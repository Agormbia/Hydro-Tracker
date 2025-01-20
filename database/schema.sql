-- Create profiles table
create table profiles (
	id uuid references auth.users on delete cascade,
	email text unique,
	username text,
	avatar_url text,
	daily_goal integer default 2000,
	created_at timestamp with time zone default timezone('utc'::text, now()) not null,
	updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
	primary key (id)
);

-- Enable RLS
alter table profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone."
	on profiles for select
	using ( true );

create policy "Users can insert their own profile."
	on profiles for insert
	with check ( auth.uid() = id );

create policy "Users can update their own profile."
	on profiles for update
	using ( auth.uid() = id );

-- Function to handle updated_at
create or replace function handle_updated_at()
returns trigger as $$
begin
	new.updated_at = now();
	return new;
end;
$$ language plpgsql;

-- Trigger to automatically update updated_at
create trigger handle_updated_at
	before update on profiles
	for each row
	execute procedure handle_updated_at();

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger after auth.users insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();