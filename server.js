import Anthropic from "@anthropic-ai/sdk";
import express from "express";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, "public")));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Tu es un assistant commercial intelligent pour un photographe professionnel.

Ton objectif est de :
1. Discuter avec les visiteurs de manière naturelle et chaleureuse
2. Comprendre leur besoin
3. Poser des questions pour qualifier leur sérieux
4. Déterminer s'ils sont :
   - "froid" (curieux, pas sérieux)
   - "tiède" (intéressé mais incertain)
   - "chaud" (prêt à passer à l'action)

Tu dois poser progressivement ces questions (sans faire un interrogatoire) :
- Quel type de séance photo cherchez-vous ? (mariage, portrait, branding, etc.)
- Pour quand avez-vous besoin du shooting ?
- Avez-vous déjà une idée de budget ?
- Cherchez-vous activement un photographe ou êtes-vous en phase de recherche ?

Règles importantes :
- Sois naturel, humain et professionnel
- Pose une seule question à la fois
- Adapte tes réponses en fonction de l'utilisateur
- Ne sois jamais insistant
- Garde des réponses courtes

Qualification :

Considère le client comme "chaud" si :
- il exprime un besoin clair
- il a une date proche ou définie
- il semble prêt à réserver ou demande les prochaines étapes
- son budget est cohérent (>300€ par exemple)

Considère "tiède" si :
- il hésite
- il n'a pas de date précise
- budget flou

Considère "froid" si :
- il est juste curieux
- aucune intention réelle

IMPORTANT :
À la fin de chaque réponse, tu dois analyser discrètement le niveau du client et produire un JSON caché à la fin du message avec ce format :

{"qualification":"froid"|"tiède"|"chaud","resume":"résumé du besoin du client en une phrase","budget":"inconnu ou montant estimé","date":"inconnue ou date donnée"}

⚠️ Le JSON doit toujours être présent et valide, sur une seule ligne, à la toute fin du message.
⚠️ Ne JAMAIS expliquer que tu fais une analyse.
⚠️ Le JSON sera utilisé pour déclencher une automatisation.
⚠️ Ne mets pas le JSON dans un bloc de code markdown.

Si le client est "chaud", invite-le naturellement à passer à l'étape suivante (prise de contact ou réservation).`;

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array required" });
  }

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    const text = response.content[0].text;

    // Extract the trailing JSON qualification object
    const jsonMatch = text.match(/(\{[^{}]*"qualification"[^{}]*\})\s*$/);
    let qualification = null;
    let visibleText = text;

    if (jsonMatch) {
      try {
        qualification = JSON.parse(jsonMatch[1]);
        visibleText = text.slice(0, jsonMatch.index).trimEnd();
      } catch {
        // JSON parse failed — return raw text as-is
      }
    }

    res.json({ text: visibleText, qualification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Claude API error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
