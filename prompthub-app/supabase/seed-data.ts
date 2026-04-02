// Seed data for Syntaxa — used by /api/seed route
// Comprehensive test data covering all categories, edge cases, and varied content lengths

export const categories = [
  { name: "Writing", name_ar: "الكتابة", slug: "writing" },
  { name: "Coding", name_ar: "البرمجة", slug: "coding" },
  { name: "Marketing", name_ar: "التسويق", slug: "marketing" },
  { name: "Education", name_ar: "التعليم", slug: "education" },
  { name: "Business", name_ar: "الأعمال", slug: "business" },
  { name: "Creative", name_ar: "الإبداع", slug: "creative" },
  { name: "Productivity", name_ar: "الإنتاجية", slug: "productivity" },
  { name: "Other", name_ar: "أخرى", slug: "other" },
] as const;

export const tags = [
  "gpt-4", "gpt-4o", "claude", "gemini", "midjourney",
  "dall-e", "stable-diffusion", "coding", "writing", "marketing",
  "seo", "portrait", "landscape", "productivity", "education",
  "creative", "business", "data-analysis", "summarization", "translation",
] as const;

export type SeedPrompt = {
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  prompt_text: string;
  category_slug: string;
  tag_slugs: string[];
  link?: string;
  views_count?: number;
  likes_count?: number;
  type?: "text" | "image" | "video";
  image_url?: string;
};

