"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
  getNotificationPermission,
  requestNotificationPermission,
  showLocalNotification,
  type PermissionState,
} from "@/lib/notifications/push";

export function NotificationOptIn() {
  const [permission, setPermission] = useState<PermissionState>("unsupported");

  useEffect(() => {
    setPermission(getNotificationPermission());
    const handler = () => setPermission(getNotificationPermission());
    window.addEventListener("sai-notification-permission-changed", handler);
    return () =>
      window.removeEventListener(
        "sai-notification-permission-changed",
        handler
      );
  }, []);

  // 권한이 이미 정해졌거나(허용/거부) 미지원이면 노출하지 않음
  if (permission !== "default") return null;

  const handleEnable = async () => {
    const result = await requestNotificationPermission();
    if (result === "granted") {
      void showLocalNotification("알림이 켜졌어요 🔔", {
        body: "오늘의 질문과 기념일 소식을 알려드릴게요.",
        url: "/together",
        tag: "sai-opt-in",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleEnable()}
      className="flex w-full items-center gap-3.5 rounded-[18px] border border-[#E8E2FB] bg-white p-4 text-left shadow-[0_3px_14px_rgba(45,49,66,0.05)] transition-all active:scale-[0.99]"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-accent text-sai-primary">
        <Bell className="size-5" strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14.5px] font-bold text-sai-text">알림 받기</p>
        <p className="mt-0.5 text-[12.5px] text-sai-text-secondary">
          오늘의 질문·기념일 소식을 놓치지 마세요
        </p>
      </div>
      <span className="shrink-0 rounded-full bg-sai-primary px-3.5 py-1.5 text-[12px] font-bold text-white">
        켜기
      </span>
    </button>
  );
}
