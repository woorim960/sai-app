const ACTIVE_GAMES_KEY = "sai_active_games";

export type ActiveGame = {
  groupId: string;
  deckId: string;
  deckTitle: string;
  mode: "async" | "sync";
  progressIndex: number;
  totalCards: number;
  playPath: string;
  updatedAt: string;
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readAll(): ActiveGame[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(ACTIVE_GAMES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ActiveGame[];
  } catch {
    return [];
  }
}

function writeAll(games: ActiveGame[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(ACTIVE_GAMES_KEY, JSON.stringify(games));
  window.dispatchEvent(new Event("sai-active-games-changed"));
}

export function upsertActiveGame(game: Omit<ActiveGame, "updatedAt">): void {
  const next: ActiveGame = {
    ...game,
    updatedAt: new Date().toISOString(),
  };
  const games = readAll().filter((item) => item.groupId !== game.groupId);
  writeAll([next, ...games].slice(0, 5));
}

export function removeActiveGame(groupId: string): void {
  writeAll(readAll().filter((item) => item.groupId !== groupId));
}

export function getActiveGames(): ActiveGame[] {
  return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
