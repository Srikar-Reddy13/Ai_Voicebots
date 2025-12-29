# Voice AI Assistant

A sleek, modern web application that allows users to interact with Google's Gemini AI using their voice. The app features a high-end "Glassmorphism" UI inspired by Apple’s design language, providing real-time speech-to-text feedback and text-to-speech responses.

---

## 🚀 Features

* **Voice Interaction:** Uses the Web Speech API for real-time speech recognition and synthesis.
* **Gemini AI Integration:** Powered by the `gemini-3-flash-preview` model for fast and intelligent responses.
* **Real-time Feedback:** Displays interim results as you speak so you can see the AI "listening" in real-time.
* **Modern UI:** A stunning liquid background with a glassmorphic container and smooth CSS animations.
* **FastAPI Backend:** A robust Python backend to handle API communication and serve static files.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Advanced Animations), Vanilla JavaScript.
* **Backend:** Python 3.x, FastAPI.
* **AI:** Google Generative AI (Gemini).
* **APIs:** Web Speech API (Recognition & Synthesis).

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

* Python 3.8+
* A Google Gemini API Key (get one at [Google AI Studio](https://aistudio.google.com/))

---

## ⚙️ Installation & Setup

1. **Clone the Repository**
```bash
git clone https://github.com/your-username/voice-ai-assistant.git
cd voice-ai-assistant

```


2. **Install Dependencies**
```bash
pip install -r requirements.txt

```


3. **Configure Environment Variables**
Create a `.env` file in the root directory and add your Gemini API key:
```env
GEMINI_API_KEY=your_api_key_here

```


4. **Run the Server**
```bash
python server.py
# or if using uvicorn directly
uvicorn server:app --reload

```


5. **Access the App**
Open your browser and navigate to: `http://127.0.0.1:8000`

---

## 📖 How to Use

1. Click the **Microphone** icon to start listening.
2. Speak your prompt. You will see your words appear in the status bar in real-time.
3. Once you stop speaking, the AI will process your request and display it in the chat bubble.
4. The assistant will then speak the response back to you.
5. If you want to interrupt the AI while it's speaking, simply click the mic button again.

---

## 📂 Project Structure

* `server.py`: FastAPI server logic, API routing, and Gemini configuration.
* `app.js`: Frontend logic for speech recognition, voice synthesis, and API calls.
* `style.css`: Styling for the glassmorphic UI and liquid background animations.
* `index.html`: Main entry point for the web application.
* `list_models.py`: A utility script to verify your API key and list available Gemini models.

---

## ⚠️ Important Notes

* **Browser Support:** This application uses the Web Speech API. For the best experience, use **Google Chrome** or **Microsoft Edge**.
* **Microphone Permissions:** Ensure you grant the browser permission to access your microphone when prompted.

Would you like me to add a "Troubleshooting" section or specific instructions for deploying this to a platform like Render or Railway?
