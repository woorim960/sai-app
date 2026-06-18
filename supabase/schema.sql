-- 사이 (SAI) Supabase schema
-- Run in Supabase SQL Editor, then seed with scripts/seed-supabase or import mock data.

create table if not exists situations (
  id text primary key,
  emoji text not null,
  name text not null,
  subtitle text not null,
  description text not null,
  sort_order int not null
);

create table if not exists decks (
  id text primary key,
  situation_id text not null references situations(id) on delete cascade,
  title text not null,
  description text not null,
  estimated_minutes int not null,
  mood_level text not null,
  card_count int not null,
  is_premium boolean not null default false,
  sort_order int not null
);

create table if not exists cards (
  id text primary key,
  deck_id text not null references decks(id) on delete cascade,
  phase text not null check (phase in ('ice_breaking', 'taste', 'value', 'closing')),
  type text not null check (type in ('balance', 'question')),
  question text not null,
  option_a text,
  option_b text,
  helper_text text not null,
  sort_order int not null
);

create index if not exists idx_decks_situation on decks(situation_id, sort_order);
create index if not exists idx_cards_deck on cards(deck_id, sort_order);

alter table situations enable row level security;
alter table decks enable row level security;
alter table cards enable row level security;

create policy "Public read situations" on situations for select using (true);
create policy "Public read decks" on decks for select using (true);
create policy "Public read cards" on cards for select using (true);

-- Multiplayer groups (optional — MVP uses in-memory store; enable for production)
create table if not exists play_groups (
  id text primary key,
  deck_id text not null references decks(id) on delete cascade,
  mode text not null check (mode in ('async', 'sync')),
  host_client_id text not null,
  status text not null default 'waiting',
  current_card_index int not null default 0,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days'),
  started_at timestamptz,
  finished_at timestamptz
);

create table if not exists play_group_participants (
  id uuid primary key default gen_random_uuid(),
  group_id text not null references play_groups(id) on delete cascade,
  client_id text not null,
  display_name text not null,
  status text not null default 'playing',
  progress_index int not null default 0,
  joined_at timestamptz not null default now(),
  completed_at timestamptz,
  unique(group_id, client_id)
);

create table if not exists play_group_answers (
  group_id text not null references play_groups(id) on delete cascade,
  client_id text not null,
  card_id text not null,
  card_type text not null,
  selected_option text,
  selected_label text,
  answer_text text,
  answered_at timestamptz not null default now(),
  primary key (group_id, client_id, card_id)
);

create index if not exists idx_play_groups_expires on play_groups(expires_at);
create index if not exists idx_play_group_participants_group on play_group_participants(group_id);
create index if not exists idx_play_group_answers_group on play_group_answers(group_id);

alter table play_groups enable row level security;
alter table play_group_participants enable row level security;
alter table play_group_answers enable row level security;

-- Server-side API uses service role; anon client reads blocked by default.
-- Enable read-only public preview of group metadata if needed later.
create policy "Deny anon play_groups" on play_groups for all using (false);
create policy "Deny anon play_group_participants" on play_group_participants for all using (false);
create policy "Deny anon play_group_answers" on play_group_answers for all using (false);

-- Couples (partner pairing for 둘이하기 — persistent "우리" unit)
-- Set NEXT_PUBLIC_COUPLE_STORE=supabase to enable.
create table if not exists couples (
  id text primary key,
  invite_code text not null unique,
  couple_name text,
  anniversary text,
  created_at timestamptz not null default now()
);

create table if not exists couple_members (
  id uuid primary key default gen_random_uuid(),
  couple_id text not null references couples(id) on delete cascade,
  client_id text not null,
  display_name text not null,
  emoji text not null default '🐧',
  token text not null,
  joined_at timestamptz not null default now(),
  unique(couple_id, client_id)
);

create table if not exists couple_records (
  id text primary key,
  couple_id text not null references couples(id) on delete cascade,
  deck_id text not null,
  deck_title text not null,
  mode text not null,
  minutes int not null default 0,
  score int,
  note text,
  by_client_id text not null,
  completed_at timestamptz not null default now()
);

create index if not exists idx_couples_invite on couples(invite_code);
create index if not exists idx_couple_members_couple on couple_members(couple_id);
create index if not exists idx_couple_records_couple on couple_records(couple_id, completed_at desc);

alter table couples enable row level security;
alter table couple_members enable row level security;
alter table couple_records enable row level security;

-- Server-side API uses service role; member tokens must never reach anon clients.
create policy "Deny anon couples" on couples for all using (false);
create policy "Deny anon couple_members" on couple_members for all using (false);
create policy "Deny anon couple_records" on couple_records for all using (false);
