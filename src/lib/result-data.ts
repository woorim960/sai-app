import type { Situation } from "@/lib/data";
import type { CardAnswerRecord } from "@/lib/storage";

export type ResultInsight = {
  id: string;
  emoji: string;
  title: string;
  description: string;
};

const defaultInsights: ResultInsight[] = [
  {
    id: "discovery",
    emoji: "✨",
    title: "새롭게 알게 된 점",
    description: "서로의 취향과 생각을 조금 더 알게 되었어요.",
  },
  {
    id: "memory",
    emoji: "💬",
    title: "가장 기억에 남는 대화",
    description: "오늘 가장 오래 이야기한 질문을 떠올려보세요.",
  },
  {
    id: "charm",
    emoji: "❤️",
    title: "상대의 새로운 매력",
    description: "대화 속에서 발견한 상대의 좋은 점을 말해보세요.",
  },
];

const insightsBySituation: Record<string, ResultInsight[]> = {
  "blind-date": [
    {
      id: "discovery",
      emoji: "✨",
      title: "새롭게 알게 된 점",
      description: "처음 만난 사람의 취향과 생각을 조금 더 알게 되었어요.",
    },
    {
      id: "memory",
      emoji: "💬",
      title: "가장 기억에 남는 대화",
      description: "어색함을 깨며 가장 오래 이야기한 주제를 떠올려보세요.",
    },
    {
      id: "charm",
      emoji: "❤️",
      title: "상대의 새로운 매력",
      description: "대화 속에서 발견한 상대의 좋은 점을 말해보세요.",
    },
  ],
  some: [
    {
      id: "discovery",
      emoji: "✨",
      title: "새롭게 알게 된 점",
      description: "은근한 설렘과 서로의 마음을 조금 더 알게 되었어요.",
    },
    {
      id: "memory",
      emoji: "💬",
      title: "가장 설렜던 순간",
      description: "오늘 대화 중 가장 설렜던 순간을 나눠보세요.",
    },
    {
      id: "charm",
      emoji: "❤️",
      title: "상대의 새로운 매력",
      description: "평소 몰랐던 상대의 매력을 발견했나요?",
    },
  ],
  "early-love": [
    {
      id: "discovery",
      emoji: "✨",
      title: "새롭게 알게 된 점",
      description: "연인이지만 아직 몰랐던 서로의 모습을 발견했어요.",
    },
    {
      id: "memory",
      emoji: "💬",
      title: "가장 따뜻했던 대화",
      description: "오늘 나눈 대화 중 가장 마음에 남는 순간은?",
    },
    {
      id: "charm",
      emoji: "❤️",
      title: "더 좋아진 점",
      description: "오늘 대화 후 상대에게 더 끌리게 된 점을 말해보세요.",
    },
  ],
  friend: [
    {
      id: "discovery",
      emoji: "✨",
      title: "새롭게 알게 된 점",
      description: "친구처럼 편했지만, 새롭게 알게 된 점이 있었나요?",
    },
    {
      id: "memory",
      emoji: "💬",
      title: "가장 웃었던 순간",
      description: "오늘 대화 중 가장 많이 웃었던 순간을 떠올려보세요.",
    },
    {
      id: "charm",
      emoji: "❤️",
      title: "상대의 새로운 매력",
      description: "친구로서 몰랐던 상대의 매력을 발견했나요?",
    },
  ],
};

export function getResultInsights(situationId: string): ResultInsight[] {
  return insightsBySituation[situationId] ?? defaultInsights;
}

export function getPersonalizedInsights(
  situationId: string,
  answers: CardAnswerRecord[]
): ResultInsight[] {
  const base = getResultInsights(situationId);
  const balanceAnswers = answers.filter(
    (answer) => answer.type === "balance" && answer.selectedLabel
  );

  if (balanceAnswers.length === 0) {
    return base;
  }

  const firstChoice = balanceAnswers[0].selectedLabel!;
  const extraCount = balanceAnswers.length - 1;
  const choiceSummary =
    extraCount > 0
      ? `"${firstChoice}" 외 ${extraCount}가지 선택`
      : `"${firstChoice}" 선택`;

  const preferenceInsight: ResultInsight = {
    id: "preference",
    emoji: "🎯",
    title: "오늘의 선택",
    description: `Balance 대화에서 ${choiceSummary}을 했어요. 서로의 취향 차이를 재미있게 나눠보세요.`,
  };

  return [preferenceInsight, ...base.slice(0, 2)];
}

export function getResultSubtitle(situation: Situation): string {
  const subtitles: Record<string, string> = {
    "blind-date": "짧은 대화 속에서도 서로의 취향과 생각을 발견했어요.",
    some: "은근한 설렘과 서로의 마음을 조금 더 알게 되었어요.",
    "early-love": "연인이지만, 아직 모르는 서로의 모습을 발견했어요.",
    friend: "편한 친구 사이에서도 새로운 이야기를 나눴어요.",
  };
  return subtitles[situation.id] ?? "짧은 대화 속에서도 서로의 취향과 생각을 발견했어요.";
}

export const shareContent = {
  title: "사이",
  text: "더 가까워지고 싶은 사람이 있나요? 사이에서 함께 대화해보세요.",
};
