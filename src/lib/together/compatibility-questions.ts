import type { CompatDimension, DimensionEffects } from "@/lib/together/compatibility";

export type CompatQuestion = {
  id: string;
  section: CompatSectionId;
  dimension: CompatDimension;
  question: string;
  optionA: { label: string; effects: DimensionEffects };
  optionB: { label: string; effects: DimensionEffects };
};

export type CompatSectionId =
  | "attachment"
  | "expression"
  | "lifestyle"
  | "intimacy"
  | "passion"
  | "commitment"
  | "conflict"
  | "autonomy";

export type CompatSection = {
  id: CompatSectionId;
  title: string;
  subtitle: string;
  theory: string;
};

export const COMPAT_SECTIONS: CompatSection[] = [
  {
    id: "attachment",
    title: "애착 안정성",
    subtitle: "친밀함에서 느끼는 편안함",
    theory: "Bowlby · Ainsworth 애착이론",
  },
  {
    id: "expression",
    title: "감정 표현",
    subtitle: "사랑을 전하는 방식",
    theory: "Gottman 정서적 연결",
  },
  {
    id: "lifestyle",
    title: "생활 리듬",
    subtitle: "일상과 계획의 성향",
    theory: "성격·생활습관 적합성",
  },
  {
    id: "intimacy",
    title: "친밀 욕구",
    subtitle: "정서적 가까움의 필요",
    theory: "Sternberg 친밀(Intimacy)",
  },
  {
    id: "passion",
    title: "열정·로맨스",
    subtitle: "설렘과 자극에 대한 태도",
    theory: "Sternberg 열정(Passion)",
  },
  {
    id: "commitment",
    title: "헌신·미래지향",
    subtitle: "관계에 대한 책임감",
    theory: "Sternberg 헌신(Commitment)",
  },
  {
    id: "conflict",
    title: "갈등 대응",
    subtitle: "다툼 이후 회복 방식",
    theory: "Gottman 갈등·수리 연구",
  },
  {
    id: "autonomy",
    title: "자율·독립",
    subtitle: "나만의 공간과 자유",
    theory: "건강한 자율성(Autonomy)",
  },
];

