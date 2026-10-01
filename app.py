from flask import Flask, render_template, request, jsonify
import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

app = Flask(__name__)

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

chat = client.chats.create(
    model="gemini-3.5-flash-lite"
)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chatbot():

    data = request.get_json()

    user_message = data.get("message", "")

    if not user_message:
        return jsonify({
            "response": "Please enter a message."
        })

    try:

        response = chat.send_message(
            message=user_message
        )

        return jsonify({
            "response": response.text
        })

    except Exception as e:

        print("Gemini Error:", e)

        return jsonify({
            "response": "Gemini is temporarily unavailable. Please try again."
        }), 503


if __name__ == "__main__":
    app.run(
        debug=True,
        port=8000
    )