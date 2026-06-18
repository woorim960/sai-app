import { decks } from "../src/lib/data/decks";
import { cards } from "../src/lib/data/cards";
import { situations } from "../src/lib/data/situations";
import { HOME_CATEGORIES, HOME_FEATURED_PRESENTATIONS, HOME_POPULAR_PRESENTATIONS } from "../src/lib/data/home";
import { GAME_PRESENTATIONS } from "../src/lib/data/games";
import { getSituationByDeckId } from "../src/lib/data/helpers";

type Issue = { level: "error" | "warn"; category: string; message: string };

const issues: Issue[] = [];

function error(category: string, message: string) {
  issues.push({ level: "error", category, message });
}

function warn(category: string, message: string) {
  issues.push({ level: "warn", category, message });
}

const deckIds = new Set(decks.map((d) => d.id));
const situationIds = new Set(situations.map((s) => s.id));

// --- 1. Deck ↔ Situation ---
for (const deck of decks) {
  if (!situationIds.has(deck.situationId)) {
    error("category", `덱 "${deck.title}" (${deck.id}): 존재하지 않는 situationId "${deck.situationId}"`);
  }
}

// --- 2. Card composition per deck ---
const EXPECTED_PHASES = ["ice_breaking", "taste", "value", "closing"] as const;

for (const deck of decks) {
  const deckCards = cards.filter((c) => c.deckId === deck.id);
  const balance = deckCards.filter((c) => c.type === "balance").length;
  const question = deckCards.filter((c) => c.type === "question").length;
  const phases = [...new Set(deckCards.map((c) => c.phase))];

  if (deckCards.length !== 15) {
    error("cards", `덱 "${deck.title}": 카드 ${deckCards.length}장 (15장 필요)`);
  }

  for (const phase of EXPECTED_PHASES) {
    if (!phases.includes(phase)) {
      warn("cards", `덱 "${deck.title}": phase "${phase}" 없음`);
    }
  }

  // 게임명 기반 기대 구성 (휴리스틱)
  const title = deck.title;
  if (title.includes("밸런스") || title.includes("월드컵") || deck.id.includes("ice-breaking")) {
    if (balance < 5) {
      warn("cards", `덱 "${title}": 밸런스 중심 게임인데 balance 카드 ${balance}장뿐`);
    }
  }
  if (title.includes("깊") || title.includes("가치관") || title.includes("미래") || title.includes("가까워")) {
    if (question < 7) {
      warn("cards", `덱 "${title}": 대화 중심 게임인데 question 카드 ${question}장뿐`);
    }
  }

  console.log(
    `  ${deck.id.padEnd(24)} | ${deck.situationId.padEnd(12)} | balance ${String(balance).padStart(2)} | question ${String(question).padStart(2)} | phases: ${phases.join(", ")}`
  );
}

// --- 3. GAME_PRESENTATIONS coverage ---
console.log("\n=== GAME_PRESENTATIONS ===");
for (const deck of decks) {
  const pres = GAME_PRESENTATIONS.find((p) => p.deckId === deck.id);
  if (!pres) {
    error("games-ui", `게임 탭에 덱 "${deck.title}" (${deck.id}) 프레젠테이션 없음`);
    continue;
  }
  if (pres.displayTitle !== deck.title) {
    warn(
      "games-ui",
      `게임 탭 표시명 불일치: 덱 "${deck.title}" ↔ UI "${pres.displayTitle}"`
    );
  }
  const situation = getSituationByDeckId(deck.id);
  if (situation && !pres.thumbClass) {
    warn("games-ui", `덱 "${deck.title}": thumbClass 없음`);
  }
}

for (const pres of GAME_PRESENTATIONS) {
  if (!deckIds.has(pres.deckId)) {
    error("games-ui", `GAME_PRESENTATIONS에 없는 덱 ID: ${pres.deckId}`);
  }
}

// --- 4. HOME presentations ---
for (const pres of [...HOME_FEATURED_PRESENTATIONS, ...HOME_POPULAR_PRESENTATIONS]) {
  const deck = decks.find((d) => d.id === pres.deckId);
  if (!deck) {
    error("home-ui", `홈 프레젠테이션에 없는 덱: ${pres.deckId}`);
    continue;
  }
  if (
    pres.displayTitle !== deck.title &&
    !pres.displayTitle.includes(deck.title.slice(0, 2))
  ) {
    warn(
      "home-ui",
      `홈 표시명 불일치: 덱 "${deck.title}" ↔ UI "${pres.displayTitle}" (${pres.deckId})`
    );
  }
}

// --- 5. HOME_CATEGORIES ---
console.log("\n=== HOME_CATEGORIES ===");
const deckHrefMap = new Map<string, string[]>();
for (const cat of HOME_CATEGORIES) {
  console.log(`  ${cat.label.padEnd(12)} → ${cat.href} ${cat.emoji}`);
  if (cat.href.startsWith("/situations/")) {
    const sid = cat.href.replace("/situations/", "");
    if (!situationIds.has(sid)) {
      error("category", `카테고리 "${cat.label}": 잘못된 situation 링크 ${cat.href}`);
    }
  } else if (cat.href.startsWith("/decks/")) {
    const did = cat.href.replace("/decks/", "");
    if (!deckIds.has(did)) {
      error("category", `카테고리 "${cat.label}": 잘못된 덱 링크 ${cat.href}`);
    }
    const refs = deckHrefMap.get(did) ?? [];
    refs.push(cat.label);
    deckHrefMap.set(did, refs);
  }
}

for (const [deckId, labels] of deckHrefMap) {
  if (labels.length > 1) {
    error(
      "category",
      `덱 "${deckId}"에 카테고리 ${labels.length}개 중복: ${labels.join(", ")}`
    );
  }
}

// --- 5b. Cross-deck duplicate questions ---
const questionMap = new Map<string, string[]>();
for (const card of cards) {
  const key = card.question.trim();
  const refs = questionMap.get(key) ?? [];
  refs.push(`${card.deckId}#${card.sortOrder}`);
  questionMap.set(key, refs);
}
const duplicateQuestions = [...questionMap.entries()].filter(([, refs]) => refs.length > 1);
if (duplicateQuestions.length > 0) {
  for (const [question, refs] of duplicateQuestions) {
    warn("cards", `중복 문항: "${question.slice(0, 40)}..." → ${refs.join(", ")}`);
  }
} else {
  console.log("\n✓ 중복 문항 없음");
}

// --- 6. Emoji consistency ---
console.log("\n=== EMOJI (situation vs deck hero) ===");
for (const deck of decks) {
  const situation = getSituationByDeckId(deck.id);
  if (!situation) continue;
  const gamePres = GAME_PRESENTATIONS.find((p) => p.deckId === deck.id);
  console.log(
    `  ${deck.title.padEnd(16)} | situation ${situation.emoji} | games illustration ${gamePres?.illustration ?? "?"}`
  );
}

// --- Summary ---
console.log("\n=== ISSUES ===");
const errors = issues.filter((i) => i.level === "error");
const warnings = issues.filter((i) => i.level === "warn");

for (const issue of issues) {
  const icon = issue.level === "error" ? "✗" : "⚠";
  console.log(`${icon} [${issue.category}] ${issue.message}`);
}

console.log(`\n총 ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length > 0 ? 1 : 0);
