-- Drop the trigger and function first to avoid dependency issues
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Drop storage policies
drop policy if exists "Avatar images are publicly accessible." on storage.objects;
drop policy if exists "Anyone can upload an avatar." on storage.objects;
drop policy if exists "Anyone can update their own avatar." on storage.objects;

-- Drop the storage bucket (only if empty)
delete from storage.buckets where id = 'avatars';

-- Finally, drop the profiles table
drop table if exists public.profiles;
