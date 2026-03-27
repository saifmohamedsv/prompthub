-- ============================================
-- Syntaxa Seed Data v2 (bilingual)
-- ============================================
-- IMPORTANT: Replace YOUR_USER_ID_HERE with your actual auth.users UUID
-- You can find it with: SELECT id FROM auth.users LIMIT 1;
-- ============================================

-- Clean existing data
DELETE FROM public.prompt_tags;
DELETE FROM public.likes;
DELETE FROM public.prompts;
DELETE FROM public.tags;
DELETE FROM public.categories;

-- Seed categories
INSERT INTO public.categories (name, name_ar, slug) VALUES
  ('Writing', 'الكتابة', 'writing'),
  ('Coding', 'البرمجة', 'coding'),
  ('Marketing', 'التسويق', 'marketing'),
  ('Education', 'التعليم', 'education'),
  ('Business', 'الأعمال', 'business'),
  ('Creative', 'الإبداع', 'creative'),
  ('Productivity', 'الإنتاجية', 'productivity'),
  ('Other', 'أخرى', 'other')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_ar = EXCLUDED.name_ar;

-- Seed tags
INSERT INTO public.tags (name, slug) VALUES
  ('gpt-4', 'gpt-4'),
  ('gpt-4o', 'gpt-4o'),
  ('claude', 'claude'),
  ('gemini', 'gemini'),
  ('midjourney', 'midjourney'),
  ('dall-e', 'dall-e'),
  ('stable-diffusion', 'stable-diffusion'),
  ('coding', 'coding'),
  ('writing', 'writing'),
  ('marketing', 'marketing'),
  ('seo', 'seo'),
  ('portrait', 'portrait'),
  ('landscape', 'landscape'),
  ('productivity', 'productivity'),
  ('education', 'education'),
  ('creative', 'creative'),
  ('business', 'business'),
  ('data-analysis', 'data-analysis'),
  ('summarization', 'summarization'),
  ('translation', 'translation')
ON CONFLICT (slug) DO NOTHING;

-- Set the user ID variable
-- ⚠️ REPLACE THIS with your actual user ID
DO $$
DECLARE
  v_user_id uuid := (SELECT id FROM auth.users LIMIT 1);
  v_prompt_id uuid;
  v_cat_id uuid;
  v_tag_id uuid;
