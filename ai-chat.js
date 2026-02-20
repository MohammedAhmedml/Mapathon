const chatToggle = document.createElement("button");
chatToggle.className = "chat-toggle";
chatToggle.innerText = "LULC Assistant";
document.body.appendChild(chatToggle);

const chatContainer = document.createElement("div");
chatContainer.className = "chat-container";
chatContainer.innerHTML = `
  <div class="chat-header">LULC Assistant</div>
  <div class="chat-messages" id="chatMessages"></div>
  <div class="chat-input">
    <input type="text" id="chatInput" placeholder="Ask about LULC..." />
    <button onclick="sendMessage()">Send</button>
  </div>
`;
document.body.appendChild(chatContainer);

chatToggle.onclick = () => {
  chatContainer.style.display =
    chatContainer.style.display === "flex" ? "none" : "flex";
};

async function sendMessage() {
  const input = document.getElementById("chatInput");
  const messages = document.getElementById("chatMessages");
  const userText = input.value.trim();

  if (!userText) return;

  messages.innerHTML += `<div class="message user-message">${userText}</div>`;
  input.value = "";

  messages.innerHTML += `<div class="message bot-message" id="loading">Typing...</div>`;
  messages.scrollTop = messages.scrollHeight;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText }),
    });

    const data = await response.json();

    document.getElementById("loading").remove();
    messages.innerHTML += `<div class="message bot-message">${data.reply}</div>`;
    messages.scrollTop = messages.scrollHeight;

  } catch (error) {
    document.getElementById("loading").remove();
    messages.innerHTML += `<div class="message bot-message">Error connecting to assistant.</div>`;
  }
}