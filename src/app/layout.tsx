import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { GameplayInteractionBridge } from "@/components/gameplay/gameplay-interaction-bridge";
import { AppBootstrap } from "@/components/layout/app-bootstrap";
import { OnboardingCookieSync } from "@/components/layout/onboarding-cookie-sync";
import { RouteHistoryTracker } from "@/components/layout/route-history-tracker";
import { UserDataBootstrap } from "@/components/layout/user-data-bootstrap";
import { ServiceWorkerRegister } from "@/components/layout/service-worker-register";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sai.app";
const description =
  "더 가까워지고 싶은 사람과 함께 게임하고 대화하며 자연스럽게 알아가세요.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "사이 | SAI",
    template: "%s | 사이",
  },
  description,
  applicationName: "사이",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "사이 | SAI",
    title: "사이 | SAI",
    description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "사이 SAI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "사이 | SAI",
    description,
    images: ["/opengraph-image"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "사이",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FAF8F5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} h-full overflow-hidden`}>
      <body className="h-full overflow-hidden">
        <AppBootstrap />
        <GameplayInteractionBridge />
        <OnboardingCookieSync />
        <RouteHistoryTracker />
        <UserDataBootstrap />
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
