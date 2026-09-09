-- Open catalog migration for GPT Sites copy
-- Keeps the catalog public/read-only without login and prepares Supabase Storage for pose images.

-- Public read access for catalog content
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.poses TO anon;
GRANT SELECT ON public.scripts TO anon;
GRANT SELECT ON public.script_poses TO anon;
GRANT SELECT ON public.downloads TO anon;

DROP POLICY IF EXISTS "categories read for anon" ON public.categories;
CREATE POLICY "categories read for anon"
ON public.categories
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "poses read for anon" ON public.poses;
CREATE POLICY "poses read for anon"
ON public.poses
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "scripts read for anon" ON public.scripts;
CREATE POLICY "scripts read for anon"
ON public.scripts
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "script_poses read for anon" ON public.script_poses;
CREATE POLICY "script_poses read for anon"
ON public.script_poses
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "downloads read for anon" ON public.downloads;
CREATE POLICY "downloads read for anon"
ON public.downloads
FOR SELECT
TO anon
USING (true);

-- Public Storage bucket for pose assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('poses', 'poses', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

DROP POLICY IF EXISTS "public read poses storage" ON storage.objects;
CREATE POLICY "public read poses storage"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'poses');

-- Upload/update/delete stays restricted to privileged server/service-role operations.
-- Favorites are handled by browser localStorage, so no anonymous write policy is added.
