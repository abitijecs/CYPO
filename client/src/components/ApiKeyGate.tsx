import { useState } from "react";

interface ApiKeyGateProps {
  children: (apiKey: string) => React.ReactNode;
}

const STORAGE_KEY = "cypo_anthropic_key";

export function ApiKeyGate({ children }: ApiKeyGateProps) {
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || "";
  });
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  if (apiKey) {
    return (
      <>
        {children(apiKey)}
        <button
          onClick={() => { localStorage.removeItem(STORAGE_KEY); setApiKey(""); setInput(""); }}
          style={styles.changeKeyBtn}
          title="Changer la clé API"
        >
          🔑
        </button>
      </>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed.startsWith("sk-ant-")) {
      setError("La clé doit commencer par sk-ant-");
      return;
    }
    localStorage.setItem(STORAGE_KEY, trimmed);
    setApiKey(trimmed);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.icon}>🏛️</div>
        <h2 style={styles.title}>CYPO — Débat Philosophique</h2>
        <p style={styles.subtitle}>
          Entrez votre clé API Anthropic pour commencer.
          <br />
          <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" style={styles.link}>
            Obtenir une clé →
          </a>
        </p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            placeholder="sk-ant-api03-..."
            style={styles.input}
            autoFocus
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.btn} disabled={!input.trim()}>
            Commencer le débat →
          </button>
        </form>
        <p style={styles.note}>
          La clé est stockée uniquement dans votre navigateur (localStorage).
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "var(--bg-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    zIndex: 1000,
  },
  modal: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "2.5rem",
    maxWidth: "440px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
  },
  icon: {
    fontSize: "2.5rem",
    marginBottom: "0.75rem",
  },
  title: {
    fontFamily: "var(--font-serif)",
    fontSize: "1.6rem",
    color: "var(--text-primary)",
    marginBottom: "0.75rem",
  },
  subtitle: {
    color: "var(--text-secondary)",
    fontSize: "0.9rem",
    lineHeight: 1.6,
    marginBottom: "1.5rem",
  },
  link: {
    color: "var(--accent)",
    textDecoration: "none",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  input: {
    background: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    color: "var(--text-primary)",
    fontSize: "0.9rem",
    padding: "0.75rem 1rem",
    outline: "none",
    fontFamily: "monospace",
  },
  error: {
    color: "#e05252",
    fontSize: "0.8rem",
    margin: 0,
  },
  btn: {
    background: "var(--accent)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: 600,
    padding: "0.75rem",
    transition: "opacity 0.2s",
  },
  note: {
    color: "var(--text-muted)",
    fontSize: "0.75rem",
    marginTop: "1.25rem",
  },
  changeKeyBtn: {
    position: "fixed",
    bottom: "1rem",
    right: "1rem",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    cursor: "pointer",
    fontSize: "1rem",
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
