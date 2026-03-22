import { useState, useEffect, useRef } from "react";
import type { DebateTopic, DebatePhase, AppView } from "../types";
import { useDebate } from "../hooks/useDebate";
import { MessageBubble } from "./MessageBubble";
import { CATEGORY_COLORS } from "../types";

interface DebateArenaProps {
  topic: DebateTopic;
  onNavigate: (view: AppView) => void;
  onChangeTopic: () => void;
}

export function DebateArena({ topic, onNavigate, onChangeTopic }: DebateArenaProps) {
  const { messages, isStreaming, error, sendMessage, stopStreaming, resetDebate } = useDebate();
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
  const [input, setInput] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const phases = topic.debatePhases;
  const currentPhase = phases[currentPhaseIdx];
  const accentColor = CATEGORY_COLORS[topic.category];

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Welcome message
  const hasStarted = messages.length > 0;

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    await sendMessage(topic, currentPhase, text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePhaseChange = (idx: number) => {
    if (isStreaming) return;
    setCurrentPhaseIdx(idx);
  };

  const handleReset = () => {
    resetDebate();
    setCurrentPhaseIdx(0);
    setInput("");
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backBtn} onClick={onChangeTopic}>
            ← Changer de sujet
          </button>
          <div>
            <div style={styles.topicLabel}>Débat en cours</div>
            <h1 style={{ ...styles.topicTitle, color: accentColor }}>{topic.title}</h1>
          </div>
        </div>
        <div style={styles.headerRight}>
          <button
            style={styles.iconBtn}
            onClick={() => setShowInfo(!showInfo)}
            title="Informations sur le sujet"
          >
            ℹ
          </button>
          <button style={styles.iconBtn} onClick={handleReset} title="Recommencer le débat">
            ↺
          </button>
        </div>
      </header>

      {/* Phase navigator */}
      <div style={styles.phaseNav}>
        {phases.map((phase, idx) => {
          const isActive = idx === currentPhaseIdx;
          const isDone = idx < currentPhaseIdx;
          return (
            <button
              key={phase.id}
              style={{
                ...styles.phaseBtn,
                ...(isActive ? { ...styles.phaseActive, borderColor: accentColor, color: accentColor } : {}),
                ...(isDone ? styles.phaseDone : {}),
              }}
              onClick={() => handlePhaseChange(idx)}
            >
              <span style={{
                ...styles.phaseNum,
                ...(isActive ? { background: accentColor } : {}),
                ...(isDone ? { background: "var(--success)" } : {}),
              }}>
                {isDone ? "✓" : idx + 1}
              </span>
              <span style={styles.phaseLabel}>{phase.label}</span>
            </button>
          );
        })}
      </div>

      {/* Phase indicator */}
      <div style={styles.phaseIndicator}>
        <div style={{ ...styles.phaseIndicatorBar, background: accentColor + "22", borderColor: accentColor + "44" }}>
          <span style={{ color: accentColor, fontWeight: 600 }}>Phase {currentPhaseIdx + 1} : {currentPhase.label}</span>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{currentPhase.description}</span>
        </div>
      </div>

      {/* Info panel */}
      {showInfo && (
        <div style={styles.infoPanel} className="fade-in">
          <button style={styles.closeInfo} onClick={() => setShowInfo(false)}>×</button>
          <h3 style={styles.infoTitle}>{topic.title}</h3>
          <p style={styles.infoDesc}>{topic.description}</p>
          <div style={styles.infoSection}>
            <strong style={styles.infoSectionTitle}>Question d'ouverture</strong>
            <p style={styles.infoText}>{topic.openingQuestion}</p>
          </div>
          <div style={styles.infoSection}>
            <strong style={styles.infoSectionTitle}>Philosophes clés</strong>
            <div style={styles.tagList}>
              {topic.keyPhilosophers.map((p) => (
                <span key={p} style={styles.tag}>{p}</span>
              ))}
            </div>
          </div>
          <div style={styles.infoSection}>
            <strong style={styles.infoSectionTitle}>Textes de référence</strong>
            <div style={styles.tagList}>
              {topic.keyTexts.map((t) => (
                <span key={t} style={{ ...styles.tag, color: "var(--gold)", borderColor: "var(--gold-dim)" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div style={styles.messages}>
        {!hasStarted && (
          <div style={styles.welcome} className="fade-in">
            <div style={styles.welcomeIcon}>⚖</div>
            <h2 style={styles.welcomeTitle}>Prêt pour le débat</h2>
            <p style={styles.welcomeText}>
              Commencez par la <strong>Phase 1 : Thèse</strong>.<br />
              {currentPhase.prompt}
            </p>
            <div style={styles.rulesBox}>
              <p style={styles.ruleItem}>📌 Restez centré sur le <strong>fond</strong> de vos arguments</p>
              <p style={styles.ruleItem}>📌 Toute affirmation factuelle doit être étayable</p>
              <p style={styles.ruleItem}>📌 La bonne foi intellectuelle est requise</p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            phases={phases}
            isStreaming={isStreaming && i === messages.length - 1 && msg.role === "assistant"}
          />
        ))}

        {error && (
          <div style={styles.error} className="fade-in">
            ⚠ Erreur : {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div style={styles.inputArea}>
        {currentPhaseIdx < phases.length - 1 && messages.length > 1 && !isStreaming && (
          <button
            style={{ ...styles.nextPhaseBtn, borderColor: accentColor + "66", color: accentColor }}
            onClick={() => setCurrentPhaseIdx(currentPhaseIdx + 1)}
          >
            Passer à la phase suivante : {phases[currentPhaseIdx + 1].label} →
          </button>
        )}
        <div style={styles.inputRow}>
          <div style={styles.inputWrapper}>
            <div style={styles.inputHint}>{currentPhase.prompt}</div>
            <textarea
              ref={inputRef}
              style={styles.textarea}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Phase ${currentPhaseIdx + 1} — ${currentPhase.label} : exprimez votre argument...`}
              rows={3}
              disabled={isStreaming}
            />
          </div>
          <div style={styles.inputActions}>
            {isStreaming ? (
              <button style={styles.stopBtn} onClick={stopStreaming}>
                ⏹ Arrêter
              </button>
            ) : (
              <button
                style={{
                  ...styles.sendBtn,
                  background: input.trim() ? accentColor : "var(--border)",
                  cursor: input.trim() ? "pointer" : "default",
                }}
                onClick={handleSend}
                disabled={!input.trim()}
              >
                Envoyer
              </button>
            )}
          </div>
        </div>
        <div style={styles.inputFooter}>
          <span>Entrée pour envoyer • Maj+Entrée pour nouvelle ligne</span>
          {isStreaming && <span style={styles.streamingIndicator}>⟳ Réflexion en cours...</span>}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 1.5rem",
    borderBottom: "1px solid var(--border)",
    background: "var(--bg-secondary)",
    flexShrink: 0,
  },
  headerLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "var(--text-muted)",
    cursor: "pointer",
    fontSize: "0.8rem",
    padding: 0,
    textAlign: "left",
  },
  topicLabel: {
    fontSize: "0.7rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  topicTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: "1.2rem",
    lineHeight: 1.2,
  },
  headerRight: {
    display: "flex",
    gap: "0.5rem",
  },
  iconBtn: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    color: "var(--text-secondary)",
    width: "36px",
    height: "36px",
    cursor: "pointer",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  phaseNav: {
    display: "flex",
    padding: "0.75rem 1.5rem",
    gap: "0.5rem",
    borderBottom: "1px solid var(--border)",
    background: "var(--bg-secondary)",
    flexShrink: 0,
    overflowX: "auto",
  },
  phaseBtn: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    color: "var(--text-muted)",
    padding: "0.4rem 0.85rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    fontSize: "0.85rem",
    whiteSpace: "nowrap",
    transition: "all 0.2s",
  },
  phaseActive: {
    background: "rgba(160, 124, 220, 0.1)",
  },
  phaseDone: {
    color: "var(--success)",
    borderColor: "var(--success)",
  },
  phaseNum: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.7rem",
    fontWeight: 600,
    color: "#fff",
    flexShrink: 0,
  },
  phaseLabel: { fontWeight: 500 },
  phaseIndicator: {
    padding: "0.5rem 1.5rem",
    flexShrink: 0,
  },
  phaseIndicatorBar: {
    border: "1px solid",
    borderRadius: "8px",
    padding: "0.5rem 0.85rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.85rem",
    gap: "1rem",
  },
  infoPanel: {
    background: "var(--bg-card)",
    borderBottom: "1px solid var(--border)",
    padding: "1.25rem 1.5rem",
    position: "relative",
    flexShrink: 0,
  },
  closeInfo: {
    position: "absolute",
    top: "0.75rem",
    right: "0.75rem",
    background: "none",
    border: "none",
    color: "var(--text-muted)",
    cursor: "pointer",
    fontSize: "1.2rem",
  },
  infoTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: "1.1rem",
    color: "var(--text-primary)",
    marginBottom: "0.4rem",
  },
  infoDesc: {
    color: "var(--text-secondary)",
    fontSize: "0.85rem",
    marginBottom: "1rem",
  },
  infoSection: { marginBottom: "0.75rem" },
  infoSectionTitle: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    display: "block",
    marginBottom: "0.4rem",
  },
  infoText: { color: "var(--text-secondary)", fontSize: "0.85rem", fontStyle: "italic" },
  tagList: { display: "flex", flexWrap: "wrap", gap: "0.35rem" },
  tag: {
    fontSize: "0.75rem",
    color: "var(--text-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "4px",
    padding: "0.15rem 0.5rem",
    background: "var(--bg-secondary)",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "1.25rem 1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  welcome: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem 1rem",
    textAlign: "center",
    gap: "1rem",
  },
  welcomeIcon: { fontSize: "2.5rem" },
  welcomeTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: "1.4rem",
    color: "var(--text-primary)",
  },
  welcomeText: {
    color: "var(--text-secondary)",
    fontSize: "1rem",
    lineHeight: 1.7,
    maxWidth: "500px",
  },
  rulesBox: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "1rem 1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
    textAlign: "left",
    maxWidth: "420px",
    width: "100%",
  },
  ruleItem: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
  },
  error: {
    background: "rgba(200, 80, 80, 0.1)",
    border: "1px solid rgba(200, 80, 80, 0.3)",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    color: "#e07070",
    fontSize: "0.9rem",
  },
  inputArea: {
    borderTop: "1px solid var(--border)",
    padding: "1rem 1.5rem",
    background: "var(--bg-secondary)",
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  nextPhaseBtn: {
    background: "none",
    border: "1px solid",
    borderRadius: "8px",
    padding: "0.4rem 1rem",
    fontSize: "0.85rem",
    cursor: "pointer",
    alignSelf: "flex-start",
    fontWeight: 500,
    transition: "all 0.2s",
  },
  inputRow: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "flex-end",
  },
  inputWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
  },
  inputHint: {
    fontSize: "0.72rem",
    color: "var(--text-muted)",
    fontStyle: "italic",
  },
  textarea: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    color: "var(--text-primary)",
    fontSize: "0.95rem",
    padding: "0.75rem 1rem",
    resize: "none",
    fontFamily: "var(--font-sans)",
    lineHeight: 1.55,
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
  },
  inputActions: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
    flexShrink: 0,
  },
  sendBtn: {
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    padding: "0.6rem 1.25rem",
    fontSize: "0.9rem",
    fontWeight: 600,
    transition: "all 0.2s",
    whiteSpace: "nowrap",
  },
  stopBtn: {
    background: "rgba(200, 80, 80, 0.15)",
    border: "1px solid rgba(200, 80, 80, 0.4)",
    borderRadius: "10px",
    color: "#e07070",
    padding: "0.6rem 1rem",
    fontSize: "0.85rem",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  inputFooter: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.72rem",
    color: "var(--text-muted)",
  },
  streamingIndicator: {
    color: "var(--accent)",
    animation: "pulse 1.5s ease-in-out infinite",
  },
};
