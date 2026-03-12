// Seed data for PromptHub — used by /api/seed route
// Each prompt includes both English and Arabic content

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
};

export const prompts: SeedPrompt[] = [
  {
    title: "Senior React Code Reviewer",
    title_ar: "مراجع كود React متقدم",
    description: "Get a thorough code review from a senior React engineer. Identifies bugs, performance issues, and suggests improvements.",
    description_ar: "احصل على مراجعة شاملة للكود من مهندس React متقدم. يحدد الأخطاء ومشاكل الأداء ويقترح تحسينات.",
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
  },
  {
    title: "Blog Post Generator",
    title_ar: "مولّد مقالات المدونة",
    description: "Generate a well-structured, SEO-optimized blog post on any topic with proper headings, introduction, and conclusion.",
    description_ar: "أنشئ مقال مدونة منظم ومحسّن لمحركات البحث حول أي موضوع مع عناوين ومقدمة وخاتمة مناسبة.",
    prompt_text: `Write a comprehensive blog post about [TOPIC]. Follow this structure:

**Title**: Create a compelling, SEO-friendly title (60 chars max)
**Meta Description**: Write a 155-character meta description
**Introduction**: Hook the reader with a surprising fact or question (150 words)

**Main Content** (3-5 sections):
- Each section with an H2 heading
- Include practical examples and actionable tips
- Use bullet points for scanability
- Add relevant statistics where applicable

**Conclusion**: Summarize key takeaways with a clear CTA

**Tone**: Professional yet conversational
**Word Count**: 1,500-2,000 words
**Target Audience**: [SPECIFY AUDIENCE]`,
    category_slug: "writing",
    tag_slugs: ["writing", "seo", "gpt-4o"],
  },
  {
    title: "Product Launch Email Sequence",
    title_ar: "سلسلة رسائل إطلاق المنتج",
    description: "Create a 5-email sequence for launching a new product, from teaser to final call-to-action.",
    description_ar: "أنشئ سلسلة من 5 رسائل بريد إلكتروني لإطلاق منتج جديد، من التشويق إلى الدعوة النهائية للعمل.",
    prompt_text: `Create a 5-email product launch sequence for [PRODUCT NAME].

Product Details:
- What it does: [DESCRIPTION]
- Target audience: [AUDIENCE]
- Price point: [PRICE]
- Launch date: [DATE]

Email Sequence:
1. **Teaser** (3 days before): Build curiosity without revealing the product
2. **Reveal** (1 day before): Announce what's coming with key benefits
3. **Launch Day**: Full pitch with social proof and urgency
4. **Follow-up** (day 2): Address objections, share testimonials
5. **Last Chance** (day 5): Final urgency with bonus offer

For each email provide:
- Subject line (+ 2 alternatives)
- Preview text
- Email body (200-300 words)
- CTA button text`,
    category_slug: "marketing",
    tag_slugs: ["marketing", "business", "gpt-4"],
  },
  {
    title: "Python Data Analysis Assistant",
    title_ar: "مساعد تحليل البيانات بايثون",
    description: "Transform raw data questions into clean Python pandas code with visualizations and statistical insights.",
    description_ar: "حوّل أسئلة البيانات الخام إلى كود بايثون نظيف باستخدام pandas مع رسوم بيانية ورؤى إحصائية.",
    prompt_text: `You are a data analysis expert. Given a dataset description, write Python code that:

1. **Loads & Cleans** the data (handle missing values, duplicates, type conversions)
2. **Explores** with descriptive statistics (mean, median, std, quartiles)
3. **Visualizes** key patterns using matplotlib/seaborn (at least 3 charts)
4. **Analyzes** correlations and trends
5. **Summarizes** findings in plain English

Always include:
- Clear comments explaining each step
- Error handling for common data issues
- A final summary dataframe of key metrics

Dataset: [DESCRIBE YOUR DATA]
Questions to answer: [YOUR QUESTIONS]`,
    category_slug: "coding",
    tag_slugs: ["coding", "data-analysis", "gpt-4o"],
  },
  {
    title: "Midjourney Cinematic Scene",
    title_ar: "مشهد سينمائي ميدجورني",
    description: "Generate detailed Midjourney prompts for cinematic, movie-quality scenes with precise lighting and composition.",
    description_ar: "أنشئ برومبتات ميدجورني مفصّلة لمشاهد سينمائية بجودة الأفلام مع إضاءة وتكوين دقيق.",
    prompt_text: `Create a Midjourney prompt for: [YOUR SCENE IDEA]

Use this structure:
[Subject description], [environment/setting], [lighting style], [camera angle], [mood/atmosphere], [artistic style], [technical parameters]

Lighting options: golden hour, neon noir, dramatic chiaroscuro, soft diffused, volumetric fog
Camera angles: wide establishing shot, close-up portrait, bird's eye view, low angle hero shot
Styles: cinematic film still, 35mm photography, IMAX quality, anamorphic lens

Output 4 variations:
1. **Dramatic**: High contrast, intense mood
2. **Ethereal**: Soft, dreamlike quality
3. **Gritty**: Raw, realistic texture
4. **Stylized**: Bold colors, graphic composition

Add: --ar 16:9 --v 6 --style raw --s 750`,
    category_slug: "creative",
    tag_slugs: ["midjourney", "creative", "portrait", "landscape"],
  },
  {
    title: "Lesson Plan Builder",
    title_ar: "مُنشئ خطط الدروس",
    description: "Create detailed, engaging lesson plans for any subject and grade level with activities and assessments.",
    description_ar: "أنشئ خطط دروس مفصّلة وتفاعلية لأي مادة ومستوى دراسي مع أنشطة وتقييمات.",
    prompt_text: `Design a comprehensive lesson plan:

**Subject**: [SUBJECT]
**Grade Level**: [GRADE]
**Duration**: [TIME]
**Learning Objectives**: What students should know/do after the lesson

Structure:
1. **Warm-Up** (5-10 min): Engaging hook activity
2. **Direct Instruction** (15-20 min): Core content delivery
3. **Guided Practice** (10-15 min): Teacher-supported activity
4. **Independent Practice** (10-15 min): Student-led work
5. **Closure** (5 min): Summary and exit ticket

Include:
- Differentiation strategies (advanced, on-level, struggling)
- Materials needed
- Assessment rubric
- Homework assignment
- Cross-curricular connections`,
    category_slug: "education",
    tag_slugs: ["education", "writing", "claude"],
  },
  {
    title: "Business Model Canvas Generator",
    title_ar: "مولّد نموذج العمل التجاري",
    description: "Generate a complete Business Model Canvas for any startup idea with detailed analysis of each section.",
    description_ar: "أنشئ نموذج عمل تجاري كامل لأي فكرة ناشئة مع تحليل مفصّل لكل قسم.",
    prompt_text: `Create a Business Model Canvas for: [YOUR BUSINESS IDEA]

Fill out each section with 3-5 bullet points:

1. **Customer Segments**: Who are your target customers?
2. **Value Propositions**: What unique value do you deliver?
3. **Channels**: How do you reach customers?
4. **Customer Relationships**: How do you interact with customers?
5. **Revenue Streams**: How does the business earn money?
6. **Key Resources**: What assets are essential?
7. **Key Activities**: What must the business do well?
8. **Key Partnerships**: Who are your strategic partners?
9. **Cost Structure**: What are the major costs?

Then provide:
- **SWOT Analysis**: Strengths, Weaknesses, Opportunities, Threats
- **Competitive Advantage**: What's your moat?
- **Go-to-Market Strategy**: First 90 days plan
- **Unit Economics**: Basic revenue/cost per customer estimate`,
    category_slug: "business",
    tag_slugs: ["business", "productivity", "gpt-4"],
  },
  {
    title: "Daily Productivity System",
    title_ar: "نظام الإنتاجية اليومي",
    description: "Design a personalized daily productivity system based on your role, goals, and energy patterns.",
    description_ar: "صمّم نظام إنتاجية يومي مخصص بناءً على دورك وأهدافك وأنماط طاقتك.",
    prompt_text: `Design my personalized productivity system:

**My Role**: [YOUR ROLE]
**Top 3 Goals**: [GOALS]
**Working Hours**: [START]-[END]
**Peak Energy Time**: [MORNING/AFTERNOON/EVENING]
**Biggest Time Wasters**: [LIST THEM]

Create:
1. **Morning Routine** (30 min): Mindset + planning ritual
2. **Time-Blocked Schedule**: Optimized for energy levels
   - Deep work blocks (90 min)
   - Admin/email batches (30 min)
   - Break protocols
3. **Priority Framework**: How to decide what to work on
4. **End-of-Day Review** (15 min): Reflection template
5. **Weekly Review**: Sunday planning session outline

Include specific tools/apps recommendations and habit triggers.`,
    category_slug: "productivity",
    tag_slugs: ["productivity", "business", "claude"],
  },
  {
    title: "API Documentation Writer",
    title_ar: "كاتب توثيق واجهات البرمجة",
    description: "Generate professional API documentation with endpoints, parameters, examples, and error codes.",
    description_ar: "أنشئ توثيقاً احترافياً لواجهات البرمجة مع نقاط النهاية والمعاملات والأمثلة وأكواد الأخطاء.",
    prompt_text: `Write API documentation for the following endpoint:

**Endpoint**: [METHOD] [PATH]
**Description**: [WHAT IT DOES]
**Auth**: [AUTH TYPE]

Generate documentation with:

### Request
- URL parameters (with types and constraints)
- Query parameters (with defaults)
- Request body schema (JSON with TypeScript types)
- Headers required

### Response
- Success response (200) with full JSON example
- Error responses (400, 401, 403, 404, 500) with error codes

### Code Examples
- cURL
- JavaScript (fetch)
- Python (requests)

### Rate Limiting
- Limits and headers

### Notes
- Pagination details
- Filtering/sorting options
- Deprecation notices`,
    category_slug: "coding",
    tag_slugs: ["coding", "writing", "gpt-4o"],
  },
  {
    title: "Social Media Content Calendar",
    title_ar: "تقويم محتوى وسائل التواصل",
    description: "Plan a month of social media content across platforms with post ideas, captions, and optimal posting times.",
    description_ar: "خطط لمحتوى شهر كامل على وسائل التواصل الاجتماعي عبر المنصات مع أفكار ونصوص وأوقات نشر مثالية.",
    prompt_text: `Create a 30-day social media content calendar:

**Brand/Business**: [NAME]
**Industry**: [INDUSTRY]
**Platforms**: [INSTAGRAM/TWITTER/LINKEDIN/TIKTOK]
**Goals**: [AWARENESS/ENGAGEMENT/LEADS/SALES]
**Brand Voice**: [PROFESSIONAL/CASUAL/HUMOROUS/EDUCATIONAL]

For each day provide:
- **Platform**: Which platform(s)
- **Content Type**: Carousel, Reel, Story, Thread, Post
- **Topic/Theme**: What the post is about
- **Caption**: Ready-to-post caption with hashtags
- **Visual Direction**: Brief description for designer
- **Best Time to Post**: Optimal time for the platform
- **CTA**: What action should the audience take

Include:
- 4 pillar content themes (rotate weekly)
- 2 trending/reactive content slots per week
- 1 user-generated content day per week
- Engagement prompts (polls, questions, challenges)`,
    category_slug: "marketing",
    tag_slugs: ["marketing", "creative", "seo"],
  },
  {
    title: "Language Learning Tutor",
    title_ar: "معلم تعلّم اللغات",
    description: "Practice any language with an AI tutor that adapts to your level and teaches through conversation.",
    description_ar: "تدرّب على أي لغة مع معلم ذكاء اصطناعي يتكيف مع مستواك ويعلّم من خلال المحادثة.",
    prompt_text: `You are a patient, encouraging language tutor for [LANGUAGE].

My level: [BEGINNER/INTERMEDIATE/ADVANCED]
My native language: [LANGUAGE]
Focus area: [GRAMMAR/VOCABULARY/CONVERSATION/PRONUNCIATION]

Teaching method:
1. Start each session with a warm-up question in [LANGUAGE]
2. If I make errors, gently correct with explanation
3. Introduce 3-5 new vocabulary words per session
4. Use real-world scenarios (ordering food, asking directions, etc.)
5. End with a quick quiz on what we covered

Rules:
- Always provide translations in parentheses for new words
- Use simple language first, then build complexity
- Celebrate progress with encouraging feedback
- If I'm stuck, give hints before the answer
- Track vocabulary I've learned across our conversation`,
    category_slug: "education",
    tag_slugs: ["education", "translation", "claude"],
  },
  {
    title: "Fullstack App Architecture Planner",
    title_ar: "مخطط هيكل التطبيقات الكاملة",
    description: "Design the complete architecture for a fullstack application with tech stack recommendations and database schema.",
    description_ar: "صمّم الهيكل الكامل لتطبيق متكامل مع توصيات التقنيات ومخطط قاعدة البيانات.",
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
- Scaling strategy

### 6. Security Checklist
- Auth best practices
- Data encryption
- Input validation`,
    category_slug: "coding",
    tag_slugs: ["coding", "business", "claude"],
  },
];
