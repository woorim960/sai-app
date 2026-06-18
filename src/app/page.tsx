import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SplashRedirect } from "@/components/layout/splash-redirect";
import { SplashScreen } from "@/components/splash/splash-screen";
import { ONBOARDING_COOKIE } from "@/lib/cookies";

export default async function SplashPage() {
  const cookieStore = await cookies();
  if (cookieStore.get(ONBOARDING_COOKIE)?.value === "true") {
    redirect("/home");
  }

  return (
    <>
      <SplashRedirect />
      <SplashScreen />
      <noscript>
        <div className="mobile-frame fixed inset-x-0 bottom-10 z-50 mx-auto">
          <div className="mobile-content">
            <Link
              href="/onboarding"
              className="flex h-14 w-full items-center justify-center rounded-[18px] bg-[#8576FF] text-[16px] font-semibold text-white"
            >
              시작하기
            </Link>
          </div>
        </div>
      </noscript>
    </>
  );
}
