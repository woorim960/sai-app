import type {
  CompatDimension,
  CompatReport,
  DimensionScores,
  LoveProfile,
  LoveTypeId,
} from "@/lib/together/compatibility";

const DIMENSION_LABELS: Record<CompatDimension, string> = {
  security: "애착 안정성",
  expressiveness: "감정 표현",
  structure: "생활 리듬",
  intimacy: "친밀 욕구",
  passion: "열정·로맨스",
  commitment: "헌신·미래",
  conflict_direct: "갈등 대응",
  autonomy: "자율·독립",
};

const DIMENSION_POLES: Record<
  CompatDimension,
  { highLabel: string; lowLabel: string }
> = {
  security: { highLabel: "안정 애착", lowLabel: "불안·회피 성향" },
  expressiveness: { highLabel: "적극 표현", lowLabel: "은근·내향" },
  structure: { highLabel: "계획·루틴", lowLabel: "즉흥·유연" },
  intimacy: { highLabel: "깊은 교감", lowLabel: "적당한 거리" },
  passion: { highLabel: "설렘·자극", lowLabel: "편안함 우선" },
  commitment: { highLabel: "장기 헌신", lowLabel: "현재 중심" },
  conflict_direct: { highLabel: "직접 대화", lowLabel: "회피·거리두기" },
  autonomy: { highLabel: "개인 공간", lowLabel: "함께함 우선" },
};

export type AttachmentStyleId = "secure" | "anxious" | "avoidant" | "fearful";

export type DimensionInsight = {
  dimension: CompatDimension;
  label: string;
  score: number;
  poleLabel: string;
  interpretation: string;
};

export type PersonalReport = {
  subtype: string;
  attachmentStyle: AttachmentStyleId;
  attachmentLabel: string;
  attachmentDescription: string;
  dimensionInsights: DimensionInsight[];
  strengths: string[];
  cautions: string[];
};

export type DimensionComparison = {
  dimension: CompatDimension;
  label: string;
  mine: number;
  partner: number;
  gap: number;
  status: "similar" | "moderate" | "different";
  note: string;
};

export type ScoreBreakdownItem = {
  dimension: CompatDimension;
  label: string;
  score: number;
};

export type ScenarioAdvice = {
  id: string;
  emoji: string;
  title: string;
  advice: string;
};

export type ProfileChange = {
  dimension: CompatDimension;
  label: string;
  previous: number;
  current: number;
  delta: number;
  trend: "up" | "down" | "stable";
};

export type EnhancedCompatReport = CompatReport & {
  breakdown: ScoreBreakdownItem[];
  comparisons: DimensionComparison[];
  scenarios: ScenarioAdvice[];
};

const ATTACHMENT_META: Record<
  AttachmentStyleId,
  { label: string; description: string; emoji: string }
> = {
  secure: {
    label: "안정형 애착",
    description:
      "친밀함과 독립성의 균형이 좋아요. 상대를 신뢰하면서도 자기 공간을 존중하는 건강한 애착 패턴입니다.",
    emoji: "🟢",
  },
  anxious: {
    label: "불안형 애착",
    description:
      "사랑받고 싶은 마음이 크고, 상대의 반응에 민감한 편이에요. 솔직한 안심 표현이 관계를 더 편안하게 만듭니다.",
    emoji: "🟡",
  },
  avoidant: {
    label: "회피형 애착",
    description:
      "독립성과 자기만의 공간을 중시해요. 너무 가까워지면 부담을 느낄 수 있어, 서서히 신뢰를 쌓는 게 중요합니다.",
    emoji: "🔵",
  },
  fearful: {
    label: "혼재형 애착",
    description:
      "가까워지고 싶으면서도 동시에 거리를 두고 싶은 마음이 공존해요. 안전한 대화 환경이 특히 중요합니다.",
    emoji: "🟣",
  },
};

