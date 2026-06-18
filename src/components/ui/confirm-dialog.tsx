"use client";

import { useLayoutEffect, useRef } from "react";
import { bindNativeTap } from "@/lib/ui/native-tap";
import { cn } from "@/lib/utils";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "나가기",
  cancelLabel = "취소",
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-6 sm:items-center"
      role="presentation"
    >
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className={cn(
          "w-full max-w-[360px] rounded-[24px] bg-sai-surface p-6 shadow-[0_8px_40px_rgba(30,30,30,0.12)]",
          "page-enter"
        )}
      >
        <h2
          id="confirm-dialog-title"
          className="text-[18px] font-semibold text-sai-text"
        >
          {title}
        </h2>
        <p
          id="confirm-dialog-description"
          className="mt-2 text-[15px] leading-relaxed text-sai-text-secondary"
        >
          {message}
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <button
            ref={confirmRef}
            type="button"
            className="h-12 touch-manipulation rounded-[14px] bg-sai-primary text-[15px] font-medium text-white transition-colors hover:bg-sai-primary/90"
          >
            {confirmLabel}
          </button>
          <button
            ref={cancelRef}
            type="button"
            className="h-12 touch-manipulation rounded-[14px] text-[15px] font-medium text-sai-text-secondary transition-colors hover:bg-accent"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
