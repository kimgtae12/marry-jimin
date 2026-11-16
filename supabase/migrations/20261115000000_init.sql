-- 방명록 ---------------------------------------------------------------
create table if not exists public.guestbook (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 20),
  message     text not null check (char_length(message) between 1 and 200),
  created_at  timestamptz not null default now()
);

alter table public.guestbook enable row level security;

create policy "guestbook: anyone can read"
  on public.guestbook for select
  to anon, authenticated
  using (true);

create policy "guestbook: anyone can write"
  on public.guestbook for insert
  to anon, authenticated
  with check (true);

-- 참석 여부 ------------------------------------------------------------
-- select 정책이 없으므로 하객은 쓰기만 가능하고, 조회는 대시보드(service role)에서만.
create table if not exists public.rsvp (
  id          uuid primary key default gen_random_uuid(),
  side        text not null check (side in ('groom', 'bride')),
  name        text not null check (char_length(name) between 1 and 20),
  attending   boolean not null,
  headcount   smallint not null default 1 check (headcount between 0 and 10),
  meal        text not null default 'undecided' check (meal in ('yes', 'no', 'undecided')),
  created_at  timestamptz not null default now()
);

alter table public.rsvp enable row level security;

create policy "rsvp: anyone can submit"
  on public.rsvp for insert
  to anon, authenticated
  with check (true);