const SUBTYPE_CANDIDATES: { dimension: CompatDimension; label: string }[] = [
  { dimension: "commitment", label: "헌신 높음형" },
  { dimension: "intimacy", label: "친밀 추구형" },
  { dimension: "passion", label: "열정 주도형" },
  { dimension: "security", label: "안정 지향형" },
  { dimension: "autonomy", label: "자율 존중형" },
  { dimension: "conflict_direct", label: "소통 적극형" },
  { dimension: "expressiveness", label: "표현 풍부형" },
  { dimension: "structure", label: "계획 실천형" },
];

const DIMENSION_INTERPRETATIONS: Record<
  CompatDimension,
  { high: string; mid: string; low: string }
> = {
  security: {
    high: "연인과의 친밀함에서 안정감을 느끼며, 관계를 비교적 신뢰하는 편이에요.",
    mid: "친밀함과 거리 사이에서 균형을 찾는 중이에요. 상황에 따라 편안함이 달라질 수 있어요.",
    low: "가까워질수록 불안하거나 거리를 두고 싶은 마음이 생길 수 있어요. 신뢰 구축에 시간이 필요해요.",
  },
  expressiveness: {
    high: "좋아하고 고마운 마음을 말·행동으로 자주 표현하는 편이에요.",
    mid: "필요할 때 표현하지만, 항상 드러내지는 않는 균형형이에요.",
    low: "말보다 행동·분위기로 마음을 전하는 은근한 스타일이에요.",
  },
  structure: {
    high: "약속·일정·루틴을 중시하며 관계를 꾸준히 챙기는 편이에요.",
    mid: "중요한 일정은 잡되, 상황에 맞게 유연하게 조정해요.",
    low: "즉흥적이고 흐름에 맡기는 데이트·일상을 선호해요.",
  },
  intimacy: {
    high: "깊은 대화와 정서적 교감을 관계의 핵심으로 여겨요.",
    mid: "친밀함을 원하지만, 적당한 거리도 편안해요.",
    low: "너무 붙어 있기보다 각자의 페이스를 존중하는 편이에요.",
  },
  passion: {
    high: "설렘·로맨스·새로움을 관계 에너지의 원천으로 삼아요.",
    mid: "설렘과 편안함 사이에서 균형을 추구해요.",
    low: "화려한 이벤트보다 편안하고 안정적인 관계를 더 중시해요.",
  },
  commitment: {
    high: "장기적 관계와 미래를 진지하게 생각하며 책임감이 강해요.",
    mid: "지금의 관계를 소중히 하면서 미래는 함께 그려가는 편이에요.",
    low: "현재의 감정과 경험을 더 중시하며, 무거운 약속에 부담을 느낄 수 있어요.",
  },
  conflict_direct: {
    high: "갈등을 피하지 않고 대화로 풀려는 편이며, 화해를 빠르게 시도해요.",
    mid: "상황에 따라 바로 대화하거나, 잠시 거리를 둘 수 있어요.",
    low: "갈등 시 거리를 두고 정리한 뒤 대화하는 스타일이에요.",
  },
  autonomy: {
    high: "개인 시간·취미·관계망을 소중히 여기는 독립적인 편이에요.",
    mid: "함께하는 시간과 나만의 시간을 적절히 나눠요.",
    low: "연인과 많은 시간을 공유하며 함께함 자체에서 만족을 느껴요.",
  },
};

const STRENGTH_BY_DIMENSION: Record<CompatDimension, string> = {
  security: "관계에서 안정감을 주고, 상대를 비교적 신뢰하는 편이에요",
  expressiveness: "애정을 표현해 상대가 사랑받는다고 느끼게 해줘요",
  structure: "약속과 일정을 지켜 관계에 안정감을 더해요",
  intimacy: "깊은 대화로 정서적 유대를 쌓는 데 강점이 있어요",
  passion: "설렘과 에너지로 관계를 생동감 있게 만듭니다",
  commitment: "장기적 관점에서 관계에 책임감을 가져요",
  conflict_direct: "갈등을 대화로 풀려는 의지가 있어 회복이 빨라요",
  autonomy: "서로의 공간을 존중하며 건강한 거리를 유지해요",
};

