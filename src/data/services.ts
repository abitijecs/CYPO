import type { Service } from '@/types/booking'

export const SERVICES: Service[] = [
  {
    id: 'soin-visage-hydratant',
    name: 'Soin Visage Hydratant',
    description:
      'Un soin profond qui redonne éclat et souplesse à votre peau. Inclut nettoyage, gommage, masque et sérum hydratant personnalisé.',
    duration: 60,
    price: 75,
    category: 'visage',
    popular: true,
  },
  {
    id: 'soin-anti-age',
    name: 'Soin Anti-Âge Premium',
    description:
      'Protocole lifting et raffermissant avec actifs haute concentration. Résultats visibles dès la première séance pour une peau redensifiée.',
    duration: 90,
    price: 120,
    category: 'visage',
  },
  {
    id: 'epilation-visage',
    name: 'Épilation Visage Complète',
    description:
      'Lèvres, menton, joues. Technique douce adaptée à tous types de peau pour un résultat lisse et durable sans irritation.',
    duration: 30,
    price: 35,
    category: 'visage',
  },
  {
    id: 'maquillage-naturel',
    name: 'Maquillage Naturel & Sublimateur',
    description:
      'Maquillage jour qui révèle votre beauté naturelle. Teint lumineux, regard expressif. Idéal pour rendez-vous ou déjeuner chic.',
    duration: 45,
    price: 60,
    category: 'maquillage',
    popular: true,
  },
  {
    id: 'maquillage-soiree',
    name: 'Maquillage Soirée & Événement',
    description:
      'Maquillage longue tenue pour les grandes occasions. Smoky eye, lèvres impeccables, bonne mine garantie toute la nuit.',
    duration: 60,
    price: 85,
    category: 'maquillage',
  },
  {
    id: 'soin-corps-relaxant',
    name: 'Soin Corps Nourrissant',
    description:
      'Gommage + enveloppement aux huiles précieuses. Peau soyeuse, esprit apaisé. Un moment de détente absolue.',
    duration: 60,
    price: 90,
    category: 'corps',
  },
  {
    id: 'epilation-corps',
    name: 'Épilation Corps (Zone au choix)',
    description:
      'Jambes, bras, aisselles ou maillot classique. Cire tiède adaptée à votre type de peau pour un résultat impeccable.',
    duration: 45,
    price: 45,
    category: 'corps',
  },
  {
    id: 'sourcils',
    name: 'Design & Mise en Forme des Sourcils',
    description:
      'Architecture des sourcils sur-mesure adaptée à votre morphologie. Épilation + traçage pour un regard structuré et harmonieux.',
    duration: 30,
    price: 30,
    category: 'soins',
  },
  {
    id: 'forfait-mariee',
    name: 'Forfait Mariée — Beauté Complète',
    description:
      'Essai + Jour J inclus. Soin visage préparatoire, maquillage mariée longue tenue, design sourcils. Un jour inoubliable, sublimé.',
    duration: 180,
    price: 280,
    category: 'maquillage',
    popular: true,
  },
]

export const CATEGORY_LABELS: Record<string, string> = {
  visage: 'Soins Visage',
  corps: 'Soins Corps',
  maquillage: 'Maquillage',
  soins: 'Soins Express',
}

export const AVAILABLE_TIMES = [
  '09:00',
  '10:00',
  '11:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
]
