import { memoryCoupleRepository } from "./memory-store";
import {
  isSupabaseCoupleStoreConfigured,
  supabaseCoupleRepository,
} from "./supabase-repository";
import type { CoupleRepository } from "./repository-types";

function resolveCoupleRepository(): CoupleRepository {
  const source = process.env.NEXT_PUBLIC_COUPLE_STORE ?? "memory";

  if (source === "supabase" && isSupabaseCoupleStoreConfigured()) {
    return supabaseCoupleRepository;
  }

  return memoryCoupleRepository;
}

let repository: CoupleRepository = resolveCoupleRepository();

export function getCoupleRepository(): CoupleRepository {
  return repository;
}

export function setCoupleRepository(next: CoupleRepository): void {
  repository = next;
}

export { memoryCoupleRepository, supabaseCoupleRepository };
