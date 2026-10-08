export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["PHP", "JavaScript", "TypeScript", "Python", "SQL", "HTML5", "CSS3"] },
  {
    group: "AI & LLM systems",
    items: ["RAG pipelines", "Vector databases", "pgvector", "Pinecone", "OpenAI API", "Anthropic API", "Embeddable chat widgets"],
  },
  {
    group: "Back end",
    items: ["Laravel", "Node.js", "NestJS", "Express.js", "Slim", "CodeIgniter", "Flask", "REST APIs", "GraphQL", "Microservices"],
  },
  {
    group: "Front end",
    items: ["React", "Next.js", "Vue.js", "Nuxt.js", "Livewire", "Inertia.js", "Tailwind CSS", "MUI", "Bootstrap", "Alpine.js"],
  },
  {
    group: "Data",
    items: ["PostgreSQL", "MySQL", "Redis", "MongoDB", "SQLite", "Supabase", "pgvector", "Pinecone"],
  },
  {
    group: "Cloud & DevOps",
    items: ["AWS EC2", "AWS S3", "Docker", "GitHub Actions", "CI/CD", "Linux (Ubuntu)", "Vercel", "Laravel Forge", "Nomad"],
  },
  {
    group: "Security & integrations",
    items: ["JWT", "Encryption", "RBAC", "OAuth", "RabbitMQ", "Stripe", "PayPal", "Alfa Bank", "Firebase / FCM", "MeiliSearch"],
  },
  { group: "Testing", items: ["Jest", "Cypress", "React Testing Library"] },
];

export const cloud: { name: string; where: string }[] = [
  { name: "AWS", where: "Resource optimization, EC2 and S3 for a medical SaaS platform." },
  { name: "Docker", where: "Containerized development and production workloads." },
  { name: "GitHub Actions", where: "Automated CI/CD pipelines and deployment workflows." },
  { name: "Vercel", where: "Application hosting and deployment." },
  { name: "Linux", where: "Ubuntu-based server environments." },
  { name: "Nomad", where: "Infrastructure for a B2B asset and telemetry platform." },
];

export const education = {
  degree: "Bachelor's Studies in Computer Science",
  school: "Northern University",
  location: "Pakistan",
  year: "2021",
  capstone: "Advanced academic modules in object-oriented programming, discrete mathematics, algorithms and data structures.",
  courses: [],
};

export const languages: { name: string; level: string; cefr: string; score: number }[] = [];

export type Recommendation = { name: string; title: string; relation: string; date: string; highlight: string; text: string };

export const quotes: Recommendation[] = [];

export const farewellCard = { url: "", title: "Team notes" };
export const farewell: { name: string; text: string }[] = [];

export const facts: string[] = [
  "I improved architectural elasticity by 40% through AWS resource optimization.",
  "A RAG pipeline and vector database power an embeddable AI support chatbot I built.",
  "Payment integrations I delivered facilitated more than $500,000 in subscriptions at 99.9% success.",
  "I led a cross-functional team of five engineers on a B2B asset and telemetry platform.",
  "A Nuxt.js migration and performance improvements reduced frontend load time by 25%.",
  "My experience spans healthcare SaaS, sports technology, enterprise onboarding and high-traffic web platforms.",
];

export const siteStack = ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Motion", "next-themes", "Postgres (Neon)", "Gemini (free-form questions)"];
