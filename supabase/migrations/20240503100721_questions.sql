create table questions (
  id bigint primary key generated always as identity,
  question text not null,
  created_by uuid not null references auth.users (id) default auth.uid(),
  created_at timestamp with time zone not null default now()
);

alter table questions enable row level security;

create policy "Users can insert questions"
on questions for insert to authenticated with check (
  auth.uid() = created_by
);

create policy "Users can query their own questions"
on questions for select to authenticated using (
  auth.uid() = created_by
);

create policy "Users can delete their own questions"
on questions for delete to authenticated using (
  auth.uid() = created_by
);

create or replace function delete_embedding_based_on_question()
returns trigger as $$
begin
    delete from document_contents
    where metadata ->> 'questionId' = old.id::text;
    return null; 
end;
$$ language plpgsql;

create trigger trigger_delete_question_embedding
after delete on questions
for each row
execute function delete_embedding_based_on_question();