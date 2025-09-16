--
-- 1. CRIA A TABELA DE PERFIS (PROFILES)
--
/*
          # [Operation Name]: Create Profiles Table
          [This operation creates the 'profiles' table to store user-specific data that is not part of Supabase Auth, such as full name and app settings.]

          ## Query Description: [This script creates a new 'profiles' table linked to 'auth.users'. It is a non-destructive, structural change and is essential for the application to function correctly. No existing data will be affected.]
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Table: public.profiles
          - Columns: id, full_name, email, avatar_url, focus_mode, density_mode, animations_enabled, updated_at
          
          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: No
          - Auth Requirements: References auth.users
          
          ## Performance Impact:
          - Indexes: Primary key on 'id'
          - Triggers: None added in this step
          - Estimated Impact: Low
          */
CREATE TABLE public.profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  email text,
  avatar_url text,
  focus_mode boolean DEFAULT false,
  density_mode text DEFAULT 'comfortable',
  animations_enabled boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);
comment on table public.profiles is 'Stores user-specific profile data.';

--
-- 2. CRIA A FUNÇÃO E O GATILHO (TRIGGER) PARA POPULAR A TABELA DE PERFIS
--
/*
          # [Operation Name]: Create New User Trigger
          [This operation creates a trigger that automatically populates the 'profiles' table when a new user signs up in 'auth.users'.]

          ## Query Description: [This script defines a function and a trigger. The function copies the user ID, full name, and email from the authentication system to the new 'profiles' table. This ensures data consistency. It is a safe, automated process.]
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Function: public.handle_new_user()
          - Trigger: on_auth_user_created on auth.users
          
          ## Security Implications:
          - RLS Status: N/A
          - Policy Changes: No
          - Auth Requirements: Runs with definer's security rights to insert into profiles.
          
          ## Performance Impact:
          - Indexes: None
          - Triggers: Added
          - Estimated Impact: Negligible impact on sign-up performance.
          */
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

--
-- 3. HABILITA RLS E CRIA POLÍTICAS DE SEGURANÇA
--
/*
          # [Operation Name]: Enable RLS and Create Policies
          [This operation enables Row Level Security (RLS) and defines access policies for 'profiles' and 'messages' tables to ensure data privacy.]

          ## Query Description: [This script ensures that users can only view/edit their own data. It is a critical security enhancement. It will restrict all access until policies are in place, then grant access based on user ID. This is a safe and required change for a multi-user application.]
          
          ## Metadata:
          - Schema-Category: "Dangerous"
          - Impact-Level: "High"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Tables: public.profiles, public.messages
          
          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: Yes
          - Auth Requirements: Policies are based on auth.uid()
          
          ## Performance Impact:
          - Indexes: None
          - Triggers: None
          - Estimated Impact: Minor overhead on queries to check policies, which is necessary for security.
          */
-- Policies for PROFILES table
alter table public.profiles enable row level security;

create policy "Users can view their own profile."
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- Policies for MESSAGES table
alter table public.messages enable row level security;

create policy "Users can view their own messages."
  on public.messages for select
  using ( auth.uid() = author_id );

create policy "Users can insert their own messages."
  on public.messages for insert
  with check ( auth.uid() = author_id );
