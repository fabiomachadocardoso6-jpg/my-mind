-- This is a comprehensive repair script. It is safe to run multiple times.
-- It ensures the 'profiles' table and its automation are correctly configured.

BEGIN;

-- Step 1: Ensure the 'profiles' table exists and has the correct columns with defaults.
-- This prevents the "Database error saving new user" by providing default values.

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  focus_mode BOOLEAN,
  density_mode TEXT,
  animations_enabled BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add columns if they are missing (for older versions of the table)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS focus_mode BOOLEAN,
  ADD COLUMN IF NOT EXISTS density_mode TEXT,
  ADD COLUMN IF NOT EXISTS animations_enabled BOOLEAN,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

-- Set default values for the configuration columns. This is the critical fix.
ALTER TABLE public.profiles
  ALTER COLUMN focus_mode SET DEFAULT false,
  ALTER COLUMN density_mode SET DEFAULT 'comfortable',
  ALTER COLUMN animations_enabled SET DEFAULT true,
  ALTER COLUMN updated_at SET DEFAULT NOW();

-- Step 2: Create a function to automatically update the 'updated_at' timestamp.
CREATE OR REPLACE FUNCTION public.handle_profile_update()
RETURNS TRIGGER AS $$
BEGIN
  new.updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger for the 'updated_at' timestamp if it doesn't exist.
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_profile_update();

-- Step 3: Create the function that automatically creates a new profile for a new user.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Create the trigger that calls the function when a new user signs up.
-- This connects the authentication system to your profiles table.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Enable Row Level Security (RLS) on the profiles table.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 6: Create policies to control access.
-- Users can see their own profile.
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;
CREATE POLICY "Users can view their own profile."
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile.
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Ensure RLS is also on the messages table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can see their own messages.
DROP POLICY IF EXISTS "Users can view their own messages." ON public.messages;
CREATE POLICY "Users can view their own messages."
  ON public.messages FOR SELECT
  USING (auth.uid() = author_id);

-- Users can insert their own messages.
DROP POLICY IF EXISTS "Users can insert their own messages." ON public.messages;
CREATE POLICY "Users can insert their own messages."
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = author_id);

COMMIT;
