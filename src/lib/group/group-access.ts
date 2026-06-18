import type { GroupResolveResult } from "./types";

export function getGroupExpiredFallback(deckId?: string) {
  if (deckId) {
    return {
      title: "만료된 대화예요",
      description:
        "이 대화는 보관 기간이 지나 접근할 수 없어요.\n같은 덱으로 새 대화를 시작해보세요.",
      primaryHref: `/decks/${deckId}`,
      primaryLabel: "다시 시작하기",
      secondaryHref: "/home",
      secondaryLabel: "홈으로",
    };
  }

  return {
    title: "만료된 대화예요",
    description:
      "이 대화는 보관 기간이 지나 접근할 수 없어요.\n새로운 대화를 시작해보세요.",
    primaryHref: "/home",
    primaryLabel: "홈으로",
  };
}

export function isActiveGroup(
  result: GroupResolveResult
): result is Extract<GroupResolveResult, { status: "active" }> {
  return result.status === "active";
}
