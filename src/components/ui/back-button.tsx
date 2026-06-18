"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  getPreviousNavigationPath,
  replaceNavigationTop,
} from "@/lib/navigation/history";
import { bindNativeTap } from "@/lib/ui/native-tap";
import { cn } from "@/lib/utils";

type BackButtonProps = {
  href?: string;
  className?: string;
  confirmMessage?: string;
  onConfirmBack?: () => void;
  preferHref?: boolean;
};

export function BackButton({
  href,
  className,
  confirmMessage,
  onConfirmBack,
  preferHref = false,
}: BackButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const onConfirmBackRef = useRef(onConfirmBack);
  const hrefRef = useRef(href);
  const preferHrefRef = useRef(preferHref);
  const confirmMessageRef = useRef(confirmMessage);
  const [confirmOpen, setConfirmOpen] = useState(false);
  onConfirmBackRef.current = onConfirmBack;
  hrefRef.current = href;
  preferHrefRef.current = preferHref;
  confirmMessageRef.current = confirmMessage;

  const navigateBack = () => {
    onConfirmBackRef.current?.();

    const targetHref = hrefRef.current;
    if (preferHrefRef.current && targetHref) {
      replaceNavigationTop(targetHref);
      window.location.replace(targetHref);
      return;
    }

    const previousPath = getPreviousNavigationPath();
    if (previousPath) {
      window.location.assign(previousPath);
      return;
    }

    const target = targetHref ?? "/home";
    replaceNavigationTop(target);
    window.location.assign(target);
  };

  useLayoutEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    return bindNativeTap(button, () => {
      if (confirmMessageRef.current) {
        setConfirmOpen(true);
        return;
      }
      navigateBack();
    });
  });

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="뒤로가기"
        className={cn(
          "flex size-10 items-center justify-center rounded-full transition-colors hover:bg-black/[0.04] active:scale-95 touch-manipulation",
          className
        )}
      >
        <ChevronLeft className="size-5 text-sai-text" strokeWidth={1.75} />
      </button>

      {confirmMessage && (
        <ConfirmDialog
          open={confirmOpen}
          title="나가시겠어요?"
          message={confirmMessage}
          confirmLabel="나가기"
          cancelLabel="계속하기"
          onConfirm={() => {
            setConfirmOpen(false);
            navigateBack();
          }}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </>
  );
}
