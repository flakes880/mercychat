create extension if not exists pg_net with schema extensions;
create extension if not exists vector with schema extensions;

create table documents (
  id bigint primary key generated always as identity,
  name text not null,
  storage_object_id uuid not null references storage.objects (id),
  created_by uuid not null references auth.users (id) default auth.uid(),
  created_at timestamp with time zone not null default now()
);

create view documents_with_storage_path
with (security_invoker=true)
as
  select documents.*, storage.objects.name as storage_object_path
  from documents
  join storage.objects
    on storage.objects.id = documents.storage_object_id;

alter table documents enable row level security;

create policy "Users can insert documents"
on documents for insert to authenticated with check (
  auth.uid() = created_by
);

create policy "Users can query their own documents"
on documents for select to authenticated using (
  auth.uid() = created_by
);

create policy "Users can delete their own documents"
on documents for delete to authenticated using (
  auth.uid() = created_by
);

create function supabase_url()
returns text
language plpgsql
security definer
as $$
declare
  secret_value text;
begin
  select decrypted_secret into secret_value from vault.decrypted_secrets where name = 'supabase_url';
  return secret_value;
end;
$$;

create function private.handle_storage_update() 
returns trigger 
language plpgsql
as $$
declare
  document_id bigint;
  result int;
begin
  insert into documents (name, storage_object_id, created_by)
    values (new.path_tokens[2], new.id, new.owner)
    returning id into document_id;

  return null;
end;
$$;

create or replace function delete_embedding_based_on_document()
returns trigger as $$
begin
    delete from document_contents
    where metadata ->> 'storageId' = old.storage_object_id::text;
    return null; 
end;
$$ language plpgsql;

create or replace function delete_associated_file()
returns trigger as $$
begin
    delete from storage.objects
    where id = old.storage_object_id;
    return old;
end;
$$ language plpgsql;

create trigger trigger_delete_related_file
  after delete on documents
  for each row
  execute function delete_associated_file();

create trigger trigger_delete_document_embedding
  after delete on documents
  for each row
  execute function delete_embedding_based_on_document();

create trigger on_file_upload
  after insert on storage.objects
  for each row
  execute procedure private.handle_storage_update();
