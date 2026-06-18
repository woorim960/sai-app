import type {
  CreateGroupInput,
  GroupResolveResult,
  GroupState,
  JoinGroupInput,
  SaveAnswerInput,
} from "./types";

export type GroupRepository = {
  createGroup(input: CreateGroupInput): Promise<GroupState>;
  resolveGroup(groupId: string): Promise<GroupResolveResult>;
  getGroupState(groupId: string): Promise<GroupState | null>;
  joinGroup(input: JoinGroupInput): Promise<GroupState | null>;
  startSyncGroup(groupId: string, clientId: string): Promise<GroupState | null>;
  saveGroupAnswer(input: SaveAnswerInput): Promise<GroupState | null>;
  updateParticipantProgress(
    groupId: string,
    clientId: string,
    progressIndex: number
  ): Promise<GroupState | null>;
  completeParticipant(
    groupId: string,
    clientId: string
  ): Promise<GroupState | null>;
  advanceSyncCard(
    groupId: string,
    clientId: string,
    maxCardIndex: number
  ): Promise<GroupState | null>;
  finishSyncGroup(
    groupId: string,
    clientId: string
  ): Promise<GroupState | null>;
};
