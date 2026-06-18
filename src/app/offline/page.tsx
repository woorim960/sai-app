import { RouteFallback } from "@/components/layout/route-fallback";

export default function OfflinePage() {
  return (
    <RouteFallback
      title="오프라인 상태예요"
      description="인터넷 연결을 확인한 뒤\n다시 시도해주세요."
      primaryHref="/home"
      primaryLabel="홈으로"
    />
  );
}
