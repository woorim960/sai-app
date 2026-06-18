import {
  advanceAsyncGroupPlay,
  hasRequiredBalanceSelection,
  readAsyncPlayContext,
} from "@/lib/group/advance-async-play";
import { syncPlaySessionFromUrl } from "@/lib/group/sync-play-session";
import { invokeGameplayNext } from "@/lib/gameplay/next-handler";

let asyncAdvanceInFlight = false;

export function syncNextButtonBlocked(
  next: HTMLButtonElement,
  blocked: boolean
): void {
  next.dataset.blocked = blocked ? "true" : "false";
}

export async function activateNextButton(next: HTMLButtonElement): Promise<void> {
  if (next.dataset.blocked === "true" || next.disabled) return;

  const shell = next.closest<HTMLElement>(".gameplay-shell");
  const cardId = next.dataset.saiCardId ?? shell?.dataset.saiCardId;

  if (next.dataset.balanceRequired === "true") {
    const selectionRoot = shell ?? document;
    if (!hasRequiredBalanceSelection(selectionRoot, cardId)) return;
  }

  const playMode = next.dataset.saiPlay ?? shell?.dataset.saiPlay;
  if (playMode === "async") {
    const groupId = next.dataset.saiGroupId ?? shell?.dataset.saiGroupId;
    if (groupId) syncPlaySessionFromUrl(groupId);

    const input = readAsyncPlayContext(next);
    if (!input) {
      window.alert("세션을 찾을 수 없어요. 다시 입장해주세요.");
      return;
    }

    if (asyncAdvanceInFlight) return;
    asyncAdvanceInFlight = true;
    next.dataset.blocked = "true";

    try {
      await advanceAsyncGroupPlay(input);
    } catch {
      next.dataset.blocked = "false";
      window.alert("저장에 실패했어요. 다시 시도해주세요.");
    } finally {
      asyncAdvanceInFlight = false;
    }
    return;
  }

  invokeGameplayNext();
}
