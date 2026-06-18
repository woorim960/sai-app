import { buildEnhancedCompatReport } from "@/lib/together/compatibility-insights";
import {
  COMPAT_QUESTIONS,
  type CompatQuestion,
} from "@/lib/together/compatibility-questions";
import {
  LOVE_PERSONAS,
  PERSONA_BY_AXIS_CODE,
  PERSONA_COUNT,
  type LovePersona,
  type LovePersonaId,
} from "@/lib/together/compatibility-personas";
export type { LovePersona, LovePersonaId } from "@/lib/together/compatibility-personas";
export {
  LOVE_PERSONAS,
  PERSONA_COUNT,
  getLovePersona,
  personaToIndex,
  indexToPersona,
} from "@/lib/together/compatibility-personas";
export type { EnhancedCompatReport, PersonalReport, ProfileChange } from "@/lib/together/compatibility-insights";
export {
  buildPersonalReport,
  buildEnhancedCompatReport,
  compareProfileChanges,
  getAttachmentMeta,
} from "@/lib/together/compatibility-insights";

export type CompatDimension =
  | "security"
  | "expressiveness"
  | "structure"
  | "intimacy"
  | "passion"
  | "commitment"
  | "conflict_direct"
  | "autonomy";

export type DimensionScores = Record<CompatDimension, number>;

export type DimensionEffects = Partial<Record<CompatDimension, number>>;

export type LoveTypeId =
  | "warm_planner"
  | "sunny_romantic"
  | "steady_anchor"
  | "free_explorer";

export type LoveType = {
  id: LoveTypeId;
  emoji: string;
  title: string;
  tagline: string;
  description: string;
  traits: string[];
  /** 학술적 근거 요약 */
  researchBasis: string;
};

export type LoveProfile = {
  v: 2;
  type: LoveTypeId;
  persona: LovePersonaId;
  scores: DimensionScores;
};

export type CompatReport = {
  score: number;
  headline: string;
  message: string;
  strengths: string[];
  growthAreas: string[];
};

export const PROFILE_VERSION = 2;

export const DIMENSION_META: Record<
  CompatDimension,
  { label: string; lowLabel: string; highLabel: string }
> = {
  security: { label: "애착 안정성", lowLabel: "불안·회피 성향", highLabel: "안정 애착" },
  expressiveness: { label: "감정 표현", lowLabel: "은근·내향", highLabel: "적극 표현" },
  structure: { label: "생활 리듬", lowLabel: "즉흥·유연", highLabel: "계획·루틴" },
  intimacy: { label: "친밀 욕구", lowLabel: "적당한 거리", highLabel: "깊은 교감" },
  passion: { label: "열정·로맨스", lowLabel: "편안함 우선", highLabel: "설렘·자극" },
  commitment: { label: "헌신·미래", lowLabel: "현재 중심", highLabel: "장기 헌신" },
  conflict_direct: { label: "갈등 대응", lowLabel: "회피·거리두기", highLabel: "직접 대화" },
  autonomy: { label: "자율·독립", lowLabel: "함께함 우선", highLabel: "개인 공간" },
};

/** 차원별 문항 수 (신뢰도 가중용) */
const DIMENSION_ITEM_COUNTS: Record<CompatDimension, number> = {
  security: 5,
  expressiveness: 5,
  structure: 5,
  intimacy: 5,
  passion: 5,
  commitment: 5,
  conflict_direct: 5,
  autonomy: 5,
};

/** 연구 기반 차원 가중치 (Hazan-Shaver, Sternberg, Gottman, 동질성 가설) */
const COMPAT_WEIGHTS: Record<CompatDimension, number> = {
  security: 0.22,
  commitment: 0.18,
  intimacy: 0.14,
  conflict_direct: 0.12,
  expressiveness: 0.1,
  structure: 0.08,
  passion: 0.08,
  autonomy: 0.08,
};

