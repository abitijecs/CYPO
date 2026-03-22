import { useState, useEffect } from "react";
import type { DebateTopic, AppView } from "../types";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "../types";

interface TopicSelectorProps {
  onSelectTopic: (topic: DebateTopic) => void;
  onNavigate: (view: AppView) => void;
}

export function TopicSelector({ onSelectTopic, onNavigate }: TopicSelectorProps) {
  const [topics, setTopics] = useState<DebateTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<DebateTopic["category"] | "all">("all");
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/topics")
      .then((r) => r.json())
      .then((data: DebateTopic[]) => { setTopics(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories: Array<DebateTopic["category"] | "all"> = [
    "all", "metaphysique", "religion", "ethique", "epistemologie",
  ];

  const filtered = filter === "all" ? topics : topics.filter((t) => t.category === filter);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.back} onClick={() => onNavigate("home")}>
          ← Retour
        </button>
        <div>
          <h2 style={styles.title}>Choisissez un sujet de débat</h2>
          <p style={styles.subtitle}>
            Sélectionnez la question philosophique que vous souhaitez explorer
          </p>
        </div>
      </div>

      <div style={styles.filters}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              ...styles.filterBtn,
              ...(filter === cat ? styles.filterActive : {}),
              ...(cat !== "all" && filter !== cat
                ? { borderColor: CATEGORY_COLORS[cat as DebateTopic["category"]] + "55" }
                : {}),
            }}
          >
            {cat === "all" ? "Tous les sujets" : CATEGORY_LABELS[cat as DebateTopic["category"]]}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={styles.loading}>
          <div style={styles.spinner} />
          <span>Chargement des sujets...</span>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              isHovered={hovered === topic.id}
              onHover={setHovered}
              onSelect={onSelectTopic}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TopicCard({
  topic,
  isHovered,
  onHover,
  onSelect,
}: {
  topic: DebateTopic;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onSelect: (t: DebateTopic) => void;
}) {
  const color = CATEGORY_COLORS[topic.category];
  return (
    <button
      style={{
        ...styles.card,
        ...(isHovered ? { ...styles.cardHover, borderColor: color } : {}),
        borderTopColor: color,
        borderTopWidth: "3px",
      }}
      onMouseEnter={() => onHover(topic.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(topic)}
    >
      <div style={styles.cardHeader}>
        <span style={{ ...styles.categoryBadge, color, borderColor: color + "55", background: color + "15" }}>
          {CATEGORY_LABELS[topic.category]}
        </span>
      </div>
      <h3 style={styles.cardTitle}>{topic.title}</h3>
      <p style={styles.cardDesc}>{topic.description}</p>
      <div style={styles.cardFooter}>
        <div style={styles.philosophers}>
          {topic.keyPhilosophers.slice(0, 3).map((p) => (
            <span key={p} style={styles.philosopher}>{p}</span>
          ))}
          {topic.keyPhilosophers.length > 3 && (
            <span style={styles.philosopher}>+{topic.keyPhilosophers.length - 3}</span>
          )}
        </div>
        <span style={{ ...styles.startBtn, color }}>Débattre →</span>
      </div>
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    padding: "1.5rem",
    overflowY: "auto",
    maxWidth: "1100px",
    margin: "0 auto",
    width: "100%",
  },
  header: {
    marginBottom: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  back: {
    background: "none",
    border: "none",
    color: "var(--text-muted)",
    cursor: "pointer",
    fontSize: "0.9rem",
    textAlign: "left",
    padding: "0",
    marginBottom: "0.5rem",
    transition: "color 0.2s",
  },
  title: {
    fontFamily: "var(--font-serif)",
    fontSize: "1.8rem",
    color: "var(--text-primary)",
  },
  subtitle: {
    color: "var(--text-secondary)",
    fontSize: "0.95rem",
  },
  filters: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
    marginBottom: "1.5rem",
  },
  filterBtn: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "20px",
    color: "var(--text-secondary)",
    padding: "0.4rem 1rem",
    fontSize: "0.85rem",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  filterActive: {
    background: "var(--accent-dim)",
    borderColor: "var(--accent)",
    color: "var(--text-primary)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1rem",
  },
  card: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "1.25rem",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  cardHover: {
    background: "var(--bg-card-hover)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  categoryBadge: {
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    border: "1px solid",
    borderRadius: "4px",
    padding: "0.2rem 0.5rem",
  },
  cardTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: "1.15rem",
    color: "var(--text-primary)",
    lineHeight: 1.3,
  },
  cardDesc: {
    color: "var(--text-secondary)",
    fontSize: "0.85rem",
    lineHeight: 1.5,
    flex: 1,
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "0.25rem",
  },
  philosophers: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.3rem",
  },
  philosopher: {
    fontSize: "0.7rem",
    color: "var(--text-muted)",
    background: "var(--bg-secondary)",
    borderRadius: "4px",
    padding: "0.15rem 0.4rem",
    border: "1px solid var(--border)",
  },
  startBtn: {
    fontSize: "0.85rem",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    padding: "4rem",
    color: "var(--text-muted)",
  },
  spinner: {
    width: "24px",
    height: "24px",
    border: "2px solid var(--border)",
    borderTopColor: "var(--accent)",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};
