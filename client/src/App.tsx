import { useState } from "react";
import type { AppView, DebateTopic } from "./types";
import { HomePage } from "./components/HomePage";
import { TopicSelector } from "./components/TopicSelector";
import { DebateArena } from "./components/DebateArena";
import { ApiKeyGate } from "./components/ApiKeyGate";

export default function App() {
  const [view, setView] = useState<AppView>("home");
  const [selectedTopic, setSelectedTopic] = useState<DebateTopic | null>(null);

  const handleSelectTopic = (topic: DebateTopic) => {
    setSelectedTopic(topic);
    setView("debate");
  };

  const handleChangeTopic = () => {
    setSelectedTopic(null);
    setView("topic-select");
  };

  return (
    <ApiKeyGate>
      {(apiKey) => (
        <div style={styles.app}>
          <nav style={styles.nav}>
            <button style={styles.logo} onClick={() => setView("home")}>
              <span style={styles.logoSymbol}>⚖</span>
              <span style={styles.logoText}>CYPO</span>
            </button>
            <div style={styles.navLinks}>
              {view !== "home" && (
                <button style={styles.navBtn} onClick={() => setView("home")}>
                  Accueil
                </button>
              )}
              {view !== "topic-select" && (
                <button style={styles.navBtn} onClick={() => setView("topic-select")}>
                  Sujets
                </button>
              )}
            </div>
          </nav>

          <main style={styles.main}>
            {view === "home" && (
              <HomePage onNavigate={setView} />
            )}
            {view === "topic-select" && (
              <TopicSelector
                onSelectTopic={handleSelectTopic}
                onNavigate={setView}
              />
            )}
            {view === "debate" && selectedTopic && (
              <DebateArena
                topic={selectedTopic}
                onNavigate={setView}
                onChangeTopic={handleChangeTopic}
                apiKey={apiKey}
              />
            )}
          </main>
        </div>
      )}
    </ApiKeyGate>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 1.5rem",
    height: "52px",
    borderBottom: "1px solid var(--border)",
    background: "var(--bg-secondary)",
    flexShrink: 0,
    zIndex: 10,
  },
  logo: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    textDecoration: "none",
  },
  logoSymbol: {
    fontSize: "1.2rem",
    color: "var(--accent)",
  },
  logoText: {
    fontFamily: "var(--font-serif)",
    fontSize: "1.3rem",
    color: "var(--accent)",
    letterSpacing: "0.12em",
    fontWeight: 600,
  },
  navLinks: {
    display: "flex",
    gap: "0.5rem",
  },
  navBtn: {
    background: "none",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    color: "var(--text-secondary)",
    padding: "0.35rem 0.85rem",
    fontSize: "0.85rem",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
};