export const LOVE_TYPES: Record<LoveTypeId, LoveType> = {
  warm_planner: {
    id: "warm_planner",
    emoji: "🌷",
    title: "다정한 기획자",
    tagline: "안정 애착 · 적극 표현 · 계획형",
    description:
      "애착이론의 '안정형'에 가까우며, Sternberg 이론에서 친밀·헌신이 높은 유형이에요. 마음을 표현하면서도 둘의 시간을 세심하게 설계해 관계 만족도가 높은 편입니다.",
    traits: ["정서 표현이 풍부", "약속·일정을 중시", "관계 안정감을 줌"],
    researchBasis: "Secure attachment · High intimacy & commitment (Sternberg)",
  },
  sunny_romantic: {
    id: "sunny_romantic",
    emoji: "🌈",
    title: "햇살 로맨티스트",
    tagline: "열정형 · 표현형 · 즉흥형",
    description:
      "Sternberg의 '열정(Passion)' 차원이 두드러지며, Lee의 Eros(열정적 사랑) 스타일에 가까워요. 감정을 솔직히 나누고 새로운 경험을 함께할 때 관계 에너지가 가장 높아집니다.",
    traits: ["설렘·로맨스를 중시", "감정 표현이 솔직", "분위기를 밝게 만듦"],
    researchBasis: "High passion · Eros love style · Expressive attachment",
  },
  steady_anchor: {
    id: "steady_anchor",
    emoji: "🌳",
    title: "든든한 안정파",
    tagline: "안정 애착 · 차분함 · 계획형",
    description:
      "애착 안정성과 헌신이 높고, Lee의 Storge(우정적 사랑)+Pragma(실용적 사랑) 성향이 강해요. 말보다 행동과 일관성으로 신뢰를 쌓으며, 장기 관계에서 만족도가 높은 유형입니다.",
    traits: ["변함없는 신뢰감", "현실적·계획적", "갈등 시 냉정하게 수리"],
    researchBasis: "Secure-stable · Storge/Pragma · High commitment",
  },
  free_explorer: {
    id: "free_explorer",
    emoji: "🪁",
    title: "자유로운 모험가",
    tagline: "자율성 · 즉흥형 · 탐험형",
    description:
      "건강한 자율성(Autonomy)이 높고 즉흥적 경험을 중시하는 유형이에요. 과도한 통제보다 상호 존중과 개인 공간을 바탕으로, 함께하는 모험이 관계를 키웁니다.",
    traits: ["개인 시간을 소중히", "새로운 경험 추구", "구속 없는 관계 선호"],
    researchBasis: "Healthy autonomy · Ludus elements · Low structure need",
  },
};

export const LOVE_TYPE_INDEX: LoveTypeId[] = [
  "warm_planner",
  "sunny_romantic",
  "steady_anchor",
  "free_explorer",
];

export { COMPAT_QUESTIONS, type CompatQuestion };
export {
  COMPAT_SECTIONS,
  getSectionForIndex,
  getSectionProgress,
  type CompatSection,
} from "@/lib/together/compatibility-questions";

export function createEmptyScores(): DimensionScores {
  return {
    security: 0,
    expressiveness: 0,
    structure: 0,
    intimacy: 0,
    passion: 0,
    commitment: 0,
    conflict_direct: 0,
    autonomy: 0,
  };
}

export function applyChoice(
  scores: DimensionScores,
  effects: DimensionEffects
): DimensionScores {
  const next = { ...scores };
  for (const [key, value] of Object.entries(effects) as [
    CompatDimension,
    number,
  ][]) {
    next[key] += value;
  }
  return next;
}

/** 원점수 → -100~100 정규화 */
export function normalizeScores(raw: DimensionScores): DimensionScores {
  const normalized = createEmptyScores();
  for (const dim of Object.keys(raw) as CompatDimension[]) {
    const max = DIMENSION_ITEM_COUNTS[dim] * 2;
    const ratio = max > 0 ? raw[dim] / max : 0;
    normalized[dim] = Math.round(Math.max(-100, Math.min(100, ratio * 100)));
  }
  return normalized;
}

const CANONICAL_PERSONA: Record<LoveTypeId, LovePersonaId> = {
  warm_planner: "warm_architect",
  sunny_romantic: "sunrise_adventurer",
  steady_anchor: "steadfast_companion",
  free_explorer: "free_spirit",
};

export function getCanonicalPersona(archetype: LoveTypeId): LovePersonaId {
  return CANONICAL_PERSONA[archetype];
}

export function resolveLovePersona(scores: DimensionScores): LovePersonaId {
  const normalized = normalizeScores(scores);
  const code = [
    normalized.expressiveness >= 0 ? "E" : "R",
    normalized.structure >= 0 ? "P" : "S",
    normalized.intimacy >= 0 ? "I" : "D",
    normalized.passion >= 0 ? "F" : "A",
  ].join("");

  return PERSONA_BY_AXIS_CODE[code] ?? "warm_architect";
}

export function resolveLoveType(scores: DimensionScores): LoveTypeId {
  const normalized = normalizeScores(scores);
  const expressive = normalized.expressiveness >= 0;
  const planner = normalized.structure >= 0;

  if (expressive && planner) return "warm_planner";
  if (expressive && !planner) return "sunny_romantic";
  if (!expressive && planner) return "steady_anchor";
  return "free_explorer";
}

