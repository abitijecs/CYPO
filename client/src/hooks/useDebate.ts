import { useState, useCallback, useRef } from "react";
import Anthropic from "@anthropic-ai/sdk";
import type { Message, DebateTopic, DebatePhase } from "../types";
import { SYSTEM_PROMPT } from "../systemPrompt";

export function useDebate(apiKey: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<boolean>(false);

  const sendMessage = useCallback(
    async (
      topic: DebateTopic,
      phase: DebatePhase,
      userMessage: string
    ) => {
      if (isStreaming) return;
      setError(null);

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: userMessage,
        phase: phase.id,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);

      const history = messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      const assistantMsgId = crypto.randomUUID();
      const assistantMsg: Message = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        phase: phase.id,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsStreaming(true);
      abortRef.current = false;

      const phaseContext = `[Phase actuelle : ${phase.label} — ${phase.description}]
[Sujet : ${topic.title}]
[Philosophes clés pour ce sujet : ${topic.keyPhilosophers.join(", ")}]
[Textes de référence : ${topic.keyTexts.join(", ")}]`;

      const conversationHistory: { role: "user" | "assistant"; content: string }[] = [
        { role: "user", content: phaseContext },
        { role: "assistant", content: `Compris. Nous sommes en phase **${phase.label}** du débat sur **"${topic.title}"**. ${phase.prompt}` },
        ...history,
        { role: "user", content: userMessage },
      ];

      try {
        const client = new Anthropic({
          apiKey,
          dangerouslyAllowBrowser: true,
        });

        const stream = client.messages.stream({
          model: "claude-opus-4-6",
          max_tokens: 2048,
          system: SYSTEM_PROMPT,
          messages: conversationHistory,
        });

        for await (const event of stream) {
          if (abortRef.current) break;
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const text = (event.delta as { type: "text_delta"; text: string }).text;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId
                  ? { ...m, content: m.content + text }
                  : m
              )
            );
          }
        }
      } catch (err) {
        if (abortRef.current) return;
        const message = err instanceof Error ? err.message : "Erreur inconnue";
        setError(message);
        setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
      } finally {
        setIsStreaming(false);
        abortRef.current = false;
      }
    },
    [messages, isStreaming, apiKey]
  );

  const stopStreaming = useCallback(() => {
    abortRef.current = true;
    setIsStreaming(false);
  }, []);

  const resetDebate = useCallback(() => {
    abortRef.current = true;
    setMessages([]);
    setIsStreaming(false);
    setError(null);
  }, []);

  return { messages, isStreaming, error, sendMessage, stopStreaming, resetDebate };
}
