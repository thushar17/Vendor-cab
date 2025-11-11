-- Create profiles table
CREATE TABLE public.profiles (
    id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name text,
    email text,
    role text,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create vehicles table
CREATE TABLE public.vehicles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    vendor_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    vehicle_number text NOT NULL,
    model text NOT NULL,
    capacity integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Create drivers table
CREATE TABLE public.drivers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    vendor_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    driver_name text NOT NULL,
    license_number text NOT NULL,
    assigned_vehicle uuid REFERENCES public.vehicles(id) ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id uuid)
RETURNS text AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = user_id;
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Super vendors can view all profiles" ON public.profiles
FOR SELECT USING (get_user_role(auth.uid()) = 'super_vendor');

-- RLS Policies for vehicles table
CREATE POLICY "Vendors can manage their own vehicles" ON public.vehicles
FOR ALL USING (auth.uid() = vendor_id);

CREATE POLICY "Super vendors can view all vehicles" ON public.vehicles
FOR SELECT USING (get_user_role(auth.uid()) = 'super_vendor');

-- RLS Policies for drivers table
CREATE POLICY "Vendors can manage their own drivers" ON public.drivers
FOR ALL USING (auth.uid() = vendor_id);

CREATE POLICY "Super vendors can view all drivers" ON public.drivers
FOR SELECT USING (get_user_role(auth.uid()) = 'super_vendor');

-- Function to create a profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email, new.raw_user_meta_data->>'role');
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in handle_new_user: %', SQLERRM;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to call the function on new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
