const STACK_KEY = "sai_nav_stack";
const MAX_STACK = 20;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readStack(): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = sessionStorage.getItem(STACK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function writeStack(stack: string[]): void {
  if (!isBrowser()) return;
  try {
    sessionStorage.setItem(STACK_KEY, JSON.stringify(stack.slice(-MAX_STACK)));
  } catch {
    // sessionStorage 사용 불가 환경(시크릿 모드 등)에서는 조용히 무시
  }
}

/**
 * 화면 이동을 스택에 기록한다.
 * - 같은 경로면 무시
 * - 직전 경로로 되돌아간 경우(뒤로가기) 최상단을 pop
 * - 그 외에는 push (앞으로 이동)
 */
export function recordNavigationPath(path: string): void {
  if (!isBrowser()) return;
  if (!path) return;

  const stack = readStack();
  const top = stack[stack.length - 1];

  if (top === path) {
    return;
  }

  const previous = stack[stack.length - 2];
  if (previous === path) {
    stack.pop();
    writeStack(stack);
    return;
  }

  stack.push(path);
  writeStack(stack);
}

/**
 * 스택의 최상단을 주어진 경로로 치환한다.
 * "상위로 가기(href)"처럼 이전 화면으로 되돌아오면 안 되는 이동에 사용한다.
 * 치환 후 직전 항목과 중복되면 정리한다.
 */
export function replaceNavigationTop(path: string): void {
  if (!isBrowser()) return;
  if (!path) return;

  const stack = readStack();
  if (stack.length === 0) {
    stack.push(path);
  } else {
    stack[stack.length - 1] = path;
  }

  if (stack.length >= 2 && stack[stack.length - 1] === stack[stack.length - 2]) {
    stack.pop();
  }

  writeStack(stack);
}

export function getPreviousNavigationPath(): string | null {
  if (!isBrowser()) return null;
  const stack = readStack();
  if (stack.length < 2) return null;
  return stack[stack.length - 2] ?? null;
}

const SMART_BACK_PREFIXES = [
  "/home",
  "/games",
  "/together",
  "/archive",
  "/my",
  "/situations/",
  "/decks/",
];

/** 덱 상세 등에서 '왔던 곳'으로 돌아가기 */
export function getSmartBackHref(fallback: string): string {
  const previous = getPreviousNavigationPath();
  if (!previous) return fallback;
  const allowed = SMART_BACK_PREFIXES.some(
    (prefix) => previous === prefix || previous.startsWith(prefix)
  );
  return allowed ? previous : fallback;
}
