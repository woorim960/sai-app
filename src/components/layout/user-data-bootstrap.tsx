"use client";

import { useEffect } from "react";
import {
  ensureDailyQuestionNotification,
  ensureWelcomeNotification,
} from "@/lib/user-data";

/** 앱 최초 진입 시 환영 알림 + 하루 1회 데일리 질문 알림 등록 */
export function UserDataBootstrap() {
  useEffect(() => {
    ensureWelcomeNotification();
    ensureDailyQuestionNotification();
  }, []);

  return null;
}
