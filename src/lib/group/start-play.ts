"use client";

import {
  getClientId,
  getDefaultDisplayName,
  setClientId,
} from "@/lib/client-id";
import { createGroupRequest } from "@/lib/group/api-client";
import type { GroupMode } from "@/lib/group/types";
import { getGroupSessionToken } from "@/lib/group/session-storage";

export async function startPlayFromDeck(
  deckId: string,
  mode: GroupMode
): Promise<void> {
  const clientId = getClientId();
  setClientId(clientId);

  const state = await createGroupRequest({
    deckId,
    mode,
    clientId,
    displayName: getDefaultDisplayName(),
  });

  const groupId = state.group.id;
  const sessionToken = getGroupSessionToken(groupId);
  const bootstrap = new URLSearchParams({ sid: clientId });
  if (sessionToken) {
    bootstrap.set("st", sessionToken);
  }

  const target =
    mode === "async"
      ? `/group/${groupId}/play?${bootstrap.toString()}`
      : `/room/${groupId}?${bootstrap.toString()}`;

  window.location.assign(target);
}
