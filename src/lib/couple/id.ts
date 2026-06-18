import { randomBytes } from "crypto";

const ID_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
// 사람이 읽기 쉬운 초대 코드(혼동되는 0/O/1/I 제외)
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomString(alphabet: string, length: number): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += alphabet[bytes[i]! % alphabet.length];
  }
  return out;
}

export function generateCoupleId(length = 12): string {
  return randomString(ID_ALPHABET, length);
}

export function generateInviteCode(length = 6): string {
  return randomString(CODE_ALPHABET, length);
}

export function generateMemberToken(length = 28): string {
  return randomString(ID_ALPHABET, length);
}