export function buildLoveProfile(rawScores: DimensionScores): LoveProfile {
  const scores = normalizeScores(rawScores);
  const persona = resolveLovePersona(rawScores);
  return {
    v: PROFILE_VERSION,
    type: LOVE_PERSONAS[persona].archetype,
    persona,
    scores,
  };
}

export function serializeProfile(profile: LoveProfile): string {
  return JSON.stringify(profile);
}

export function parseProfile(note?: string | null): LoveProfile | null {
  if (!note) return null;
  if (note in LOVE_TYPES) {
    return null;
  }
  try {
    const parsed = JSON.parse(note) as LoveProfile;
    if (parsed.v !== PROFILE_VERSION || !parsed.type || !parsed.scores) {
      return null;
    }
    if (!parsed.persona) {
      parsed.persona = resolveLovePersona(parsed.scores);
    }
    return parsed;
  } catch {
    return null;
  }
}

export function getProfilePersona(profile: LoveProfile): LovePersona {
  const id = profile.persona ?? resolveLovePersona(profile.scores);
  return LOVE_PERSONAS[id];
}

export function getPersonaAxisBadges(scores: DimensionScores): string[] {
  const normalized = normalizeScores(scores);
  return [
    normalized.expressiveness >= 0 ? "적극 표현" : "은근·내향",
    normalized.structure >= 0 ? "계획·루틴" : "즉흥·유연",
    normalized.intimacy >= 0 ? "깊은 교감" : "적당한 거리",
    normalized.passion >= 0 ? "설렘·자극" : "편안함 우선",
  ];
}

export function formatFullTypeLabel(profile: LoveProfile): string {
  const persona = getProfilePersona(profile);
  return `${persona.title} (${persona.code})`;
}

export function loveTypeToIndex(id: LoveTypeId): number {
  return LOVE_TYPE_INDEX.indexOf(id);
}

export function indexToLoveType(index: number): LoveTypeId {
  return LOVE_TYPE_INDEX[index] ?? "warm_planner";
}

function dimensionSimilarity(a: number, b: number): number {
  return 1 - Math.min(1, Math.abs(a - b) / 200);
}

/** 다차원 프로필 기반 궁합 (연구 가중 유사도) */
export function computeDimensionalCompat(
  profileA: LoveProfile,
  profileB: LoveProfile
): number {
  let weighted = 0;

  for (const dim of Object.keys(COMPAT_WEIGHTS) as CompatDimension[]) {
    weighted +=
      COMPAT_WEIGHTS[dim] *
      dimensionSimilarity(profileA.scores[dim], profileB.scores[dim]);
  }

  // 안정 애착 쌍 보너스 (Hazan & Shaver: secure pairing)
  if (profileA.scores.security > 15 && profileB.scores.security > 15) {
    weighted += 0.04;
  }

  // 갈등 스타일 극단적 불일치 페널티 (Gottman)
  const conflictGap = Math.abs(
    profileA.scores.conflict_direct - profileB.scores.conflict_direct
  );
  if (conflictGap > 80) weighted -= 0.05;

  // 헌신·친밀 모두 높으면 보너스 (Sternberg)
  if (
    profileA.scores.commitment > 20 &&
    profileB.scores.commitment > 20 &&
    profileA.scores.intimacy > 10 &&
    profileB.scores.intimacy > 10
  ) {
    weighted += 0.03;
  }

  // 구조 보완성: 적당한 차이는 생활 균형 (±3%)
  const structGap = Math.abs(profileA.scores.structure - profileB.scores.structure);
  if (structGap >= 25 && structGap <= 75) weighted += 0.03;

  return Math.round(Math.min(97, Math.max(62, 58 + weighted * 42)));
}

const LEGACY_COMPAT_MATRIX: Record<LoveTypeId, Record<LoveTypeId, number>> = {
  warm_planner: {
    warm_planner: 88,
    sunny_romantic: 92,
    steady_anchor: 95,
    free_explorer: 84,
  },
  sunny_romantic: {
    warm_planner: 92,
    sunny_romantic: 86,
    steady_anchor: 90,
    free_explorer: 94,
  },
  steady_anchor: {
    warm_planner: 95,
    sunny_romantic: 90,
    steady_anchor: 82,
    free_explorer: 89,
  },
  free_explorer: {
    warm_planner: 84,
    sunny_romantic: 94,
    steady_anchor: 89,
    free_explorer: 80,
  },
};

