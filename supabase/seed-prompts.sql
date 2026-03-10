-- ============================================
-- Seed Prompts
-- Run AFTER schema.sql and after at least one user has signed up.
-- ============================================

DO $$
DECLARE
  uid uuid;
  cat_writing uuid;
  cat_coding uuid;
  cat_marketing uuid;
  cat_education uuid;
  cat_business uuid;
  cat_creative uuid;
  cat_productivity uuid;
BEGIN
  -- Get first user
  SELECT id INTO uid FROM auth.users LIMIT 1;

  IF uid IS NULL THEN
    RAISE EXCEPTION 'No users found. Sign up first, then run this seed.';
  END IF;

  -- Ensure profile exists (in case the trigger didn't fire for this user)
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  SELECT
    uid,
    u.raw_user_meta_data ->> 'user_name',
    coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name'),
    u.raw_user_meta_data ->> 'avatar_url'
  FROM auth.users u
  WHERE u.id = uid
  ON CONFLICT (id) DO NOTHING;

  -- Get category IDs
  SELECT id INTO cat_writing FROM public.categories WHERE slug = 'writing';
  SELECT id INTO cat_coding FROM public.categories WHERE slug = 'coding';
  SELECT id INTO cat_marketing FROM public.categories WHERE slug = 'marketing';
  SELECT id INTO cat_education FROM public.categories WHERE slug = 'education';
  SELECT id INTO cat_business FROM public.categories WHERE slug = 'business';
  SELECT id INTO cat_creative FROM public.categories WHERE slug = 'creative';
  SELECT id INTO cat_productivity FROM public.categories WHERE slug = 'productivity';

  -- Seed prompts
  INSERT INTO public.prompts (title, description, prompt_text, link, likes_count, views_count, category_id, user_id) VALUES
  (
    'Blog Post Outline Generator',
    'Generate a detailed blog post outline with introduction, key sections, and conclusion. Provide a topic and target audience, and get a structured outline ready for writing.',
    'Create a detailed blog post outline about [TOPIC] for [TARGET AUDIENCE]. Include: 1) A compelling introduction with a hook, 2) 4-6 main sections with key points under each, 3) A conclusion with a call to action. Format with headers and bullet points.',
    'https://chatgpt.com',
    24,
    1240,
    cat_writing,
    uid
  ),
  (
    'Email Rewriter — Professional Tone',
    'Paste any draft email and get it rewritten in a professional, clear, and concise tone. Preserves your intent while improving readability and impact.',
    'Rewrite the following email in a professional, clear, and concise tone. Preserve the original intent and key information while improving readability, grammar, and impact. Use appropriate greetings and sign-offs. Here is the email: [PASTE EMAIL]',
    'https://chatgpt.com',
    18,
    890,
    cat_writing,
    uid
  ),
  (
    'Story Plot Generator',
    'Create unique and engaging story plots with character arcs, conflicts, and resolutions. Specify genre, mood, and setting for tailored results.',
    'Generate a unique story plot in the [GENRE] genre with a [MOOD] mood, set in [SETTING]. Include: a protagonist with a clear motivation, an antagonist or central conflict, 3 major plot points, a climax, and a resolution. Include a brief character arc description.',
    NULL,
    31,
    2100,
    cat_creative,
    uid
  ),
  (
    'Code Review Assistant',
    'Paste your code and get a thorough review covering best practices, potential bugs, performance issues, and security vulnerabilities. Supports all major languages.',
    'Act as a senior software engineer performing a code review. Analyze the following code for: 1) Bugs and logic errors, 2) Security vulnerabilities, 3) Performance issues, 4) Best practice violations, 5) Readability improvements. Rate severity (critical/warning/info) for each finding. Code: [PASTE CODE]',
    'https://claude.ai',
    42,
    3200,
    cat_coding,
    uid
  ),
  (
    'Regex Pattern Builder',
    'Describe what you want to match in plain English and get the exact regex pattern with explanation. Includes test cases and edge case handling.',
    'I need a regex pattern that matches: [DESCRIBE WHAT TO MATCH]. Provide: 1) The regex pattern, 2) A breakdown of each component, 3) 5 test strings that should match, 4) 5 test strings that should NOT match, 5) Any edge cases to be aware of. Use the [LANGUAGE/FLAVOR] regex flavor.',
    NULL,
    15,
    780,
    cat_coding,
    uid
  ),
  (
    'SQL Query Optimizer',
    'Paste your SQL query and get an optimized version with index suggestions, query plan analysis, and performance improvement tips.',
    'Optimize the following SQL query for performance. Provide: 1) The optimized query, 2) Explanation of changes, 3) Suggested indexes, 4) Estimated performance improvement, 5) Any potential issues with the optimization. Query: [PASTE SQL]',
    'https://chatgpt.com',
    28,
    1450,
    cat_coding,
    uid
  ),
  (
    'Social Media Caption Writer',
    'Generate engaging social media captions for Instagram, Twitter/X, LinkedIn, and TikTok. Specify your brand voice, target audience, and key message.',
    'Write 3 engaging social media captions for [PLATFORM] about [TOPIC/PRODUCT]. Brand voice: [CASUAL/PROFESSIONAL/WITTY]. Target audience: [DESCRIBE]. Include relevant hashtags, a call to action, and keep within the platform character limits.',
    'https://chatgpt.com',
    35,
    1890,
    cat_marketing,
    uid
  ),
  (
    'SEO Meta Description Generator',
    'Create compelling meta descriptions optimized for search engines. Input your page title and content summary to get click-worthy descriptions under 160 characters.',
    'Create 3 SEO-optimized meta descriptions for a page titled "[PAGE TITLE]". Content summary: [BRIEF SUMMARY]. Requirements: under 160 characters each, include primary keyword "[KEYWORD]", use active voice, include a call to action, and make it compelling enough to improve click-through rate.',
    NULL,
    12,
    560,
    cat_marketing,
    uid
  ),
  (
    'Explain Like I''m 5',
    'Break down any complex concept into simple, easy-to-understand language with relatable analogies. Perfect for learning new subjects or explaining to beginners.',
    'Explain [CONCEPT] as if I''m 5 years old. Use simple words, everyday analogies, and a friendly tone. Break it into 3-4 short paragraphs. End with a fun fact related to the topic.',
    'https://claude.ai',
    56,
    4500,
    cat_education,
    uid
  ),
  (
    'Flashcard Generator',
    'Turn any study material into effective flashcards with questions on one side and concise answers on the other. Supports spaced repetition principles.',
    'Create 20 flashcards from the following study material. Format each as Q: [question] / A: [answer]. Use spaced repetition principles: mix factual recall, conceptual understanding, and application questions. Vary difficulty. Material: [PASTE CONTENT]',
    NULL,
    22,
    980,
    cat_education,
    uid
  ),
  (
    'Meeting Summary & Action Items',
    'Paste meeting notes or transcript and get a structured summary with key decisions, action items, owners, and deadlines clearly listed.',
    'Summarize the following meeting notes into: 1) Meeting Overview (2-3 sentences), 2) Key Decisions Made, 3) Action Items (formatted as: [TASK] — Owner: [NAME] — Deadline: [DATE]), 4) Open Questions, 5) Next Steps. Notes: [PASTE NOTES]',
    'https://claude.ai',
    38,
    2700,
    cat_business,
    uid
  ),
  (
    'Competitor Analysis Framework',
    'Analyze any competitor by providing their name and industry. Get a structured SWOT analysis, market positioning, and strategic recommendations.',
    'Perform a competitor analysis for [COMPANY NAME] in the [INDUSTRY] industry. Include: 1) Company overview, 2) SWOT analysis, 3) Market positioning, 4) Key differentiators, 5) Pricing strategy, 6) Target audience, 7) Strategic recommendations for competing against them.',
    NULL,
    19,
    1100,
    cat_business,
    uid
  ),
  (
    'Daily Task Prioritizer',
    'List your tasks for the day and get them prioritized using the Eisenhower Matrix. Includes time estimates and suggested order of execution.',
    'Prioritize my tasks using the Eisenhower Matrix (Urgent/Important). For each task, provide: priority level, estimated time, and suggested time slot. Then give me an optimized daily schedule. My tasks: [LIST TASKS]',
    NULL,
    27,
    1650,
    cat_productivity,
    uid
  ),
  (
    'Decision Matrix Builder',
    'Struggling with a decision? Provide your options and criteria, and get a weighted decision matrix that helps you make objective, data-driven choices.',
    'Help me decide between these options: [LIST OPTIONS]. My criteria are: [LIST CRITERIA]. Create a weighted decision matrix: assign importance weights (1-10) to each criterion, score each option (1-10) per criterion, calculate weighted totals, and provide a clear recommendation with reasoning.',
    'https://chatgpt.com',
    14,
    720,
    cat_productivity,
    uid
  ),
  (
    'Midjourney Prompt Crafter',
    'Describe your vision in plain language and get optimized Midjourney prompts with aspect ratios, style parameters, and artistic references for stunning AI art.',
    'I want to create an image of [DESCRIBE YOUR VISION]. Generate 3 optimized Midjourney prompts with: detailed scene description, lighting, mood, camera angle, artistic style references, and appropriate parameters (--ar, --style, --v). Vary the artistic direction across the 3 prompts.',
    'https://midjourney.com',
    47,
    3800,
    cat_creative,
    uid
  ),
  (
    'Character Backstory Generator',
    'Create rich, detailed character backstories for games, novels, or D&D campaigns. Specify race, class, personality traits, and get a compelling origin story.',
    'Create a detailed character backstory for a [RACE] [CLASS] in a [SETTING] world. Personality traits: [LIST TRAITS]. Include: origin story, key formative event, motivation, a secret, relationships, and a personal flaw. Write in narrative style, 300-400 words.',
    NULL,
    33,
    2400,
    cat_creative,
    uid
  );

END $$;
