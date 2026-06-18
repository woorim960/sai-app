"use client";

import { useLayoutEffect, useMemo, useState } from "react";
import { balanceGroupName, readBalanceSelection } from "@/lib/gameplay/balance-dom";
import {
  buildAdvanceNextHref,
  type AdvanceNextQuery,
} from "@/lib/group/build-advance-next-href";
import { cn } from "@/lib/utils";

type AdvanceNextLinkProps = {
  payload: AdvanceNextQuery;
  isLast: boolean;
  balanceRequired?: boolean;
  blocked?: boolean;
  className?: string;
};

function resolveSelection(
  balanceRequired: boolean,
  cardId: string
): "A" | "B" | null {
  if (!balanceRequired) return null;
  return readBalanceSelection(balanceGroupName(cardId));
}

export function AdvanceNextLink({
  payload,
  isLast,
  balanceRequired = false,
  blocked = false,
  className,
}: AdvanceNextLinkProps) {
  const balanceGroup = balanceGroupName(payload.cardId);

  const [href, setHref] = useState(() =>
    buildAdvanceNextHref({
      ...payload,
      selectedOption: resolveSelection(balanceRequired, payload.cardId),
    })
  );

  const staticPayloadKey = useMemo(
    () =>
      [
        payload.groupId,
        payload.cardIndex,
        payload.totalCards,
        payload.cardId,
        payload.cardType,
        payload.optionA,
        payload.optionB,
      ].join("|"),
    [payload]
  );

  useLayoutEffect(() => {
    const syncHref = () => {
      setHref(
        buildAdvanceNextHref({
          ...payload,
          selectedOption: resolveSelection(balanceRequired, payload.cardId),
        })
      );
    };

    syncHref();

    if (!balanceRequired) return;

    const root = document.querySelector(`[data-balance-root="${balanceGroup}"]`);
    if (!root) return;

    const onActivity = () => queueMicrotask(syncHref);

    root.addEventListener("change", syncHref);
    root.addEventListener("input", syncHref);
    root.addEventListener("click", onActivity, true);
    root.addEventListener("pointerup", onActivity, true);

    return () => {
      root.removeEventListener("change", syncHref);
      root.removeEventListener("input", syncHref);
      root.removeEventListener("click", onActivity, true);
      root.removeEventListener("pointerup", onActivity, true);
    };
  }, [balanceGroup, balanceRequired, payload, staticPayloadKey]);

  const label = isLast ? "결과 보기" : "다음 질문";

  const handleNavigate = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const selection = resolveSelection(balanceRequired, payload.cardId);
    if (balanceRequired && !selection) {
      event.preventDefault();
      return;
    }

    const nextHref = buildAdvanceNextHref({
      ...payload,
      selectedOption: selection,
    });
    event.currentTarget.href = nextHref;
  };

  if (blocked) {
    return (
      <span
        data-sai-next
        data-blocked="true"
        data-balance-required={balanceRequired ? "true" : "false"}
        aria-disabled
        className={cn(
          "gameplay-next-btn sai-btn-dark flex h-14 w-full items-center justify-center touch-manipulation opacity-40",
          className
        )}
      >
        {label}
      </span>
    );
  }

  return (
    <a
      href={href}
      onClick={handleNavigate}
      data-sai-next
      data-blocked="false"
      data-balance-required={balanceRequired ? "true" : "false"}
      className={cn(
        "gameplay-next-btn sai-btn-dark flex h-14 w-full items-center justify-center touch-manipulation no-underline",
        className
      )}
    >
      {label}
    </a>
  );
}