export const prompts: SeedPrompt[] = [
  // ═══════════════════════════════════════════
  // CODING (6 prompts — varied complexity)
  // ═══════════════════════════════════════════
  {
    title: "Senior React Code Reviewer",
    title_ar: "مراجع كود React متقدم",
    description: "Get a thorough code review from a senior React engineer. Identifies bugs, performance issues, accessibility gaps, and suggests improvements with severity labels.",
    description_ar: "احصل على مراجعة شاملة للكود من مهندس React متقدم. يحدد الأخطاء ومشاكل الأداء وثغرات الوصول ويقترح تحسينات مع تصنيفات الخطورة.",
    prompt_text: `You are a senior React engineer with 10+ years of experience. Review the following code and provide:

1. **Bugs & Issues**: Any logic errors, race conditions, or potential crashes
2. **Performance**: Unnecessary re-renders, missing memoization, heavy computations
3. **Best Practices**: Component structure, hook usage, naming conventions
4. **Security**: XSS vulnerabilities, unsafe data handling
5. **Accessibility**: Missing ARIA labels, keyboard navigation issues

Format your review as a numbered list with severity labels: 🔴 Critical, 🟡 Warning, 🟢 Suggestion

Code to review:
[PASTE YOUR CODE HERE]`,
    category_slug: "coding",
    tag_slugs: ["coding", "claude", "gpt-4"],
    views_count: 1847,
    likes_count: 312,
  },
  {
    title: "Python Data Pipeline Architect",
    title_ar: "مهندس خطوط بيانات بايثون",
    description: "Transform raw data questions into production-ready Python pandas pipelines with error handling, logging, and visualization.",
    description_ar: "حوّل أسئلة البيانات الخام إلى خطوط إنتاج بايثون جاهزة للإنتاج مع معالجة الأخطاء والتسجيل والتصور.",
    prompt_text: `You are a data engineering expert. Given a dataset description, write a production-ready Python pipeline that:

1. **Loads & Validates** data (schema validation, type checking, null handling)
2. **Transforms** with clear step-by-step operations (each in its own function)
3. **Visualizes** key patterns using matplotlib/seaborn (at least 3 publication-ready charts)
4. **Exports** results to CSV/JSON with metadata
5. **Logs** every step with Python's logging module

Requirements:
- Type hints on all functions
- Docstrings with examples
- Unit test stubs for each transform function
- Memory-efficient: use chunked reading for large files

Dataset: [DESCRIBE YOUR DATA]
Questions to answer: [YOUR QUESTIONS]`,
    category_slug: "coding",
    tag_slugs: ["coding", "data-analysis", "gpt-4o"],
    views_count: 2103,
    likes_count: 445,
  },
  {
    title: "Fullstack App Architecture Planner",
    title_ar: "مخطط هيكل التطبيقات الكاملة",
    description: "Design the complete architecture for a fullstack application with tech stack recommendations, database schema, API design, and deployment strategy.",
    description_ar: "صمّم الهيكل الكامل لتطبيق متكامل مع توصيات التقنيات ومخطط قاعدة البيانات وتصميم الواجهة واستراتيجية النشر.",
    prompt_text: `Design the architecture for: [APP DESCRIPTION]

**Requirements**: [KEY FEATURES]
**Scale**: [USERS EXPECTED]
**Budget**: [STARTUP/MEDIUM/ENTERPRISE]

Provide:

### 1. Tech Stack Recommendation
- Frontend framework + reasoning
- Backend/API approach
- Database (SQL vs NoSQL with justification)
- Auth solution
- Hosting/deployment

### 2. Database Schema
- Tables/collections with relationships
- Key indexes for performance
- Migration strategy

### 3. API Design
- RESTful endpoints or GraphQL schema
- Authentication flow
- Rate limiting strategy

### 4. Frontend Architecture
- Component hierarchy
- State management approach
- Routing structure

### 5. DevOps
- CI/CD pipeline
- Monitoring & logging
- Scaling strategy`,
    category_slug: "coding",
    tag_slugs: ["coding", "business", "claude"],
    views_count: 956,
    likes_count: 189,
  },
  {
    title: "API Documentation Writer",
    title_ar: "كاتب توثيق واجهات البرمجة",
    description: "Generate professional API documentation with endpoints, parameters, code examples in multiple languages, and error codes.",
    description_ar: "أنشئ توثيقاً احترافياً لواجهات البرمجة مع نقاط النهاية والمعاملات وأمثلة الكود بعدة لغات وأكواد الأخطاء.",
    prompt_text: `Write API documentation for the following endpoint:

**Endpoint**: [METHOD] [PATH]
**Description**: [WHAT IT DOES]
**Auth**: [AUTH TYPE]

Generate:
- URL parameters, query parameters, request body schema
- Success response (200) with full JSON example
- Error responses (400, 401, 403, 404, 500)
- Code examples: cURL, JavaScript (fetch), Python (requests)
- Rate limiting details and pagination`,
    category_slug: "coding",
    tag_slugs: ["coding", "writing", "gpt-4o"],
    views_count: 634,
    likes_count: 98,
  },
  {
    // SHORT title + description edge case
    title: "Git Commit Fixer",
    title_ar: "مصلح رسائل Git",
    description: "Rewrite messy git commit messages into conventional commits format.",
    description_ar: "أعد كتابة رسائل الإيداع الفوضوية بتنسيق الإيداعات التقليدية.",
    prompt_text: `Rewrite this git commit message into Conventional Commits format (type(scope): description).

Rules:
- type: feat, fix, docs, style, refactor, test, chore
- scope: optional, lowercase
- description: imperative mood, no period, under 72 chars
- body: explain WHY, not what (optional)
- footer: BREAKING CHANGE if applicable

Original message: [PASTE COMMIT MESSAGE]`,
    category_slug: "coding",
    tag_slugs: ["coding", "gpt-4"],
    views_count: 3201,
    likes_count: 567,
  },
  {
    title: "SQL Query Optimizer & Explainer",
    title_ar: "محسّن ومفسّر استعلامات SQL",
    description: "Paste any SQL query and get an optimized version with execution plan analysis, index recommendations, and plain English explanation of what it does.",
    description_ar: "الصق أي استعلام SQL واحصل على نسخة محسّنة مع تحليل خطة التنفيذ وتوصيات الفهارس وشرح بلغة بسيطة.",
    prompt_text: `Analyze and optimize this SQL query:

\`\`\`sql
[PASTE YOUR SQL HERE]
\`\`\`

Provide:
1. **Plain English**: What does this query do? (one paragraph)
2. **Performance Issues**: Identify N+1 queries, missing indexes, full table scans
3. **Optimized Version**: Rewritten query with comments explaining changes
4. **Index Recommendations**: CREATE INDEX statements needed
5. **Estimated Impact**: Before/after comparison (order of magnitude)`,
    category_slug: "coding",
    tag_slugs: ["coding", "data-analysis", "claude"],
    views_count: 1455,
    likes_count: 278,
  },

  // ═══════════════════════════════════════════
  // WRITING (5 prompts)
  // ═══════════════════════════════════════════
  {
    title: "Blog Post Generator — SEO Optimized",
    title_ar: "مولّد مقالات مدونة محسّنة للسيو",
    description: "Generate a well-structured, SEO-optimized blog post on any topic with proper headings, meta description, internal linking suggestions, and a compelling hook.",
    description_ar: "أنشئ مقال مدونة منظم ومحسّن لمحركات البحث حول أي موضوع مع عناوين ووصف ميتا واقتراحات روابط داخلية.",
    prompt_text: `Write a comprehensive blog post about [TOPIC]. Follow this structure:

**Title**: Compelling, SEO-friendly (60 chars max)
**Meta Description**: 155 characters
**Introduction**: Hook with a surprising fact or question (150 words)

**Main Content** (3-5 sections):
- Each section with an H2 heading
- Practical examples and actionable tips
- Bullet points for scanability
- Statistics where applicable

**Conclusion**: Key takeaways + clear CTA

**Tone**: Professional yet conversational
**Word Count**: 1,500-2,000 words
**Target Audience**: [SPECIFY]`,
    category_slug: "writing",
    tag_slugs: ["writing", "seo", "gpt-4o"],
    views_count: 4521,
    likes_count: 892,
  },
  {
    title: "Technical Writing Style Guide Enforcer",
    title_ar: "مطبّق دليل أسلوب الكتابة التقنية",
    description: "Paste any technical document and get it rewritten to match industry-standard technical writing guidelines — clear, concise, and consistent.",
    description_ar: "الصق أي مستند تقني واحصل على إعادة كتابته ليطابق معايير الكتابة التقنية — واضح وموجز ومتسق.",
    prompt_text: `Rewrite this technical document following these rules:

1. **Active voice** over passive (e.g., "Click Save" not "Save should be clicked")
2. **Present tense** (e.g., "The system displays" not "The system will display")
3. **One idea per sentence** — break long sentences
4. **Consistent terminology** — flag and unify synonyms
5. **Numbered steps** for procedures
6. **Avoid jargon** or define it on first use

Input text:
[PASTE YOUR DOCUMENT]

Output: Rewritten text + a changelog of what was modified and why.`,
    category_slug: "writing",
    tag_slugs: ["writing", "coding", "claude"],
    views_count: 876,
    likes_count: 145,
  },
  {
    // VERY LONG description edge case
    title: "Novel Chapter Outliner & Scene Builder",
    title_ar: "مخطط فصول الرواية وبناء المشاهد",
    description: "Build detailed chapter outlines for your novel with scene-by-scene breakdowns, character arcs, tension curves, dialogue beats, and pacing notes. Perfect for both plotters who plan everything and pantsers who need structure without losing spontaneity. Works for any genre from literary fiction to sci-fi thriller.",
    description_ar: "ابنِ مخططات فصول مفصّلة لروايتك مع تحليل مشهد بمشهد وأقواس الشخصيات ومنحنيات التوتر ونبضات الحوار وملاحظات الإيقاع. مثالي للمخططين والكتاب العفويين على حد سواء.",
    prompt_text: `Help me outline Chapter [NUMBER] of my novel.

Genre: [GENRE]
Previous chapter summary: [BRIEF SUMMARY]
Main characters in this chapter: [NAMES & ROLES]
Chapter goal: [WHAT MUST HAPPEN]

Create:
1. **Opening Hook**: First paragraph that pulls readers in
2. **Scene Breakdown**: 3-5 scenes with:
   - POV character
   - Setting (time, place, sensory details)
   - Conflict/tension
   - Key dialogue beats
   - Emotional arc
3. **Chapter Climax**: The turning point
4. **Closing Line**: Last sentence that compels page-turning
5. **Pacing Notes**: Fast/slow/medium for each scene
6. **Foreshadowing**: Subtle hints to plant for later chapters`,
    category_slug: "writing",
    tag_slugs: ["writing", "creative", "claude"],
    views_count: 1233,
    likes_count: 334,
  },
  {
    title: "Cover Letter That Gets Interviews",
    title_ar: "خطاب تقديم يحصل على مقابلات",
    description: "Generate a tailored cover letter that highlights relevant experience and matches the job description tone.",
    description_ar: "أنشئ خطاب تقديم مخصص يبرز الخبرة ذات الصلة ويطابق نبرة الوصف الوظيفي.",
    prompt_text: `Write a cover letter for this position:

**Job Title**: [TITLE]
**Company**: [COMPANY]
**Job Description**: [PASTE KEY REQUIREMENTS]

**My Background**: [BRIEF RESUME SUMMARY]
**Why This Company**: [YOUR GENUINE REASON]

Rules:
- 3 paragraphs max (250-350 words total)
- Open with a specific achievement, not "I am writing to apply..."
- Match 3 key requirements to my experience with concrete examples
- Close with confidence, not desperation
- Sound human, not AI-generated`,
    category_slug: "writing",
    tag_slugs: ["writing", "business", "gpt-4"],
    views_count: 5678,
    likes_count: 1203,
  },
  {
    // MINIMAL prompt_text edge case
    title: "One-Line Story Expander",
    title_ar: "موسّع القصة من سطر واحد",
    description: "Give it a single sentence and it expands into a complete flash fiction story.",
    description_ar: "أعطه جملة واحدة ويوسعها إلى قصة قصيرة جداً كاملة.",
    prompt_text: `Expand this one sentence into a 500-word flash fiction story with a twist ending: "[YOUR SENTENCE]"`,
    category_slug: "writing",
    tag_slugs: ["writing", "creative"],
    views_count: 2340,
    likes_count: 456,
  },

  // ═══════════════════════════════════════════
  // MARKETING (4 prompts)
  // ═══════════════════════════════════════════
  {
    title: "Product Launch Email Sequence",
    title_ar: "سلسلة رسائل إطلاق المنتج",
    description: "Create a 5-email sequence for launching a new product — from mystery teaser to final urgency call. Each email includes subject lines, preview text, and full copy.",
    description_ar: "أنشئ سلسلة من 5 رسائل بريد إلكتروني لإطلاق منتج جديد — من التشويق الغامض إلى نداء الإلحاح النهائي.",
    prompt_text: `Create a 5-email product launch sequence for [PRODUCT NAME].

Product: [DESCRIPTION]
Audience: [TARGET]
Price: [PRICE]
Launch date: [DATE]

Emails:
1. **Teaser** (3 days before): Build curiosity
2. **Reveal** (1 day before): Key benefits
3. **Launch Day**: Full pitch + social proof + urgency
4. **Follow-up** (day 2): Address objections, testimonials
5. **Last Chance** (day 5): Final urgency + bonus

Each email: subject line (+ 2 alternatives), preview text, body (200-300 words), CTA button text.`,
    category_slug: "marketing",
    tag_slugs: ["marketing", "business", "gpt-4"],
    views_count: 3456,
    likes_count: 678,
  },
  {
    title: "Social Media Content Calendar — 30 Days",
    title_ar: "تقويم محتوى 30 يوم لوسائل التواصل",
    description: "Plan a full month of social media content across platforms with post ideas, ready-to-use captions, hashtags, and optimal posting times.",
    description_ar: "خطط لمحتوى شهر كامل على وسائل التواصل الاجتماعي مع أفكار منشورات ونصوص جاهزة وهاشتاقات وأوقات نشر مثالية.",
    prompt_text: `Create a 30-day social media content calendar:

**Brand**: [NAME]
**Industry**: [INDUSTRY]
**Platforms**: [INSTAGRAM/TWITTER/LINKEDIN/TIKTOK]
**Goals**: [AWARENESS/ENGAGEMENT/LEADS/SALES]
**Voice**: [PROFESSIONAL/CASUAL/HUMOROUS/EDUCATIONAL]

For each day:
- Platform + content type (carousel, reel, story, thread)
- Topic/theme
- Ready-to-post caption with hashtags
- Visual direction for designer
- Best posting time
- CTA

Include 4 pillar themes rotating weekly and 2 reactive content slots per week.`,
    category_slug: "marketing",
    tag_slugs: ["marketing", "creative", "seo"],
    views_count: 2789,
    likes_count: 534,
  },
  {
    title: "Landing Page Copy Framework",
    title_ar: "إطار نصوص صفحة الهبوط",
    description: "Generate high-converting landing page copy using the PAS (Problem-Agitate-Solution) framework with headline variants and social proof sections.",
    description_ar: "أنشئ نصوص صفحة هبوط عالية التحويل باستخدام إطار المشكلة-الإثارة-الحل مع متغيرات العناوين وأقسام الإثبات الاجتماعي.",
    prompt_text: `Write landing page copy for: [PRODUCT/SERVICE]

Use the PAS framework:
1. **Problem**: What pain does the audience feel? (2-3 sentences)
2. **Agitate**: Make the pain vivid and urgent (2-3 sentences)
3. **Solution**: Present your product as the answer

Sections to write:
- **Hero**: Headline (5 variants) + subheadline + CTA
- **Features**: 3-4 key features with benefit-focused descriptions
- **Social Proof**: Testimonial templates (3 different formats)
- **FAQ**: 5 objection-handling questions
- **Final CTA**: Urgency-driven closing section

Target audience: [WHO]
Desired action: [SIGN UP/BUY/BOOK DEMO]`,
    category_slug: "marketing",
    tag_slugs: ["marketing", "writing", "gpt-4o"],
    views_count: 1567,
    likes_count: 289,
  },
  {
    title: "Competitor Analysis Deep Dive",
    title_ar: "تحليل المنافسين المعمّق",
    description: "Analyze competitors' strengths, weaknesses, positioning, and find gaps your brand can exploit.",
    description_ar: "حلّل نقاط قوة وضعف المنافسين وتموضعهم وابحث عن فجوات يمكن لعلامتك استغلالها.",
    prompt_text: `Analyze these competitors for [YOUR BRAND]:

Competitors: [LIST 3-5 COMPETITORS]
Your industry: [INDUSTRY]

For each competitor, analyze:
1. **Positioning**: How they describe themselves
2. **Strengths**: What they do better than you
3. **Weaknesses**: Where they fall short
4. **Pricing**: Their model vs yours
5. **Content Strategy**: What content they produce
6. **Customer Sentiment**: Common praises and complaints

Then provide:
- **Gap Analysis**: Opportunities they're all missing
- **Your Unique Angle**: How to position differently
- **Quick Wins**: 3 things to implement this week`,
    category_slug: "marketing",
    tag_slugs: ["marketing", "business", "claude"],
    views_count: 987,
    likes_count: 176,
  },

  // ═══════════════════════════════════════════
  // EDUCATION (3 prompts)
  // ═══════════════════════════════════════════
  {
    title: "Interactive Lesson Plan Builder",
    title_ar: "مُنشئ خطط دروس تفاعلية",
    description: "Create detailed lesson plans with differentiated instruction strategies, formative assessments, and cross-curricular connections.",
    description_ar: "أنشئ خطط دروس مفصّلة مع استراتيجيات تعليم متمايز وتقييمات تكوينية وروابط عبر المناهج.",
    prompt_text: `Design a comprehensive lesson plan:

**Subject**: [SUBJECT]
**Grade Level**: [GRADE]
**Duration**: [TIME]
**Learning Objectives**: [OBJECTIVES]

Structure:
1. **Warm-Up** (5-10 min): Engaging hook
2. **Direct Instruction** (15-20 min): Core content
3. **Guided Practice** (10-15 min): Teacher-supported
4. **Independent Practice** (10-15 min): Student-led
5. **Closure** (5 min): Summary + exit ticket

Include differentiation (advanced/on-level/struggling), materials list, assessment rubric, and homework.`,
    category_slug: "education",
    tag_slugs: ["education", "writing", "claude"],
    views_count: 1890,
    likes_count: 367,
  },
  {
    title: "Language Learning Conversation Partner",
    title_ar: "شريك محادثة لتعلّم اللغات",
    description: "Practice any language with an AI tutor that adapts to your level, corrects mistakes gently, and teaches through natural conversation.",
    description_ar: "تدرّب على أي لغة مع معلم ذكاء اصطناعي يتكيف مع مستواك ويصحح الأخطاء بلطف ويعلّم عبر محادثة طبيعية.",
    prompt_text: `You are a patient language tutor for [LANGUAGE].

Level: [BEGINNER/INTERMEDIATE/ADVANCED]
Native language: [LANGUAGE]
Focus: [GRAMMAR/VOCABULARY/CONVERSATION]

Method:
1. Start with a warm-up question in target language
2. Correct errors gently with explanation
3. Introduce 3-5 new words per session
4. Use real-world scenarios
5. End with a quick quiz

Rules:
- Translations in parentheses for new words
- Simple → complex progression
- Encouraging feedback
- Track vocabulary across conversations`,
    category_slug: "education",
    tag_slugs: ["education", "translation", "claude"],
    views_count: 4123,
    likes_count: 789,
  },
  {
    title: "Exam Question Generator with Answer Key",
    title_ar: "مولّد أسئلة امتحانات مع إجابات",
    description: "Generate varied exam questions (multiple choice, short answer, essay) at different Bloom's taxonomy levels with a complete answer key.",
    description_ar: "أنشئ أسئلة امتحان متنوعة (اختيارات، إجابات قصيرة، مقالية) بمستويات مختلفة من تصنيف بلوم مع مفتاح إجابات كامل.",
    prompt_text: `Generate an exam for:

**Subject**: [SUBJECT]
**Topic**: [SPECIFIC TOPIC]
**Level**: [GRADE/UNIVERSITY LEVEL]
**Duration**: [EXAM TIME]

Create:
- 10 Multiple choice (4 options each, 1 correct)
- 5 Short answer (2-3 sentences expected)
- 2 Essay questions (paragraph-length)

Requirements:
- Questions span Remember → Analyze → Create (Bloom's taxonomy)
- Include at least 2 application-based scenarios
- Provide complete answer key with explanations
- Mark difficulty: Easy (40%), Medium (40%), Hard (20%)
- Total marks: 100`,
    category_slug: "education",
    tag_slugs: ["education", "gpt-4"],
    views_count: 2567,
    likes_count: 498,
  },

  // ═══════════════════════════════════════════
  // BUSINESS (3 prompts)
  // ═══════════════════════════════════════════
  {
    title: "Business Model Canvas Generator",
    title_ar: "مولّد نموذج العمل التجاري",
    description: "Generate a complete Business Model Canvas for any startup idea with SWOT analysis, competitive advantage, and go-to-market strategy.",
    description_ar: "أنشئ نموذج عمل تجاري كامل لأي فكرة ناشئة مع تحليل SWOT والميزة التنافسية واستراتيجية الدخول للسوق.",
    prompt_text: `Create a Business Model Canvas for: [BUSINESS IDEA]

Fill each section with 3-5 bullets:
1. Customer Segments
2. Value Propositions
3. Channels
4. Customer Relationships
5. Revenue Streams
6. Key Resources
7. Key Activities
8. Key Partnerships
9. Cost Structure

Then provide SWOT Analysis, Competitive Advantage, Go-to-Market (first 90 days), and Unit Economics.`,
    category_slug: "business",
    tag_slugs: ["business", "productivity", "gpt-4"],
    views_count: 3678,
    likes_count: 712,
  },
  {
    title: "Investor Pitch Deck Script",
    title_ar: "سيناريو عرض المستثمرين",
    description: "Create a compelling 10-slide pitch deck script with talking points, data suggestions, and anticipated investor questions.",
    description_ar: "أنشئ سيناريو عرض تقديمي مقنع من 10 شرائح مع نقاط حوار واقتراحات بيانات وأسئلة متوقعة من المستثمرين.",
    prompt_text: `Write a pitch deck script for: [STARTUP NAME]

**Problem**: [THE PAIN POINT]
**Solution**: [YOUR PRODUCT]
**Traction**: [CURRENT METRICS]
**Ask**: [FUNDING AMOUNT]

Create 10 slides:
1. Title + one-liner
2. Problem (make it visceral)
3. Solution (demo-ready description)
4. Market size (TAM/SAM/SOM)
5. Business model
6. Traction & milestones
7. Competition (your advantage)
8. Team (why you)
9. Financials (3-year projection)
10. The Ask + use of funds

For each slide: title, 3-4 bullet points, 30-second talking script, and suggested visual.`,
    category_slug: "business",
    tag_slugs: ["business", "marketing", "claude"],
    views_count: 1234,
    likes_count: 234,
  },
  {
    title: "Meeting Notes to Action Items",
    title_ar: "تحويل ملاحظات الاجتماع لمهام",
    description: "Paste raw meeting notes and get structured minutes with action items, owners, deadlines, and follow-up questions.",
    description_ar: "الصق ملاحظات الاجتماع الخام واحصل على محضر منظم مع مهام ومسؤولين ومواعيد وأسئلة متابعة.",
    prompt_text: `Convert these meeting notes into structured minutes:

[PASTE RAW NOTES]

Output format:
## Meeting Summary (2-3 sentences)
## Key Decisions Made
## Action Items
| # | Task | Owner | Deadline | Priority |
## Open Questions
## Next Meeting Topics`,
    category_slug: "business",
    tag_slugs: ["business", "productivity", "summarization"],
    views_count: 6789,
    likes_count: 1456,
  },

  // ═══════════════════════════════════════════
  // CREATIVE (4 prompts)
  // ═══════════════════════════════════════════
  {
    title: "Midjourney Cinematic Scene Composer",
    title_ar: "مؤلف مشاهد سينمائية ميدجورني",
    description: "Generate detailed Midjourney prompts for cinematic, movie-quality scenes with precise lighting, composition, and mood direction.",
    description_ar: "أنشئ برومبتات ميدجورني مفصّلة لمشاهد سينمائية بجودة الأفلام مع إضاءة وتكوين ومزاج دقيق.",
    prompt_text: `Create a Midjourney prompt for: [SCENE IDEA]

Structure: [Subject], [environment], [lighting], [camera angle], [mood], [style], [parameters]

Output 4 variations:
1. **Dramatic**: High contrast, intense
2. **Ethereal**: Soft, dreamlike
3. **Gritty**: Raw, realistic
4. **Stylized**: Bold colors, graphic

Add: --ar 16:9 --v 6 --style raw --s 750`,
    category_slug: "creative",
    tag_slugs: ["midjourney", "creative", "portrait", "landscape"],
    views_count: 5432,
    likes_count: 1089,
    type: "image",
    image_url: "https://images.unsplash.com/photo-1634017839464-5c339eba3df4?w=800&q=80",
  },
  {
    title: "DALL-E Product Mockup Generator",
    title_ar: "مولّد نماذج منتجات DALL-E",
    description: "Create photorealistic product mockup prompts for DALL-E — packaging, devices, merchandise, all in professional studio lighting.",
    description_ar: "أنشئ برومبتات نماذج منتجات واقعية لـ DALL-E — تغليف وأجهزة وبضائع بإضاءة استوديو احترافية.",
    prompt_text: `Generate a DALL-E prompt for a product mockup:

**Product**: [DESCRIBE THE PRODUCT]
**Style**: [MINIMAL/LUXURY/PLAYFUL/TECH]
**Background**: [WHITE STUDIO/LIFESTYLE/FLAT LAY/IN-USE]
**Angle**: [FRONT/3-QUARTER/TOP-DOWN/HERO SHOT]

Include: soft studio lighting, shallow depth of field, 8K quality, product photography style.

Generate 3 prompt variants: editorial, e-commerce, and social media ad style.`,
    category_slug: "creative",
    tag_slugs: ["dall-e", "creative", "marketing"],
    views_count: 1876,
    likes_count: 345,
    type: "image",
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
  },
  {
    title: "Brand Identity Concept Generator",
    title_ar: "مولّد مفاهيم هوية العلامة",
    description: "Generate a complete brand identity concept including name options, color palette, typography suggestions, logo direction, and brand voice guidelines.",
    description_ar: "أنشئ مفهوم هوية علامة تجارية كامل يتضمن خيارات أسماء ولوحة ألوان واقتراحات خطوط واتجاه الشعار وإرشادات صوت العلامة.",
    prompt_text: `Create a brand identity concept for:

**Business type**: [WHAT YOU DO]
**Target audience**: [WHO]
**Competitors**: [2-3 COMPETITORS]
**Values**: [3-5 BRAND VALUES]
**Vibe**: [MODERN/CLASSIC/PLAYFUL/PREMIUM/MINIMAL]

Generate:
1. **Name Options**: 5 brand names with domain availability check format
2. **Color Palette**: Primary, secondary, accent (with hex codes)
3. **Typography**: Heading + body font pairing recommendations
4. **Logo Direction**: 3 concept descriptions
5. **Brand Voice**: Tone of voice guidelines with do/don't examples
6. **Tagline Options**: 5 taglines`,
    category_slug: "creative",
    tag_slugs: ["creative", "business", "marketing"],
    views_count: 2345,
    likes_count: 467,
    type: "image",
    image_url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
  },
  {
    // NO TAGS edge case
    title: "Abstract Art Prompt Randomizer",
    title_ar: "مولّد عشوائي لفن تجريدي",
    description: "Generate unexpected abstract art prompts by combining random elements — textures, emotions, music genres, and natural phenomena.",
    description_ar: "أنشئ برومبتات فن تجريدي غير متوقعة بدمج عناصر عشوائية — قوام ومشاعر وأنواع موسيقى وظواهر طبيعية.",
    prompt_text: `Generate 5 abstract art prompts by combining:

Random texture: [CHOOSE: marble / rust / silk / bark / glass / smoke]
Random emotion: [CHOOSE: nostalgia / rage / serenity / wonder / grief]
Random music: [CHOOSE: jazz / metal / classical / ambient / hip-hop]
Random nature: [CHOOSE: aurora / tsunami / bloom / erosion / lightning]

For each combination, write a detailed visual art prompt suitable for Midjourney or Stable Diffusion.`,
    category_slug: "creative",
    tag_slugs: [],
    views_count: 432,
    likes_count: 67,
    type: "image",
    image_url: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&q=80",
  },

  // ═══════════════════════════════════════════
  // PRODUCTIVITY (3 prompts)
  // ═══════════════════════════════════════════
  {
    title: "Daily Productivity System Designer",
    title_ar: "مصمم نظام إنتاجية يومي",
    description: "Design a personalized daily productivity system based on your role, goals, energy patterns, and biggest time wasters.",
    description_ar: "صمّم نظام إنتاجية يومي مخصص بناءً على دورك وأهدافك وأنماط طاقتك وأكبر مضيعات الوقت.",
    prompt_text: `Design my personalized productivity system:

**Role**: [YOUR ROLE]
**Top 3 Goals**: [GOALS]
**Hours**: [START]-[END]
**Peak Energy**: [MORNING/AFTERNOON/EVENING]
**Time Wasters**: [LIST THEM]

Create:
1. Morning Routine (30 min)
2. Time-Blocked Schedule (90-min deep work + 30-min admin)
3. Priority Framework
4. End-of-Day Review (15 min)
5. Weekly Review outline

Include tool recommendations and habit triggers.`,
    category_slug: "productivity",
    tag_slugs: ["productivity", "business", "claude"],
    views_count: 3456,
    likes_count: 678,
  },
  {
    title: "Email Response Templates for Every Situation",
    title_ar: "قوالب رد بريد إلكتروني لكل موقف",
    description: "Get professional email templates for 10 common workplace situations — from declining meetings to delivering bad news.",
    description_ar: "احصل على قوالب بريد احترافية لـ 10 مواقف عمل شائعة — من رفض الاجتماعات إلى إيصال أخبار سيئة.",
    prompt_text: `Generate professional email templates for these 10 situations:

1. Declining a meeting politely
2. Following up after no response (3rd attempt)
3. Delivering bad news to a client
4. Asking for a deadline extension
5. Introducing yourself to a new team
6. Requesting feedback on your work
7. Escalating an issue to management
8. Thanking someone for a referral
9. Setting boundaries on after-hours communication
10. Resigning professionally

Each template: subject line, body (100-150 words), and what to customize.`,
    category_slug: "productivity",
    tag_slugs: ["productivity", "writing", "gpt-4o"],
    views_count: 7890,
    likes_count: 1678,
  },
  {
    title: "Decision Matrix Builder",
    title_ar: "بانِ مصفوفة القرارات",
    description: "Make better decisions by structuring your options into a weighted scoring matrix with clear criteria.",
    description_ar: "اتخذ قرارات أفضل بهيكلة خياراتك في مصفوفة تسجيل مرجحة بمعايير واضحة.",
    prompt_text: `Help me make this decision: [DESCRIBE THE DECISION]

Options I'm considering: [LIST 2-5 OPTIONS]

Steps:
1. Identify 5-7 evaluation criteria based on my situation
2. Assign weights (1-5) to each criterion
3. Score each option (1-10) on each criterion
4. Calculate weighted scores
5. Present the results in a clear table
6. Give your recommendation with reasoning
7. Identify what could change the outcome (sensitivity analysis)`,
    category_slug: "productivity",
    tag_slugs: ["productivity", "business"],
    views_count: 1234,
    likes_count: 234,
  },

  // ═══════════════════════════════════════════
  // OTHER (2 prompts — edge cases)
  // ═══════════════════════════════════════════
  {
    // NO ARABIC title/description edge case
    title: "Universal Prompt Improver",
    title_ar: "",
    description: "Paste any AI prompt and get an improved version with better structure, specificity, and output quality.",
    description_ar: "",
    prompt_text: `Improve this prompt. Make it:
1. More specific (add constraints, format requirements)
2. Better structured (clear sections, numbered steps)
3. Higher quality output (add examples, specify tone, define edge cases)
4. More efficient (remove ambiguity, reduce token waste)

Original prompt:
[PASTE YOUR PROMPT]

Output: The improved prompt + a brief explanation of what you changed and why.`,
    category_slug: "other",
    tag_slugs: ["gpt-4", "claude", "gpt-4o"],
    views_count: 9876,
    likes_count: 2345,
  },
  {
    // VERY LONG prompt_text edge case
    title: "The Ultimate System Prompt for Claude",
    title_ar: "برومبت النظام المطلق لكلود",
    description: "A comprehensive system prompt that configures Claude as an elite thinking partner — structured reasoning, multiple perspectives, and self-correction.",
    description_ar: "برومبت نظام شامل يُهيئ كلود كشريك تفكير متميز — تفكير منظم ووجهات نظر متعددة وتصحيح ذاتي.",
    prompt_text: `You are an elite thinking partner and knowledge synthesizer. Follow these operating principles in every response:

## Core Behaviors
1. **Think step by step** — break complex questions into sub-problems before answering
2. **Consider multiple perspectives** — present at least 2 viewpoints before recommending one
3. **Quantify when possible** — use numbers, percentages, and estimates instead of vague qualifiers
4. **Flag uncertainty** — explicitly state your confidence level (high/medium/low) and what would change your mind
5. **Be concise** — lead with the answer, then explain. Never pad with filler phrases

## Response Structure
- **TLDR** (1-2 sentences): The direct answer
- **Analysis**: Detailed reasoning with evidence
- **Alternatives**: What else could work and trade-offs
- **Action Items**: Specific next steps (if applicable)
- **Questions**: What I should ask myself or clarify

## Self-Correction Protocol
Before finalizing your response:
1. Re-read the question — did I actually answer what was asked?
2. Check for logical fallacies in my reasoning
3. Consider: what would a domain expert critique about my answer?
4. Verify any factual claims I'm making

## Communication Style
- Professional but human — like a brilliant colleague, not a textbook
- Use analogies to explain complex concepts
- Bold key takeaways for scanability
- Challenge assumptions respectfully when needed

## When I Say "Think Harder"
Re-examine your answer from scratch. Find the flaw in your reasoning. Consider the opposite conclusion. Then give me a better answer.`,
    category_slug: "other",
    tag_slugs: ["claude", "productivity", "writing"],
    views_count: 12345,
    likes_count: 3456,
    link: "https://claude.ai",
  },
];
