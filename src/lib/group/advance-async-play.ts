import { balanceGroupName, readBalanceSelection } from "@/lib/gameplay/balance-dom";
import { resolvePlayClientId } from "@/lib/group/resolve-play-session";
import { removeActiveGame } from "@/lib/group/active-games";
import { advanceAsyncPlayRequest } from "@/lib/group/api-client";
import { markDeckCompleted } from "@/lib/storage";
import { recordCoupleSessionIfPaired } from "@/lib/couple/record-session";

export type AdvanceAsyncPlayInput = {
  groupId: string;
  clientId: string;
  deckId: string;
  deckTitle: string;
  estimatedMinutes: number;
  currentIndex: number;
  totalCards: number;
  cardId: string;
  cardType: "balance" | "question";
  optionA?: string;
  optionB?: string;
  selectedOption: "A" | "B" | null;
  resultPath: string;
};

export type AdvanceAsyncPlayOutcome =
  | { kind: "next"; nextIndex: number }
  | { kind: "complete" };

function readSelectedOption(
  root: ParentNode,
  cardId: string
): "A" | "B" | null {
  const checked = root.querySelector<HTMLInputElement>(
    ".balance-option-input:checked"
  );
  if (checked?.value === "A" || checked?.value === "B") {
    return checked.value;
  }

  const fromDom = readBalanceSelection(balanceGroupName(cardId));
  if (fromDom) return fromDom;

  for (const input of root.querySelectorAll<HTMLInputElement>(
    ".balance-option-input"
  )) {
    if (input.checked && (input.value === "A" || input.value === "B")) {
      return input.value;
    }
  }

  return null;
}

export function hasRequiredBalanceSelection(
  root: ParentNode,
  cardId?: string
): boolean {
  if (root.querySelector(".balance-option-input:checked")) return true;
  if (!cardId) return false;
  return readBalanceSelection(balanceGroupName(cardId)) !== null;
}

function parseAdvanceDataset(
  source: HTMLElement,
  root: ParentNode
): AdvanceAsyncPlayInput | null {
  const groupId = source.dataset.saiGroupId;
  const deckId = source.dataset.saiDeckId;
  const deckTitle = source.dataset.saiDeckTitle;
  const cardId = source.dataset.saiCardId;
  const cardType = source.dataset.saiCardType;
  const resultPath = source.dataset.saiResultPath;

  if (!groupId || !deckId || !deckTitle || !cardId || !resultPath) {
    return null;
  }
  if (cardType !== "balance" && cardType !== "question") {
    return null;
  }

  const clientId =
    source.dataset.saiClientId?.trim() || resolvePlayClientId(groupId);
  if (!clientId) return null;

  const currentIndex = Number(source.dataset.saiCardIndex ?? "0");
  const totalCards = Number(source.dataset.saiTotalCards ?? "0");
  const estimatedMinutes = Number(source.dataset.saiEstimatedMinutes ?? "0");

  if (
    !Number.isFinite(currentIndex) ||
    !Number.isFinite(totalCards) ||
    totalCards < 1
  ) {
    return null;
  }

  const selectedOption = readSelectedOption(root, cardId);

  return {
    groupId,
    clientId,
    deckId,
    deckTitle,
    estimatedMinutes,
    currentIndex,
    totalCards,
    cardId,
    cardType,
    optionA: source.dataset.saiOptionA,
    optionB: source.dataset.saiOptionB,
    selectedOption,
    resultPath,
  };
}

export function readAsyncPlayFromButton(
  button: HTMLButtonElement
): AdvanceAsyncPlayInput | null {
  if (button.dataset.saiPlay !== "async") return null;
  const shell = button.closest(".gameplay-shell") ?? document;
  return parseAdvanceDataset(button, shell);
}

export function readAsyncPlayFromShell(
  shell: HTMLElement
): AdvanceAsyncPlayInput | null {
  if (shell.dataset.saiPlay !== "async") return null;
  return parseAdvanceDataset(shell, shell);
}

export function readAsyncPlayContext(
  button: HTMLButtonElement
): AdvanceAsyncPlayInput | null {
  return (
    readAsyncPlayFromButton(button) ??
    (button.closest<HTMLElement>(".gameplay-shell")
      ? readAsyncPlayFromShell(
          button.closest<HTMLElement>(".gameplay-shell")!
        )
      : null)
  );
}

export async function advanceAsyncGroupPlay(
  input: AdvanceAsyncPlayInput
): Promise<AdvanceAsyncPlayOutcome> {
  const {
    groupId,
    clientId,
    deckId,
    deckTitle,
    estimatedMinutes,
    currentIndex,
    totalCards,
    cardId,
    cardType,
    optionA,
    optionB,
    selectedOption,
    resultPath,
  } = input;

  const effectiveSelection =
    cardType === "balance"
      ? selectedOption ?? readBalanceSelection(balanceGroupName(cardId))
      : selectedOption;

  if (cardType === "balance" && !effectiveSelection) {
    throw new Error("Balance option required");
  }

  const advanced = await advanceAsyncPlayRequest({
    groupId,
    clientId,
    cardId,
    cardType,
    cardIndex: currentIndex,
    totalCards,
    selectedOption: effectiveSelection ?? undefined,
    selectedLabel:
      effectiveSelection === "A"
        ? optionA
        : effectiveSelection === "B"
          ? optionB
          : undefined,
  });

  if (!advanced.ok) {
    throw new Error("Failed to advance");
  }

  if (advanced.kind === "complete") {
    removeActiveGame(groupId);
    markDeckCompleted(deckId, {
      deckTitle,
      mode: "async",
      groupId,
      resultHref: resultPath,
    });
    void recordCoupleSessionIfPaired({
      deckId,
      deckTitle,
      mode: "async",
      minutes: estimatedMinutes,
    });
    window.location.replace(resultPath);
    return { kind: "complete" };
  }

  return { kind: "next", nextIndex: advanced.nextIndex };
}
