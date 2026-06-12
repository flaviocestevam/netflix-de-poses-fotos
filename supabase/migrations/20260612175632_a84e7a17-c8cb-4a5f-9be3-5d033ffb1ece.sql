
-- =========================
-- PROFILES
-- =========================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  access_status TEXT NOT NULL DEFAULT 'ativo',
  device_count INT NOT NULL DEFAULT 1,
  last_login TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- =========================
-- CATEGORIES
-- =========================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_image TEXT,
  tag TEXT,
  pose_count INT DEFAULT 0,
  category_type TEXT NOT NULL DEFAULT 'cenario', -- 'cenario' | 'emocional'
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories read for authenticated" ON public.categories FOR SELECT TO authenticated USING (true);

-- =========================
-- POSES
-- =========================
CREATE TABLE public.poses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  difficulty TEXT NOT NULL DEFAULT 'facil', -- muito_facil | facil | medio | avancado
  estimated_seconds INT NOT NULL DEFAULT 30,
  style TEXT, -- romantica | divertida | natural | elegante | instagramavel | espontanea | discreta | criativa
  framing TEXT, -- corpo_inteiro | meio_corpo | close | de_costas | sentados | caminhando | abracados ...
  scenario TEXT,
  description TEXT,
  when_to_use TEXT,
  how_to_do TEXT,
  what_she_does TEXT,
  what_he_does TEXT,
  common_mistake TEXT,
  natural_tip TEXT,
  tags TEXT[] DEFAULT '{}',
  is_sos BOOLEAN NOT NULL DEFAULT false,
  is_30s BOOLEAN NOT NULL DEFAULT false,
  downloadable BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.poses TO authenticated;
GRANT ALL ON public.poses TO service_role;
ALTER TABLE public.poses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "poses read for authenticated" ON public.poses FOR SELECT TO authenticated USING (true);
CREATE INDEX poses_category_idx ON public.poses(category_id);
CREATE INDEX poses_sos_idx ON public.poses(is_sos);
CREATE INDEX poses_30s_idx ON public.poses(is_30s);

-- =========================
-- FAVORITES
-- =========================
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pose_id UUID NOT NULL REFERENCES public.poses(id) ON DELETE CASCADE,
  list_name TEXT DEFAULT 'Geral',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, pose_id, list_name)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.favorites TO authenticated;
GRANT ALL ON public.favorites TO service_role;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =========================
-- SCRIPTS (Roteiros)
-- =========================
CREATE TABLE public.scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  total_poses INT DEFAULT 0,
  scenario TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.scripts TO authenticated;
GRANT ALL ON public.scripts TO service_role;
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "scripts read for authenticated" ON public.scripts FOR SELECT TO authenticated USING (true);

CREATE TABLE public.script_poses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  script_id UUID NOT NULL REFERENCES public.scripts(id) ON DELETE CASCADE,
  pose_id UUID NOT NULL REFERENCES public.poses(id) ON DELETE CASCADE,
  order_number INT NOT NULL DEFAULT 0
);
GRANT SELECT ON public.script_poses TO authenticated;
GRANT ALL ON public.script_poses TO service_role;
ALTER TABLE public.script_poses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "script_poses read for authenticated" ON public.script_poses FOR SELECT TO authenticated USING (true);

-- =========================
-- DOWNLOADS
-- =========================
CREATE TABLE public.downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'pack', -- pack | pdf | bonus
  cover_image TEXT,
  file_url TEXT,
  total_items INT,
  access_level TEXT NOT NULL DEFAULT 'cliente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.downloads TO authenticated;
GRANT ALL ON public.downloads TO service_role;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "downloads read for authenticated" ON public.downloads FOR SELECT TO authenticated USING (true);

-- =========================
-- TRIPS (Minha Viagem)
-- =========================
CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_name TEXT NOT NULL,
  destination TEXT,
  trip_type TEXT,
  start_date DATE,
  end_date DATE,
  cover_image TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trips TO authenticated;
GRANT ALL ON public.trips TO service_role;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own trips" ON public.trips FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.trip_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section_name TEXT NOT NULL,
  order_number INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trip_sections TO authenticated;
GRANT ALL ON public.trip_sections TO service_role;
ALTER TABLE public.trip_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own trip sections" ON public.trip_sections FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.trip_poses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  section_id UUID REFERENCES public.trip_sections(id) ON DELETE SET NULL,
  pose_id UUID NOT NULL REFERENCES public.poses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'para_fazer', -- para_fazer | feita | pulada
  order_number INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trip_poses TO authenticated;
GRANT ALL ON public.trip_poses TO service_role;
ALTER TABLE public.trip_poses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own trip poses" ON public.trip_poses FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =========================
-- PROFILE TRIGGER on signup
-- =========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  trip1 UUID;
  trip2 UUID;
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email
  );

  -- viagens demo
  INSERT INTO public.trips (user_id, trip_name, destination, trip_type, cover_image, notes)
  VALUES (NEW.id, 'Paris 2026', 'Paris, França', 'Romântica', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200', 'Roteiro de fotos para Paris')
  RETURNING id INTO trip1;

  INSERT INTO public.trips (user_id, trip_name, destination, trip_type, cover_image, notes)
  VALUES (NEW.id, 'Lua de Mel Maldivas', 'Maldivas', 'Lua de mel', 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200', 'Fotos para a viagem mais especial')
  RETURNING id INTO trip2;

  INSERT INTO public.trip_sections (trip_id, user_id, section_name, order_number) VALUES
    (trip1, NEW.id, 'Aeroporto', 1),
    (trip1, NEW.id, 'Hotel', 2),
    (trip1, NEW.id, 'Ruas de Paris', 3),
    (trip1, NEW.id, 'Restaurante', 4),
    (trip1, NEW.id, 'Torre Eiffel', 5),
    (trip1, NEW.id, 'Pôr do sol', 6),
    (trip2, NEW.id, 'Chegada', 1),
    (trip2, NEW.id, 'Praia', 2),
    (trip2, NEW.id, 'Bangalô', 3),
    (trip2, NEW.id, 'Jantar romântico', 4),
    (trip2, NEW.id, 'Pôr do sol', 5);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
