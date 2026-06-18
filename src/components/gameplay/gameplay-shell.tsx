import { MobileShell } from "@/components/layout/mobile-shell";
import { GameplayBackLink } from "@/components/gameplay/gameplay-back-link";
import { GameplayNextButton } from "@/components/gameplay/gameplay-next-button";
import { ProgressBar } from "@/components/gameplay/progress-bar";
import { QuestionCard } from "@/components/gameplay/question-card";
import type { Card } from "@/lib/data";

type GameplayShellProps = {
  cards: Card[];
  currentIndex: number;
  selectedOption: "A" | "B" | null;
  onSelectOption: (option: "A" | "B") => void;
  answerText?: string;
  onAnswerTextChange?: (value: string) => void;
  onNext: () => void;
  backHref: string;
  backConfirmTitle?: string;
  backConfirmMessage?: string;
  backConfirmHint?: string;
  isLast: boolean;
  nextBlocked?: boolean;
  showNextButton?: boolean;
  title?: string;
  headerExtra?: React.ReactNode;
  participantsSlot?: React.ReactNode;
  footerHint?: React.ReactNode;
  /** 모바일 DOM 위임 — React 핸들러 없이도 다음 카드 진행 */
  asyncPlayMeta?: {
    groupId: string;
    clientId: string;
    deckId: string;
    deckTitle: string;
    estimatedMinutes: number;
    resultPath: string;
  };
};

export function GameplayShell({
  cards,
  currentIndex,
  selectedOption,
  onSelectOption,
  answerText,
  onAnswerTextChange,
  onNext,
  backHref,
  backConfirmTitle,
  backConfirmMessage,
  backConfirmHint,
  isLast,
  nextBlocked = false,
  showNextButton = true,
  title,
  headerExtra,
  participantsSlot,
  footerHint,
  asyncPlayMeta,
}: GameplayShellProps) {
  const totalCards = cards.length;
  const currentCard = cards[currentIndex];
  const displayIndex = currentIndex + 1;

  if (!currentCard) return null;

  const isBalance = currentCard.type === "balance";

  return (
    <MobileShell className="page-enter bg-gradient-to-b from-[#FAFAFC] via-[#FAF8FF] to-[#F6F3FF]">
      <div
        className="gameplay-shell flex h-full min-h-0 flex-col px-5 pb-4 safe-pt safe-pb"
        data-balance-required={isBalance ? "true" : "false"}
        {...(asyncPlayMeta
          ? {
              "data-sai-play": "async",
              "data-sai-group-id": asyncPlayMeta.groupId,
              "data-sai-client-id": asyncPlayMeta.clientId,
              "data-sai-deck-id": asyncPlayMeta.deckId,
              "data-sai-deck-title": asyncPlayMeta.deckTitle,
              "data-sai-estimated-minutes": String(asyncPlayMeta.estimatedMinutes),
              "data-sai-card-index": String(currentIndex),
              "data-sai-total-cards": String(totalCards),
              "data-sai-card-id": currentCard.id,
              "data-sai-card-type": currentCard.type,
              "data-sai-option-a": currentCard.optionA ?? "",
              "data-sai-option-b": currentCard.optionB ?? "",
              "data-sai-is-last": isLast ? "true" : "false",
              "data-sai-result-path": asyncPlayMeta.resultPath,
            }
          : {})}
      >
        <header className="shrink-0">
          <div className="relative flex h-10 items-center justify-center">
            <div className="absolute left-0 z-20">
              <GameplayBackLink
                href={backHref}
                confirmTitle={backConfirmTitle}
                confirmMessage={backConfirmMessage}
                confirmHint={backConfirmHint}
              />
            </div>
            <div className="text-center">
              {title && (
                <p className="text-[15px] font-bold tracking-[-0.02em] text-sai-text">
                  {title}
                </p>
              )}
              <p className="mt-0.5 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-0.5 text-[11.5px] font-semibold text-sai-text-secondary shadow-sm ring-1 ring-[#EEEDF4]">
                <span className="text-sai-primary">{displayIndex}</span>
                <span className="opacity-40">/</span>
                <span>{totalCards}</span>
              </p>
            </div>
          </div>
          <div className="mt-3">
            <ProgressBar current={displayIndex} total={totalCards} />
          </div>
          {headerExtra}
        </header>

        <main className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto py-4">
          <div key={currentCard.id} className="card-enter">
            <QuestionCard
              card={currentCard}
              selectedOption={selectedOption}
              onSelectOption={onSelectOption}
              answerText={answerText}
              onAnswerTextChange={
                currentCard.type === "question" ? onAnswerTextChange : undefined
              }
            />
          </div>
        </main>

        <footer className="gameplay-footer relative z-20 shrink-0 space-y-4">
          {participantsSlot && (
            <div className="flex justify-center">{participantsSlot}</div>
          )}
          {footerHint}
          {showNextButton && (
            <GameplayNextButton
              isLast={isLast}
              blocked={nextBlocked}
              balanceRequired={isBalance}
              onNext={onNext}
            />
          )}
        </footer>
      </div>
    </MobileShell>
  );
}
