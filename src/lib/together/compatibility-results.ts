import type { CoupleMemberPublic, CoupleRecord } from "@/lib/couple/types";
import {
  computeCompatReport,
  indexToLoveType,
  LOVE_TYPES,
  parseProfile,
  type CompatReport,
  type LoveProfile,
  type LoveTypeId,
} from "@/lib/together/compatibility";

export const COMPAT_DECK_ID = "compatibility-test";
export const COMPAT_DECK_TITLE = "연애 궁합 심리테스트";

export type SavedCompatResult = {
  loveTypeId: LoveTypeId;
  profile?: LoveProfile | null;
  completedAt: string;
  source: "local" | "couple";
};

export type CompatSnapshot = {
  mine: SavedCompatResult | null;
  partner: SavedCompatResult | null;
  partnerName?: string;
  report: CompatReport | null;
};

export function recordToLoveType(record: CoupleRecord): LoveTypeId | null {
  const profile = parseProfile(record.note);
  if (profile) return profile.type;

  if (record.note && record.note in LOVE_TYPES) {
    return record.note as LoveTypeId;
  }
  if (typeof record.score === "number" && record.score >= 0) {
    return indexToLoveType(record.score);
  }
  return null;
}

export function recordToProfile(record: CoupleRecord): LoveProfile | null {
  return parseProfile(record.note);
}

export function getCompatQuizRecord(
  records: CoupleRecord[],
  clientId: string
): CoupleRecord | undefined {
  return records.find(
    (record) =>
      record.deckId === COMPAT_DECK_ID &&
      record.mode === "quiz" &&
      record.byClientId === clientId
  );
}

export function recordToSavedResult(record: CoupleRecord): SavedCompatResult | null {
  const loveTypeId = recordToLoveType(record);
  if (!loveTypeId) return null;
  return {
    loveTypeId,
    profile: recordToProfile(record),
    completedAt: record.completedAt,
    source: "couple",
  };
}

export function buildCompatSnapshot(input: {
  records?: CoupleRecord[];
  members?: CoupleMemberPublic[];
  myClientId: string | null;
  localResult?: SavedCompatResult | null;
}): CompatSnapshot {
  const { records = [], members = [], myClientId, localResult = null } = input;

  let mine: SavedCompatResult | null = localResult;
  let partner: SavedCompatResult | null = null;
  let partnerName: string | undefined;
  let myProfile: LoveProfile | null = localResult?.profile ?? null;
  let partnerProfile: LoveProfile | null = null;

  if (myClientId) {
    const myRecord = getCompatQuizRecord(records, myClientId);
    if (myRecord) {
      const saved = recordToSavedResult(myRecord);
      if (saved) {
        mine = saved;
        myProfile = saved.profile ?? myProfile;
      }
    }

    const partnerRecord = records.find(
      (record) =>
        record.deckId === COMPAT_DECK_ID &&
        record.mode === "quiz" &&
        record.byClientId !== myClientId
    );

    if (partnerRecord) {
      partner = recordToSavedResult(partnerRecord);
      partnerProfile = partner?.profile ?? null;
      partnerName = members.find(
        (member) => member.clientId === partnerRecord.byClientId
      )?.displayName;
    }
  }

  const report =
    mine && partner
      ? computeCompatReport(
          mine.loveTypeId,
          partner.loveTypeId,
          myProfile,
          partnerProfile
        )
      : null;

  return { mine, partner, partnerName, report };
}
