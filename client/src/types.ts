export interface DebateTopic {
  id: string;
  title: string;
  description: string;
  category: "metaphysique" | "ethique" | "epistemologie" | "societe" | "religion";
  openingQuestion: string;
  keyPhilosophers: string[];
  keyTexts: string[];
  debatePhases: DebatePhase[];
}

export interface DebatePhase {
  id: string;
  label: string;
  description: string;
  prompt: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  phase: string;
  timestamp: Date;
}

export type AppView = "home" | "topic-select" | "debate";

export const CATEGORY_LABELS: Record<DebateTopic["category"], string> = {
  metaphysique: "Métaphysique",
  ethique: "Éthique",
  epistemologie: "Épistémologie",
  societe: "Société",
  religion: "Religion & Foi",
};

export const CATEGORY_COLORS: Record<DebateTopic["category"], string> = {
  metaphysique: "#8B6F9F",
  ethique: "#5F8B6F",
  epistemologie: "#8B7A5F",
  societe: "#5F7A8B",
  religion: "#8B5F5F",
};
