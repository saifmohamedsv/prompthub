-- Add prompt type column (text, image, video)
ALTER TABLE public.prompts
  ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'text'
  CHECK (type IN ('text', 'image', 'video'));
