import type { AppView } from "../types";

interface HomePageProps {
  onNavigate: (view: AppView) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.emblem}>⚖</div>
        <h1 style={styles.title}>CYPO</h1>
        <p style={styles.subtitle}>Espace de débat philosophique & idéologique</p>
        <p style={styles.tagline}>
          Testez vos arguments à la lumière de la raison, de l'histoire et de la science.
        </p>

        <div style={styles.pillars}>
          <Pillar icon="🔍" title="Esprit critique" text="Chaque affirmation est confrontée aux faits vérifiables." />
          <Pillar icon="⚖️" title="Neutralité" text="Aucune doctrine n'est favorisée. Seule la rigueur compte." />
          <Pillar icon="🏛️" title="Philosophie" text="Appuyé sur les grands textes philosophiques et scientifiques." />
          <Pillar icon="💬" title="Bonne foi" text="Un débat structuré centré sur le fond, pas la forme." />
        </div>

        <div style={styles.structure}>
          <h2 style={{ ...styles.sectionTitle, marginBottom: "1rem" }}>Structure du débat</h2>
          <div style={styles.phases}>
            {[
              { n: "1", label: "Thèse", desc: "Exposez votre position" },
              { n: "2", label: "Arguments", desc: "Défendez avec des preuves" },
              { n: "3", label: "Contre-arguments", desc: "Affrontez les objections" },
              { n: "4", label: "Synthèse", desc: "Construisez une conclusion" },
            ].map((p) => (
              <div key={p.n} style={styles.phaseCard}>
                <div style={styles.phaseNum}>{p.n}</div>
                <strong style={styles.phaseLabel}>{p.label}</strong>
                <span style={styles.phaseDesc}>{p.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.disclaimer}>
          <p>
            <strong>Ce n'est pas un outil de conversion.</strong>{" "}
            L'objectif est d'affiner votre pensée, pas de vous orienter vers une croyance.
            Vos arguments seront analysés avec bienveillance mais sans complaisance.
          </p>
        </div>

        <button style={styles.cta} onClick={() => onNavigate("topic-select")}>
          Commencer un débat
        </button>
      </div>
    </div>
  );
}

function Pillar({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div style={styles.pillar}>
      <span style={styles.pillarIcon}>{icon}</span>
      <strong style={styles.pillarTitle}>{title}</strong>
      <span style={styles.pillarText}>{text}</span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
    overflowY: "auto",
  },
  hero: {
    maxWidth: "760px",
    width: "100%",
    textAlign: "center",
    animation: "fadeIn 0.5s ease",
  },
  emblem: {
    fontSize: "3rem",
    marginBottom: "0.5rem",
    display: "block",
  },
  title: {
    fontSize: "3.5rem",
    fontFamily: "var(--font-serif)",
    color: "var(--accent)",
    letterSpacing: "0.15em",
    marginBottom: "0.25rem",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "var(--gold)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 500,
    marginBottom: "1rem",
  },
  tagline: {
    fontSize: "1.15rem",
    color: "var(--text-secondary)",
    maxWidth: "500px",
    margin: "0 auto 2.5rem",
    lineHeight: 1.7,
    fontFamily: "var(--font-serif)",
    fontStyle: "italic",
  },
  pillars: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "1rem",
    marginBottom: "2.5rem",
  },
  pillar: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "1.25rem 1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.4rem",
    textAlign: "center",
  },
  pillarIcon: { fontSize: "1.5rem" },
  pillarTitle: { color: "var(--text-primary)", fontSize: "0.9rem" },
  pillarText: { color: "var(--text-secondary)", fontSize: "0.8rem", lineHeight: 1.4 },
  structure: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "1.5rem",
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: "1.2rem",
    color: "var(--gold)",
  },
  phases: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "0.75rem",
  },
  phaseCard: {
    background: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "0.75rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.3rem",
  },
  phaseNum: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "var(--accent-dim)",
    color: "var(--text-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.85rem",
    fontWeight: 600,
  },
  phaseLabel: { color: "var(--accent)", fontSize: "0.9rem" },
  phaseDesc: { color: "var(--text-muted)", fontSize: "0.75rem", textAlign: "center" },
  disclaimer: {
    background: "rgba(160, 124, 220, 0.08)",
    border: "1px solid var(--accent-dim)",
    borderRadius: "8px",
    padding: "1rem 1.25rem",
    marginBottom: "2rem",
    color: "var(--text-secondary)",
    fontSize: "0.9rem",
    lineHeight: 1.6,
  },
  cta: {
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "0.9rem 2.5rem",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.02em",
    transition: "background 0.2s, transform 0.1s",
  },
};
