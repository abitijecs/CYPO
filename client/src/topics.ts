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

export const DEBATE_PHASES: DebatePhase[] = [
  {
    id: "these",
    label: "Thèse",
    description: "Exposez votre position principale",
    prompt: "Formulez clairement votre thèse sur ce sujet. Quelle est votre position ?"
  },
  {
    id: "arguments",
    label: "Arguments",
    description: "Défendez votre thèse par des arguments",
    prompt: "Quels arguments soutiennent votre thèse ? Appuyez-vous sur des faits vérifiables."
  },
  {
    id: "contre_arguments",
    label: "Contre-arguments",
    description: "Affrontez les objections",
    prompt: "Comment répondez-vous aux objections majeures à votre position ?"
  },
  {
    id: "synthese",
    label: "Synthèse",
    description: "Construisez une conclusion nuancée",
    prompt: "Quelle synthèse proposez-vous en tenant compte des échanges ?"
  }
];

export const TOPICS: DebateTopic[] = [
  {
    id: "existence_dieu",
    title: "L'existence de Dieu",
    description: "Y a-t-il des preuves rationnelles de l'existence ou de la non-existence de Dieu ?",
    category: "metaphysique",
    openingQuestion: "Quels arguments pensez-vous les plus solides pour ou contre l'existence d'un Dieu ?",
    keyPhilosophers: ["Thomas d'Aquin", "Descartes", "Kant", "Spinoza", "Nietzsche", "Anselme de Cantorbéry"],
    keyTexts: ["Summa Theologica (Thomas d'Aquin)", "Méditations métaphysiques (Descartes)", "Critique de la raison pure (Kant)", "Éthique (Spinoza)"],
    debatePhases: DEBATE_PHASES
  },
  {
    id: "sens_vie",
    title: "Le sens de la vie",
    description: "La vie a-t-elle un sens intrinsèque ou l'homme doit-il le construire ?",
    category: "metaphysique",
    openingQuestion: "Pensez-vous que le sens de la vie est donné (par Dieu, la nature) ou construit par l'être humain ?",
    keyPhilosophers: ["Camus", "Sartre", "Nietzsche", "Aristote", "Buddha", "Épictète"],
    keyTexts: ["Le Mythe de Sisyphe (Camus)", "L'Être et le Néant (Sartre)", "Ainsi parlait Zarathoustra (Nietzsche)", "Éthique à Nicomaque (Aristote)"],
    debatePhases: DEBATE_PHASES
  },
  {
    id: "morale_universelle",
    title: "La morale est-elle universelle ?",
    description: "Existe-t-il des valeurs morales absolues valables pour toute l'humanité ?",
    category: "ethique",
    openingQuestion: "Croyez-vous en l'existence d'une morale universelle transcendant les cultures ?",
    keyPhilosophers: ["Kant", "Aristote", "Nietzsche", "Mill", "Rawls", "Levinas"],
    keyTexts: ["Fondements de la métaphysique des mœurs (Kant)", "Utilitarisme (Mill)", "Par-delà bien et mal (Nietzsche)", "Théorie de la justice (Rawls)"],
    debatePhases: DEBATE_PHASES
  },
  {
    id: "libre_arbitre",
    title: "Le libre arbitre",
    description: "L'être humain est-il libre de ses choix ou déterminé par la nature et la société ?",
    category: "metaphysique",
    openingQuestion: "Pensez-vous que vos décisions sont véritablement libres ou résultent de causes que vous ne contrôlez pas ?",
    keyPhilosophers: ["Spinoza", "Descartes", "Kant", "Sartre", "Schopenhauer", "Hume"],
    keyTexts: ["Éthique (Spinoza)", "Méditations métaphysiques (Descartes)", "L'être et le néant (Sartre)", "Traité de la nature humaine (Hume)"],
    debatePhases: DEBATE_PHASES
  },
  {
    id: "religion_science",
    title: "Religion et Science",
    description: "Religion et science sont-elles compatibles ou fondamentalement opposées ?",
    category: "religion",
    openingQuestion: "Comment concevez-vous la relation entre foi religieuse et méthode scientifique ?",
    keyPhilosophers: ["Galilée", "Darwin", "Einstein", "Dawkins", "Teilhard de Chardin", "Stephen Gould"],
    keyTexts: ["L'Origine des espèces (Darwin)", "Le Gène égoïste (Dawkins)", "Non-Overlapping Magisteria (Gould)", "Le Phénomène humain (Teilhard)"],
    debatePhases: DEBATE_PHASES
  },
  {
    id: "probleme_mal",
    title: "Le problème du mal",
    description: "Comment concilier l'existence d'un Dieu bon et tout-puissant avec la souffrance dans le monde ?",
    category: "religion",
    openingQuestion: "Comment expliquez-vous la présence du mal et de la souffrance dans un monde créé par un Dieu bon ?",
    keyPhilosophers: ["Leibniz", "Voltaire", "Job", "Augustine d'Hippone", "Dostoïevski", "Alvin Plantinga"],
    keyTexts: ["Théodicée (Leibniz)", "Candide (Voltaire)", "Le Livre de Job (Bible)", "La Cité de Dieu (Augustin)", "Les Frères Karamazov (Dostoïevski)"],
    debatePhases: DEBATE_PHASES
  },
  {
    id: "ame_conscience",
    title: "L'âme et la conscience",
    description: "La conscience est-elle réductible au cerveau ou témoigne-t-elle d'une réalité immatérielle ?",
    category: "metaphysique",
    openingQuestion: "Pensez-vous que la conscience humaine peut s'expliquer entièrement par la neurobiologie ?",
    keyPhilosophers: ["Descartes", "Hume", "Wittgenstein", "Chalmers", "Dennett", "Platon"],
    keyTexts: ["Méditations métaphysiques (Descartes)", "Phédon (Platon)", "The Conscious Mind (Chalmers)", "Consciousness Explained (Dennett)"],
    debatePhases: DEBATE_PHASES
  },
  {
    id: "fondement_droits",
    title: "Le fondement des droits humains",
    description: "Les droits de l'homme sont-ils naturels, divins ou des constructions sociales ?",
    category: "ethique",
    openingQuestion: "Sur quel fondement reposent selon vous les droits fondamentaux de la personne humaine ?",
    keyPhilosophers: ["Locke", "Rousseau", "Kant", "Rawls", "Arendt", "Grotius"],
    keyTexts: ["Traité du gouvernement civil (Locke)", "Du contrat social (Rousseau)", "Déclaration universelle des droits de l'homme (1948)", "Théorie de la justice (Rawls)"],
    debatePhases: DEBATE_PHASES
  },
  {
    id: "verite_relative",
    title: "La vérité est-elle relative ?",
    description: "Existe-t-il des vérités objectives ou toute vérité est-elle relative à une culture, une époque ?",
    category: "epistemologie",
    openingQuestion: "Croyez-vous qu'il existe des vérités absolues, ou que toute vérité dépend d'un point de vue ?",
    keyPhilosophers: ["Platon", "Protagoras", "Nietzsche", "Wittgenstein", "Popper", "Rorty"],
    keyTexts: ["La République (Platon)", "Généalogie de la morale (Nietzsche)", "La Logique de la découverte scientifique (Popper)", "Investigations philosophiques (Wittgenstein)"],
    debatePhases: DEBATE_PHASES
  },
  {
    id: "mort_apres",
    title: "La mort et l'au-delà",
    description: "Y a-t-il une vie après la mort ? Comment différentes traditions abordent cette question ?",
    category: "religion",
    openingQuestion: "Que pensez-vous qu'il arrive à la conscience après la mort du corps physique ?",
    keyPhilosophers: ["Platon", "Épicure", "Heidegger", "Lévinas", "Schopenhauer", "Buddha"],
    keyTexts: ["Phédon (Platon)", "Lettre à Ménécée (Épicure)", "Être et Temps (Heidegger)", "Bardo Thödol (Livre tibétain des morts)"],
    debatePhases: DEBATE_PHASES
  }
];
