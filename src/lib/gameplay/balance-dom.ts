export function readBalanceSelection(groupName: string): "A" | "B" | null {
  if (typeof document === "undefined") return null;

  const checked = document.querySelector<HTMLInputElement>(
    `[data-balance-root="${groupName}"] .balance-option-input:checked`
  );
  if (!checked) return null;

  const value = checked.value;
  return value === "A" || value === "B" ? value : null;
}

export function balanceGroupName(cardId: string): string {
  return `balance-${cardId}`;
}
