create table visitors (
  id bigint primary key generated always as identity,
  name text not null,
  email text not null unique,
  created_at timestamp with time zone not null default now()
);

alter table visitors enable row level security;

create policy "Admin can query visitors"
on visitors for select to public using (
  true
);

create policy "All visitors can create account"
on visitors for insert to public with check (
  true
);