function buildInsights(
  profileA: LoveProfile,
  profileB: LoveProfile
): { strengths: string[]; growthAreas: string[] } {
  const strengths: string[] = [];
  const growthAreas: string[] = [];

  const pairs: [CompatDimension, string, string][] = [
    ["security", "애착 안정성이 비슷해 관계 불안이 적어요", "애착 불안·회피 성향 차이에 주의가 필요해요"],
    ["commitment", "미래·헌신 가치관이 잘 맞아요", "관계 기대 수준(헌신) 차이를 대화로 맞춰보세요"],
    ["intimacy", "정서적 친밀 욕구가 비슷해요", "함께하는 시간·깊이의 기대가 다를 수 있어요"],
    ["conflict_direct", "갈등 대응 방식이 비슷해 회복이 빨라요", "갈등 시 대화 vs 거리두기 방식이 달라요"],
    ["expressiveness", "감정 표현 방식이 통하는 편이에요", "애정 표현 빈도·방식 차이를 이해해주세요"],
    ["structure", "생활 리듬·계획 성향이 맞아요", "계획형 vs 즉흥형 차이로 일정 마찰이 있을 수 있어요"],
    ["passion", "로맨스·설렘에 대한 기대가 비슷해요", "열정·안정 중 무엇을 더 원하는지 나눠보세요"],
    ["autonomy", "개인 시간·자율성 존중이 비슷해요", "함께함 vs 나만의 시간 비율을 조율해보세요"],
  ];

  for (const [dim, strengthMsg, growthMsg] of pairs) {
    const gap = Math.abs(profileA.scores[dim] - profileB.scores[dim]);
    if (gap <= 30) strengths.push(strengthMsg);
    else if (gap >= 55) growthAreas.push(growthMsg);
  }

  return {
    strengths: strengths.slice(0, 3),
    growthAreas: growthAreas.slice(0, 2),
  };
}

export function computeCompatReport(
  typeA: LoveTypeId,
  typeB: LoveTypeId,
  profileA?: LoveProfile | null,
  profileB?: LoveProfile | null
): CompatReport {
  const score =
    profileA && profileB
      ? computeDimensionalCompat(profileA, profileB)
      : LEGACY_COMPAT_MATRIX[typeA][typeB];

  const titleA = profileA
    ? getProfilePersona(profileA).title
    : LOVE_TYPES[typeA].title;
  const titleB = profileB
    ? getProfilePersona(profileB).title
    : LOVE_TYPES[typeB].title;

  let headline = "잘 통하는 사이";
  if (score >= 93) headline = "환상의 케미";
  else if (score >= 88) headline = "찰떡 궁합";
  else if (score >= 82) headline = "서로를 채워주는 사이";
  else if (score >= 75) headline = "노력하면 더 깊어지는 사이";

  const samePersona =
    profileA && profileB && profileA.persona === profileB.persona;
  const sameArchetype = typeA === typeB;

  const message = samePersona
    ? `둘 다 '${titleA}' 유형! 가치관과 연애 리듬이 비슷해 편안한 관계를 만들기 쉬워요.`
    : sameArchetype
      ? `같은 ${LOVE_TYPES[typeA].title} 계열이지만 세부 성향이 달라요. 공통점을 발견하고 차이를 존중하면 더 깊어질 수 있어요.`
      : `'${titleA}'와 '${titleB}'의 조합. 다른 강점이 균형을 이루며 성장할 여지가 있어요.`;

  const insights =
    profileA && profileB
      ? buildInsights(profileA, profileB)
      : { strengths: [], growthAreas: [] };

  if (insights.strengths.length === 0 && profileA && profileB) {
    insights.strengths.push("서로 다른 매력이 관계에 활력을 줄 수 있어요");
  }

  const base: CompatReport = {
    score,
    headline,
    message,
    strengths: insights.strengths,
    growthAreas: insights.growthAreas,
  };

  if (profileA && profileB) {
    return buildEnhancedCompatReport(
      typeA,
      typeB,
      profileA,
      profileB,
      base
    );
  }

  return base;
}

/** 상위 3개 차원 강점 (개인 프로필 요약) */
export function getTopDimensions(scores: DimensionScores, limit = 3): CompatDimension[] {
  return (Object.keys(scores) as CompatDimension[])
    .sort((a, b) => Math.abs(scores[b]) - Math.abs(scores[a]))
    .slice(0, limit);
}

export const COMPAT_TEST_META = {
  itemCount: COMPAT_QUESTIONS.length,
  dimensionCount: 8,
  personaCount: PERSONA_COUNT,
  estimatedMinutes: 6,
  theories: [
    "Bowlby · Ainsworth 애착이론",
    "Sternberg 삼각이론 (친밀·열정·헌신)",
    "Gottman 관계·갈등 연구",
    "4축 16페르소나 분류 (표현·리듬·친밀·열정)",
  ],
};
