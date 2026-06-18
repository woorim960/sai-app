import { memoryGroupRepository } from "./memory-store";
import {
  isSupabaseGroupStoreConfigured,
  supabaseGroupRepository,
} from "./supabase-repository";
import type { GroupRepository } from "./repository-types";

function resolveGroupRepository(): GroupRepository {
  const source = process.env.NEXT_PUBLIC_GROUP_STORE ?? "memory";

  if (source === "supabase" && isSupabaseGroupStoreConfigured()) {
    return supabaseGroupRepository;
  }

  return memoryGroupRepository;
}

let repository: GroupRepository = resolveGroupRepository();

export function getGroupRepository(): GroupRepository {
  return repository;
}

export function setGroupRepository(next: GroupRepository): void {
  repository = next;
}

export { memoryGroupRepository, supabaseGroupRepository };
