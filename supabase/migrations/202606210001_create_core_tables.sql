create extension if not exists pgcrypto with schema extensions;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'app_language'
      and n.nspname = 'public'
  ) then
    create type public.app_language as enum ('fr', 'wo');
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'appointment_type'
      and n.nspname = 'public'
  ) then
    create type public.appointment_type as enum ('medical', 'contraception', 'cycle', 'other');
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'notification_category'
      and n.nspname = 'public'
  ) then
    create type public.notification_category as enum (
      'cycles',
      'contraception',
      'articleOfDay',
      'dailyTip',
      'symptomLog',
      'orientation',
      'predictive'
    );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'notification_frequency'
      and n.nspname = 'public'
  ) then
    create type public.notification_frequency as enum ('daily', 'weekly', 'monthly');
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'orientation_level'
      and n.nspname = 'public'
  ) then
    create type public.orientation_level as enum ('surveillance', 'recommended', 'urgent');
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'sensitive_orientation_level'
      and n.nspname = 'public'
  ) then
    create type public.sensitive_orientation_level as enum (
      'surveillance',
      'recommended',
      'priority'
    );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'community_room_id'
      and n.nspname = 'public'
  ) then
    create type public.community_room_id as enum (
      'endometriose',
      'contraception',
      'maternite',
      'menopause',
      'intimite',
      'soutien'
    );
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  photo_url text,
  birthdate date,
  location text not null default '',
  personality text not null default '',
  marital_status text not null default '',
  children_count integer not null default 0 check (children_count >= 0),
  desire_children text not null default '',
  contraception_active boolean not null default false,
  contraception_method text not null default '',
  health_conditions text[] not null default '{}'::text[],
  religious_faith text not null default '',
  education_level text not null default '',
  hobbies text[] not null default '{}'::text[],
  about_me text not null default '',
  pregnancy_status text not null default '',
  pregnancy_weeks text not null default '',
  pregnancy_due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_preferences (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  selected_age text,
  selected_needs text[] not null default '{}'::text[],
  selected_goals text[] not null default '{}'::text[],
  life_situation text,
  discrete_mode boolean not null default false,
  oral_mode boolean not null default false,
  discrete_mode_manual boolean,
  is_onboarded boolean not null default false,
  has_consented boolean not null default false,
  has_completed_tutorial boolean not null default false,
  has_seen_welcome boolean not null default false,
  privacy_concern boolean not null default false,
  language public.app_language not null default 'fr',
  age_range text,
  living_context text,
  privacy_level text,
  social_norms text,
  context_education_level text,
  preferred_tone text,
  audio_preference text,
  needs_support boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_preferences_selected_age_check check (
    selected_age is null
    or selected_age = any (array['15-17', '18-24', '25-34', '35-49', '50+']::text[])
  ),
  constraint user_preferences_selected_goals_check check (
    selected_goals <@ array['cycle', 'grossesse', 'menopause', 'bienetre']::text[]
  ),
  constraint user_preferences_life_situation_check check (
    life_situation is null
    or life_situation = any (
      array[
        'curious',
        'cycles',
        'contraception',
        'pregnant',
        'trying',
        'postpartum',
        'menopause',
        'general',
        'prefer-not-say'
      ]::text[]
    )
  ),
  constraint user_preferences_age_range_check check (
    age_range is null
    or age_range = any (array['15-17', '18-24', '25-34', '35-49', '50+']::text[])
  ),
  constraint user_preferences_living_context_check check (
    living_context is null
    or living_context = any (
      array['alone', 'parents', 'partner', 'roommates', 'family']::text[]
    )
  ),
  constraint user_preferences_privacy_level_check check (
    privacy_level is null
    or privacy_level = any (array['low', 'medium', 'high', 'very-high']::text[])
  ),
  constraint user_preferences_social_norms_check check (
    social_norms is null
    or social_norms = any (array['conservative', 'moderate', 'open']::text[])
  ),
  constraint user_preferences_context_education_level_check check (
    context_education_level is null
    or context_education_level = any (array['basic', 'intermediate', 'advanced']::text[])
  ),
  constraint user_preferences_preferred_tone_check check (
    preferred_tone is null
    or preferred_tone = any (array['formal', 'friendly', 'sisterly']::text[])
  ),
  constraint user_preferences_audio_preference_check check (
    audio_preference is null
    or audio_preference = any (array['always', 'sometimes', 'never']::text[])
  )
);