const CAUTION_BY_DIMENSION: Record<CompatDimension, string> = {
  security: "불안할 때 상대에게 과한 확인을 요구하지 않는지 점검해보세요",
  expressiveness: "상대가 말보다 행동으로 사랑을 느끼는지 확인해보세요",
  structure: "지나친 계획이 상대에게 부담이 되지 않는지 살펴보세요",
  intimacy: "상대의 속도보다 빠르게 친밀함을 요구하지 않는지 주의하세요",
  passion: "설렘만 추구하다 안정감을 놓치지 않는지 생각해보세요",
  commitment: "상대와 관계 기대 수준이 맞는지 대화로 확인해보세요",
  conflict_direct: "감정이 올라갔을 때 상대를 압박하지 않도록 주의하세요",
  autonomy: "거리를 너무 두어 상대가 외롭게 느끼지 않는지 살펴보세요",
};

function scoreTier(score: number): "high" | "mid" | "low" {
  if (score >= 25) return "high";
  if (score <= -25) return "low";
  return "mid";
}

function dimensionSimilarityPercent(a: number, b: number): number {
  return Math.round((1 - Math.min(1, Math.abs(a - b) / 200)) * 100);
}

export function resolveAttachmentStyle(
  scores: DimensionScores
): AttachmentStyleId {
  const { security, intimacy, autonomy } = scores;

  if (security >= 20) return "secure";
  if (security < -10 && intimacy > 15 && autonomy < 10) return "anxious";
  if (security < -10 && autonomy > 15 && intimacy <= 10) return "avoidant";
  if (security < -10 && intimacy > 10 && autonomy > 10) return "fearful";
  if (security >= 0) return "secure";
  if (intimacy > autonomy + 10) return "anxious";
  if (autonomy > intimacy + 10) return "avoidant";
  return "fearful";
}

export function resolveSubtype(scores: DimensionScores): string {
  const sorted = [...SUBTYPE_CANDIDATES].sort(
    (a, b) => scores[b.dimension] - scores[a.dimension]
  );
  return sorted[0]?.label ?? "균형형";
}

export function interpretDimension(
  dimension: CompatDimension,
  score: number
): DimensionInsight {
  const meta = DIMENSION_POLES[dimension];
  const tier = scoreTier(score);
  const poleLabel =
    tier === "high"
      ? meta.highLabel
      : tier === "low"
        ? meta.lowLabel
        : "균형";

  return {
    dimension,
    label: DIMENSION_LABELS[dimension],
    score,
    poleLabel,
    interpretation: DIMENSION_INTERPRETATIONS[dimension][tier],
  };
}

export function buildPersonalReport(profile: LoveProfile): PersonalReport {
  const dimensions = Object.keys(DIMENSION_LABELS) as CompatDimension[];
  const dimensionInsights = dimensions.map((dim) =>
    interpretDimension(dim, profile.scores[dim])
  );

  const ranked = [...dimensions].sort(
    (a, b) => Math.abs(profile.scores[b]) - Math.abs(profile.scores[a])
  );

  const strengths = ranked
    .filter((dim) => profile.scores[dim] >= 20)
    .slice(0, 3)
    .map((dim) => STRENGTH_BY_DIMENSION[dim]);

  const cautions = ranked
    .filter((dim) => profile.scores[dim] <= -20)
    .slice(0, 2)
    .map((dim) => CAUTION_BY_DIMENSION[dim]);

  if (strengths.length === 0) {
    strengths.push("여러 차원에서 균형 잡힌 연애 성향을 가지고 있어요");
  }
  if (cautions.length === 0) {
    const midCaution = ranked.find((dim) => Math.abs(profile.scores[dim]) < 15);
    if (midCaution) cautions.push(CAUTION_BY_DIMENSION[midCaution]);
  }

  const attachmentStyle = resolveAttachmentStyle(profile.scores);
  const attachment = ATTACHMENT_META[attachmentStyle];

  return {
    subtype: resolveSubtype(profile.scores),
    attachmentStyle,
    attachmentLabel: attachment.label,
    attachmentDescription: attachment.description,
    dimensionInsights,
    strengths: strengths.slice(0, 3),
    cautions: cautions.slice(0, 2),
  };
}

