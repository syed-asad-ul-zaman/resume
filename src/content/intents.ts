import {
  Award,
  BookOpen,
  Briefcase,
  Cloud,
  Code2,
  Download,
  Hammer,
  Languages,
  Lightbulb,
  Mail,
  MessageSquareHeart,
  MessageSquareText,
  Rocket,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Block } from "@/lib/persona/types";
import { facts } from "./details";
import { profile } from "./profile";
import { projects } from "./projects";

// The job persona's questions as code. The site reads them through the persona (src/server/persona),
// which starts from this file until a job persona is published from the admin.
export type { Block };

export type Intent = {
  id: string;
  label: string;
  prompt: string;
  icon: LucideIcon;
  keywords: string[];
  /** Shown as a chip on the landing screen and in the sidebar. */
  primary?: boolean;
  /** Alternative wordings; "Regenerate" cycles through them. */
  answers: string[];
  blocks: Block[];
  followUps: string[];
};

const base: Intent[] = [
  {
    id: "about",
    label: "About me",
    prompt: "Who are you?",
    icon: User,
    primary: true,
    keywords: ["about", "who", "you", "bio", "intro", "yourself", "summary", "asad", "profile"],
    answers: [
      `I'm **${profile.name}**, a ${profile.role} based in ${profile.location}. I have 8+ years of experience building SaaS products, distributed systems and AI-powered platforms, with work spanning healthcare, sports technology, enterprise onboarding and high-traffic websites.`,
      `I'm a hands-on full-stack engineer focused on scalable SaaS and practical AI. My work includes RAG chat systems, microservices, secure medical platforms and payment integrations.`,
    ],
    blocks: [{ kind: "stats" }, { kind: "focus" }],
    followUps: ["experience", "projects", "skills"],
  },
  {
    id: "experience",
    label: "Experience",
    prompt: "Walk me through your experience.",
    icon: Briefcase,
    primary: true,
    keywords: ["experience", "work", "job", "career", "history", "company", "healthstay", "gasvisor", "scala", "orbit360", "syntecx", "getnet"],
    answers: [
      "My experience spans healthcare SaaS, B2B asset management, sports technology, SaaS onboarding and high-traffic web platforms. I have worked with teams and clients in the UAE, Germany, the Netherlands and Pakistan.",
      "I have held full-stack engineering roles since 2018, including leading a five-engineer team and building production systems across healthcare, sports and enterprise software.",
    ],
    blocks: [{ kind: "experience" }],
    followUps: ["projects", "skills", "hire"],
  },
  {
    id: "projects",
    label: "Projects",
    prompt: "Show me your projects.",
    icon: Rocket,
    primary: true,
    keywords: ["projects", "portfolio", "work", "built", "build", "apps", "showcase"],
    answers: [
      "Here are selected projects from my work in medical SaaS and AI, B2B asset management, sports technology, enterprise onboarding and high-traffic websites.",
      "My recent work includes an AI support chatbot for medical portals, a B2B telemetry platform, and sports-platform services with high-reliability payments.",
    ],
    blocks: [{ kind: "projects" }],
    followUps: ["project-medical-ai-support", "project-gasvisor-platform", "project-scala-sports"],
  },
  {
    id: "skills",
    label: "Skills",
    prompt: "What's your tech stack?",
    icon: Code2,
    primary: true,
    keywords: ["skills", "stack", "tech", "technologies", "tools", "languages", "frameworks", "react", "nextjs", "node", "nestjs", "typescript", "python"],
    answers: [
      "I work across PHP, JavaScript, TypeScript and Python; backend frameworks including Laravel, NestJS and Flask; and frontend frameworks including React, Next.js, Vue and Nuxt. My AI work includes RAG pipelines, vector databases and LLM APIs.",
      "My stack spans full-stack web development, distributed services, PostgreSQL and MySQL, cloud delivery, application security and AI integrations.",
    ],
    blocks: [{ kind: "skills" }],
    followUps: ["ai-systems", "cloud", "projects"],
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    prompt: "What's your cloud and DevOps experience?",
    icon: Cloud,
    primary: true,
    keywords: ["cloud", "devops", "aws", "docker", "ec2", "s3", "ci", "cd", "deploy", "github actions", "infrastructure", "linux"],
    answers: [
      "I have worked with AWS EC2 and S3, Docker, Linux, Vercel, Nomad and GitHub Actions, including CI/CD, monitoring and automated incident-response workflows.",
    ],
    blocks: [{ kind: "cloud" }],
    followUps: ["skills", "experience", "hire"],
  },
  {
    id: "ai-systems",
    label: "AI systems",
    prompt: "Tell me about your AI and LLM work.",
    icon: Sparkles,
    primary: true,
    keywords: ["ai", "llm", "rag", "vector", "openai", "anthropic", "chatbot", "machine learning"],
    answers: [
      "I built an embeddable AI chatbot microservice for patient support using Python, Flask, OpenAI and Anthropic APIs, with retrieval-augmented generation and pgvector / Pinecone integrations.",
    ],
    blocks: [{ kind: "project", id: "medical-ai-support" }],
    followUps: ["skills", "projects", "experience"],
  },
  {
    id: "education",
    label: "Education",
    prompt: "Where did you study?",
    icon: BookOpen,
    primary: true,
    keywords: ["education", "study", "studies", "university", "degree", "school", "bachelor", "computer science"],
    answers: [
      "I studied Computer Science at Northern University in Pakistan, completing advanced modules in object-oriented programming, discrete mathematics, algorithms and data structures in 2021.",
    ],
    blocks: [{ kind: "education" }],
    followUps: ["experience", "skills", "download"],
  },
  {
    id: "languages",
    label: "Languages",
    prompt: "Which languages do you speak?",
    icon: Languages,
    keywords: ["language", "languages", "speak"],
    answers: ["Language proficiencies aren't listed in my current CV."],
    blocks: [],
    followUps: ["experience", "contact", "about"],
  },
  {
    id: "now",
    label: "Current work",
    prompt: "What are you working on right now?",
    icon: Zap,
    keywords: ["now", "current", "currently", "working", "building", "latest", "today"],
    answers: [
      "My current role is Senior Full Stack Engineer at Healthstay.io, where I work on medical SaaS, application performance, cloud infrastructure and an AI support chatbot.",
    ],
    blocks: [{ kind: "project", id: "medical-ai-support" }],
    followUps: ["projects", "experience", "skills"],
  },
  {
    id: "hire",
    label: "Hiring & relocation",
    prompt: "Can I hire you?",
    icon: Sparkles,
    primary: true,
    keywords: ["hire", "hiring", "job", "role", "position", "available", "availability", "relocate", "relocation", "visa", "offer", "recruit", "work with"],
    answers: [
      `My profile is focused on senior full-stack and AI systems engineering. I'm based in ${profile.location} and willing to relocate. You can reach me at **${profile.email}** or on LinkedIn.`,
    ],
    blocks: [{ kind: "hire" }],
    followUps: ["message", "download", "contact"],
  },
  {
    id: "contact",
    label: "Contact",
    prompt: "How can I contact you?",
    icon: Mail,
    primary: true,
    keywords: ["contact", "email", "mail", "phone", "call", "reach", "linkedin", "message", "talk"],
    answers: ["You can email me, call me or connect with me on LinkedIn. You can also send a message through this site."],
    blocks: [{ kind: "contact" }, { kind: "contact-form" }],
    followUps: ["hire", "download", "feedback"],
  },
  {
    id: "message",
    label: "Send a message",
    prompt: "I'd like to get in touch.",
    icon: MessageSquareText,
    keywords: ["message", "write", "send", "form", "get in touch", "inquiry", "enquiry", "reach out", "talk"],
    answers: ["Leave your details and a short note, and I'll get back to you."],
    blocks: [{ kind: "contact-form" }],
    followUps: ["hire", "download", "contact"],
  },
  {
    id: "feedback",
    label: "Share feedback",
    prompt: "I have some feedback on your site.",
    icon: MessageSquareHeart,
    primary: true,
    keywords: ["feedback", "review", "rate", "rating", "suggest", "suggestion", "improve", "opinion", "thoughts", "site"],
    answers: ["I'd love to hear your feedback. Every note helps improve the site."],
    blocks: [{ kind: "feedback-form" }],
    followUps: ["projects", "contact", "surprise"],
  },
  {
    id: "download",
    label: "Download CV",
    prompt: "Can I download your CV?",
    icon: Download,
    primary: true,
    keywords: ["download", "cv", "resume", "résumé", "pdf", "file", "print"],
    answers: ["Here is my CV as a PDF, or you can open the web version."],
    blocks: [{ kind: "download" }],
    followUps: ["hire", "contact", "experience"],
  },
  {
    id: "surprise",
    label: "A few highlights",
    prompt: "Tell me something interesting.",
    icon: Award,
    primary: true,
    keywords: ["surprise", "fun", "fact", "random", "interesting", "something"],
    answers: facts,
    blocks: [],
    followUps: ["surprise", "projects", "about"],
  },
  {
    id: "beliefs",
    label: "Engineering principles",
    prompt: "What principles guide your engineering?",
    icon: Lightbulb,
    keywords: ["believe", "beliefs", "values", "principles", "philosophy", "mindset", "approach"],
    answers: ["I focus on scalable architecture, reliability, security and practical outcomes:"],
    blocks: [{ kind: "beliefs" }],
    followUps: ["about", "skills", "hire"],
  },
  {
    id: "recommendations",
    label: "References",
    prompt: "Do you have recommendations?",
    icon: Award,
    keywords: ["recommendations", "references", "testimonials", "reviews"],
    answers: ["Recommendations aren't included in the current profile. Please contact me for professional inquiries."],
    blocks: [],
    followUps: ["hire", "contact", "experience"],
  },
  {
    id: "privacy",
    label: "Privacy",
    prompt: "How do you use my data?",
    icon: ShieldCheck,
    keywords: ["privacy", "data", "cookies", "cookie", "gdpr", "tracking", "analytics", "consent"],
    answers: ["Simply and honestly. Here's exactly what this site keeps, and you can change your choice any time:"],
    blocks: [{ kind: "privacy" }],
    followUps: ["stack", "contact", "about"],
  },
  {
    id: "stack",
    label: "How this site works",
    prompt: "How did you build this site?",
    icon: Hammer,
    keywords: ["site", "website", "this", "built", "how", "ai", "chatgpt", "gemini", "llm", "model", "bot", "real"],
    answers: [
      "This is a Next.js portfolio with curated answers based on my CV. Optional AI answers use the configured model and the same profile content; messages and feedback are stored by the site.",
    ],
    blocks: [{ kind: "stack" }],
    followUps: ["projects", "privacy", "surprise"],
  },
];

const projectIntents: Intent[] = projects.map((p) => ({
  id: `project-${p.id}`,
  label: p.name,
  prompt: `Tell me about the ${p.name} project.`,
  icon: Award,
  keywords: [p.name.toLowerCase(), ...p.name.toLowerCase().split(/\s+/), p.id, ...p.stack.map((s) => s.toLowerCase())],
  answers: [`**${p.name}**: ${p.tagline}`],
  blocks: [{ kind: "project", id: p.id }],
  followUps: [...projects.filter((o) => o.id !== p.id).slice(0, 2).map((o) => `project-${o.id}`), "download"],
}));

export const fallbackIntent: Intent = {
  id: "fallback",
  label: "Not sure",
  prompt: "",
  icon: Sparkles,
  keywords: [],
  answers: [
    "That one's outside what this chat covers - I only answer from my CV. Try one of these:",
    "Good question, but I keep this chat to my work and CV. How about one of these?",
  ],
  blocks: [{ kind: "suggest" }],
  followUps: [],
};

export const intents: Intent[] = [...base, ...projectIntents];
export const primaryIntents = intents.filter((i) => i.primary);

const byId = new Map(intents.map((i) => [i.id, i]));
export const getIntent = (id: string): Intent | undefined => byId.get(id);
