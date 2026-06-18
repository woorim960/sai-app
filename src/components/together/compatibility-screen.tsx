"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BookOpen } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { BackButton } from "@/components/ui/back-button";
import { Toast } from "@/components/ui/toast";
import { getClientId } from "@/lib/client-id";
import { addCoupleRecordRequest } from "@/lib/couple/api-client";
import { getCoupleSession } from "@/lib/couple/session-storage";
import { useCouple } from "@/lib/couple/use-couple";
import {
  COMPAT_QUESTIONS,
  COMPAT_TEST_META,
  applyChoice,
  buildLoveProfile,
  createEmptyScores,
  getCanonicalPersona,
  getProfilePersona,
  getSectionProgress,
  loveTypeToIndex,
  serializeProfile,
  type CompatReport,
  type DimensionScores,
  type LoveProfile,
  type LoveTypeId,
} from "@/lib/together/compatibility";
import {
  COMPAT_DECK_ID,
  COMPAT_DECK_TITLE,
  buildCompatSnapshot,
} from "@/lib/together/compatibility-results";
import {
  loadLocalCompatResult,
  saveLocalCompatProfile,
} from "@/lib/together/compatibility-storage";
import { CompatibilityQuizView } from "@/components/together/compatibility-quiz-view";
import { CompatibilityResultView } from "@/components/together/compatibility-result-view";
import { cn } from "@/lib/utils";

function fallbackProfile(loveTypeId: LoveTypeId): LoveProfile {
  return {
    v: 2,
    type: loveTypeId,
    persona: getCanonicalPersona(loveTypeId),
    scores: createEmptyScores(),
  };
}

type Step = "intro" | "quiz" | "result";