export function buildDimensionComparisons(
  profileA: LoveProfile,
  profileB: LoveProfile
): DimensionComparison[] {
  const notes: Record<CompatDimension, [string, string, string]> = {
    security: [
      "애착 안정성이 비슷해 관계 불안이 적어요",
      "애착 성향에 약간 차이가 있어요",
      "애착 불안·회피 패턴 차이에 주의가 필요해요",
    ],
    expressiveness: [
      "애정 표현 방식이 잘 통해요",
      "표현 빈도·방식에 차이가 있을 수 있어요",
      "한쪽은 말로, 한쪽은 행동으로 사랑을 느낄 수 있어요",
    ],
    structure: [
      "생활 리듬·계획 성향이 맞아요",
      "일정 조율이 필요할 수 있어요",
      "계획형 vs 즉흥형 차이로 일정 마찰이 있을 수 있어요",
    ],
    intimacy: [
      "친밀 욕구가 비슷해요",
      "함께하는 시간·깊이 기대가 조금 달라요",
      "친밀함에 대한 필요가 꽤 다를 수 있어요",
    ],
    passion: [
      "로맨스·설렘에 대한 기대가 비슷해요",
      "설렘 vs 안정 중 무엇을 더 원하는지 나눠보세요",
      "열정·안정 중 우선순위가 다를 수 있어요",
    ],
    commitment: [
      "미래·헌신 가치관이 잘 맞아요",
      "관계 기대 수준을 한번 확인해보세요",
      "헌신·미래에 대한 기대 차이가 클 수 있어요",
    ],
    conflict_direct: [
      "갈등 대응 방식이 비슷해 회복이 빨라요",
      "갈등 시 대화 타이밍을 맞추면 좋아요",
      "한쪽은 바로 대화, 한쪽은 거리두기를 원할 수 있어요",
    ],
    autonomy: [
      "개인 시간·자율성 존중이 비슷해요",
      "함께함 vs 나만의 시간 비율을 조율해보세요",
      "독립성·함께함에 대한 필요가 다를 수 있어요",
    ],
  };

  return (Object.keys(DIMENSION_LABELS) as CompatDimension[]).map((dim) => {
    const mine = profileA.scores[dim];
    const partner = profileB.scores[dim];
    const gap = Math.abs(mine - partner);
    const status: DimensionComparison["status"] =
      gap <= 30 ? "similar" : gap <= 55 ? "moderate" : "different";
    const noteIndex = status === "similar" ? 0 : status === "moderate" ? 1 : 2;

    return {
      dimension: dim,
      label: DIMENSION_LABELS[dim],
      mine,
      partner,
      gap,
      status,
      note: notes[dim][noteIndex]!,
    };
  });
}

export function buildScoreBreakdown(
  profileA: LoveProfile,
  profileB: LoveProfile
): ScoreBreakdownItem[] {
  return (Object.keys(DIMENSION_LABELS) as CompatDimension[]).map((dim) => ({
    dimension: dim,
    label: DIMENSION_LABELS[dim],
    score: dimensionSimilarityPercent(profileA.scores[dim], profileB.scores[dim]),
  }));
}

