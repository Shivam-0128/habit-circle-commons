CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NULLIF(NEW.raw_user_meta_data->>'display_name',''), split_part(NEW.email,'@',1)));
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 200),
  when_i_do_it text NOT NULL DEFAULT '' CHECK (char_length(when_i_do_it) <= 2000),
  is_shared boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.habits TO authenticated;
GRANT ALL ON public.habits TO service_role;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own or shared habits" ON public.habits FOR SELECT TO authenticated USING (user_id = auth.uid() OR is_shared);
CREATE POLICY "Insert own habits" ON public.habits FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Update own habits" ON public.habits FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Delete own habits" ON public.habits FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.completions (
  habit_id uuid NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  day date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (habit_id, day)
);
GRANT SELECT, INSERT, DELETE ON public.completions TO authenticated;
GRANT ALL ON public.completions TO service_role;
ALTER TABLE public.completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read completions of visible habits" ON public.completions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.habits h WHERE h.id = habit_id AND (h.user_id = auth.uid() OR h.is_shared)));
CREATE POLICY "Owner adds completions" ON public.completions FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.habits h WHERE h.id = habit_id AND h.user_id = auth.uid()));
CREATE POLICY "Owner removes completions" ON public.completions FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.habits h WHERE h.id = habit_id AND h.user_id = auth.uid()));

CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.comments TO authenticated;
GRANT ALL ON public.comments TO service_role;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read comments of visible habits" ON public.comments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.habits h WHERE h.id = habit_id AND (h.user_id = auth.uid() OR h.is_shared)));
CREATE POLICY "Members comment on visible habits" ON public.comments FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.habits h WHERE h.id = habit_id AND (h.user_id = auth.uid() OR h.is_shared)));
CREATE POLICY "Delete own comments" ON public.comments FOR DELETE TO authenticated USING (user_id = auth.uid());