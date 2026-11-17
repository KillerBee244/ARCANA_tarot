import { z } from "zod";

export const SelectedCardSchema = z.object({
  cardId: z.string().min(1),
  orientation: z.enum(["upright", "reversed"]),
  positionId: z.string().min(1),
  selectionOrder: z.number().int().nonnegative(),
});

export const InterpretApiRequestSchema = z.object({
  readingId: z.string().min(1),
  question: z.string().max(500).default(""),
  category: z.enum(["love", "career", "finance", "self", "general"]),
  spreadType: z.enum(["single", "three_card"]),
  selectedCards: z.array(SelectedCardSchema).min(1).max(3),
});

export const AIStructuredOutputSchema = z.object({
  title: z.string().min(1).max(120),
  overview: z.string().min(10),
  cardConnections: z.array(
    z.object({
      cardId: z.string(),
      connectionText: z.string().min(5),
    })
  ),
  personalizedInterpretation: z.string().min(20),
  reflectionQuestions: z.array(z.string().min(5)).min(2).max(4),
  closingMessage: z.string().min(10),
});

export type AIStructuredOutput = z.infer<typeof AIStructuredOutputSchema>;
