import type { DimensionScores, LoveTypeId } from "@/lib/together/compatibility";

export type LovePersonaId =
  | "romantic_curator"
  | "warm_architect"
  | "sparkling_host"
  | "gentle_leader"
  | "sunrise_adventurer"
  | "bright_soulmate"
  | "passion_wanderer"
  | "free_spirit"
  | "quiet_devotee"
  | "steadfast_companion"
  | "thoughtful_observer"
  | "silent_guardian"
  | "deep_romantic"
  | "calm_confidant"
  | "wild_heart"
  | "quiet_independent";

export type PersonaAxisCode = "E" | "R" | "P" | "S" | "I" | "D" | "F" | "A";

export type LovePersona = {
  id: LovePersonaId;
  code: string;
  emoji: string;
  title: string;
  tagline: string;
  description: string;
  traits: string[];
  archetype: LoveTypeId;
  researchBasis: string;
};

const PERSONA_BY_CODE: Record<string, LovePersonaId> = {
  EPIF: "romantic_curator",
  EPIA: "warm_architect",
  EPDF: "sparkling_host",
  EPDA: "gentle_leader",
  ESIF: "sunrise_adventurer",
  ESIA: "bright_soulmate",
  ESDF: "passion_wanderer",
  ESDA: "free_spirit",
  RPIF: "quiet_devotee",
  RPIA: "steadfast_companion",
  RPDF: "thoughtful_observer",
  RPDA: "silent_guardian",
  RSIF: "deep_romantic",
  RSIA: "calm_confidant",
  RSDF: "wild_heart",
  RSDA: "quiet_independent",
};

