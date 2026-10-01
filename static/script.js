const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const chatMessages = document.getElementById("chatMessages");
const typingIndicator = document.getElementById("typingIndicator");
const clearBtn = document.getElementById("clearBtn");
const newChatBtn = document.getElementById("newChatBtn");


/* =========================
   Add Message
========================= */

function addMessage(message, sender) {

    const messageDiv = document.createElement("div");

    messageDiv.classList.add(
        "message",
        sender === "user"
            ? "user-message"
            : "bot-message"
    );

    if (sender === "user") {

        messageDiv.innerHTML = `
            <div class="avatar">
                👤
            </div>

            <div class="message-content">

                <div class="message-text">
                    ${escapeHTML(message)}
                </div>

            </div>
        `;

    } else {

        messageDiv.innerHTML = `
            <div class="avatar">
                ✨
            </div>

            <div class="message-content">

                <div class="sender">
                    Gemini AI
                </div>

                <div class="message-text">
                    ${formatBotMessage(message)}
                </div>

            </div>
        `;
    }

    chatMessages.appendChild(messageDiv);

    scrollToBottom();
}


/* =========================
   Format Bot Message
========================= */

function formatBotMessage(message) {

    return escapeHTML(message)
        .replace(/\n/g, "<br>");
}


/* =========================
   Prevent HTML Injection
========================= */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* =========================
   Send Message
========================= */

async function sendMessage() {

    const message = messageInput.value.trim();

    if (!message) {
        return;
    }

    addMessage(message, "user");

    messageInput.value = "";

    messageInput.style.height = "auto";

    sendBtn.disabled = true;

    typingIndicator.classList.remove("hidden");

    scrollToBottom();

    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });


        if (!response.ok) {
            throw new Error("Server error");
        }


        const data = await response.json();


        typingIndicator.classList.add("hidden");


        if (data.response) {

            addMessage(
                data.response,
                "bot"
            );

        } else {

            addMessage(
                "Sorry, I couldn't generate a response.",
                "bot"
            );
        }


    } catch (error) {

        console.error(error);

        typingIndicator.classList.add("hidden");

        addMessage(
            "⚠️ Unable to connect to the AI server. Please try again.",
            "bot"
        );

    }

    sendBtn.disabled = false;

    messageInput.focus();
}


/* =========================
   Enter Key
========================= */

messageInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();
        }

    }
);


/* =========================
   Auto Resize Textarea
========================= */

messageInput.addEventListener(
    "input",
    function() {

        this.style.height = "auto";

        this.style.height =
            Math.min(this.scrollHeight, 150) + "px";

    }
);


/* =========================
   Clear Chat
========================= */

function clearChat() {

    chatMessages.innerHTML = `

        <div class="message bot-message">

            <div class="avatar">
                ✨
            </div>

            <div class="message-content">

                <div class="sender">
                    Gemini AI
                </div>

                <div class="message-text">

                    <p>
                        Hello! 👋
                    </p>

                    <p>
                        I'm your AI assistant.
                        Ask me anything!
                    </p>

                </div>

            </div>

        </div>

    `;

}


clearBtn.addEventListener(
    "click",
    clearChat
);


newChatBtn.addEventListener(
    "click",
    clearChat
);


/* =========================
   Send Button
========================= */

sendBtn.addEventListener(
    "click",
    sendMessage
);


/* =========================
   Scroll
========================= */

function scrollToBottom() {

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}