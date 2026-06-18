import type {
  AddCoupleRecordInput,
  CoupleProfilePatch,
  CoupleState,
  CreateCoupleInput,
  JoinCoupleInput,
  JoinCoupleResult,
} from "./types";

export type CoupleRepository = {
  createCouple(
    input: CreateCoupleInput
  ): Promise<{ state: CoupleState; token: string }>;
  joinCouple(input: JoinCoupleInput): Promise<JoinCoupleResult>;
  getCoupleState(coupleId: string): Promise<CoupleState | null>;
  addCoupleRecord(input: AddCoupleRecordInput): Promise<CoupleState | null>;
  updateCoupleProfile(
    coupleId: string,
    patch: CoupleProfilePatch
  ): Promise<CoupleState | null>;
};
