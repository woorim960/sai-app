"use client";

import { useEffect, useState } from "react";
import { Share2 } from "lucide-react";
import { shareContent } from "@/lib/result-data";
import { Toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type GroupShareButtonProps = {
  groupId: string;
  deckTitle: string;
  className?: string;
  compact?: boolean;
  variant?: "invite" | "share" | "lobby";
  onShareSuccess?: () => void;
};

export function GroupShareButton({
  groupId,
  deckTitle,
  className,
  compact,
  variant = "invite",
  onShareSuccess,
}: GroupShareButtonProps) {
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/invite/${groupId}`
      : `/invite/${groupId}`;

  const shareText =
    variant === "share"
      ? `'${deckTitle}' 함께하기 결과를 확인해보세요!`
      : variant === "lobby"
        ? `'${deckTitle}' 함께하기에 초대했어요. 링크로 들어와 같이 플레이해요!`
        : `'${deckTitle}' 덱에 초대했어요. 나도 플레이하고 선택을 비교해보세요!`;

  const buttonLabel =
    variant === "share"
      ? "결과 링크 공유하기"
      : variant === "lobby"
        ? "초대 링크 복사하기"
        : "친구 초대하고 비교하기";

  const hintText =
    variant === "lobby"
      ? "복사한 링크를 카톡·문자로 친구에게 보내주세요"
      : "친구가 플레이하면 더 많은 결과가 열려요";

  useEffect(() => {
    if (!toastMessage) return;
    setToastVisible(true);
    const timer = setTimeout(() => setToastVisible(false), 2400);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const showToast = (message: string) => {
    setToastMessage("");
    requestAnimationFrame(() => setToastMessage(message));
  };

  const handleShare = async () => {
    const shareData = {
      title: shareContent.title,
      text: shareText,
      url: inviteUrl,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        onShareSuccess?.();
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${inviteUrl}`);
      showToast(
        variant === "lobby"
          ? "링크 복사됐어요 · 친구에게 보내주세요"
          : "초대 링크가 복사되었어요."
      );
      onShareSuccess?.();
    } catch {
      showToast("링크 복사에 실패했어요.");
    }
  };

  return (
    <>
      <div className={cn("text-center", className)}>
        <button
          type="button"
          onClick={() => void handleShare()}
          className="flex w-full items-center justify-center gap-2 rounded-[18px] bg-sai-primary py-4 text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(118,99,234,0.28)] transition-transform hover:bg-sai-primary/90 active:scale-[0.98]"
        >
          <Share2 className="size-[18px]" strokeWidth={2.2} />
          {buttonLabel}
        </button>
        {!compact && (
          <p className="mt-2.5 text-[12px] text-sai-text-secondary">{hintText}</p>
        )}
      </div>
      <Toast message={toastMessage} visible={toastVisible} />
    </>
  );
}
