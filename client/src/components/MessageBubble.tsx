import type { Message, DebatePhase } from "../types";

interface MessageBubbleProps {
  message: Message;
  phases: DebatePhase[];
  isStreaming?: boolean;
}

export function MessageBubble({ message, phases, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const phase = phases.find((p) => p.id === message.phase);

  return (
    <div style={{ ...styles.wrapper, justifyContent: isUser ? "flex-end" : "flex-start" }} className="fade-in">
      {!isUser && (
        <div style={styles.avatar}>⚖</div>
      )}
      <div style={{ maxWidth: "75%", display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: isUser ? "flex-end" : "flex-start" }}>
        <div style={styles.meta}>
          <span style={styles.role}>{isUser ? "Vous" : "Philosophe"}</span>
          {phase && (
            <span style={styles.phaseBadge}>{phase.label}</span>
          )}
        </div>
        <div style={{
          ...styles.bubble,
          ...(isUser ? styles.userBubble : styles.aiBubble),
        }}>
          <div
            style={styles.content}
            className="message-content"
            dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
          />
          {isStreaming && !isUser && (
            <span style={styles.cursor}>▍</span>
          )}
        </div>
      </div>
      {isUser && (
        <div style={{ ...styles.avatar, background: "var(--user-border)", borderColor: "var(--user-bubble)" }}>
          ✦
        </div>
      )}
    </div>
  );
}

// Minimal markdown-like formatter
function formatMessage(text: string): string {
  if (!text) return "";

  return text
    // Bold: **text**
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic: *text*
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
    // Headers: ## text
    .replace(/^### (.+)$/gm, "<h4 style='color:var(--gold);margin:0.75rem 0 0.25rem;font-size:0.95rem;'>$1</h4>")
    .replace(/^## (.+)$/gm, "<h3 style='color:var(--accent);margin:0.75rem 0 0.25rem;font-size:1rem;'>$1</h3>")
    // Unordered list
    .replace(/^[-•] (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
    // Line breaks to paragraphs
    .split(/\n\n+/)
    .map((para) => {
      if (para.startsWith("<ul>") || para.startsWith("<h")) return para;
      return `<p>${para.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("");
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "flex-start",
    padding: "0.25rem 0",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "var(--accent-dim)",
    border: "1px solid var(--accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.9rem",
    flexShrink: 0,
    marginTop: "1.5rem",
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  role: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
    fontWeight: 500,
  },
  phaseBadge: {
    fontSize: "0.65rem",
    color: "var(--gold)",
    border: "1px solid var(--gold-dim)",
    borderRadius: "4px",
    padding: "0.1rem 0.4rem",
    background: "rgba(201, 168, 76, 0.08)",
    letterSpacing: "0.04em",
  },
  bubble: {
    borderRadius: "12px",
    padding: "0.9rem 1.1rem",
    lineHeight: 1.65,
    fontSize: "0.95rem",
    position: "relative",
  },
  userBubble: {
    background: "var(--user-bubble)",
    border: "1px solid var(--user-border)",
    borderTopRightRadius: "4px",
    color: "var(--text-primary)",
  },
  aiBubble: {
    background: "var(--ai-bubble)",
    border: "1px solid var(--ai-border)",
    borderTopLeftRadius: "4px",
    color: "var(--text-primary)",
  },
  content: {
    display: "inline",
  },
  cursor: {
    display: "inline-block",
    color: "var(--accent)",
    animation: "pulse 1s ease-in-out infinite",
    marginLeft: "2px",
    verticalAlign: "middle",
  },
};
