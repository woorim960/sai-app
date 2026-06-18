import type { CardPhase } from "./types";

export const PHASE_LABELS: Record<CardPhase, string> = {
  ice_breaking: "Ice Breaking",
  taste: "Taste",
  value: "Value",
  closing: "Closing",
};

export const CONVERSATION_PHASE_MESSAGES: Record<CardPhase, string> = {
  ice_breaking: "가볍게 웃으며 시작해요",
  taste: "서로의 취향을 자연스럽게 알아가요",
  value: "서로의 생각과 가치관을 나눠요",
  closing: "오늘 대화를 따뜻하게 마무리해요",
};
