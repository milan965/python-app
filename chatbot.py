import os
import time
from dotenv import load_dotenv
from google import genai

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=API_KEY)

chat = client.chats.create(
    model="gemini-3.5-flash-lite"
)

print("=" * 50)
print("       GEMINI AI CHATBOT")
print("=" * 50)
print("Type 'exit' to quit.\n")


def ask_gemini(message, max_retries=5):

    for attempt in range(max_retries):

        try:
            response = chat.send_message(
                message=message
            )

            return response.text

        except Exception as e:

            error = str(e)

            if "503" in error or "UNAVAILABLE" in error:

                wait_time = 2 ** attempt

                print(
                    f"\nGemini is temporarily busy. "
                    f"Retrying in {wait_time} seconds..."
                )

                time.sleep(wait_time)

            else:
                raise e

    return "Gemini is currently unavailable. Please try again later."


while True:

    user_input = input("You: ")

    if user_input.lower() == "exit":
        print("Bot: Goodbye!")
        break

    if not user_input.strip():
        continue

    answer = ask_gemini(user_input)

    print("Bot:", answer)
    print()