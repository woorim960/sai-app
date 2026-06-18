export type PermissionState = NotificationPermission | "unsupported";

export function notificationsSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getNotificationPermission(): PermissionState {
  if (!notificationsSupported()) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<PermissionState> {
  if (!notificationsSupported()) return "unsupported";
  try {
    const result = await Notification.requestPermission();
    window.dispatchEvent(new Event("sai-notification-permission-changed"));
    return result;
  } catch {
    return "denied";
  }
}

type LocalNotificationOptions = {
  body?: string;
  url?: string;
  tag?: string;
};

/**
 * OS 레벨 알림을 띄운다. 서비스워커가 등록돼 있으면 SW를 통해(클릭 라우팅 지원),
 * 없으면 페이지 컨텍스트의 Notification으로 폴백한다.
 */
export async function showLocalNotification(
  title: string,
  options: LocalNotificationOptions = {}
): Promise<void> {
  if (!notificationsSupported()) return;
  if (Notification.permission !== "granted") return;

  const payload: NotificationOptions & { data?: unknown } = {
    body: options.body,
    icon: "/icon.svg",
    badge: "/icon.svg",
    tag: options.tag,
    data: { url: options.url ?? "/" },
  };

  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.showNotification(title, payload);
        return;
      }
    } catch {
      /* SW 사용 불가 시 폴백 */
    }
  }

  try {
    new Notification(title, payload);
  } catch {
    /* 폴백 실패는 무시 */
  }
}