/** 32문항 — 각 하위척도 4문항 (표준화된 단문 척도 패턴) */
export const COMPAT_QUESTIONS: CompatQuestion[] = [
  // ── 애착 안정성 (5) ──
  {
    id: "a1",
    section: "attachment",
    dimension: "security",
    question: "연인과 마음을 나눌 때 전반적으로 편안함을 느낀다",
    optionA: { label: "그렇다", effects: { security: 2 } },
    optionB: { label: "잘 모르겠다 / 아니다", effects: { security: -2 } },
  },
  {
    id: "a2",
    section: "attachment",
    dimension: "security",
    question: "상대의 연락이 뜸하면 관계가 흔들릴까 불안해진다",
    optionA: { label: "자주 그렇다", effects: { security: -2 } },
    optionB: { label: "별로 그렇지 않다", effects: { security: 2 } },
  },
  {
    id: "a3",
    section: "attachment",
    dimension: "security",
    question: "나는 연인에게 마음을 의지해도 괜찮다고 느낀다",
    optionA: { label: "그렇다", effects: { security: 2 } },
    optionB: { label: "의지하기 어렵다", effects: { security: -2 } },
  },
  {
    id: "a4",
    section: "attachment",
    dimension: "security",
    question: "가까워질수록 오히려 거리를 두고 싶어질 때가 있다",
    optionA: { label: "가끔 그렇다", effects: { security: -2 } },
    optionB: { label: "거의 없다", effects: { security: 2 } },
  },
  {
    id: "a5",
    section: "attachment",
    dimension: "security",
    question: "상대가 나를 진심으로 아끼고 있다고 믿는 편이다",
    optionA: { label: "그렇다", effects: { security: 2 } },
    optionB: { label: "확신하기 어렵다", effects: { security: -2 } },
  },

  // ── 감정 표현 (4) ──
  {
    id: "e1",
    section: "expression",
    dimension: "expressiveness",
    question: "좋아한다는 말, 고맙다는 말을 자주 전하는 편이다",
    optionA: { label: "자주 한다", effects: { expressiveness: 2 } },
    optionB: { label: "행동으로 보여준다", effects: { expressiveness: -2 } },
  },
  {
    id: "e2",
    section: "expression",
    dimension: "expressiveness",
    question: "기분이 좋거나 서운할 때 감정을 바로 표현한다",
    optionA: { label: "그렇다", effects: { expressiveness: 2 } },
    optionB: { label: "혼자 정리한 뒤 말한다", effects: { expressiveness: -2 } },
  },
  {
    id: "e3",
    section: "expression",
    dimension: "expressiveness",
    question: "스킨십·애정 표현이 관계에서 중요하다",
    optionA: { label: "중요하다", effects: { expressiveness: 2, intimacy: 1 } },
    optionB: { label: "크게 중요하지 않다", effects: { expressiveness: -2 } },
  },
  {
    id: "e4",
    section: "expression",
    dimension: "expressiveness",
    question: "하루 일과를 연인과 나누는 편이다",
    optionA: { label: "자주 공유한다", effects: { expressiveness: 2, intimacy: 1 } },
    optionB: { label: "꼭 필요하진 않다", effects: { expressiveness: -1, autonomy: 1 } },
  },

  // ── 생활 리듬 (4) ──
  {
    id: "l1",
    section: "lifestyle",
    dimension: "structure",
    question: "데이트나 약속은 미리 계획하는 편이다",
    optionA: { label: "계획형", effects: { structure: 2 } },
    optionB: { label: "즉흥형", effects: { structure: -2 } },
  },
  {
    id: "l2",
    section: "lifestyle",
    dimension: "structure",
    question: "둘만의 루틴(요일 데이트, 통화 시간 등)이 있으면 좋다",
    optionA: { label: "좋다", effects: { structure: 2, commitment: 1 } },
    optionB: { label: "매번 달라도 괜찮다", effects: { structure: -2 } },
  },
  {
    id: "l3",
    section: "lifestyle",
    dimension: "structure",
    question: "갑작스러운 일정 변경이 나를 불편하게 한다",
    optionA: { label: "그렇다", effects: { structure: 2 } },
    optionB: { label: "오히려 재미있다", effects: { structure: -2, passion: 1 } },
  },
  {
    id: "l4",
    section: "lifestyle",
    dimension: "structure",
    question: "기념일·이벤트는 미리 준비하는 편이다",
    optionA: { label: "꼼꼼히 준비", effects: { structure: 2, commitment: 1 } },
    optionB: { label: "그때그때 센스 있게", effects: { structure: -2, passion: 1 } },
  },

  // ── 친밀 욕구 (4) ──
  {
    id: "i1",
    section: "intimacy",
    dimension: "intimacy",
    question: "깊은 대화를 나눌 때 관계 만족도가 높아진다",
    optionA: { label: "그렇다", effects: { intimacy: 2 } },
    optionB: { label: "가볍게 보내는 것도 좋다", effects: { intimacy: -1 } },
  },
  {
    id: "i2",
    section: "intimacy",
    dimension: "intimacy",
    question: "함께하는 시간이 많을수록 안정감을 느낀다",
    optionA: { label: "그렇다", effects: { intimacy: 2 } },
    optionB: { label: "적당한 거리가 필요하다", effects: { intimacy: -1, autonomy: 2 } },
  },
  {
    id: "i3",
    section: "intimacy",
    dimension: "intimacy",
    question: "상대의 속마음을 알고 있다는 느낌이 중요하다",
    optionA: { label: "매우 중요", effects: { intimacy: 2 } },
    optionB: { label: "어느 정도만 알아도 된다", effects: { intimacy: -2 } },
  },
  {
    id: "i4",
    section: "intimacy",
    dimension: "intimacy",
    question: "연애에서 정서적 교감이 육체적 교감만큼 중요하다",
    optionA: { label: "그렇다", effects: { intimacy: 2 } },
    optionB: { label: "다르게 느낀다", effects: { intimacy: -1, passion: 1 } },
  },

  // ── 열정·로맨스 (4) ──
  {
    id: "p1",
    section: "passion",
    dimension: "passion",
    question: "관계에 설렘과 새로움이 있어야 한다고 느낀다",
    optionA: { label: "그렇다", effects: { passion: 2 } },
    optionB: { label: "편안함이 더 중요", effects: { passion: -2, security: 1 } },
  },
  {
    id: "p2",
    section: "passion",
    dimension: "passion",
    question: "서프라이즈나 이벤트가 관계를 살아있게 한다",
    optionA: { label: "그렇다", effects: { passion: 2 } },
    optionB: { label: "크게 필요 없다", effects: { passion: -2 } },
  },
  {
    id: "p3",
    section: "passion",
    dimension: "passion",
    question: "첫 만남 때의 두근거림을 오래 유지하고 싶다",
    optionA: { label: "그렇다", effects: { passion: 2 } },
    optionB: { label: "깊어지는 편안함이 더 좋다", effects: { passion: -2, intimacy: 1 } },
  },
  {
    id: "p4",
    section: "passion",
    dimension: "passion",
    question: "새로운 경험·여행을 함께하는 것을 좋아한다",
    optionA: { label: "좋아한다", effects: { passion: 2, structure: -1 } },
    optionB: { label: "익숙한 일상이 좋다", effects: { passion: -2, structure: 1 } },
  },

  // ── 헌신·미래지향 (4) ──
  {
    id: "c1",
    section: "commitment",
    dimension: "commitment",
    question: "장기적인 관계를 전제로 연애하는 편이다",
    optionA: { label: "그렇다", effects: { commitment: 2 } },
    optionB: { label: "당장의 감정이 더 중요", effects: { commitment: -2 } },
  },
  {
    id: "c2",
    section: "commitment",
    dimension: "commitment",
    question: "어려운 시기에도 관계를 지키려 노력한다",
    optionA: { label: "그렇다", effects: { commitment: 2, security: 1 } },
    optionB: { label: "상황에 따라 다르다", effects: { commitment: -1 } },
  },
  {
    id: "c3",
    section: "commitment",
    dimension: "commitment",
    question: "미래 계획(동거, 결혼 등)을 함께 그리는 것이 자연스럽다",
    optionA: { label: "그렇다", effects: { commitment: 2 } },
    optionB: { label: "아직 부담스럽다", effects: { commitment: -2 } },
  },
  {
    id: "c4",
    section: "commitment",
    dimension: "commitment",
    question: "약속을 지키는 것이 관계에서 가장 중요하다",
    optionA: { label: "그렇다", effects: { commitment: 2, structure: 1 } },
    optionB: { label: "유연함이 더 중요", effects: { commitment: -1, structure: -1 } },
  },

  // ── 갈등 대응 (4) ──
  {
    id: "f1",
    section: "conflict",
    dimension: "conflict_direct",
    question: "다툼이 생기면 가능한 빨리 대화로 푸는 편이다",
    optionA: { label: "그렇다", effects: { conflict_direct: 2 } },
    optionB: { label: "혼자 생각할 시간이 필요", effects: { conflict_direct: -2 } },
  },
  {
    id: "f2",
    section: "conflict",
    dimension: "conflict_direct",
    question: "서운한 일은 참지 않고 표현하는 편이다",
    optionA: { label: "그렇다", effects: { conflict_direct: 2, expressiveness: 1 } },
    optionB: { label: "넘어가는 편이다", effects: { conflict_direct: -2 } },
  },
  {
    id: "f3",
    section: "conflict",
    dimension: "conflict_direct",
    question: "싸운 뒤 먼저 사과하거나 화해를 시도할 수 있다",
    optionA: { label: "그렇다", effects: { conflict_direct: 2, commitment: 1 } },
    optionB: { label: "상대가 먼저일 때가 많다", effects: { conflict_direct: -1 } },
  },
  {
    id: "f4",
    section: "conflict",
    dimension: "conflict_direct",
    question: "갈등 상황에서 감정이 올라가면 대화를 잠시 멈춘다",
    optionA: { label: "그렇다", effects: { conflict_direct: -2 } },
    optionB: { label: "끝까지 이야기한다", effects: { conflict_direct: 2 } },
  },

  // ── 자율·독립 (3) ──
  {
    id: "u1",
    section: "autonomy",
    dimension: "autonomy",
    question: "연애 중에도 나만의 시간·취미가 꼭 필요하다",
    optionA: { label: "그렇다", effects: { autonomy: 2 } },
    optionB: { label: "대부분 함께하는 시간이 좋다", effects: { autonomy: -2, intimacy: 1 } },
  },
  {
    id: "u2",
    section: "autonomy",
    dimension: "autonomy",
    question: "중요한 결정은 스스로 판단하고 싶다",
    optionA: { label: "그렇다", effects: { autonomy: 2 } },
    optionB: { label: "상대와 함께 정하는 편", effects: { autonomy: -2, commitment: 1 } },
  },
  {
    id: "u3",
    section: "autonomy",
    dimension: "autonomy",
    question: "친구·가족과의 관계도 연애만큼 소중히 여긴다",
    optionA: { label: "그렇다", effects: { autonomy: 2 } },
    optionB: { label: "연인이 최우선", effects: { autonomy: -2, intimacy: 1 } },
  },

  // ── 보강 문항 (차원당 신뢰도 강화, 32→40) ──
  {
    id: "e5",
    section: "expression",
    dimension: "expressiveness",
    question: "상대에게 서운한 점을 솔직하게 말하는 편이다",
    optionA: { label: "그렇다", effects: { expressiveness: 2, conflict_direct: 1 } },
    optionB: { label: "혼자 삭이는 편이다", effects: { expressiveness: -2 } },
  },
  {
    id: "l5",
    section: "lifestyle",
    dimension: "structure",
    question: "공동 일정·가계·약속을 체계적으로 관리하는 편이다",
    optionA: { label: "그렇다", effects: { structure: 2, commitment: 1 } },
    optionB: { label: "대충 넘기는 편이다", effects: { structure: -2 } },
  },
  {
    id: "i5",
    section: "intimacy",
    dimension: "intimacy",
    question: "연인과의 대화에서 '진짜 나'를 보여주는 것이 중요하다",
    optionA: { label: "그렇다", effects: { intimacy: 2 } },
    optionB: { label: "적당한 선이 편하다", effects: { intimacy: -2 } },
  },
  {
    id: "p5",
    section: "passion",
    dimension: "passion",
    question: "관계에서 육체적·감각적 교감도 중요한 요소다",
    optionA: { label: "그렇다", effects: { passion: 2, intimacy: 1 } },
    optionB: { label: "정서적 교감이 더 중요하다", effects: { passion: -2 } },
  },
  {
    id: "c5",
    section: "commitment",
    dimension: "commitment",
    question: "연인과의 관계는 다른 관계보다 우선순위가 높다",
    optionA: { label: "그렇다", effects: { commitment: 2, intimacy: 1 } },
    optionB: { label: "균형 있게 본다", effects: { commitment: -1, autonomy: 1 } },
  },
  {
    id: "f5",
    section: "conflict",
    dimension: "conflict_direct",
    question: "비난보다 '나-메시지'로 감정을 표현하려 노력한다",
    optionA: { label: "그렇다", effects: { conflict_direct: 2, security: 1 } },
    optionB: { label: "감정이 앞서는 편이다", effects: { conflict_direct: -1 } },
  },
  {
    id: "u4",
    section: "autonomy",
    dimension: "autonomy",
    question: "연애 중에도 커리어·취미·목표를 포기하지 않는다",
    optionA: { label: "그렇다", effects: { autonomy: 2 } },
    optionB: { label: "관계를 위해 조율한다", effects: { autonomy: -2, commitment: 1 } },
  },
  {
    id: "u5",
    section: "autonomy",
    dimension: "autonomy",
    question: "상대가 나의 사생활·연락 빈도에 간섭하면 부담스럽다",
    optionA: { label: "그렇다", effects: { autonomy: 2, security: -1 } },
    optionB: { label: "관심으로 받아들인다", effects: { autonomy: -2, intimacy: 1 } },
  },
];

export function getSectionForIndex(index: number): CompatSection | undefined {
  const question = COMPAT_QUESTIONS[index];
  if (!question) return undefined;
  return COMPAT_SECTIONS.find((section) => section.id === question.section);
}

export function getSectionProgress(index: number): {
  sectionIndex: number;
  sectionTotal: number;
  section: CompatSection;
} | null {
  const question = COMPAT_QUESTIONS[index];
  if (!question) return null;
  const section = COMPAT_SECTIONS.find((s) => s.id === question.section);
  if (!section) return null;
  const sectionQuestions = COMPAT_QUESTIONS.filter((q) => q.section === section.id);
  const sectionIndex = sectionQuestions.findIndex((q) => q.id === question.id);
  return { sectionIndex: sectionIndex + 1, sectionTotal: sectionQuestions.length, section };
}
