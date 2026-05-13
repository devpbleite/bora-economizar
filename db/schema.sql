create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  name text not null,
  type text not null check (type in ('income', 'expense')),
  color text not null default '#bdebd8',
  icon text not null default 'Circle',
  created_at timestamptz not null default now()
);

create table if not exists monthly_settings (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  month date not null,
  fixed_income numeric(12, 2) not null default 0,
  savings_goal_percent numeric(5, 2) not null default 30,
  created_at timestamptz not null default now(),
  unique (profile_id, month)
);

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  type text not null check (type in ('income', 'expense')),
  title text not null,
  amount numeric(12, 2) not null,
  transaction_date date not null,
  notes text,
  is_recurring boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists transactions_profile_date_idx
  on transactions (profile_id, transaction_date desc);
