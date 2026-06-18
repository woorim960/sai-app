import type {
  CoupleMember,
  CoupleState,
  CoupleStatePublic,
} from "./types";

/** 공개 응답에서 멤버 토큰을 제거한다. */
export function toPublicCoupleState(state: CoupleState): CoupleStatePublic {
  return {
    couple: state.couple,
    members: state.members.map(({ token: _token, ...rest }) => rest),
    records: state.records,
  };
}

export function findMember(
  state: CoupleState,
  clientId: string
): CoupleMember | undefined {
  return state.members.find((member) => member.clientId === clientId);
}

export function isMemberAuthorized(
  state: CoupleState,
  clientId: string,
  token: string
): boolean {
  const member = findMember(state, clientId);
  return Boolean(member && member.token === token);
}

export const DEFAULT_MEMBER_EMOJI = "🐧";
export const DEFAULT_PARTNER_EMOJI = "🐤";