BEGIN

  -- ==========================================
  -- 1. Senior React Code Reviewer
  -- ==========================================
  SELECT id INTO v_cat_id FROM public.categories WHERE slug = 'coding';
  INSERT INTO public.prompts (title, title_ar, description, description_ar, prompt_text, category_id, user_id)
  VALUES (
    'Senior React Code Reviewer',
    'مراجع كود React متقدم',
    'Get a thorough code review from a senior React engineer. Identifies bugs, performance issues, and suggests improvements.',
    'احصل على مراجعة شاملة للكود من مهندس React متقدم. يحدد الأخطاء ومشاكل الأداء ويقترح تحسينات.',
    E'You are a senior React engineer with 10+ years of experience. Review the following code and provide:\n\n1. **Bugs & Issues**: Any logic errors, race conditions, or potential crashes\n2. **Performance**: Unnecessary re-renders, missing memoization, heavy computations\n3. **Best Practices**: Component structure, hook usage, naming conventions\n4. **Security**: XSS vulnerabilities, unsafe data handling\n5. **Accessibility**: Missing ARIA labels, keyboard navigation issues\n\nFormat your review as a numbered list with severity labels: 🔴 Critical, 🟡 Warning, 🟢 Suggestion\n\nCode to review:\n[PASTE YOUR CODE HERE]',
    v_cat_id, v_user_id
  ) RETURNING id INTO v_prompt_id;
  INSERT INTO public.prompt_tags (prompt_id, tag_id) SELECT v_prompt_id, id FROM public.tags WHERE slug IN ('coding', 'claude', 'gpt-4');

  -- ==========================================
  -- 2. Blog Post Generator
  -- ==========================================
  SELECT id INTO v_cat_id FROM public.categories WHERE slug = 'writing';
  INSERT INTO public.prompts (title, title_ar, description, description_ar, prompt_text, category_id, user_id)
  VALUES (
    'Blog Post Generator',
    'مولّد مقالات المدونة',
    'Generate a well-structured, SEO-optimized blog post on any topic with proper headings, introduction, and conclusion.',
    'أنشئ مقال مدونة منظم ومحسّن لمحركات البحث حول أي موضوع مع عناوين ومقدمة وخاتمة مناسبة.',
    E'Write a comprehensive blog post about [TOPIC]. Follow this structure:\n\n**Title**: Create a compelling, SEO-friendly title (60 chars max)\n**Meta Description**: Write a 155-character meta description\n**Introduction**: Hook the reader with a surprising fact or question (150 words)\n\n**Main Content** (3-5 sections):\n- Each section with an H2 heading\n- Include practical examples and actionable tips\n- Use bullet points for scanability\n- Add relevant statistics where applicable\n\n**Conclusion**: Summarize key takeaways with a clear CTA\n\n**Tone**: Professional yet conversational\n**Word Count**: 1,500-2,000 words\n**Target Audience**: [SPECIFY AUDIENCE]',
    v_cat_id, v_user_id
  ) RETURNING id INTO v_prompt_id;
  INSERT INTO public.prompt_tags (prompt_id, tag_id) SELECT v_prompt_id, id FROM public.tags WHERE slug IN ('writing', 'seo', 'gpt-4o');

  -- ==========================================
  -- 3. Product Launch Email Sequence
  -- ==========================================
  SELECT id INTO v_cat_id FROM public.categories WHERE slug = 'marketing';
  INSERT INTO public.prompts (title, title_ar, description, description_ar, prompt_text, category_id, user_id)
  VALUES (
    'Product Launch Email Sequence',
    'سلسلة رسائل إطلاق المنتج',
    'Create a 5-email sequence for launching a new product, from teaser to final call-to-action.',
    'أنشئ سلسلة من 5 رسائل بريد إلكتروني لإطلاق منتج جديد، من التشويق إلى الدعوة النهائية للعمل.',
    E'Create a 5-email product launch sequence for [PRODUCT NAME].\n\nProduct Details:\n- What it does: [DESCRIPTION]\n- Target audience: [AUDIENCE]\n- Price point: [PRICE]\n- Launch date: [DATE]\n\nEmail Sequence:\n1. **Teaser** (3 days before): Build curiosity without revealing the product\n2. **Reveal** (1 day before): Announce what''s coming with key benefits\n3. **Launch Day**: Full pitch with social proof and urgency\n4. **Follow-up** (day 2): Address objections, share testimonials\n5. **Last Chance** (day 5): Final urgency with bonus offer\n\nFor each email provide:\n- Subject line (+ 2 alternatives)\n- Preview text\n- Email body (200-300 words)\n- CTA button text',
    v_cat_id, v_user_id
  ) RETURNING id INTO v_prompt_id;
  INSERT INTO public.prompt_tags (prompt_id, tag_id) SELECT v_prompt_id, id FROM public.tags WHERE slug IN ('marketing', 'business', 'gpt-4');

  -- ==========================================
  -- 4. Python Data Analysis Assistant
  -- ==========================================
  SELECT id INTO v_cat_id FROM public.categories WHERE slug = 'coding';
  INSERT INTO public.prompts (title, title_ar, description, description_ar, prompt_text, category_id, user_id)
  VALUES (
    'Python Data Analysis Assistant',
    'مساعد تحليل البيانات بايثون',
    'Transform raw data questions into clean Python pandas code with visualizations and statistical insights.',
    'حوّل أسئلة البيانات الخام إلى كود بايثون نظيف باستخدام pandas مع رسوم بيانية ورؤى إحصائية.',
    E'You are a data analysis expert. Given a dataset description, write Python code that:\n\n1. **Loads & Cleans** the data (handle missing values, duplicates, type conversions)\n2. **Explores** with descriptive statistics (mean, median, std, quartiles)\n3. **Visualizes** key patterns using matplotlib/seaborn (at least 3 charts)\n4. **Analyzes** correlations and trends\n5. **Summarizes** findings in plain English\n\nAlways include:\n- Clear comments explaining each step\n- Error handling for common data issues\n- A final summary dataframe of key metrics\n\nDataset: [DESCRIBE YOUR DATA]\nQuestions to answer: [YOUR QUESTIONS]',
    v_cat_id, v_user_id
  ) RETURNING id INTO v_prompt_id;
  INSERT INTO public.prompt_tags (prompt_id, tag_id) SELECT v_prompt_id, id FROM public.tags WHERE slug IN ('coding', 'data-analysis', 'gpt-4o');

  -- ==========================================
  -- 5. Midjourney Cinematic Scene
  -- ==========================================
  SELECT id INTO v_cat_id FROM public.categories WHERE slug = 'creative';
  INSERT INTO public.prompts (title, title_ar, description, description_ar, prompt_text, category_id, user_id)
  VALUES (
    'Midjourney Cinematic Scene',
    'مشهد سينمائي ميدجورني',
    'Generate detailed Midjourney prompts for cinematic, movie-quality scenes with precise lighting and composition.',
    'أنشئ برومبتات ميدجورني مفصّلة لمشاهد سينمائية بجودة الأفلام مع إضاءة وتكوين دقيق.',
    E'Create a Midjourney prompt for: [YOUR SCENE IDEA]\n\nUse this structure:\n[Subject description], [environment/setting], [lighting style], [camera angle], [mood/atmosphere], [artistic style], [technical parameters]\n\nLighting options: golden hour, neon noir, dramatic chiaroscuro, soft diffused, volumetric fog\nCamera angles: wide establishing shot, close-up portrait, bird''s eye view, low angle hero shot\nStyles: cinematic film still, 35mm photography, IMAX quality, anamorphic lens\n\nOutput 4 variations:\n1. **Dramatic**: High contrast, intense mood\n2. **Ethereal**: Soft, dreamlike quality\n3. **Gritty**: Raw, realistic texture\n4. **Stylized**: Bold colors, graphic composition\n\nAdd: --ar 16:9 --v 6 --style raw --s 750',
    v_cat_id, v_user_id
  ) RETURNING id INTO v_prompt_id;
  INSERT INTO public.prompt_tags (prompt_id, tag_id) SELECT v_prompt_id, id FROM public.tags WHERE slug IN ('midjourney', 'creative', 'portrait', 'landscape');

  -- ==========================================
  -- 6. Lesson Plan Builder
  -- ==========================================
  SELECT id INTO v_cat_id FROM public.categories WHERE slug = 'education';
  INSERT INTO public.prompts (title, title_ar, description, description_ar, prompt_text, category_id, user_id)
  VALUES (
    'Lesson Plan Builder',
    'مُنشئ خطط الدروس',
    'Create detailed, engaging lesson plans for any subject and grade level with activities and assessments.',
    'أنشئ خطط دروس مفصّلة وتفاعلية لأي مادة ومستوى دراسي مع أنشطة وتقييمات.',
    E'Design a comprehensive lesson plan:\n\n**Subject**: [SUBJECT]\n**Grade Level**: [GRADE]\n**Duration**: [TIME]\n**Learning Objectives**: What students should know/do after the lesson\n\nStructure:\n1. **Warm-Up** (5-10 min): Engaging hook activity\n2. **Direct Instruction** (15-20 min): Core content delivery\n3. **Guided Practice** (10-15 min): Teacher-supported activity\n4. **Independent Practice** (10-15 min): Student-led work\n5. **Closure** (5 min): Summary and exit ticket\n\nInclude:\n- Differentiation strategies (advanced, on-level, struggling)\n- Materials needed\n- Assessment rubric\n- Homework assignment\n- Cross-curricular connections',
    v_cat_id, v_user_id
  ) RETURNING id INTO v_prompt_id;
  INSERT INTO public.prompt_tags (prompt_id, tag_id) SELECT v_prompt_id, id FROM public.tags WHERE slug IN ('education', 'writing', 'claude');

  -- ==========================================
  -- 7. Business Model Canvas Generator
  -- ==========================================
  SELECT id INTO v_cat_id FROM public.categories WHERE slug = 'business';
  INSERT INTO public.prompts (title, title_ar, description, description_ar, prompt_text, category_id, user_id)
  VALUES (
    'Business Model Canvas Generator',
    'مولّد نموذج العمل التجاري',
    'Generate a complete Business Model Canvas for any startup idea with detailed analysis of each section.',
    'أنشئ نموذج عمل تجاري كامل لأي فكرة ناشئة مع تحليل مفصّل لكل قسم.',
    E'Create a Business Model Canvas for: [YOUR BUSINESS IDEA]\n\nFill out each section with 3-5 bullet points:\n\n1. **Customer Segments**: Who are your target customers?\n2. **Value Propositions**: What unique value do you deliver?\n3. **Channels**: How do you reach customers?\n4. **Customer Relationships**: How do you interact with customers?\n5. **Revenue Streams**: How does the business earn money?\n6. **Key Resources**: What assets are essential?\n7. **Key Activities**: What must the business do well?\n8. **Key Partnerships**: Who are your strategic partners?\n9. **Cost Structure**: What are the major costs?\n\nThen provide:\n- **SWOT Analysis**: Strengths, Weaknesses, Opportunities, Threats\n- **Competitive Advantage**: What''s your moat?\n- **Go-to-Market Strategy**: First 90 days plan\n- **Unit Economics**: Basic revenue/cost per customer estimate',
    v_cat_id, v_user_id
  ) RETURNING id INTO v_prompt_id;
  INSERT INTO public.prompt_tags (prompt_id, tag_id) SELECT v_prompt_id, id FROM public.tags WHERE slug IN ('business', 'productivity', 'gpt-4');

  -- ==========================================
  -- 8. Daily Productivity System
  -- ==========================================
  SELECT id INTO v_cat_id FROM public.categories WHERE slug = 'productivity';
  INSERT INTO public.prompts (title, title_ar, description, description_ar, prompt_text, category_id, user_id)
  VALUES (
    'Daily Productivity System',
    'نظام الإنتاجية اليومي',
    'Design a personalized daily productivity system based on your role, goals, and energy patterns.',
    'صمّم نظام إنتاجية يومي مخصص بناءً على دورك وأهدافك وأنماط طاقتك.',
    E'Design my personalized productivity system:\n\n**My Role**: [YOUR ROLE]\n**Top 3 Goals**: [GOALS]\n**Working Hours**: [START]-[END]\n**Peak Energy Time**: [MORNING/AFTERNOON/EVENING]\n**Biggest Time Wasters**: [LIST THEM]\n\nCreate:\n1. **Morning Routine** (30 min): Mindset + planning ritual\n2. **Time-Blocked Schedule**: Optimized for energy levels\n   - Deep work blocks (90 min)\n   - Admin/email batches (30 min)\n   - Break protocols\n3. **Priority Framework**: How to decide what to work on\n4. **End-of-Day Review** (15 min): Reflection template\n5. **Weekly Review**: Sunday planning session outline\n\nInclude specific tools/apps recommendations and habit triggers.',
    v_cat_id, v_user_id
  ) RETURNING id INTO v_prompt_id;
  INSERT INTO public.prompt_tags (prompt_id, tag_id) SELECT v_prompt_id, id FROM public.tags WHERE slug IN ('productivity', 'business', 'claude');

  -- ==========================================
  -- 9. API Documentation Writer
  -- ==========================================
  SELECT id INTO v_cat_id FROM public.categories WHERE slug = 'coding';
  INSERT INTO public.prompts (title, title_ar, description, description_ar, prompt_text, category_id, user_id)
  VALUES (
    'API Documentation Writer',
    'كاتب توثيق واجهات البرمجة',
    'Generate professional API documentation with endpoints, parameters, examples, and error codes.',
    'أنشئ توثيقاً احترافياً لواجهات البرمجة مع نقاط النهاية والمعاملات والأمثلة وأكواد الأخطاء.',
    E'Write API documentation for the following endpoint:\n\n**Endpoint**: [METHOD] [PATH]\n**Description**: [WHAT IT DOES]\n**Auth**: [AUTH TYPE]\n\nGenerate documentation with:\n\n### Request\n- URL parameters (with types and constraints)\n- Query parameters (with defaults)\n- Request body schema (JSON with TypeScript types)\n- Headers required\n\n### Response\n- Success response (200) with full JSON example\n- Error responses (400, 401, 403, 404, 500) with error codes\n\n### Code Examples\n- cURL\n- JavaScript (fetch)\n- Python (requests)\n\n### Rate Limiting\n- Limits and headers\n\n### Notes\n- Pagination details\n- Filtering/sorting options\n- Deprecation notices',
    v_cat_id, v_user_id
  ) RETURNING id INTO v_prompt_id;
  INSERT INTO public.prompt_tags (prompt_id, tag_id) SELECT v_prompt_id, id FROM public.tags WHERE slug IN ('coding', 'writing', 'gpt-4o');

  -- ==========================================
  -- 10. Social Media Content Calendar
  -- ==========================================
  SELECT id INTO v_cat_id FROM public.categories WHERE slug = 'marketing';
  INSERT INTO public.prompts (title, title_ar, description, description_ar, prompt_text, category_id, user_id)
  VALUES (
    'Social Media Content Calendar',
    'تقويم محتوى وسائل التواصل',
    'Plan a month of social media content across platforms with post ideas, captions, and optimal posting times.',
    'خطط لمحتوى شهر كامل على وسائل التواصل الاجتماعي عبر المنصات مع أفكار ونصوص وأوقات نشر مثالية.',
    E'Create a 30-day social media content calendar:\n\n**Brand/Business**: [NAME]\n**Industry**: [INDUSTRY]\n**Platforms**: [INSTAGRAM/TWITTER/LINKEDIN/TIKTOK]\n**Goals**: [AWARENESS/ENGAGEMENT/LEADS/SALES]\n**Brand Voice**: [PROFESSIONAL/CASUAL/HUMOROUS/EDUCATIONAL]\n\nFor each day provide:\n- **Platform**: Which platform(s)\n- **Content Type**: Carousel, Reel, Story, Thread, Post\n- **Topic/Theme**: What the post is about\n- **Caption**: Ready-to-post caption with hashtags\n- **Visual Direction**: Brief description for designer\n- **Best Time to Post**: Optimal time for the platform\n- **CTA**: What action should the audience take\n\nInclude:\n- 4 pillar content themes (rotate weekly)\n- 2 trending/reactive content slots per week\n- 1 user-generated content day per week\n- Engagement prompts (polls, questions, challenges)',
    v_cat_id, v_user_id
  ) RETURNING id INTO v_prompt_id;
  INSERT INTO public.prompt_tags (prompt_id, tag_id) SELECT v_prompt_id, id FROM public.tags WHERE slug IN ('marketing', 'creative', 'seo');

  -- ==========================================
  -- 11. Language Learning Tutor
  -- ==========================================
  SELECT id INTO v_cat_id FROM public.categories WHERE slug = 'education';
  INSERT INTO public.prompts (title, title_ar, description, description_ar, prompt_text, category_id, user_id)
  VALUES (
    'Language Learning Tutor',
    'معلم تعلّم اللغات',
    'Practice any language with an AI tutor that adapts to your level and teaches through conversation.',
    'تدرّب على أي لغة مع معلم ذكاء اصطناعي يتكيف مع مستواك ويعلّم من خلال المحادثة.',
    E'You are a patient, encouraging language tutor for [LANGUAGE].\n\nMy level: [BEGINNER/INTERMEDIATE/ADVANCED]\nMy native language: [LANGUAGE]\nFocus area: [GRAMMAR/VOCABULARY/CONVERSATION/PRONUNCIATION]\n\nTeaching method:\n1. Start each session with a warm-up question in [LANGUAGE]\n2. If I make errors, gently correct with explanation\n3. Introduce 3-5 new vocabulary words per session\n4. Use real-world scenarios (ordering food, asking directions, etc.)\n5. End with a quick quiz on what we covered\n\nRules:\n- Always provide translations in parentheses for new words\n- Use simple language first, then build complexity\n- Celebrate progress with encouraging feedback\n- If I''m stuck, give hints before the answer\n- Track vocabulary I''ve learned across our conversation',
    v_cat_id, v_user_id
  ) RETURNING id INTO v_prompt_id;
  INSERT INTO public.prompt_tags (prompt_id, tag_id) SELECT v_prompt_id, id FROM public.tags WHERE slug IN ('education', 'translation', 'claude');

  -- ==========================================
  -- 12. Fullstack App Architecture Planner
  -- ==========================================
  SELECT id INTO v_cat_id FROM public.categories WHERE slug = 'coding';
  INSERT INTO public.prompts (title, title_ar, description, description_ar, prompt_text, category_id, user_id)
  VALUES (
    'Fullstack App Architecture Planner',
    'مخطط هيكل التطبيقات الكاملة',
    'Design the complete architecture for a fullstack application with tech stack recommendations and database schema.',
    'صمّم الهيكل الكامل لتطبيق متكامل مع توصيات التقنيات ومخطط قاعدة البيانات.',
    E'Design the architecture for: [APP DESCRIPTION]\n\n**Requirements**: [KEY FEATURES]\n**Scale**: [USERS EXPECTED]\n**Budget**: [STARTUP/MEDIUM/ENTERPRISE]\n\nProvide:\n\n### 1. Tech Stack Recommendation\n- Frontend framework + reasoning\n- Backend/API approach\n- Database (SQL vs NoSQL with justification)\n- Auth solution\n- Hosting/deployment\n\n### 2. Database Schema\n- Tables/collections with relationships\n- Key indexes for performance\n- Migration strategy\n\n### 3. API Design\n- RESTful endpoints or GraphQL schema\n- Authentication flow\n- Rate limiting strategy\n\n### 4. Frontend Architecture\n- Component hierarchy\n- State management approach\n- Routing structure\n\n### 5. DevOps\n- CI/CD pipeline\n- Monitoring & logging\n- Scaling strategy\n\n### 6. Security Checklist\n- Auth best practices\n- Data encryption\n- Input validation',
    v_cat_id, v_user_id
  ) RETURNING id INTO v_prompt_id;
  INSERT INTO public.prompt_tags (prompt_id, tag_id) SELECT v_prompt_id, id FROM public.tags WHERE slug IN ('coding', 'business', 'claude');

END $$;
