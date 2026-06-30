// ─────────────────────────────────────────────────────────────────────────────
// SKILLS
// ─────────────────────────────────────────────────────────────────────────────
export const skillGroups = [
  {
    group: "AI Automation",
    icon: "Zap",
    color: "from-yellow-500 to-orange-500",
    skills: ["N8N", "Make.com", "Zapier", "LangGraph", "LangChain", "Crew AI", "Activepieces"],
  },
  {
    group: "AI Agents",
    icon: "Bot",
    color: "from-blue-500 to-cyan-500",
    skills: ["OpenAI GPT-4o", "Claude API", "Gemini", "Whisper", "DALL·E", "OpenAI Realtime API", "Llama 3"],
  },
  {
    group: "Web Development",
    icon: "Globe",
    color: "from-purple-500 to-pink-500",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Node.js", "FastAPI"],
  },
  {
    group: "Programming Languages",
    icon: "Code2",
    color: "from-green-500 to-emerald-500",
    skills: ["Python", "JavaScript", "TypeScript", "SQL", "Bash", "JSON"],
  },
  {
    group: "Databases",
    icon: "Database",
    color: "from-red-500 to-rose-500",
    skills: ["PostgreSQL", "Supabase", "MongoDB", "Redis", "Pinecone", "Qdrant"],
  },
  {
    group: "Tools & DevOps",
    icon: "Wrench",
    color: "from-indigo-500 to-violet-500",
    skills: ["Git", "Docker", "Vercel", "AWS", "GitHub Actions", "Postman", "Linux"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// EXPERIENCE
// ─────────────────────────────────────────────────────────────────────────────
export const experiences = [
  {
    id: 1,
    role: "AI Automation Engineer",
    company: "Freelance / Self-Employed",
    period: "2023 — Present",
    type: "Full-time",
    description:
      "Building AI-powered automation systems and intelligent agents for businesses worldwide. Specializing in end-to-end workflow automation, RAG pipelines, and voice AI solutions.",
    highlights: [
      "Delivered 15+ AI automation projects across 8 countries",
      "Built autonomous agents saving clients 40+ hours/week",
      "Created N8N + LangGraph pipelines used in production",
    ],
  },
  {
    id: 2,
    role: "Full Stack Web Developer",
    company: "Agency / Contract Work",
    period: "2022 — 2023",
    type: "Contract",
    description:
      "Developed modern web applications for startups and SMBs using React, Next.js, and Node.js. Focused on performance, SEO, and clean user experiences.",
    highlights: [
      "Built 10+ client websites with 95+ Lighthouse scores",
      "Integrated payment systems (Stripe, PayPal) for 5 SaaS products",
      "Reduced average page load time by 60% through optimization",
    ],
  },
  {
    id: 3,
    role: "Python Developer & Automation Specialist",
    company: "Tech Startup",
    period: "2021 — 2022",
    type: "Full-time",
    description:
      "Built internal automation tools, data pipelines, and web scrapers. Worked closely with the data team to streamline ETL processes and reporting.",
    highlights: [
      "Automated 80% of manual data entry workflows",
      "Built a real-time scraping pipeline processing 1M+ records/day",
      "Reduced data processing time from 6 hours to 15 minutes",
    ],
  },
  {
    id: 4,
    role: "Started Self-Learning Journey",
    company: "Independent",
    period: "2020 — 2021",
    type: "Learning",
    description:
      "Began deep-diving into Python, web development, and later AI/ML. Completed multiple online courses and built first projects to solidify fundamentals.",
    highlights: [
      "Completed 500+ hours of Python and web dev coursework",
      "Built first full-stack app deployed to production",
      "Discovered passion for AI and automation",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CERTIFICATES
// ─────────────────────────────────────────────────────────────────────────────
export const certificates = [
  {
    id: 1,
    title: "DeepLearning.AI — LangChain for LLM Application Development",
    issuer: "DeepLearning.AI",
    date: "2024",
    credentialUrl: "https://learn.deeplearning.ai/",
    color: "from-blue-500 to-cyan-500",
    icon: "🤖",
  },
  {
    id: 2,
    title: "OpenAI API — Building Systems with ChatGPT",
    issuer: "DeepLearning.AI",
    date: "2024",
    credentialUrl: "https://learn.deeplearning.ai/",
    color: "from-green-500 to-emerald-500",
    icon: "🧠",
  },
  {
    id: 3,
    title: "Meta — Back-End Development Professional Certificate",
    issuer: "Coursera / Meta",
    date: "2023",
    credentialUrl: "https://coursera.org/",
    color: "from-blue-600 to-indigo-600",
    icon: "🌐",
  },
  {
    id: 4,
    title: "Google — Project Management Professional Certificate",
    issuer: "Coursera / Google",
    date: "2023",
    credentialUrl: "https://coursera.org/",
    color: "from-red-500 to-orange-500",
    icon: "📋",
  },
  {
    id: 5,
    title: "N8N — Advanced Workflow Automation",
    issuer: "N8N Academy",
    date: "2024",
    credentialUrl: "https://n8n.io/",
    color: "from-purple-500 to-pink-500",
    icon: "⚡",
  },
  {
    id: 6,
    title: "AWS — Cloud Practitioner Essentials",
    issuer: "AWS Training",
    date: "2023",
    credentialUrl: "https://aws.amazon.com/training/",
    color: "from-yellow-500 to-orange-400",
    icon: "☁️",
  },
];

// PERSONAL INFO
export const personalInfo = {
  name: "SmartFlow",
  title: "AI Automation Engineer & Web Developer",
  taglines: [
    "Building AI Agents",
    "Automating the Future",
    "Shipping Web Products",
    "Solving Real Problems",
  ],
  about: `I'm a builder at the intersection of AI and software engineering. I specialize in designing autonomous AI agents, intelligent automation pipelines, and high-performance web applications that solve real business problems.

With a foundation in Python and JavaScript and deep expertise in the LangChain / LangGraph ecosystem, I've helped businesses across industries automate workflows that used to require full-time headcount — freeing their teams to focus on work that actually matters.

I believe the best technology is invisible: it just works, reliably, at scale, without needing a manual. That's what I build.`,
  goals: [
    "Ship AI products used by 10,000+ people",
    "Build a profitable AI automation agency",
    "Contribute to open-source AI tooling",
    "Mentor the next generation of AI builders",
  ],
  location: "India",
  email: "hs4096883@gmail.com",
  github: "https://github.com/Harishtech142",
  // TODO: replace with your real LinkedIn profile URL
  linkedin: "https://linkedin.com/in/your-linkedin-handle",
  whatsapp: "https://wa.me/916230931639",
  resumeUrl: "/resume.pdf",
};