export function CompatibilityScreen() {
  const { state, paired, refresh } = useCouple();
  const [step, setStep] = useState<Step>("intro");
  const [qIndex, setQIndex] = useState(0);
  const [rawScores, setRawScores] = useState<DimensionScores>(createEmptyScores);
  const [profile, setProfile] = useState<LoveProfile | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<LoveProfile | null>(null);
  const [partnerName, setPartnerName] = useState<string | undefined>();
  const [report, setReport] = useState<CompatReport | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const initialApplied = useRef(false);

  const myClientId = getClientId();

  const snapshot = useMemo(
    () =>
      buildCompatSnapshot({
        records: state?.records,
        members: state?.members,
        myClientId,
        localResult: loadLocalCompatResult(),
      }),
    [state, myClientId]
  );

  const applySnapshot = useCallback((next: typeof snapshot) => {
    if (!next.mine) return false;
    setProfile(next.mine.profile ?? fallbackProfile(next.mine.loveTypeId));
    setPartnerProfile(next.partner?.profile ?? null);
    setPartnerName(next.partnerName);
    setReport(next.report);
    setStep("result");
    return true;
  }, []);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || initialApplied.current || !snapshot.mine) return;
    initialApplied.current = true;
    applySnapshot(snapshot);
  }, [hydrated, snapshot, applySnapshot]);

  useEffect(() => {
    if (!hydrated || step !== "result" || !snapshot.mine) return;
    setProfile(
      snapshot.mine.profile ?? fallbackProfile(snapshot.mine.loveTypeId)
    );
    setPartnerProfile(snapshot.partner?.profile ?? null);
    setPartnerName(snapshot.partnerName);
    setReport(snapshot.report);
  }, [hydrated, step, snapshot]);

  useEffect(() => {
    const handler = () => void refresh();
    window.addEventListener("sai-couple-changed", handler);
    window.addEventListener("sai-compat-changed", handler);
    return () => {
      window.removeEventListener("sai-couple-changed", handler);
      window.removeEventListener("sai-compat-changed", handler);
    };
  }, [refresh]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 1800);
  };

  const total = COMPAT_QUESTIONS.length;
  const current = COMPAT_QUESTIONS[qIndex];
  const sectionProgress = getSectionProgress(qIndex);

  const reset = () => {
    setStep("intro");
    setQIndex(0);
    setRawScores(createEmptyScores());
    setProfile(null);
    setPartnerProfile(null);
    setPartnerName(undefined);
    setReport(null);
  };

  const startQuiz = () => {
    setQIndex(0);
    setRawScores(createEmptyScores());
    setStep("quiz");
  };

  const persistResult = async (nextProfile: LoveProfile) => {
    saveLocalCompatProfile(nextProfile);

    const session = getCoupleSession();
    if (!session) return null;

    try {
      return await addCoupleRecordRequest({
        coupleId: session.coupleId,
        deckId: COMPAT_DECK_ID,
        deckTitle: COMPAT_DECK_TITLE,
        mode: "quiz",
        minutes: COMPAT_TEST_META.estimatedMinutes,
        score: loveTypeToIndex(nextProfile.type),
        note: serializeProfile(nextProfile),
      });
    } catch {
      return null;
    }
  };

  const handleAnswer = async (choice: "A" | "B") => {
    if (!current) return;

    const effects =
      choice === "A" ? current.optionA.effects : current.optionB.effects;
    const nextScores = applyChoice(rawScores, effects);
    setRawScores(nextScores);

    if (qIndex + 1 < total) {
      setQIndex((prev) => prev + 1);
      return;
    }

    const nextProfile = buildLoveProfile(nextScores);
    setProfile(nextProfile);
    setStep("result");

    const coupleState = await persistResult(nextProfile);
    const nextSnapshot = buildCompatSnapshot({
      records: coupleState?.records ?? state?.records,
      members: coupleState?.members ?? state?.members,
      myClientId,
      localResult: loadLocalCompatResult(),
    });

    setPartnerProfile(nextSnapshot.partner?.profile ?? null);
    setPartnerName(nextSnapshot.partnerName);
    setReport(nextSnapshot.report);

    if (coupleState) {
      showToast("결과가 저장됐어요");
    } else if (!getCoupleSession()) {
      showToast("내 기기에 결과를 저장했어요");
    }
  };

  const buildOgUrl = (): string | undefined => {
    if (!report || !profile || !partnerProfile) return undefined;
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const params = new URLSearchParams({
      score: String(report.score),
      headline: report.headline,
      a: getProfilePersona(profile).title,
      b: getProfilePersona(partnerProfile).title,
    });
    return `${origin}/api/og/couple?${params.toString()}`;
  };

  const handleShare = async () => {
    if (!profile) return;
    const persona = getProfilePersona(profile);
    const text = report
      ? `우리 연애 궁합은 ${report.score}%! ${report.headline} 💘 내 스타일은 '${persona.title}'`
      : `내 연애 스타일은 '${persona.title}' ${persona.emoji} - 사이에서 확인했어요!`;
    const url = buildOgUrl();

    if (navigator.share) {
      try {
        await navigator.share({
          title: "사이 - 연애 궁합",
          text,
          ...(url ? { url } : {}),
        });
      } catch {
        /* 취소됨 */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url ? `${text}\n${url}` : text);
      showToast("결과를 복사했어요");
    } catch {
      showToast("복사에 실패했어요");
    }
  };

  return (
    <MobileShell
      className={cn(
        step === "quiz"
          ? "bg-gradient-to-b from-[#FFF8FB] via-[#FAF7FB] to-[#F4F1FE]"
          : step === "result"
            ? "bg-gradient-to-b from-[#FAF8FF] via-[#FAF7FB] to-[#FFF8FB]"
            : "bg-[#FAF7FB]"
      )}
    >
      <div className="app-viewport-scroll flex h-full min-h-0 flex-col px-5 pb-10 safe-pt safe-pb">
        <div className="relative flex h-10 shrink-0 items-center justify-center">
          <div className="absolute left-0">
            <BackButton href="/together" />
          </div>
          <p className="text-[16px] font-bold text-sai-text">
            {step === "quiz" ? "우리 연애 스타일" : "연애 궁합 테스트"}
          </p>
        </div>

        {step === "intro" && (
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <span className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-[#FF9EC0] to-[#FFC8DD] text-[48px] shadow-[0_12px_30px_rgba(255,143,177,0.35)]">
                💘
              </span>
              <h1 className="mt-7 text-[24px] font-bold tracking-[-0.02em] text-sai-text">
                과학적 연애 궁합 검사
              </h1>
              <p className="mt-2.5 text-[14px] leading-relaxed text-sai-text-secondary">
                {COMPAT_TEST_META.itemCount}문항 · {COMPAT_TEST_META.dimensionCount}개
                차원 · {COMPAT_TEST_META.personaCount}가지 페르소나 · 약{" "}
                {COMPAT_TEST_META.estimatedMinutes}분
              </p>
            </div>

            <div className="rounded-[20px] border border-[#ECE2EF] bg-white p-4 text-left shadow-sm">
              <p className="flex items-center gap-2 text-[13px] font-bold text-sai-text">
                <BookOpen className="size-4 text-sai-primary" strokeWidth={2.2} />
                이론적 근거
              </p>
              <ul className="mt-3 space-y-1.5">
                {COMPAT_TEST_META.theories.map((theory) => (
                  <li
                    key={theory}
                    className="text-[12px] leading-relaxed text-sai-text-secondary"
                  >
                    · {theory}
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={startQuiz}
              className="mt-5 w-full rounded-[16px] bg-sai-primary py-4 text-[15px] font-bold text-white shadow-[0_8px_22px_rgba(145,129,244,0.32)] transition-all active:scale-[0.99]"
            >
              {snapshot.mine ? "다시 검사하기" : "검사 시작하기"}
            </button>
            {snapshot.mine && (
              <button
                type="button"
                onClick={() => applySnapshot(snapshot)}
                className="mt-3 w-full rounded-[16px] border border-[#E5E1FA] bg-white py-3.5 text-[14px] font-bold text-sai-primary active:scale-[0.99]"
              >
                저장된 결과 보기
              </button>
            )}
            <p className="mt-3 text-center text-[12px] text-sai-text-secondary">
              프로필별 저장 · 파트너 결과와 비교 가능
            </p>
          </div>
        )}

        {step === "quiz" && current && sectionProgress && (
          <CompatibilityQuizView
            qIndex={qIndex}
            total={total}
            current={current}
            sectionProgress={sectionProgress}
            onAnswer={(choice) => void handleAnswer(choice)}
          />
        )}

        {step === "result" && profile && (
          <div className="flex-1 pt-4">
            <CompatibilityResultView
              profile={profile}
              partnerProfile={partnerProfile}
              partnerName={partnerName}
              report={report}
              onShare={() => void handleShare()}
              onReset={reset}
            />
          </div>
        )}
      </div>

      <Toast message={toast ?? ""} visible={toast !== null} />
    </MobileShell>
  );
}
