-- Create follows table
CREATE TABLE IF NOT EXISTS public.follows (
  follower_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON public.follows(following_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON public.follows(follower_id);

-- Add counters to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS followers_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS following_count integer NOT NULL DEFAULT 0;

-- RLS
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view follows"
  ON public.follows FOR SELECT
  USING (auth.uid() = follower_id OR auth.uid() = following_id);

CREATE POLICY "Users can follow others"
  ON public.follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON public.follows FOR DELETE
  USING (auth.uid() = follower_id);

-- Atomic toggle function
CREATE OR REPLACE FUNCTION public.toggle_follow(p_following_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_exists boolean;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.follows
    WHERE follower_id = auth.uid() AND following_id = p_following_id
  ) INTO v_exists;

  IF v_exists THEN
    DELETE FROM public.follows
    WHERE follower_id = auth.uid() AND following_id = p_following_id;
    UPDATE public.profiles SET followers_count = GREATEST(0, followers_count - 1) WHERE id = p_following_id;
    UPDATE public.profiles SET following_count = GREATEST(0, following_count - 1) WHERE id = auth.uid();
    RETURN false;
  ELSE
    INSERT INTO public.follows (follower_id, following_id)
    VALUES (auth.uid(), p_following_id);
    UPDATE public.profiles SET followers_count = followers_count + 1 WHERE id = p_following_id;
    UPDATE public.profiles SET following_count = following_count + 1 WHERE id = auth.uid();
    RETURN true;
  END IF;
END;
$$;
