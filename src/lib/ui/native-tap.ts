/** React onClick 대신 사용 — 모바일·하이드레이션 깨짐 시에도 탭 동작 보장 */
export function bindNativeTap(
  element: HTMLElement,
  handler: () => void,
  options?: { guard?: () => boolean }
): () => void {
  const onActivate = () => {
    if (options?.guard?.() === false) return;
    handler();
  };

  element.addEventListener("click", onActivate);
  element.addEventListener("pointerup", onActivate);

  return () => {
    element.removeEventListener("click", onActivate);
    element.removeEventListener("pointerup", onActivate);
  };
}
