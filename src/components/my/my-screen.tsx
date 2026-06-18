"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppTabShell } from "@/components/layout/app-tab-shell";
import { HomeExperimentReport } from "@/components/games/home-experiment-report";
import { Button } from "@/components/ui/button";
import {
  getDefaultDisplayName,
  getDisplayName,
  setDisplayName,
} from "@/lib/client-id";
import { useUserStatsSnapshot } from "@/lib/hooks/use-user-data";
import { cn } from "@/lib/utils";

export function MyScreen() {
  const stats = useUserStatsSnapshot();
  const [name, setName] = useState("플레이어");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(getDisplayName() || getDefaultDisplayName());
  }, []);

  const initial = name.slice(0, 1) || "플";

  const handleSave = () => {
    setDisplayName(name.trim() || "플레이어");
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <AppTabShell className="page-enter">
      <header className="app-screen-header px-6">
        <h1 className="text-[26px] font-bold tracking-[-0.02em] text-sai-text">
          마이
        </h1>
        <p className="mt-2 text-[14px] text-sai-text-secondary">
          프로필과 활동 정보를 확인하세요.
        </p>
      </header>

      <main className="mt-8 space-y-6 px-6">
        <section className="sai-card flex items-center gap-4 p-5">
          <span className="flex size-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-sai-primary to-[#a89eff] text-[24px] font-bold text-white">
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <label htmlFor="display-name" className="text-[13px] text-sai-text-secondary">
              닉네임
            </label>
            <input
              id="display-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-[14px] border border-border bg-sai-bg px-3 py-2 text-[16px] font-semibold text-sai-text outline-none focus:border-sai-primary"
              maxLength={12}
            />
          </div>
        </section>

        <Button onClick={handleSave} className="sai-btn-dark h-12">
          {saved ? "저장됨" : "닉네임 저장"}
        </Button>

        <section className="grid grid-cols-3 gap-3">
          <StatCard label="완료" value={stats.completedCount} />
          <StatCard label="좋아요" value={stats.favoriteCount} />
          <StatCard label="기록" value={stats.historyCount} />
        </section>

        <section className="space-y-3">
          <QuickLink href="/archive" title="보관함" desc="좋아요 · 플레이 기록" />
          <QuickLink href="/games" title="게임 목록" desc="전체 덱 보기" />
          <QuickLink href="/together" title="둘이하기" desc="함께 플레이할 덱" />
        </section>

        {process.env.NODE_ENV === "development" && (
          <section className="space-y-3">
            <div>
              <p className="text-[13px] font-bold text-sai-text">개발자</p>
              <p className="mt-0.5 text-[12px] text-sai-text-secondary">
                로컬 A/B 실험 지표 (dev 전용)
              </p>
            </div>
            <HomeExperimentReport />
          </section>
        )}
      </main>
    </AppTabShell>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="sai-card-soft p-4 text-center">
      <p className="text-[22px] font-bold text-sai-text">{value}</p>
      <p className="mt-1 text-[12px] text-sai-text-secondary">{label}</p>
    </div>
  );
}

function QuickLink({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "sai-card-soft block p-4 transition-all active:scale-[0.99]"
      )}
    >
      <p className="text-[16px] font-bold text-sai-text">{title}</p>
      <p className="mt-1 text-[13px] text-sai-text-secondary">{desc}</p>
    </Link>
  );
}
