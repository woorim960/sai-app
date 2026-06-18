"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/user-data";
import {
  useNotifications,
  useUnreadNotificationCount,
} from "@/lib/hooks/use-user-data";
import { cn } from "@/lib/utils";

type NotificationBellProps = {
  className?: string;
};

function NotificationEmptyState({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-accent/50">
        <Bell className="size-5 text-sai-text-secondary" strokeWidth={1.75} />
      </div>
      <p className="text-[14px] font-semibold text-sai-text">새 알림이 없어요</p>
      <p className="mt-1.5 max-w-[220px] text-[12px] leading-relaxed text-sai-text-secondary">
        데일리 질문이나 함께하기 초대가 오면 여기에 표시돼요.
      </p>
      <Link
        href="/games"
        className="mt-5 rounded-full bg-sai-primary/10 px-4 py-2 text-[13px] font-semibold text-sai-primary touch-manipulation transition-colors active:bg-sai-primary/15"
        onClick={onNavigate}
      >
        게임 둘러보기
      </Link>
    </div>
  );
}

export function NotificationBell({ className }: NotificationBellProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const unreadCount = useUnreadNotificationCount();
  const notifications = useNotifications();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const closePanel = () => setOpen(false);
  const displayCount = mounted ? unreadCount : 0;
  const displayNotifications = mounted ? notifications : [];

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        aria-label="알림"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "relative flex size-10 items-center justify-center rounded-full bg-sai-surface shadow-[0_2px_12px_rgba(45,49,66,0.08)] transition-[transform,box-shadow] active:scale-95 touch-manipulation",
          open
            ? "bg-accent/60 shadow-[0_4px_16px_rgba(145,129,244,0.18)]"
            : "hover:bg-accent/30"
        )}
      >
        <Bell className="size-[18px] text-sai-text" />
        {displayCount > 0 && (
          <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500 ring-2 ring-sai-surface" />
        )}
      </button>

      {open && (
        <button
          type="button"
          aria-label="알림 닫기"
          className="fixed inset-0 z-40 bg-black/25 animate-in fade-in duration-200"
          onClick={closePanel}
        />
      )}

      <div
        role="dialog"
        aria-label="알림"
        aria-modal="true"
        className={cn(
          "fixed z-50 w-[min(320px,calc(100vw-2.5rem))] overflow-hidden rounded-[20px] border border-border/60 bg-sai-surface shadow-[0_16px_48px_rgba(45,49,66,0.18)] transition-all duration-200",
          "right-[max(1.25rem,env(safe-area-inset-right))]",
          "top-[var(--app-header-height)]",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        )}
      >
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
          <p className="text-[15px] font-bold text-sai-text">알림</p>
          <div className="flex items-center gap-3">
            {displayCount > 0 && (
              <button
                type="button"
                onClick={() => markAllNotificationsRead()}
                className="touch-manipulation text-[12px] font-medium text-sai-primary"
              >
                모두 읽음
              </button>
            )}
            <button
              type="button"
              aria-label="닫기"
              onClick={closePanel}
              className="flex size-7 items-center justify-center rounded-full text-sai-text-secondary transition-colors hover:bg-accent/50 touch-manipulation"
            >
              <span className="text-[18px] leading-none">×</span>
            </button>
          </div>
        </div>

        <div className="max-h-[min(360px,50dvh)] overflow-y-auto">
          {displayNotifications.length === 0 ? (
            <NotificationEmptyState onNavigate={closePanel} />
          ) : (
            displayNotifications.map((item) => {
              const content = (
                <>
                  <p className="text-[14px] font-semibold text-sai-text">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[12px] leading-relaxed text-sai-text-secondary">
                    {item.body}
                  </p>
                </>
              );

              const itemClassName = cn(
                "block w-full px-4 py-3 text-left transition-colors hover:bg-accent/50 touch-manipulation",
                !item.read && "bg-accent/30"
              );

              if (item.href) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={itemClassName}
                    onClick={() => {
                      markNotificationRead(item.id);
                      closePanel();
                    }}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  className={itemClassName}
                  onClick={() => markNotificationRead(item.id)}
                >
                  {content}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
