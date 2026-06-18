"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_TABS } from "@/lib/navigation/tabs";
import { cn } from "@/lib/utils";

function isTabActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href === "/together" && pathname.startsWith("/together")) return true;
  if (href === "/games" && pathname.startsWith("/games")) return true;
  return false;
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="하단 메뉴"
      className="z-40 shrink-0 border-t border-[#EBEBEF] bg-white/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex w-full items-stretch px-1 pt-1">
        {APP_TABS.map((tab) => {
          const active = isTabActive(pathname, tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-semibold transition-colors",
                active ? "text-sai-primary" : "text-[#A0A0A8]"
              )}
            >
              <Icon
                className={cn("size-[22px]", active && "stroke-[2.4]")}
                strokeWidth={active ? 2.4 : 2}
              />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
