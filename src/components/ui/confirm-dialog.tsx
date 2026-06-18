"use client";

import { useLayoutEffect, useRef } from "react";
import { LogOut, Sparkles } from "lucide-react";
import { bindNativeTap } from "@/lib/ui/native-tap";
import { cn } from "@/lib/utils";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  hint?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  hint,
  confirmLabel = "나가기",
  cancelLabel = "계속하기",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const onConfirmRef = useRef(onConfirm);
  const onCancelRef = useRef(onCancel);
  onConfirmRef.current = onConfirm;
  onCancelRef.current = onCancel;

  useLayoutEffect(() => {
    if (!open) return;

    const cleanups: Array<() => void> = [];
    const overlay = overlayRef.current;

    if (overlay) {
      const onOverlayTap = (event: Event) => {
        if (event.target !== overlay) return;
        onCancelRef.current();
      };
      overlay.addEventListener("click", onOverlayTap);
      overlay.addEventListener("pointerup", onOverlayTap);
      cleanups.push(() => {
        overlay.removeEventListener("click", onOverlayTap);
        overlay.removeEventListener("pointerup", onOverlayTap);
      });
    }

    if (confirmRef.current) {
      cleanups.push(
        bindNativeTap(confirmRef.current, () => onConfirmRef.current())
      );
    }

    if (cancelRef.current) {
      cleanups.push(
        bindNativeTap(cancelRef.current, () => onCancelRef.current())
      );
    }

    if (panelRef.current) {
      const stopBubble = (event: Event) => event.stopPropagation();
      panelRef.current.addEventListener("click", stopBubble);
      panelRef.current.addEventListener("pointerup", stopBubble);
      cleanups.push(() => {
        panelRef.current?.removeEventListener("click", stopBubble);
        panelRef.current?.removeEventListener("pointerup", stopBubble);
      });
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[120] flex items-end justify-center bg-[#1A1625]/45 p-4 pb-[max(20px,env(safe-area-inset-bottom))] backdrop-blur-[2px] sm:items-center sm:p-6"
      role="presentation"
    >
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className={cn(
          "w-full max-w-[380px] overflow-hidden rounded-[28px] bg-white shadow-[0_24px_64px_rgba(30,30,30,0.18)]",
          "page-enter"
        )}
      >
        <div className="bg-gradient-to-br from-[#F6F3FF] via-white to-[#FFF9F5] px-6 pb-2 pt-7 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-[20px] bg-white shadow-[0_8px_24px_rgba(133,118,255,0.18)] ring-1 ring-[#EEEAFF]">
            <Sparkles className="size-7 text-sai-primary" strokeWidth={1.8} />
          </span>
          <h2
            id="confirm-dialog-title"
            className="mt-5 text-[20px] font-bold tracking-[-0.02em] text-sai-text"
          >
            {title}
          </h2>
          <p
            id="confirm-dialog-description"
            className="mt-2.5 text-[15px] leading-relaxed text-sai-text-secondary"
          >
            {message}
          </p>
          {hint && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#F4FFF8] px-3.5 py-1.5 text-[12.5px] font-medium text-[#2E9B5B] ring-1 ring-[#D8F5E3]">
              <span aria-hidden>✓</span>
              {hint}
            </p>
          )}
        </div>

        <div className="space-y-2.5 px-5 pb-5 pt-4">
          <button
            ref={cancelRef}
            type="button"
            className="h-[52px] w-full touch-manipulation rounded-[16px] bg-sai-primary text-[16px] font-semibold text-white shadow-[0_10px_28px_rgba(133,118,255,0.28)] transition-transform active:scale-[0.99]"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            className="flex h-11 w-full touch-manipulation items-center justify-center gap-1.5 rounded-[14px] text-[14px] font-medium text-sai-text-secondary transition-colors hover:bg-[#F7F6FA] active:scale-[0.99]"
          >
            <LogOut className="size-4 opacity-70" strokeWidth={2} />
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
