import { mockRepository } from "./repository";
import { supabaseRepository } from "./supabase-repository";
import type { DataRepository } from "./types";
import { isSupabaseConfigured } from "@/lib/supabase/client";

function resolveRepository(): DataRepository {
  const source = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "mock";

  if (source === "supabase" && isSupabaseConfigured()) {
    return supabaseRepository;
  }

  return mockRepository;
}

let repository: DataRepository = resolveRepository();

export function getRepository(): DataRepository {
  return repository;
}

export function setRepository(next: DataRepository): void {
  repository = next;
}

export { mockRepository, supabaseRepository };
