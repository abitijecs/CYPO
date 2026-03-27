import Anthropic from '@anthropic-ai/sdk'
import { SERVICES, CATEGORY_LABELS } from '@/data/services'
import { formatCurrency, formatDuration } from '@/lib/utils'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

function buildServicesContext(): string {
  const grouped: Record<string, typeof SERVICES> = {}
  for (const s of SERVICES) {
    if (!grouped[s.category]) grouped[s.category] = []
    grouped[s.category].push(s)
  }

  return Object.entries(grouped)
    .map(([cat, services]) => {
      const label = CATEGORY_LABELS[cat] || cat
      const list = services
        .map(
          (s) =>
            `  - ${s.name} (id: ${s.id}): ${formatCurrency(s.price)}, ${formatDuration(s.duration)}. ${s.description}`,
        )
        .join('\n')
      return `${label}:\n${list}`
    })
    .join('\n\n')
}

export const CHAT_SYSTEM_PROMPT = `Tu es "Maya", l'assistante virtuelle chaleureuse et professionnelle de Mailess M2S, experte en beauté et esthétique.

Ton rôle :
- Accueillir les clientes avec chaleur et bienveillance
- Les aider à choisir la prestation idéale selon leurs besoins
- Répondre à leurs questions sur les soins, la préparation, les contre-indications
- Les guider vers la prise de rendez-vous via le bouton "Réserver" visible sur la page
- Parler exclusivement en français
- Être concise (2-3 phrases max par réponse), jamais robotique

PRESTATIONS DISPONIBLES :
${buildServicesContext()}

TARIFS & PAIEMENT :
- Paiement le jour de la prestation (espèces, virement ou carte)
- Aucun acompte requis à la réservation
- Annulation gratuite jusqu'à 24h avant le rendez-vous

IMPORTANT — DÉTECTION D'INTENTION DE PAIEMENT :
Quand une cliente confirme qu'elle veut réserver ET payer (ex: "je prends", "c'est bon", "je veux réserver", "comment je paie", "parfait je valide"), tu DOIS appeler l'outil \`notifier_proprietaire\` avant de répondre.

Commence toujours par un accueil chaleureux si c'est le premier message.`

export const NOTIFICATION_TOOL: Anthropic.Tool = {
  name: 'notifier_proprietaire',
  description:
    'Notifie Mailess qu\'une cliente est prête à réserver et payer. À appeler uniquement quand la cliente confirme clairement son intention de réservation et de paiement.',
  input_schema: {
    type: 'object' as const,
    properties: {
      service_id: {
        type: 'string',
        description: 'ID du service mentionné (ex: maquillage-soiree). Laisser vide si inconnu.',
      },
      resume: {
        type: 'string',
        description: 'Résumé de 1-2 phrases de ce que la cliente souhaite.',
      },
    },
    required: ['resume'],
  },
}
