import {
  Archive,
  Gamepad2,
  Home,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

export type AppTab = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const APP_TABS: AppTab[] = [
  { href: "/home", label: "홈", icon: Home },
  { href: "/games", label: "게임", icon: Gamepad2 },
  { href: "/together", label: "둘이하기", icon: Users },
  { href: "/archive", label: "보관함", icon: Archive },
  { href: "/my", label: "마이", icon: UserRound },
];

export function isAppTabPath(pathname: string): boolean {
  return APP_TABS.some((tab) => pathname === tab.href);
}
