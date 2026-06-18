"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Send, Share2, Sparkles } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { BackButton } from "@/components/ui/back-button";
import { Toast } from "@/components/ui/toast";
import { getClientId } from "@/lib/client-id";
import { addCoupleRecordRequest } from "@/lib/couple/api-client";
import { getCoupleSession } from "@/lib/couple/session-storage";
import { useCouple } from "@/lib/couple/use-couple";
import {
  dailyDeckId,
  getDailyQuestion,
  getTodayKey,
} from "@/lib/together/daily";
import { cn } from "@/lib/utils";

function localKey(dateKey: string): string {
  return `sai_daily_answer_${dateKey}`;
}

export function DailyScreen() {
  const { state, members, refresh } = useCoupleMembers();
  const [mounted, setMounted] = useState(false);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const todayKey = getTodayKey();
  const question = useMemo(() => getDailyQuestion(todayKey), [todayKey]);
  const deckId = dailyDeckId(todayKey);
  const myClientId = mounted ? getClientId() : "";

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(localKey(getTodayKey()));
    if (saved) {
      setAnswer(saved);
      setSubmitted(true);
    }
  }, []);

  const todaysRecords = (state?.records ?? []).filter(
    (record) => record.deckId === deckId && record.note
  );
  const myRecord = todaysRecords.find((r) => r.byClientId === myClientId);
  const partnerRecord = todaysRecords.find((r) => r.byClientId !== myClientId);

  const myAnswer = myRecord?.note ?? (submitted ? answer : "");
  const showAnswers = submitted || Boolean(myRecord);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 1800);
  };

  const memberByClient = (clientId: string) =>
    members.find((m) => m.clientId === clientId);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      showToast("답변을 입력해주세요");
      return;
    }
    setLoading(true);
    localStorage.setItem(localKey(todayKey), answer.trim());

    const session = getCoupleSession();
    if (session) {
      await addCoupleRecordRequest({
        coupleId: session.coupleId,
        deckId,
        deckTitle: question.text,
        mode: "duo",
        minutes: 1,
        note: answer.trim(),
      }).catch(() => null);
      await refresh();
    }

    setSubmitted(true);
    setLoading(false);
    showToast("답변을 저장했어요");
  };

  const handleShare = async () => {
    const text = `[오늘의 질문] ${question.text}\n내 답변: ${myAnswer}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "사이 - 오늘의 질문", text });
      } catch {
        /* 취소됨 */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      showToast("복사했어요");
    } catch {
      showToast("복사에 실패했어요");
    }
  };

  return (
    <MobileShell className="bg-[#FAF7FB]">
      <div className="app-viewport-scroll flex h-full min-h-0 flex-col px-5 pb-10 safe-pt safe-pb">
        <div className="relative flex h-10 shrink-0 items-center justify-center">
          <div className="absolute left-0">
            <BackButton href="/together" />
          </div>
          <p className="text-[16px] font-bold text-sai-text">오늘의 질문</p>
        </div>

        <div className="mt-6 rounded-[24px] bg-gradient-to-br from-[#9181F4] to-[#B6A9FF] p-6 text-white shadow-[0_14px_34px_rgba(118,99,234,0.3)]">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-[12px] font-semibold">
            <Sparkles className="size-3.5" strokeWidth={2.2} />
            {todayKey.replace(/-/g, ".")}
          </span>
          <h1 className="mt-4 text-[22px] font-bold leading-[1.4] tracking-[-0.02em]">
            {question.text}
          </h1>
        </div>

        {!showAnswers ? (
          <div className="mt-6">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="나의 답변을 적어보세요"
              rows={5}
              maxLength={300}
              className="w-full resize-none rounded-[18px] border border-[#ECE2EF] bg-white px-4 py-4 text-[15px] leading-relaxed outline-none focus:border-sai-primary"
            />
            <button
              type="button"
              disabled={loading}
              onClick={() => void handleSubmit()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-[16px] bg-sai-primary py-4 text-[15px] font-bold text-white shadow-[0_8px_22px_rgba(145,129,244,0.32)] transition-all active:scale-[0.99] disabled:opacity-60"
            >
              <Send className="size-5" strokeWidth={2.2} />
              {loading ? "저장 중..." : "답변 남기기"}
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <AnswerCard
              emoji={memberByClient(myClientId)?.emoji ?? "🙂"}
              name={memberByClient(myClientId)?.displayName ?? "나"}
              answer={myAnswer}
              mine
            />
            {partnerRecord ? (
              <AnswerCard
                emoji={memberByClient(partnerRecord.byClientId)?.emoji ?? "💜"}
                name={
                  memberByClient(partnerRecord.byClientId)?.displayName ??
                  "파트너"
                }
                answer={partnerRecord.note ?? ""}
              />
            ) : (
              <div className="rounded-[18px] border border-dashed border-[#D9CFEA] bg-white/60 px-4 py-6 text-center">
                <p className="text-[14px] font-semibold text-sai-text">
                  파트너의 답변을 기다리고 있어요
                </p>
                <button
                  type="button"
                  onClick={() => void refresh()}
                  className="mt-2 text-[13px] font-semibold text-sai-primary"
                >
                  새로고침
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => void handleShare()}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-[16px] border border-[#E5E1FA] bg-white py-3.5 text-[14px] font-bold text-sai-text active:scale-[0.98]"
            >
              <Share2 className="size-4" strokeWidth={2.2} />
              내 답변 공유
            </button>
          </div>
        )}

        <Link
          href="/together"
          className="mt-auto block pt-8 text-center text-[13px] font-semibold text-sai-text-secondary"
        >
          둘이하기로 돌아가기
        </Link>
      </div>

      <Toast message={toast ?? ""} visible={toast !== null} />
    </MobileShell>
  );
}

function useCoupleMembers() {
  const { state, refresh } = useCouple();
  return { state, members: state?.members ?? [], refresh };
}

function AnswerCard({
  emoji,
  name,
  answer,
  mine,
}: {
  emoji: string;
  name: string;
  answer: string;
  mine?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[18px] border p-4",
        mine
          ? "border-[#E5E1FA] bg-white shadow-[0_3px_14px_rgba(45,49,66,0.05)]"
          : "border-[#FAD7E6] bg-[#FFF5F9]"
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-full bg-accent text-[15px]">
          {emoji}
        </span>
        <span className="text-[13px] font-bold text-sai-text">{name}</span>
        {mine && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-sai-primary">
            나
          </span>
        )}
      </div>
      <p className="mt-2.5 whitespace-pre-wrap text-[14.5px] leading-relaxed text-sai-text">
        {answer}
      </p>
    </div>
  );
}