export const LOVE_PERSONAS: Record<LovePersonaId, LovePersona> = {
  romantic_curator: {
    id: "romantic_curator",
    code: "EPIF",
    emoji: "🎀",
    title: "로맨틱 큐레이터",
    tagline: "표현형 · 계획형 · 친밀형 · 열정형",
    description:
      "설렘을 일상으로 설계하는 타입이에요. 기념일·서프라이즈·분위기를 세심하게 챙기며, Sternberg 이론에서 친밀·열정·헌신이 모두 높은 '완전한 사랑'에 가까운 프로필입니다.",
    traits: ["이벤트·기념일을 즐김", "감정 표현이 풍부", "관계에 에너지를 쏟음"],
    archetype: "warm_planner",
    researchBasis: "High intimacy + passion + commitment (Sternberg)",
  },
  warm_architect: {
    id: "warm_architect",
    code: "EPIA",
    emoji: "🏡",
    title: "따뜻한 설계자",
    tagline: "표현형 · 계획형 · 친밀형 · 안정형",
    description:
      "다정함과 안정감을 동시에 주는 연인이에요. 애착이론의 안정형에 가깝고, 말과 행동으로 사랑을 꾸준히 전하며 둘만의 루틴을 소중히 여깁니다.",
    traits: ["정서적 돌봄이 뛰어남", "약속·일정을 지킴", "장기 관계에 강점"],
    archetype: "warm_planner",
    researchBasis: "Secure attachment · High intimacy (Bowlby/Ainsworth)",
  },
  sparkling_host: {
    id: "sparkling_host",
    code: "EPDF",
    emoji: "✨",
    title: "반짝이는 호스트",
    tagline: "표현형 · 계획형 · 거리형 · 열정형",
    description:
      "관계에 활력을 불어넣되, 적당한 거리감을 유지하는 타입이에요. 분위기 메이커이면서도 개인 시간을 존중하며, 열정과 자율성의 균형이 좋습니다.",
    traits: ["분위기를 밝게 만듦", "자기 페이스를 지킴", "로맨틱한 순간을 연출"],
    archetype: "warm_planner",
    researchBasis: "Passion + healthy autonomy balance",
  },
  gentle_leader: {
    id: "gentle_leader",
    code: "EPDA",
    emoji: "🌸",
    title: "다정한 리더",
    tagline: "표현형 · 계획형 · 거리형 · 안정형",
    description:
      "관계를 따뜻하게 이끌되, 서로의 공간을 존중하는 현실적 리더형이에요. 감정을 표현하면서도 과하지 않고, 안정적인 관계 틀을 만들어 갑니다.",
    traits: ["관계 방향을 부드럽게 제시", "현실적·계획적", "상대의 속도를 존중"],
    archetype: "warm_planner",
    researchBasis: "Expressive secure · Pragma elements (Lee)",
  },
  sunrise_adventurer: {
    id: "sunrise_adventurer",
    code: "ESIF",
    emoji: "🌅",
    title: "일출 모험가",
    tagline: "표현형 · 즉흥형 · 친밀형 · 열정형",
    description:
      "Lee의 Eros(열정적 사랑) 스타일에 가장 가까운 타입이에요. 새로운 경험과 깊은 교감을 동시에 추구하며, 함께할 때 에너지가 가장 높아집니다.",
    traits: ["설렘·모험을 사랑함", "감정을 솔직히 나눔", "관계에 생동감을 더함"],
    archetype: "sunny_romantic",
    researchBasis: "Eros love style · High passion (Lee/Sternberg)",
  },
  bright_soulmate: {
    id: "bright_soulmate",
    code: "ESIA",
    emoji: "💛",
    title: "밝은 소울메이트",
    tagline: "표현형 · 즉흥형 · 친밀형 · 안정형",
    description:
      "친구 같은 편안함과 연인으로서의 애정을 동시에 주는 타입이에요. Storge(우정적 사랑) 성향이 강하고, 함께 웃고 대화할 때 가장 행복해합니다.",
    traits: ["유머·대화가 잘 통해", "정서적 유대를 중시", "밝은 에너지"],
    archetype: "sunny_romantic",
    researchBasis: "Storge + expressive intimacy (Lee)",
  },
  passion_wanderer: {
    id: "passion_wanderer",
    code: "ESDF",
    emoji: "🔥",
    title: "열정의 방랑자",
    tagline: "표현형 · 즉흥형 · 거리형 · 열정형",
    description:
      "강렬한 감정과 자유로운 리듬을 함께 추구해요. 구속보다는 선택으로 함께하는 관계를 선호하며, 새로운 자극이 관계를 살아 있게 만듭니다.",
    traits: ["자극·새로움을 추구", "감정 표현이 직설적", "자유로운 연애관"],
    archetype: "sunny_romantic",
    researchBasis: "Ludus + Eros elements · High passion",
  },
  free_spirit: {
    id: "free_spirit",
    code: "ESDA",
    emoji: "🪁",
    title: "자유로운 영혼",
    tagline: "표현형 · 즉흥형 · 거리형 · 안정형",
    description:
      "개인의 자율성을 지키면서도 관계를 즐기는 타입이에요. 함께하는 시간과 나만의 시간을 자연스럽게 나누며, 가벼운 즐거움 속에 깊은 신뢰를 쌓습니다.",
    traits: ["개인 시간을 소중히", "즉흥적 데이트 선호", "구속 없는 관계"],
    archetype: "free_explorer",
    researchBasis: "Healthy autonomy · Ludus elements (Lee)",
  },
  quiet_devotee: {
    id: "quiet_devotee",
    code: "RPIF",
    emoji: "🕯️",
    title: "조용한 헌신가",
    tagline: "은은형 · 계획형 · 친밀형 · 열정형",
    description:
      "말은 적지만 마음은 깊은 타입이에요. 행동과 꾸준함으로 사랑을 증명하며, 겉으로 드러나지 않아도 관계에 강한 열정을 품고 있습니다.",
    traits: ["말보다 행동으로 표현", "깊은 정서적 유대", "꾸준한 헌신"],
    archetype: "steady_anchor",
    researchBasis: "Quiet commitment · Deep intimacy",
  },
  steadfast_companion: {
    id: "steadfast_companion",
    code: "RPIA",
    emoji: "🌳",
    title: "든든한 동반자",
    tagline: "은은형 · 계획형 · 친밀형 · 안정형",
    description:
      "애착 안정성과 헌신이 높은 가장 '든든한' 프로필이에요. 변함없는 신뢰와 일관성으로 관계를 지키며, 장기 연애·결혼에서 만족도가 높은 유형입니다.",
    traits: ["변함없는 신뢰감", "현실적·책임감", "갈등 시 차분히 수리"],
    archetype: "steady_anchor",
    researchBasis: "Secure-stable · Storge/Pragma (Lee)",
  },
  thoughtful_observer: {
    id: "thoughtful_observer",
    code: "RPDF",
    emoji: "🌙",
    title: "깊이 있는 관찰자",
    tagline: "은은형 · 계획형 · 거리형 · 열정형",
    description:
      "상대를 세심하게 관찰하고 이해하는 타입이에요. 쉽게 다가가지 않지만, 한번 마음을 열면 깊고 열정적인 관계를 만들어 갑니다.",
    traits: ["상대를 잘 읽음", "신중한 접근", "내면의 열정이 깊음"],
    archetype: "steady_anchor",
    researchBasis: "Reflective attachment · Selective intimacy",
  },
  silent_guardian: {
    id: "silent_guardian",
    code: "RPDA",
    emoji: "🛡️",
    title: "묵묵한 수호자",
    tagline: "은은형 · 계획형 · 거리형 · 안정형",
    description:
      "말없이 곁을 지키는 수호자형이에요. 실용적이고 믿음직한 파트너로서, 위기 상황에서 가장 든든한 존재가 되어 줍니다.",
    traits: ["행동으로 신뢰를 쌓음", "실용적·현실적", "상대를 든든히 지원"],
    archetype: "steady_anchor",
    researchBasis: "Pragma · Secure-low expressiveness",
  },
  deep_romantic: {
    id: "deep_romantic",
    code: "RSIF",
    emoji: "🌊",
    title: "깊은 낭만가",
    tagline: "은은형 · 즉흥형 · 친밀형 · 열정형",
    description:
      "겉으로는 차분하지만 내면에 깊은 낭만을 품은 타입이에요. 소수의 사람에게만 마음을 열고, 그 관계에 강렬한 감정을 쏟습니다.",
    traits: ["깊은 감수성", "소수 정예의 친밀", "내면의 열정이 강함"],
    archetype: "free_explorer",
    researchBasis: "Deep Eros · Selective attachment",
  },
  calm_confidant: {
    id: "calm_confidant",
    code: "RSIA",
    emoji: "🤝",
    title: "차분한 동지",
    tagline: "은은형 · 즉흥형 · 친밀형 · 안정형",
    description:
      "친구 같은 편안함을 은은하게 전하는 타입이에요. 급하지 않게 관계를 키우며, 상대의 이야기를 들어주는 것에 진심입니다.",
    traits: ["경청이 뛰어남", "편안한 유대감", "압박 없는 친밀"],
    archetype: "free_explorer",
    researchBasis: "Storge · Low-pressure intimacy",
  },
  wild_heart: {
    id: "wild_heart",
    code: "RSDF",
    emoji: "💫",
    title: "거침없는 심장",
    tagline: "은은형 · 즉흥형 · 거리형 · 열정형",
    description:
      "겉으로는 자유롭지만 내면에 강한 열정을 품은 반전 매력형이에요. 예측 불가한 매력으로 관계에 긴장감과 설렘을 더합니다.",
    traits: ["자유로운 영혼", "내면의 열정", "독특한 매력"],
    archetype: "free_explorer",
    researchBasis: "Passionate autonomy · Ludus elements",
  },
  quiet_independent: {
    id: "quiet_independent",
    code: "RSDA",
    emoji: "🍃",
    title: "고요한 독립가",
    tagline: "은은형 · 즉흥형 · 거리형 · 안정형",
    description:
      "혼자만의 세계를 소중히 하면서도 사랑할 줄 아는 타입이에요. 과한 의존 없이, 성숙한 거리에서 관계를 즐깁니다.",
    traits: ["독립적·자기완결적", "성숙한 거리감", "압박 없는 사랑"],
    archetype: "free_explorer",
    researchBasis: "Healthy autonomy · Mature independence",
  },
};

export const PERSONA_BY_AXIS_CODE = PERSONA_BY_CODE;

export const LOVE_PERSONA_INDEX: LovePersonaId[] = Object.keys(
  LOVE_PERSONAS
) as LovePersonaId[];

export function getLovePersona(id: LovePersonaId): LovePersona {
  return LOVE_PERSONAS[id];
}

export function personaToIndex(id: LovePersonaId): number {
  return LOVE_PERSONA_INDEX.indexOf(id);
}

export function indexToPersona(index: number): LovePersonaId {
  return LOVE_PERSONA_INDEX[index] ?? "warm_architect";
}

export const PERSONA_COUNT = 16;
