const messagesEl = document.getElementById("messages");
const inputEl    = document.getElementById("user-input");
const sendBtn    = document.getElementById("send-btn");
const resetBtn   = document.getElementById("reset-btn");

const qualBadge  = document.getElementById("qual-badge");
const qualResume = document.getElementById("qual-resume");
const qualBudget = document.getElementById("qual-budget");
const qualDate   = document.getElementById("qual-date");

// Conversation history sent to the API
let history = [];

const GREETING = "Bonjour ! Je suis ravi de vous accueillir. Je suis l'assistant du studio CYPO. Pour mieux vous aider, pouvez-vous me dire quel type de projet photo vous avez en tête ?";

// ── UI helpers ─────────────────────────────────────────────────────────────

function appendMessage(role, text) {
  const wrap = document.createElement("div");
  wrap.className = `message ${role}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = role === "bot" ? "📷" : "👤";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  wrap.appendChild(avatar);
  wrap.appendChild(bubble);
  messagesEl.appendChild(wrap);
  scrollToBottom();
  return bubble;
}

function showTyping() {
  const wrap = document.createElement("div");
  wrap.className = "message bot typing";
  wrap.id = "typing-indicator";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = "📷";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("span");
    dot.className = "dot";
    bubble.appendChild(dot);
  }

  wrap.appendChild(avatar);
  wrap.appendChild(bubble);
  messagesEl.appendChild(wrap);
  scrollToBottom();
}

function hideTyping() {
  const el = document.getElementById("typing-indicator");
  if (el) el.remove();
}

function scrollToBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function updateQualification(qual) {
  if (!qual) return;

  const label = qual.qualification || "—";
  qualBadge.textContent = label;
  qualBadge.className = `qual-badge ${label}`;

  qualResume.textContent = qual.resume || "—";
  qualBudget.textContent = qual.budget || "—";
  qualDate.textContent   = qual.date   || "—";
}

function setLoading(state) {
  sendBtn.disabled = state;
  inputEl.disabled = state;
}

// ── Send logic ─────────────────────────────────────────────────────────────

async function sendMessage(text) {
  if (!text.trim()) return;

  appendMessage("user", text);
  history.push({ role: "user", content: text });

  inputEl.value = "";
  inputEl.style.height = "auto";
  setLoading(true);
  showTyping();

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    hideTyping();

    appendMessage("bot", data.text);
    history.push({ role: "assistant", content: data.text });

    if (data.qualification) updateQualification(data.qualification);
  } catch (err) {
    hideTyping();
    appendMessage("bot", "Désolé, une erreur s'est produite. Veuillez réessayer.");
    console.error(err);
  } finally {
    setLoading(false);
    inputEl.focus();
  }
}

// ── Auto-resize textarea ───────────────────────────────────────────────────

inputEl.addEventListener("input", () => {
  inputEl.style.height = "auto";
  inputEl.style.height = Math.min(inputEl.scrollHeight, 160) + "px";
});

// ── Event listeners ────────────────────────────────────────────────────────

sendBtn.addEventListener("click", () => sendMessage(inputEl.value));

inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage(inputEl.value);
  }
});

resetBtn.addEventListener("click", () => {
  history = [];
  messagesEl.innerHTML = "";
  qualBadge.textContent = "—";
  qualBadge.className = "qual-badge";
  qualResume.textContent = "—";
  qualBudget.textContent = "—";
  qualDate.textContent   = "—";
  appendMessage("bot", GREETING);
  history.push({ role: "assistant", content: GREETING });
});

// ── Init ───────────────────────────────────────────────────────────────────

appendMessage("bot", GREETING);
history.push({ role: "assistant", content: GREETING });
inputEl.focus();
