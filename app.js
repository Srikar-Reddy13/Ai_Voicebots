const micBtn = document.getElementById('mic-btn');
const statusText = document.getElementById('status-text');
const chatContainer = document.getElementById('chat-container');

// Check browser support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    statusText.innerText = "Speech Recognition not supported in this browser.";
    micBtn.disabled = true;
}

const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = true; // Enable real-time feedback

const synth = window.speechSynthesis;
let isListening = false;

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message');
    div.innerText = text;
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function speak(text) {
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }

    micBtn.classList.remove('listening');
    micBtn.classList.add('speaking');
    // statusText.innerText = "Speaking..."; // Removed to allow interim display reset

    const utterThis = new SpeechSynthesisUtterance(text);

    // Select a nice voice
    const voices = synth.getVoices();
    const preferredVoice = voices.find(voice => voice.name.includes("Google") || voice.name.includes("Female"));
    if (preferredVoice) {
        utterThis.voice = preferredVoice;
    }

    utterThis.onend = function (event) {
        micBtn.classList.remove('speaking');
        statusText.innerText = "Ready to listen";
    }

    utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
        micBtn.classList.remove('speaking');
        statusText.innerText = "Error speaking";
    }

    synth.speak(utterThis);
}

micBtn.addEventListener('click', () => {
    if (isListening) {
        recognition.stop();
        return;
    }

    if (synth.speaking) {
        synth.cancel();
        micBtn.classList.remove('speaking');
        statusText.innerText = "Ready to listen";
        return;
    }

    recognition.start();
});

recognition.onstart = () => {
    isListening = true;
    micBtn.classList.add('listening');
    statusText.innerText = "Listening...";
};

recognition.onend = () => {
    isListening = false;
    micBtn.classList.remove('listening');
    // If we're not speaking, go back to ready
    if (!synth.speaking) {
        statusText.innerText = "Ready to listen";
    }
};

recognition.onresult = async (event) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
        } else {
            interimTranscript += event.results[i][0].transcript;
        }
    }

    // Show interim results in the status text for real-time feedback
    if (interimTranscript) {
        statusText.innerText = interimTranscript;
    }

    if (finalTranscript) {
        // Final result found, process it
        statusText.innerText = "Thinking...";
        addMessage(finalTranscript, 'user');

        try {
            console.log("Sending request to server...");
            const response = await fetch('http://127.0.0.1:8000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: finalTranscript }) // Send finalTranscript
            });

            if (!response.ok) {
                console.error("Server response not OK", response.status);
                const errData = await response.json();
                throw new Error(errData.detail || "Server error");
            }

            const data = await response.json();
            const aiResponse = data.response;

            addMessage(aiResponse, 'ai');
            speak(aiResponse);

        } catch (error) {
            console.error("Fetch Error:", error);
            addMessage("Error: " + error.message, 'ai');
            speak("I encountered an error.");
            statusText.innerText = "Error";

            // Visual cue for error
            micBtn.style.background = "red";
            setTimeout(() => {
                micBtn.style.background = ""; // Reset
            }, 2000);
        }
    }
};
