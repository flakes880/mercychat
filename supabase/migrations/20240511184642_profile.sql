create table profile (
  user_id uuid not null,
  email text null,
  name text null,
  role text default 'subscriber', -- default role for new users
  created_at timestamp with time zone not null default now(),
  primary key (user_id),
  foreign key (user_id) references auth.users (id) on delete cascade
);

-- alter table profile enable row level security;

-- create policy "Users can create profile" 
-- on profile for insert to authenticated with check (
--   auth.uid() = user_id
-- );

-- create policy "User and Admin can see profile" 
-- on profile for select to authenticated using (
--   auth.uid() = user_id or
--     (select role from profile where user_id = auth.uid()) = 'admin'
-- );

-- create policy "Admin can update profile" 
-- on profile for update to authenticated with check (
--   (select role from profile where user_id = auth.uid()) = 'admin'
-- );

create or replace function handle_new_user() 
returns trigger 
security definer
as $$
begin
    insert into public.profile (user_id, email, name)
    values (new.id, new.email, new.raw_user_meta_data ->> 'name');
    return new;
end;
$$ language plpgsql;

create trigger trigger_new_user
after insert on auth.users
for each row
execute function handle_new_user();