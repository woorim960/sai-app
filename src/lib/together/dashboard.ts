import {
  getAllDecks,
  getCardsByDeckId,
  getDeckById,
  getTogetherDeckPresentations,
  getHomePopularDecks,
  type Deck,
  type HomeDeckPresentation,
} from "@/lib/data";
import type { CoupleRecord } from "@/lib/couple/types";
import type { PlayHistoryEntry } from "@/lib/user-data";

/** 대시보드 집계를 위한 정규화된 세션 단위 */
export type TogetherSession = {
  deckId: string;
  deckTitle: string;
  minutes: number;
  completedAt: string;
};

export type TogetherStats = {
  totalMinutes: number;
  totalCount: number;
  level: number;
  levelLabel: string;
  /** 다음 레벨까지의 진행도(0~100) */
  intimacy: number;
  /** 다음 레벨까지 남은 플레이 수 */
  toNextLevel: number;
  streakDays: number;
};

export type ResumeItem = {
  deckId: string;
  deckTitle: string;
  currentIndex: number;
  total: number;
  progress: number;
};

export type Badge = {
  id: string;
  emoji: string;
  label: string;
  description: string;
  unlocked: boolean;
};

const LEVEL_LABELS = [
  "첫 만남",
  "알아가는 사이",
  "가까워지는 사이",
  "통하는 사이",
  "찰떡 케미",
  "운명의 짝꿍",
];

const PLAYS_PER_LEVEL = 5;

function deckMinutes(deckId: string): number {
  return getDeckById(deckId)?.estimatedMinutes ?? 5;
}

/** 커플(서버) 기록 → 세션 목록 */
export function sessionsFromCoupleRecords(
  records: CoupleRecord[]
): TogetherSession[] {
  return records.map((record) => ({
    deckId: record.deckId,
    deckTitle: record.deckTitle,
    minutes: record.minutes || deckMinutes(record.deckId),
    completedAt: record.completedAt,
  }));
}

/** 로컬 플레이 기록 → 세션 목록 (페어링 전 폴백) */
export function sessionsFromPlayHistory(
  history: PlayHistoryEntry[]
): TogetherSession[] {
  return history.map((entry) => ({
    deckId: entry.deckId,
    deckTitle: entry.deckTitle,
    minutes: deckMinutes(entry.deckId),
    completedAt: entry.completedAt,
  }));
}

export function computeStats(sessions: TogetherSession[]): TogetherStats {
  const totalMinutes = sessions.reduce((sum, item) => sum + item.minutes, 0);
  const totalCount = sessions.length;

  const levelIndex = Math.min(
    Math.floor(totalCount / PLAYS_PER_LEVEL),
    LEVEL_LABELS.length - 1
  );
  const playsIntoLevel = totalCount % PLAYS_PER_LEVEL;
  const isMaxLevel = levelIndex >= LEVEL_LABELS.length - 1;

  return {
    totalMinutes,
    totalCount,
    level: levelIndex + 1,
    levelLabel: LEVEL_LABELS[levelIndex]!,
    intimacy: isMaxLevel
      ? 100
      : Math.round((playsIntoLevel / PLAYS_PER_LEVEL) * 100),
    toNextLevel: isMaxLevel ? 0 : PLAYS_PER_LEVEL - playsIntoLevel,
    streakDays: computeStreak(sessions),
  };
}

function toDateKey(iso: string): string {
  return iso.slice(0, 10);
}

