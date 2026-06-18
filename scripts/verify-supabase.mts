/**
 * Supabase 배포 전 검증 — 스키마·시드·API 키 연결 확인
 *
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run verify:supabase
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

const EXPECTED = {
  situations: 4,
  decks: 12,
  cards: 180,
} as const;

type CheckResult = { ok: boolean; message: string };

function check(label: string, ok: boolean, detail: string): CheckResult {
  const icon = ok ? "✓" : "✗";
  return { ok, message: `${icon} ${label}: ${detail}` };
}

async function main() {
  const results: CheckResult[] = [];

  results.push(
    check("NEXT_PUBLIC_SUPABASE_URL", Boolean(url), url ? "set" : "missing")
  );
  results.push(
    check(
      "SUPABASE_SERVICE_ROLE_KEY",
      Boolean(serviceKey),
      serviceKey ? "set" : "missing"
    )
  );
  results.push(
    check(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      Boolean(anonKey),
      anonKey ? "set" : "missing (Vercel Production에 필요)"
    )
  );

  if (!url || !serviceKey) {
    printResults(results);
    process.exit(1);
  }

  const admin = createClient(url, serviceKey);

  for (const table of [
    "situations",
    "decks",
    "cards",
    "play_groups",
    "play_group_participants",
    "play_group_answers",
  ]) {
    const { error } = await admin.from(table).select("*", { head: true, count: "exact" });
    results.push(
      check(
        `table ${table}`,
        !error,
        error ? error.message : "exists"
      )
    );
  }

  const { count: situationCount, error: sErr } = await admin
    .from("situations")
    .select("*", { head: true, count: "exact" });
  if (!sErr) {
    results.push(
      check(
        "situations count",
        situationCount === EXPECTED.situations,
        `${situationCount ?? 0} (expected ${EXPECTED.situations})`
      )
    );
  }

  const { count: deckCount, error: dErr } = await admin
    .from("decks")
    .select("*", { head: true, count: "exact" });
  if (!dErr) {
    results.push(
      check(
        "decks count",
        deckCount === EXPECTED.decks,
        `${deckCount ?? 0} (expected ${EXPECTED.decks})`
      )
    );
  }

  const { count: cardCount, error: cErr } = await admin
    .from("cards")
    .select("*", { head: true, count: "exact" });
  if (!cErr) {
    results.push(
      check(
        "cards count",
        cardCount === EXPECTED.cards,
        `${cardCount ?? 0} (expected ${EXPECTED.cards})`
      )
    );
  }

  if (anonKey) {
    const anon = createClient(url, anonKey);
    const { data, error } = await anon.from("decks").select("id").limit(1);
    results.push(
      check(
        "anon read decks",
        !error && Array.isArray(data),
        error ? error.message : `ok (${data?.length ?? 0} row sampled)`
      )
    );
  }

  printResults(results);

  const failed = results.some((r) => !r.ok);
  if (failed) {
    console.log("\n일부 검증 실패. schema.sql 실행 후 npm run seed:supabase 를 다시 실행하세요.");
    process.exit(1);
  }

  console.log("\n✓ Supabase 배포 준비 완료");
}

function printResults(results: CheckResult[]) {
  console.log("\n--- Supabase verify ---\n");
  for (const r of results) {
    console.log(r.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
