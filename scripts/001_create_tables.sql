-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  business_type text,
  monthly_income decimal(12, 2),
  financial_goals text[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create budgets table
create table if not exists public.budgets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  amount decimal(12, 2) not null,
  spent decimal(12, 2) default 0,
  period text default 'monthly',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create transactions table
create table if not exists public.transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  amount decimal(12, 2) not null,
  description text,
  transaction_date timestamp with time zone default now(),
  type text not null check (type in ('income', 'expense')),
  created_at timestamp with time zone default now()
);

-- Create savings_goals table
create table if not exists public.savings_goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target_amount decimal(12, 2) not null,
  current_amount decimal(12, 2) default 0,
  deadline date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create alerts table
create table if not exists public.alerts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null check (type in ('critical', 'warning', 'info', 'success')),
  category text not null,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- Create subscriptions table
create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null check (plan in ('free', 'pro', 'business')),
  status text not null check (status in ('active', 'cancelled', 'expired')),
  billing_cycle text not null check (billing_cycle in ('monthly', 'annual')),
  current_period_start timestamp with time zone default now(),
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.budgets enable row level security;
alter table public.transactions enable row level security;
alter table public.savings_goals enable row level security;
alter table public.alerts enable row level security;
alter table public.subscriptions enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Budgets policies
create policy "Users can view their own budgets"
  on public.budgets for select
  using (auth.uid() = user_id);

create policy "Users can insert their own budgets"
  on public.budgets for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own budgets"
  on public.budgets for update
  using (auth.uid() = user_id);

create policy "Users can delete their own budgets"
  on public.budgets for delete
  using (auth.uid() = user_id);

-- Transactions policies
create policy "Users can view their own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own transactions"
  on public.transactions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own transactions"
  on public.transactions for delete
  using (auth.uid() = user_id);

-- Savings goals policies
create policy "Users can view their own savings goals"
  on public.savings_goals for select
  using (auth.uid() = user_id);

create policy "Users can insert their own savings goals"
  on public.savings_goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own savings goals"
  on public.savings_goals for update
  using (auth.uid() = user_id);

create policy "Users can delete their own savings goals"
  on public.savings_goals for delete
  using (auth.uid() = user_id);

-- Alerts policies
create policy "Users can view their own alerts"
  on public.alerts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own alerts"
  on public.alerts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own alerts"
  on public.alerts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own alerts"
  on public.alerts for delete
  using (auth.uid() = user_id);

-- Subscriptions policies
create policy "Users can view their own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own subscription"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own subscription"
  on public.subscriptions for update
  using (auth.uid() = user_id);
