"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  Heart,
  HeartHandshake,
  Play,
  Sparkles,
} from "lucide-react";
import { AppTabShell } from "@/components/layout/app-tab-shell";
import { CompatResultsCard } from "@/components/together/compat-results-card";
import { OurRecordCard } from "@/components/together/our-record-card";
import { NotificationOptIn } from "@/components/together/notification-opt-in";
import { useCouple } from "@/lib/couple/use-couple";
import { usePlayHistory } from "@/lib/hooks/use-user-data";
import { ensureAnniversaryNotifications } from "@/lib/user-data";
import {
  computeBadges,
  computeStats,
  recommendDecks,
  sessionsFromCoupleRecords,
  sessionsFromPlayHistory,
  type TogetherSession,
} from "@/lib/together/dashboard";
import { getDailyQuestion } from "@/lib/together/daily";
import { buildCompatSnapshot } from "@/lib/together/compatibility-results";
import { loadLocalCompatResult } from "@/lib/together/compatibility-storage";
import { getClientId } from "@/lib/client-id";
import { getActiveGames } from "@/lib/group/active-games";
import { cn } from "@/lib/utils";

export function TogetherScreen() {
  const { state, paired, hasCouple } = useCouple();
  const history = usePlayHistory();
  const [mounted, setMounted] = useState(false);
  const [compatTick, setCompatTick] = useState(0);
  const [activeGamesTick, setActiveGamesTick] = useState(0);

  useEffect(() => {
    setMounted(true);
    const bump = () => setCompatTick((value) => value + 1);
    const bumpGames = () => setActiveGamesTick((value) => value + 1);
    window.addEventListener("sai-compat-changed", bump);
    window.addEventListener("sai-couple-changed", bump);
    window.addEventListener("sai-active-games-changed", bumpGames);
    return () => {
      window.removeEventListener("sai-compat-changed", bump);
      window.removeEventListener("sai-couple-changed", bump);
      window.removeEventListener("sai-active-games-changed", bumpGames);
    };
  }, []);

  const anniversary = state?.couple.anniversary;
  useEffect(() => {
    ensureAnniversaryNotifications(anniversary);
  }, [anniversary]);

  const sessions: TogetherSession[] = useMemo(() => {
    if (state && state.records.length > 0) {
      return sessionsFromCoupleRecords(state.records);
    }
    return sessionsFromPlayHistory(history);
  }, [state, history]);

  const stats = useMemo(() => computeStats(sessions), [sessions]);
  const recommendations = useMemo(() => recommendDecks(sessions), [sessions]);
  const badges = useMemo(
    () => computeBadges(sessions, stats),
    [sessions, stats]
  );

  const activeGames = useMemo(() => {
    void activeGamesTick;
    if (!mounted) return [];
    return getActiveGames();
  }, [mounted, activeGamesTick]);

  const compatSnapshot = useMemo(() => {
    void compatTick;
    return buildCompatSnapshot({
      records: state?.records,
      members: state?.members,
      myClientId: mounted ? getClientId() : null,
      localResult: mounted ? loadLocalCompatResult() : null,
    });
  }, [state, mounted, compatTick]);

  const members = state?.members ?? [];
  const waiting = hasCouple && !paired;

  return (
    <AppTabShell className="page-enter bg-[#FAFAFC]">
      <header className="app-screen-header flex items-center justify-between px-5">
        <div>
          <h1 className="text-[24px] font-bold tracking-[-0.02em] text-sai-text">
            둘이하기
          </h1>
          <p className="text-[13px] text-sai-text-secondary">
            {paired
              ? "함께 기록을 쌓아가요"
              : "파트너와 연결하고 우리만의 기록을 쌓아보세요"}
          </p>
        </div>
        <Link
          href="/together/connect"
          aria-label="커플 연결"
          className="flex size-10 items-center justify-center rounded-full bg-white text-sai-primary shadow-[0_4px_14px_rgba(45,49,66,0.08)]"
        >
          <Heart
            className="size-5"
            strokeWidth={2.2}
            fill={paired ? "currentColor" : "none"}
          />
        </Link>
      </header>

      <main className="mt-6 space-y-7 px-5 pb-4">
        <OurRecordCard
          stats={stats}
          members={members}
          coupleName={state?.couple.coupleName}
          anniversary={state?.couple.anniversary}
          paired={paired}
        />

        {!hasCouple && <ConnectCallout />}
        {waiting && state && (
          <WaitingCallout inviteCode={state.couple.inviteCode} />
        )}

        <Link
          href="/together/daily"
          className="block rounded-[20px] border border-[#E8E2FB] bg-white p-4 shadow-[0_3px_14px_rgba(45,49,66,0.05)] transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-accent text-[15px]">
              💌
            </span>
            <span className="text-[12px] font-bold text-sai-primary">
              오늘의 질문
            </span>
          </div>
          <p className="mt-2.5 text-[16px] font-bold leading-snug text-sai-text">
            {getDailyQuestion().text}
          </p>
          <p className="mt-1.5 inline-flex items-center gap-1 text-[12.5px] font-semibold text-sai-text-secondary">
            함께 답하고 비교해보기
            <ChevronRight className="size-3.5" strokeWidth={2.4} />
          </p>
        </Link>

        <NotificationOptIn />

        {activeGames.length > 0 && (
          <section>
            <SectionTitle title="이어하기" subtitle="진행 중인 게임을 마저 즐겨요" />
            <div className="mt-3 space-y-2.5">
              {activeGames.map((item) => {
                const progress = Math.min(
                  Math.round(((item.progressIndex + 1) / item.totalCards) * 100),
                  99
                );

                return (
                  <Link
                    key={item.groupId}
                    href={item.playPath}
                    className="flex items-center gap-3.5 rounded-[18px] border border-[#EEEDF4] bg-white p-3.5 shadow-[0_3px_14px_rgba(45,49,66,0.05)] transition-all active:scale-[0.99]"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-accent text-sai-primary">
                      <Play className="size-5" strokeWidth={2.2} fill="currentColor" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14.5px] font-bold text-sai-text">
                        {item.deckTitle}
                      </p>
                      <p className="mt-0.5 text-[11px] text-sai-text-secondary">
                        {item.mode === "async" ? "각자하기" : "함께하기"} ·{" "}
                        {item.progressIndex + 1}/{item.totalCards}
                      </p>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#EEEDF4]">
                        <span
                          className="block h-full rounded-full bg-sai-primary transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-sai-primary px-3.5 py-1.5 text-[12px] font-bold text-white">
                      이어하기
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section>
          <SectionTitle
            title="우리의 추천 게임"
            subtitle={
              paired ? "아직 함께 안 해본 게임이에요" : "둘이서 즐기기 좋아요"
            }
          />
          <div className="mt-3 space-y-2.5">
            {recommendations.map((item) => (
              <Link
                key={item.deckId}
                href={`/decks/${item.deckId}`}
                className="flex items-center gap-3.5 rounded-[18px] border border-[#EEEDF4] bg-white p-3.5 shadow-[0_3px_14px_rgba(45,49,66,0.05)] transition-all active:scale-[0.99]"
              >
                <span
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-[16px] bg-gradient-to-br text-[24px]",
                    item.gradientClass
                  )}
                >
                  {item.illustration}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-semibold text-sai-primary">
                    {item.tagLabel}
                  </span>
                  <p className="truncate text-[15px] font-bold text-sai-text">
                    {item.displayTitle}
                  </p>
                  <p className="mt-0.5 truncate text-[12px] text-sai-text-secondary">
                    {item.displaySubtitle}
                  </p>
                </div>
                <ChevronRight className="size-5 shrink-0 text-sai-text-secondary" />
              </Link>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title="우리의 성취" subtitle="함께할수록 모이는 뱃지" />
          <div className="mt-3 grid grid-cols-3 gap-2.5">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-[16px] border p-3 text-center transition-colors",
                  badge.unlocked
                    ? "border-[#E5E1FA] bg-white shadow-[0_3px_12px_rgba(45,49,66,0.05)]"
                    : "border-[#EEEDF4] bg-[#F4F4F7]"
                )}
              >
                <span
                  className={cn(
                    "text-[26px]",
                    !badge.unlocked && "opacity-30 grayscale"
                  )}
                >
                  {badge.emoji}
                </span>
                <span
                  className={cn(
                    "text-[11px] font-bold leading-tight",
                    badge.unlocked ? "text-sai-text" : "text-sai-text-secondary"
                  )}
                >
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <CompatResultsCard snapshot={compatSnapshot} paired={paired} />
      </main>
    </AppTabShell>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <h2 className="text-[17px] font-bold tracking-[-0.01em] text-sai-text">
        {title}
      </h2>
      <p className="mt-0.5 text-[13px] text-sai-text-secondary">{subtitle}</p>
    </div>
  );
}

function ConnectCallout() {
  return (
    <Link
      href="/together/connect"
      className="flex items-center gap-4 rounded-[20px] border border-dashed border-[#C9BFF6] bg-[#F4F1FE] p-4 transition-all active:scale-[0.99]"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-[16px] bg-sai-primary text-white">
        <HeartHandshake className="size-6" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-bold text-sai-text">파트너와 연결하기</p>
        <p className="mt-0.5 text-[12.5px] text-sai-text-secondary">
          연결하면 둘의 기록과 궁합이 함께 쌓여요
        </p>
      </div>
      <ChevronRight className="size-5 shrink-0 text-sai-primary" />
    </Link>
  );
}

function WaitingCallout({ inviteCode }: { inviteCode: string }) {
  return (
    <Link
      href="/together/connect"
      className="flex items-center gap-4 rounded-[20px] border border-[#E5E1FA] bg-white p-4 shadow-[0_3px_14px_rgba(45,49,66,0.05)] transition-all active:scale-[0.99]"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-[16px] bg-accent text-sai-primary">
        <Sparkles className="size-6" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-bold text-sai-text">파트너 초대 대기 중</p>
        <p className="mt-0.5 text-[12.5px] text-sai-text-secondary">
          초대 코드 <span className="font-bold text-sai-primary">{inviteCode}</span>{" "}
          · 링크를 공유해보세요
        </p>
      </div>
      <ChevronRight className="size-5 shrink-0 text-sai-primary" />
    </Link>
  );
}