export function buildScenarioAdvice(
  profileA: LoveProfile,
  profileB: LoveProfile
): ScenarioAdvice[] {
  const a = profileA.scores;
  const b = profileB.scores;
  const scenarios: ScenarioAdvice[] = [];

  // 갈등 시
  if (a.conflict_direct > 15 && b.conflict_direct < -15) {
    scenarios.push({
      id: "conflict-mixed",
      emoji: "💬",
      title: "다툴 때",
      advice:
        "한쪽은 바로 대화를 원하고, 다른 한쪽은 정리할 시간이 필요해요. '지금 대화할까, 30분 뒤에 할까?' 같이 타이밍을 먼저 맞춰보세요.",
    });
  } else if (a.conflict_direct < -15 && b.conflict_direct < -15) {
    scenarios.push({
      id: "conflict-avoid",
      emoji: "💬",
      title: "다툴 때",
      advice:
        "둘 다 갈등을 피하는 경향이 있어요. 감정이 식은 뒤 '아까 그 일, 다시 이야기해볼까?'라고 먼저 꺼내는 습관이 도움이 됩니다.",
    });
  } else {
    scenarios.push({
      id: "conflict-ok",
      emoji: "💬",
      title: "다툴 때",
      advice:
        "대화로 푸는 성향이 비슷해요. 싸운 뒤 '아까 내 말이 너무 심했어' 한마디가 관계를 훨씬 빠르게 회복시킵니다.",
    });
  }

  // 데이트
  if (Math.abs(a.structure - b.structure) > 50) {
    scenarios.push({
      id: "date-structure",
      emoji: "📅",
      title: "데이트할 때",
      advice:
        "계획형과 즉흥형 조합이에요. '이번엔 네가 짜줘' / '이번엔 내가 계획할게'처럼 번갈아 리드하면 둘 다 만족하기 쉬워요.",
    });
  } else {
    scenarios.push({
      id: "date-similar",
      emoji: "📅",
      title: "데이트할 때",
      advice:
        "데이트 스타일이 비슷해요. 작은 루틴(매주 금요일 데이트 등)을 만들면 관계 만족도가 더 올라갑니다.",
    });
  }

  // 애정 표현
  if (Math.abs(a.expressiveness - b.expressiveness) > 45) {
    scenarios.push({
      id: "affection-gap",
      emoji: "💕",
      title: "애정 표현",
      advice:
        "표현 빈도·방식에 차이가 있어요. '나는 이렇게 사랑받을 때 기뻐'처럼 구체적으로 알려주면 오해가 줄어듭니다.",
    });
  } else {
    scenarios.push({
      id: "affection-ok",
      emoji: "💕",
      title: "애정 표현",
      advice:
        "서로의 애정 표현 방식이 통하는 편이에요. 일상의 작은 칭찬과 감사가 관계를 더 단단하게 만듭니다.",
    });
  }

  return scenarios;
}

export function compareProfileChanges(
  previous: LoveProfile,
  current: LoveProfile
): ProfileChange[] {
  const threshold = 12;
  return (Object.keys(DIMENSION_LABELS) as CompatDimension[])
    .map((dim) => {
      const prev = previous.scores[dim];
      const curr = current.scores[dim];
      const delta = curr - prev;
      const trend: ProfileChange["trend"] =
        Math.abs(delta) < threshold ? "stable" : delta > 0 ? "up" : "down";
      return {
        dimension: dim,
        label: DIMENSION_LABELS[dim],
        previous: prev,
        current: curr,
        delta,
        trend,
      };
    })
    .filter((item) => item.trend !== "stable")
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 4);
}

export function buildEnhancedCompatReport(
  typeA: LoveTypeId,
  typeB: LoveTypeId,
  profileA: LoveProfile,
  profileB: LoveProfile,
  base: CompatReport
): EnhancedCompatReport {
  return {
    ...base,
    breakdown: buildScoreBreakdown(profileA, profileB),
    comparisons: buildDimensionComparisons(profileA, profileB),
    scenarios: buildScenarioAdvice(profileA, profileB),
  };
}

export function getAttachmentMeta(style: AttachmentStyleId) {
  return ATTACHMENT_META[style];
}
