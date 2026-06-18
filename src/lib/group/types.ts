export type GroupMode = "async" | "sync";

export type GroupStatus = "waiting" | "playing" | "finished";

export type ParticipantStatus = "playing" | "completed";

export type Group = {
  id: string;
  deckId: string;
  mode: GroupMode;
  hostClientId: string;
  status: GroupStatus;
  currentCardIndex: number;
  createdAt: string;
  expiresAt: string;
  startedAt?: string;
  finishedAt?: string;
};

export type GroupParticipant = {
  clientId: string;
  displayName: string;
  status: ParticipantStatus;
  progressIndex: number;
  joinedAt: string;
  completedAt?: string;
};

export type GroupAnswer = {
  clientId: string;
  cardId: string;
  cardType: "balance" | "question";
  selectedOption?: "A" | "B";
  selectedLabel?: string;
  answerText?: string;
  answeredAt: string;
};

export type GroupState = {
  group: Group;
  participants: GroupParticipant[];
  answers: GroupAnswer[];
};

/** Non-participants only see summary — no answers or client IDs */
export type GroupPublicPreview = {
  group: Pick<Group, "id" | "deckId" | "mode" | "status" | "expiresAt">;
  participants: Pick<GroupParticipant, "displayName" | "status">[];
  participantCount: number;
};

export type GroupResolveResult =
  | { status: "active"; state: GroupState }
  | { status: "expired"; expiredAt: string; deckId?: string }
  | { status: "missing" };

export type GroupStateResponse = GroupState & {
  sessionToken?: string;
};

export type CreateGroupInput = {
  deckId: string;
  mode: GroupMode;
  hostClientId: string;
  hostDisplayName: string;
};

export type JoinGroupInput = {
  groupId: string;
  clientId: string;
  displayName: string;
};

export type SaveAnswerInput = {
  groupId: string;
  clientId: string;
  cardId: string;
  cardType: "balance" | "question";
  selectedOption?: "A" | "B";
  selectedLabel?: string;
  answerText?: string;
};
