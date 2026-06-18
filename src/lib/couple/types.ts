export type CoupleRecordMode = "async" | "sync" | "duo" | "quiz";

export type CoupleMember = {
  clientId: string;
  displayName: string;
  emoji: string;
  joinedAt: string;
  /** 서버 전용 비밀 토큰. 공개 응답에서는 제거된다. */
  token: string;
};

export type CoupleMemberPublic = Omit<CoupleMember, "token">;

export type CoupleRecord = {
  id: string;
  deckId: string;
  deckTitle: string;
  mode: CoupleRecordMode;
  minutes: number;
  byClientId: string;
  /** 궁합/심리테스트 결과 점수 등 부가 정보 */
  score?: number;
  /** 데일리 질문 답변 등 텍스트 메모 */
  note?: string;
  completedAt: string;
};

export type Couple = {
  id: string;
  inviteCode: string;
  coupleName?: string;
  anniversary?: string;
  createdAt: string;
};

export type CoupleState = {
  couple: Couple;
  members: CoupleMember[];
  records: CoupleRecord[];
};

export type CoupleStatePublic = {
  couple: Couple;
  members: CoupleMemberPublic[];
  records: CoupleRecord[];
};

export type CreateCoupleInput = {
  clientId: string;
  displayName: string;
  emoji?: string;
  coupleName?: string;
  anniversary?: string;
};

export type JoinCoupleInput = {
  inviteCode: string;
  clientId: string;
  displayName: string;
  emoji?: string;
};

export type AddCoupleRecordInput = {
  coupleId: string;
  clientId: string;
  deckId: string;
  deckTitle: string;
  mode: CoupleRecordMode;
  minutes: number;
  score?: number;
  note?: string;
};

export type CoupleProfilePatch = {
  coupleName?: string;
  anniversary?: string;
};

export type JoinCoupleResult =
  | { ok: true; state: CoupleState; token: string }
  | { ok: false; reason: "not_found" | "full" };
