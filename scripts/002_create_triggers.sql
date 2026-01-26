-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Triggers for updated_at
create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger budgets_updated_at
  before update on public.budgets
  for each row
  execute function public.handle_updated_at();

create trigger savings_goals_updated_at
  before update on public.savings_goals
  for each row
  execute function public.handle_updated_at();

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row
  execute function public.handle_updated_at();

-- Function to create default profile and subscription on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Create profile
  insert into public.profiles (id, display_name, business_type, monthly_income, financial_goals)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', null),
    coalesce(new.raw_user_meta_data ->> 'business_type', null),
    coalesce((new.raw_user_meta_data ->> 'monthly_income')::decimal, null),
    coalesce(
      array(select jsonb_array_elements_text(new.raw_user_meta_data -> 'financial_goals')),
      array[]::text[]
    )
  )
  on conflict (id) do nothing;

  -- Create default free subscription
  insert into public.subscriptions (user_id, plan, status, billing_cycle, current_period_end)
  values (
    new.id,
    'free',
    'active',
    'monthly',
    now() + interval '30 days'
  )
  on conflict do nothing;

  return new;
end;
$$;

-- Trigger for new user
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
