-- Create users table
create table if not exists public.users (
  id uuid default uuid_generate_v4() primary key,
  username text unique not null,
  password_hash text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.users enable row level security;

-- Create policy to allow users to read their own data
create policy "Users can read their own data" on public.users
  for select using (auth.uid() = id);

-- Create policy to allow users to update their own data
create policy "Users can update their own data" on public.users
  for update using (auth.uid() = id);

-- Create policy to allow anyone to create a user
create policy "Anyone can create a user" on public.users
  for insert with check (true);
