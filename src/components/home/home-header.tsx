import { NotificationBell } from "@/components/home/notification-bell";
import { APP_NAME } from "@/lib/constants";

export function HomeHeader() {
  return (
    <header className="app-screen-header flex items-center justify-between px-5">
      <h1 className="text-[30px] font-bold leading-none tracking-[-0.04em] text-sai-text">
        {APP_NAME.slice(0, 1)}
        <span className="relative inline-block">
          {APP_NAME.slice(1, 2)}
          <span
            aria-hidden
            className="absolute -right-2 -top-1 text-[10px] text-sai-primary"
          >
            ♥
          </span>
        </span>
        {APP_NAME.slice(2)}
      </h1>
      <NotificationBell />
    </header>
  );
}
