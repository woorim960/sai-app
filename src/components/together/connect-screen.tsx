"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, HeartHandshake, Share2, Unlink } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { BackButton } from "@/components/ui/back-button";
import { Toast } from "@/components/ui/toast";
import { getDefaultDisplayName, setDisplayName } from "@/lib/client-id";
import {
  createCoupleRequest,
  joinCoupleRequest,
  updateCoupleProfileRequest,
} from "@/lib/couple/api-client";
import { clearCoupleSession } from "@/lib/couple/session-storage";
import { useCouple } from "@/lib/couple/use-couple";
import { cn } from "@/lib/utils";

const EMOJIS = ["🐧", "🐤", "🐰", "🐱", "🐶", "🦊", "🐻", "🐯"];

export function ConnectScreen() {
  const router = useRouter();
  const { state, paired, hasCouple, refresh } = useCouple();

  const [mode, setMode] = useState<"create" | "join">("create");
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(EMOJIS[0]!);
  const [coupleName, setCoupleName] = useState("");
  const [anniversary, setAnniversary] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setName(getDefaultDisplayName());
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      setInviteCode(code.toUpperCase());
      setMode("join");
      setEmoji(EMOJIS[1]!);
    }
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 1800);
  };

  const inviteLink = state
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/together/connect?code=${state.couple.inviteCode}`
    : "";

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label}를 복사했어요`);
    } catch {
      showToast("복사에 실패했어요");
    }
  };

  const handleShare = async () => {
    if (!state) return;
    const text = `우리 같이 사이에서 놀자! 초대 코드: ${state.couple.inviteCode}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "사이 - 둘이하기", text, url: inviteLink });
      } catch {
        /* 사용자가 취소함 */
      }
      return;
    }
    await handleCopy(inviteLink, "초대 링크");
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("이름을 입력해주세요");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setDisplayName(name);
      await createCoupleRequest({
        displayName: name.trim(),
        emoji,
        coupleName: coupleName.trim() || undefined,
        anniversary: anniversary || undefined,
      });
      await refresh();
      showToast("커플 공간을 만들었어요");
    } catch {
      setError("연결에 실패했어요. 다시 시도해주세요");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!name.trim()) {
      setError("이름을 입력해주세요");
      return;
    }
    if (!inviteCode.trim()) {
      setError("초대 코드를 입력해주세요");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setDisplayName(name);
      await joinCoupleRequest({
        inviteCode: inviteCode.trim().toUpperCase(),
        displayName: name.trim(),
        emoji,
      });
      await refresh();
      showToast("연결되었어요!");
      router.replace("/together");
    } catch (err) {
      setError(err instanceof Error ? err.message : "연결에 실패했어요");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAnniversary = async (value: string) => {
    if (!state) return;
    try {
      await updateCoupleProfileRequest({
        coupleId: state.couple.id,
        anniversary: value,
      });
      await refresh();
      showToast("기념일을 저장했어요");
    } catch {
      showToast("저장에 실패했어요");
    }
  };

  const handleDisconnect = () => {
    clearCoupleSession();
    setMode("create");
    showToast("연결을 해제했어요");
  };

  return (
    <MobileShell className="bg-[#FAFAFC]">
      <div className="app-viewport-scroll h-full min-h-0 px-5 pb-12 safe-pt safe-pb">
        <div className="relative flex h-10 items-center justify-center">
          <div className="absolute left-0">
            <BackButton href="/together" />
          </div>
          <p className="text-[16px] font-bold text-sai-text">커플 연결</p>
        </div>

        {/* 이미 연결/대기 중인 경우: 공유 화면 */}
        {hasCouple && state ? (
          <div className="mt-8">
            <div className="rounded-[24px] bg-gradient-to-br from-[#7B6CF6] to-[#B6A9FF] p-6 text-center text-white shadow-[0_14px_34px_rgba(118,99,234,0.32)]">
              <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-white/20 text-[32px]">
                {paired ? "💞" : "🔗"}
              </span>
              <h2 className="mt-4 text-[19px] font-bold">
                {paired ? "연결 완료!" : "파트너를 기다리고 있어요"}
              </h2>
              <p className="mt-1.5 text-[13px] text-white/85">
                {paired
                  ? "이제 둘의 기록이 함께 쌓여요"
                  : "아래 코드나 링크를 파트너에게 보내주세요"}
              </p>

              {!paired && (
                <div className="mt-5 rounded-[16px] bg-white/15 px-4 py-3.5 backdrop-blur-sm">
                  <p className="text-[11px] text-white/75">초대 코드</p>
                  <p className="mt-0.5 text-[28px] font-extrabold tracking-[0.18em]">
                    {state.couple.inviteCode}
                  </p>
                </div>
              )}
            </div>

            {!paired && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleCopy(state.couple.inviteCode, "초대 코드")}
                  className="flex items-center justify-center gap-2 rounded-[16px] border border-[#E5E1FA] bg-white py-3.5 text-[14px] font-bold text-sai-text active:scale-[0.98]"
                >
                  <Copy className="size-4" strokeWidth={2.2} />
                  코드 복사
                </button>
                <button
                  type="button"
                  onClick={() => void handleShare()}
                  className="flex items-center justify-center gap-2 rounded-[16px] bg-sai-primary py-3.5 text-[14px] font-bold text-white active:scale-[0.98]"
                >
                  <Share2 className="size-4" strokeWidth={2.2} />
                  링크 공유
                </button>
              </div>
            )}

            <div className="mt-6 rounded-[18px] border border-[#EEEDF4] bg-white p-4">
              <p className="text-[13px] font-bold text-sai-text">연결된 멤버</p>
              <div className="mt-3 space-y-2.5">
                {state.members.map((member) => (
                  <div key={member.clientId} className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-accent text-[18px]">
                      {member.emoji}
                    </span>
                    <span className="text-[14px] font-medium text-sai-text">
                      {member.displayName}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-[18px] border border-[#EEEDF4] bg-white p-4">
              <p className="text-[13px] font-bold text-sai-text">처음 만난 날</p>
              <p className="mt-0.5 text-[12px] text-sai-text-secondary">
                기념일을 설정하면 함께한 일수가 표시돼요
              </p>
              <input
                type="date"
                defaultValue={state.couple.anniversary ?? ""}
                onChange={(e) => void handleSaveAnniversary(e.target.value)}
                className="mt-3 w-full rounded-[14px] border border-[#E5E1FA] bg-white px-4 py-3 text-[15px] outline-none focus:border-sai-primary"
              />
            </div>

            <button
              type="button"
              onClick={handleDisconnect}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-[16px] py-3 text-[13px] font-semibold text-sai-text-secondary active:scale-[0.99]"
            >
              <Unlink className="size-4" strokeWidth={2} />
              연결 해제
            </button>
          </div>
        ) : (
          /* 미연결: 만들기 / 참여하기 */
          <div className="mt-8">
            <div className="flex items-center gap-3">
              <span className="flex size-14 items-center justify-center rounded-[18px] bg-sai-primary text-white">
                <HeartHandshake className="size-7" strokeWidth={2} />
              </span>
              <div>
                <h2 className="text-[19px] font-bold text-sai-text">
                  파트너와 연결하기
                </h2>
                <p className="text-[13px] text-sai-text-secondary">
                  둘의 기록·궁합을 함께 쌓아보세요
                </p>
                <p className="mt-1 text-[12px] text-sai-text-secondary/80">
                  게임 초대 링크와는 달라요 · 한 번 연결하면 계속 유지돼요
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-2 rounded-full bg-[#F1F0F6] p-1">
              <TabButton
                active={mode === "create"}
                onClick={() => setMode("create")}
              >
                새로 만들기
              </TabButton>
              <TabButton active={mode === "join"} onClick={() => setMode("join")}>
                코드로 참여
              </TabButton>
            </div>

            <div className="mt-6 space-y-5">
              <Field label="내 이름">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  maxLength={12}
                  className="w-full rounded-[14px] border border-[#E5E1FA] bg-white px-4 py-3 text-[15px] outline-none focus:border-sai-primary"
                />
              </Field>

              <Field label="내 캐릭터">
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setEmoji(item)}
                      className={cn(
                        "flex size-11 items-center justify-center rounded-full text-[22px] transition-all",
                        emoji === item
                          ? "bg-sai-primary/15 ring-2 ring-sai-primary"
                          : "bg-white ring-1 ring-[#EEEDF4]"
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </Field>

              {mode === "create" ? (
                <>
                  <Field label="우리 이름 (선택)">
                    <input
                      value={coupleName}
                      onChange={(e) => setCoupleName(e.target.value)}
                      placeholder="예) 콩떡커플"
                      maxLength={16}
                      className="w-full rounded-[14px] border border-[#E5E1FA] bg-white px-4 py-3 text-[15px] outline-none focus:border-sai-primary"
                    />
                  </Field>
                  <Field label="처음 만난 날 (선택)">
                    <input
                      type="date"
                      value={anniversary}
                      onChange={(e) => setAnniversary(e.target.value)}
                      className="w-full rounded-[14px] border border-[#E5E1FA] bg-white px-4 py-3 text-[15px] outline-none focus:border-sai-primary"
                    />
                  </Field>
                </>
              ) : (
                <Field label="초대 코드">
                  <input
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    placeholder="6자리 코드"
                    maxLength={6}
                    className="w-full rounded-[14px] border border-[#E5E1FA] bg-white px-4 py-3 text-[18px] font-bold tracking-[0.2em] outline-none focus:border-sai-primary"
                  />
                </Field>
              )}

              {error && (
                <p className="text-[13px] font-medium text-[#E5484D]">{error}</p>
              )}

              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  mode === "create" ? void handleCreate() : void handleJoin()
                }
                className="flex w-full items-center justify-center gap-2 rounded-[16px] bg-sai-primary py-4 text-[15px] font-bold text-white shadow-[0_8px_22px_rgba(145,129,244,0.32)] transition-all active:scale-[0.99] disabled:opacity-60"
              >
                {loading ? (
                  "처리 중..."
                ) : mode === "create" ? (
                  <>
                    <Check className="size-5" strokeWidth={2.4} />
                    커플 공간 만들기
                  </>
                ) : (
                  <>
                    <HeartHandshake className="size-5" strokeWidth={2.2} />
                    연결하기
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <Toast message={toast ?? ""} visible={toast !== null} />
    </MobileShell>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 rounded-full py-2.5 text-[14px] font-bold transition-all",
        active
          ? "bg-white text-sai-primary shadow-[0_2px_8px_rgba(45,49,66,0.08)]"
          : "text-sai-text-secondary"
      )}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-semibold text-sai-text">
        {label}
      </label>
      {children}
    </div>
  );
}