create table public.article_favorites (
  user_id uuid not null references public.profiles (id) on delete cascade,
  article_id integer not null,
  created_at timestamptz not null default now(),
  primary key (user_id, article_id)
);

create table public.glossary_views (
  user_id uuid not null references public.profiles (id) on delete cascade,
  term text not null,
  view_count integer not null default 1 check (view_count >= 1),
  first_viewed_at timestamptz not null default now(),
  last_viewed_at timestamptz not null default now(),
  primary key (user_id, term)
);

create table public.quick_access_items (
  user_id uuid not null references public.profiles (id) on delete cascade,
  item_key text not null,
  position smallint not null check (position >= 0),
  created_at timestamptz not null default now(),
  primary key (user_id, item_key),
  unique (user_id, position),
  constraint quick_access_items_item_key_check check (
    item_key = any (
      array[
        'bibliotheque',
        'suivi',
        'carte',
        'about',
        'orientation',
        'orientation-sensible',
        'chat',
        'medecins',
        'journal',
        'faq',
        'glossaire',
        'urgence',
        'stats-sante',
        'calendrier',
        'mon-contexte'
      ]::text[]
    )
  )
);

create table public.cycle_data (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  last_period_date date,
  cycle_length integer not null default 0 check (cycle_length between 0 and 90),
  period_length integer not null default 0 check (period_length between 0 and 20),
  pill_tracking boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cycle_daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  log_date date not null,
  mood text,
  flow smallint check (flow between 0 and 3),
  notes text,
  is_period boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, log_date),
  unique (id, user_id)
);

create table public.cycle_symptom_logs (
  id uuid primary key default gen_random_uuid(),
  daily_log_id uuid not null,
  user_id uuid not null references public.profiles (id) on delete cascade,
  symptom_id text not null,
  intensity smallint not null check (intensity between 1 and 3),
  notes text,
  created_at timestamptz not null default now(),
  unique (daily_log_id, symptom_id),
  constraint cycle_symptom_logs_known_symptom_check check (
    symptom_id = any (
      array[
        'headache',
        'cramps',
        'breast-pain',
        'bloating',
        'mood-swings',
        'fatigue',
        'nausea',
        'back-pain',
        'acne',
        'cravings',
        'insomnia',
        'irritability'
      ]::text[]
    )
  ),
  constraint cycle_symptom_logs_daily_log_fkey foreign key (daily_log_id, user_id)
    references public.cycle_daily_logs (id, user_id)
    on delete cascade
);

create table public.cycle_pill_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  log_date date not null,
  taken boolean not null default true,
  taken_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, log_date)
);

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  entry_at timestamptz not null default now(),
  mood text not null default '',
  content text not null default '',
  tags text[] not null default '{}'::text[],
  photos text[] not null default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  date date not null,
  time time not null,
  title text not null,
  type public.appointment_type not null,
  location text,
  doctor text,
  notes text,
  reminder boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.feedback_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  type text not null,
  message text not null,
  rating smallint check (rating between 1 and 5),
  user_name text,
  photos text[] not null default '{}'::text[],
  created_at timestamptz not null default now(),
  constraint feedback_entries_message_not_blank_check check (btrim(message) <> '')
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  category public.notification_category not null,
  message text not null,
  metaphor text not null default '',
  is_read boolean not null default false,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  constraint notifications_message_not_blank_check check (btrim(message) <> '')
);