export function computeStreak(sessions: TogetherSession[]): number {
  if (sessions.length === 0) return 0;

  const days = new Set(sessions.map((item) => toDateKey(item.completedAt)));
  let streak = 0;
  const cursor = new Date();

  // 오늘 또는 어제부터 연속으로 거슬러 올라간다.
  if (!days.has(toDateKey(cursor.toISOString()))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(toDateKey(cursor.toISOString()))) return 0;
  }

  while (days.has(toDateKey(cursor.toISOString()))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

/** 기념일로부터 함께한 일수 (당일을 1일로 카운트) */
export function daysSinceAnniversary(anniversary?: string): number | null {
  if (!anniversary) return null;
  const start = new Date(`${anniversary}T00:00:00`);
  if (Number.isNaN(start.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  const diff = Math.floor(
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff + 1;
}

export function formatDuration(minutes: number): string {
  if (minutes <= 0) return "0분";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}분`;
  if (mins === 0) return `${hours}시간`;
  return `${hours}시간 ${mins}분`;
}

/** 둘이서 즐기기 좋은 덱 풀(추천 후보) */
function couplePresentationPool(): HomeDeckPresentation[] {
  const togetherDecks = getTogetherDeckPresentations();
  const popular = getHomePopularDecks("couple");
  const seen = new Set<string>();
  const merged: HomeDeckPresentation[] = [];

  for (const item of [...togetherDecks, ...popular]) {
    if (seen.has(item.deckId)) continue;
    seen.add(item.deckId);
    merged.push(item);
  }
  return merged;
}

/** 아직 함께 안 해본 덱 우선 추천 */
export function recommendDecks(
  sessions: TogetherSession[],
  limit = 3
): HomeDeckPresentation[] {
  const played = new Set(sessions.map((item) => item.deckId));
  const pool = couplePresentationPool();
  const fresh = pool.filter((item) => !played.has(item.deckId));
  const result = fresh.length > 0 ? fresh : pool;
  return result.slice(0, limit);
}

/** sessionStorage 진행 상태에서 이어하기 항목 추출 */
export function getResumeItems(
  readProgress: (deckId: string) => { currentIndex: number } | null,
  isCompleted: (deckId: string) => boolean,
  limit = 2
): ResumeItem[] {
  const items: ResumeItem[] = [];

  for (const deck of getAllDecks()) {
    if (isCompleted(deck.id)) continue;
    const progress = readProgress(deck.id);
    if (!progress || progress.currentIndex <= 0) continue;

    const total = getCardsByDeckId(deck.id).length;
    if (total === 0) continue;

    items.push({
      deckId: deck.id,
      deckTitle: deck.title,
      currentIndex: progress.currentIndex,
      total,
      progress: Math.min(Math.round((progress.currentIndex / total) * 100), 99),
    });
  }

  return items.slice(0, limit);
}

export function computeBadges(
  sessions: TogetherSession[],
  stats: TogetherStats
): Badge[] {
  const distinctDecks = new Set(sessions.map((item) => item.deckId)).size;
  const totalDecks = getAllDecks().length;

  return [
    {
      id: "first-step",
      emoji: "🌱",
      label: "첫 발걸음",
      description: "처음으로 함께 플레이했어요",
      unlocked: stats.totalCount >= 1,
    },
    {
      id: "streak-3",
      emoji: "🔥",
      label: "3일 연속",
      description: "3일 연속으로 함께했어요",
      unlocked: stats.streakDays >= 3,
    },
    {
      id: "explorer",
      emoji: "🧭",
      label: "탐험가",
      description: "5가지 다른 게임을 즐겼어요",
      unlocked: distinctDecks >= 5,
    },
    {
      id: "marathon",
      emoji: "⏱️",
      label: "수다 마라톤",
      description: "함께한 시간 2시간 돌파",
      unlocked: stats.totalMinutes >= 120,
    },
    {
      id: "soulmate",
      emoji: "💞",
      label: "운명의 짝꿍",
      description: "최고 친밀도 레벨 달성",
      unlocked: stats.level >= LEVEL_LABELS.length,
    },
    {
      id: "completionist",
      emoji: "🏆",
      label: "콜렉터",
      description: "모든 게임을 함께 완료했어요",
      unlocked: totalDecks > 0 && distinctDecks >= totalDecks,
    },
  ];
}

export function getDeckPresentationFallback(deck: Deck): HomeDeckPresentation {
  return {
    deckId: deck.id,
    displayTitle: deck.title,
    displaySubtitle: deck.description,
    tagLabel: `${deck.estimatedMinutes}분`,
    gradientClass: "from-[#8B7CFF] via-[#9D8FFF] to-[#C4BBFF]",
    illustration: "💜",
  };
}