create table public.notification_preferences (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  cycles_enabled boolean not null default true,
  cycles_frequency public.notification_frequency not null default 'weekly',
  cycles_last_sent_at timestamptz,
  contraception_enabled boolean not null default true,
  contraception_frequency public.notification_frequency not null default 'monthly',
  contraception_last_sent_at timestamptz,
  article_of_day_enabled boolean not null default true,
  article_of_day_frequency public.notification_frequency not null default 'daily',
  article_of_day_last_sent_at timestamptz,
  daily_tip_enabled boolean not null default true,
  daily_tip_frequency public.notification_frequency not null default 'daily',
  daily_tip_last_sent_at timestamptz,
  symptom_log_enabled boolean not null default true,
  symptom_log_frequency public.notification_frequency not null default 'weekly',
  symptom_log_last_sent_at timestamptz,
  orientation_enabled boolean not null default true,
  orientation_frequency public.notification_frequency not null default 'monthly',
  orientation_last_sent_at timestamptz,
  predictive_enabled boolean not null default true,
  predictive_frequency public.notification_frequency not null default 'monthly',
  predictive_last_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orientation_sessions (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  current_step integer not null default 0 check (current_step >= 0),
  completed_at timestamptz,
  level public.orientation_level,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orientation_sessions_answers_object_check check (jsonb_typeof(answers) = 'object')
);

create table public.sensitive_orientation_sessions (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  level public.sensitive_orientation_level,
  risk_dimensions text[] not null default '{}'::text[],
  privacy_risk boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sensitive_orientation_sessions_answers_object_check check (
    jsonb_typeof(answers) = 'object'
  )
);

create table public.community_profiles (
  participant_key text primary key,
  user_id uuid unique references public.profiles (id) on delete set null,
  pseudonym text not null default '',
  share_age boolean not null default false,
  share_situation boolean not null default false,
  share_needs boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint community_profiles_participant_key_check check (
    char_length(participant_key) between 3 and 64
  ),
  constraint community_profiles_pseudonym_check check (
    char_length(pseudonym) <= 32
  )
);

create table public.community_room_memberships (
  room_id public.community_room_id not null,
  participant_key text not null references public.community_profiles (participant_key) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  user_name text not null,
  joined_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  primary key (room_id, participant_key),
  constraint community_room_memberships_user_name_check check (
    char_length(user_name) between 1 and 32
  )
);

create table public.community_messages (
  id uuid primary key default gen_random_uuid(),
  room_id public.community_room_id not null,
  participant_key text not null references public.community_profiles (participant_key) on delete restrict,
  user_id uuid references public.profiles (id) on delete set null,
  user_name text not null,
  text text not null,
  is_anonymous boolean not null default false,
  reactions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint community_messages_user_name_check check (
    char_length(user_name) between 1 and 32
  ),
  constraint community_messages_text_check check (
    char_length(text) between 1 and 1000
  ),
  constraint community_messages_reactions_object_check check (
    jsonb_typeof(reactions) = 'object'
  )
);

create table public.community_message_reports (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.community_messages (id) on delete cascade,
  reporter_key text not null references public.community_profiles (participant_key) on delete cascade,
  reporter_user_id uuid references public.profiles (id) on delete set null,
  reason text not null default 'inappropriate',
  created_at timestamptz not null default now(),
  unique (message_id, reporter_key)
);

create index article_favorites_user_id_created_at_idx
  on public.article_favorites (user_id, created_at desc);

create index quick_access_items_user_id_position_idx
  on public.quick_access_items (user_id, position);

create index cycle_daily_logs_user_id_log_date_idx
  on public.cycle_daily_logs (user_id, log_date desc);

create index cycle_symptom_logs_user_id_created_at_idx
  on public.cycle_symptom_logs (user_id, created_at desc);

create index cycle_pill_logs_user_id_log_date_idx
  on public.cycle_pill_logs (user_id, log_date desc);

create index journal_entries_user_id_entry_at_idx
  on public.journal_entries (user_id, entry_at desc);

create index appointments_user_id_date_time_idx
  on public.appointments (user_id, date, time);

create index feedback_entries_user_id_created_at_idx
  on public.feedback_entries (user_id, created_at desc);

create index notifications_user_id_created_at_idx
  on public.notifications (user_id, created_at desc);

create index notifications_user_id_is_read_idx
  on public.notifications (user_id, is_read, created_at desc);

create index community_room_memberships_room_id_last_seen_at_idx
  on public.community_room_memberships (room_id, last_seen_at desc);

create index community_messages_room_id_created_at_idx
  on public.community_messages (room_id, created_at desc);

create index community_messages_user_id_created_at_idx
  on public.community_messages (user_id, created_at desc);

create index community_message_reports_message_id_created_at_idx
  on public.community_message_reports (message_id, created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  next_name text;
begin
  next_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'first_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
    nullif(split_part(new.email, '@', 1), ''),
    'SaxalWer'
  );

  insert into public.profiles (id, name)
  values (new.id, next_name)
  on conflict (id) do nothing;

  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.cycle_data (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.notification_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.orientation_sessions (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.sensitive_orientation_sessions (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger user_preferences_set_updated_at
before update on public.user_preferences
for each row
execute function public.set_updated_at();

create trigger cycle_data_set_updated_at
before update on public.cycle_data
for each row
execute function public.set_updated_at();

create trigger cycle_daily_logs_set_updated_at
before update on public.cycle_daily_logs
for each row
execute function public.set_updated_at();

create trigger cycle_pill_logs_set_updated_at
before update on public.cycle_pill_logs
for each row
execute function public.set_updated_at();

create trigger journal_entries_set_updated_at
before update on public.journal_entries
for each row
execute function public.set_updated_at();

create trigger appointments_set_updated_at
before update on public.appointments
for each row
execute function public.set_updated_at();

create trigger notification_preferences_set_updated_at
before update on public.notification_preferences
for each row
execute function public.set_updated_at();

create trigger orientation_sessions_set_updated_at
before update on public.orientation_sessions
for each row
execute function public.set_updated_at();

create trigger sensitive_orientation_sessions_set_updated_at
before update on public.sensitive_orientation_sessions
for each row
execute function public.set_updated_at();

create trigger community_profiles_set_updated_at
before update on public.community_profiles
for each row
execute function public.set_updated_at();

create trigger community_messages_set_updated_at
before update on public.community_messages
for each row
execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.article_favorites enable row level security;
alter table public.glossary_views enable row level security;
alter table public.quick_access_items enable row level security;
alter table public.cycle_data enable row level security;
alter table public.cycle_daily_logs enable row level security;
alter table public.cycle_symptom_logs enable row level security;
alter table public.cycle_pill_logs enable row level security;
alter table public.journal_entries enable row level security;
alter table public.appointments enable row level security;
alter table public.feedback_entries enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.orientation_sessions enable row level security;
alter table public.sensitive_orientation_sessions enable row level security;
alter table public.community_profiles enable row level security;
alter table public.community_room_memberships enable row level security;
alter table public.community_messages enable row level security;
alter table public.community_message_reports enable row level security;

create policy "profiles_own_rows"
on public.profiles
for all
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "user_preferences_own_rows"
on public.user_preferences
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "article_favorites_own_rows"
on public.article_favorites
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "glossary_views_own_rows"
on public.glossary_views
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "quick_access_items_own_rows"
on public.quick_access_items
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "cycle_data_own_rows"
on public.cycle_data
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "cycle_daily_logs_own_rows"
on public.cycle_daily_logs
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "cycle_symptom_logs_own_rows"
on public.cycle_symptom_logs
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "cycle_pill_logs_own_rows"
on public.cycle_pill_logs
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "journal_entries_own_rows"
on public.journal_entries
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "appointments_own_rows"
on public.appointments
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "feedback_entries_own_rows"
on public.feedback_entries
for all
to authenticated
using ((select auth.uid()) = user_id)
with check (user_id is null or (select auth.uid()) = user_id);

create policy "notifications_own_rows"
on public.notifications
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "notification_preferences_own_rows"
on public.notification_preferences
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "orientation_sessions_own_rows"
on public.orientation_sessions
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "sensitive_orientation_sessions_own_rows"
on public.sensitive_orientation_sessions
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "community_profiles_own_rows"
on public.community_profiles
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "community_room_memberships_read_authenticated"
on public.community_room_memberships
for select
to authenticated
using (true);

create policy "community_room_memberships_own_rows"
on public.community_room_memberships
for all
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.community_profiles cp
    where cp.participant_key = community_room_memberships.participant_key
      and cp.user_id = (select auth.uid())
  )
);

create policy "community_messages_read_authenticated"
on public.community_messages
for select
to authenticated
using (true);

create policy "community_messages_own_rows"
on public.community_messages
for all
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.community_profiles cp
    where cp.participant_key = community_messages.participant_key
      and cp.user_id = (select auth.uid())
  )
);

create policy "community_message_reports_own_rows"
on public.community_message_reports
for all
to authenticated
using ((select auth.uid()) = reporter_user_id)
with check (
  (select auth.uid()) = reporter_user_id
  and exists (
    select 1
    from public.community_profiles cp
    where cp.participant_key = community_message_reports.reporter_key
      and cp.user_id = (select auth.uid())
  )
);
