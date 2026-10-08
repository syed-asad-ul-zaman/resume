export type Project = {
  id: string;
  name: string;
  year: string;
  kind: "Personal" | "Open source" | "Work" | "Freelance";
  tagline: string;
  problem: string;
  built: string[];
  numbers: string[];
  stack: string[];
  link?: { label: string; href: string };
};

export const projects: Project[] = [
  {
    id: "medical-ai-support",
    name: "Medical SaaS & AI Support",
    year: "2024 - Present",
    kind: "Work",
    tagline: "A medical SaaS platform with an embeddable RAG-powered patient-support chatbot.",
    problem: "Hospital portals need reliable patient support while protecting sensitive medical information.",
    built: [
      "Built an embeddable chatbot microservice with Python, Flask, OpenAI and Anthropic APIs.",
      "Implemented retrieval-augmented generation with a vector database using pgvector or Pinecone.",
      "Applied JWT authentication, encryption and granular role-based access controls.",
      "Improved frontend performance by 25% during a migration to Nuxt.js.",
    ],
    numbers: ["40% improvement in architectural elasticity", "25% faster frontend performance", "100,000+ users covered by security controls"],
    stack: ["Python", "Flask", "RAG", "OpenAI", "Anthropic", "pgvector", "Pinecone", "Nuxt.js", "AWS", "PostgreSQL"],
  },
  {
    id: "gasvisor-platform",
    name: "GasVisor B2B Platform",
    year: "2024 - 2025",
    kind: "Work",
    tagline: "A distributed B2B system for assets, locations and telemetry devices.",
    problem: "The team needed to move a legacy asset-management system onto a scalable architecture.",
    built: [
      "Led a cross-functional team of five engineers.",
      "Migrated legacy Directus functionality to a production-grade microservices backend.",
      "Integrated Supabase authentication, role-based permissions and RabbitMQ-based event processing.",
      "Developed the administrative interface using modern web patterns.",
    ],
    numbers: ["5 engineers on the team"],
    stack: ["NestJS", "Next.js", "GraphQL", "RabbitMQ", "PostgreSQL", "Prisma", "Redis", "Supabase", "Nomad"],
  },
  {
    id: "scala-sports",
    name: "Scala Sports Platform",
    year: "2023 - 2024",
    kind: "Work",
    tagline: "Sports-community services, automated league administration and subscription payments.",
    problem: "League operators needed real-time coordination and less manual administration.",
    built: [
      "Built scalable backend services for league administration and integrated LTA and USTA APIs.",
      "Integrated Stripe and PayPal subscription payments.",
      "Created a real-time administrative dashboard with Filament and Livewire.",
    ],
    numbers: ["10,000+ active users", "$500,000+ in subscriptions", "99.9% payment success", "30% fewer support tickets"],
    stack: ["Laravel", "Vue.js", "Inertia.js", "Filament", "Livewire", "PostgreSQL", "Stripe", "PayPal", "Redis"],
  },
  {
    id: "saas-onboarding",
    name: "SaaS Onboarding & Conversation Widgets",
    year: "2023 - 2024",
    kind: "Work",
    tagline: "Onboarding workflows and conversational widgets for enterprise clients.",
    problem: "Customers needed smoother SaaS onboarding and real-time ways to engage with services.",
    built: [
      "Designed an onboarding framework and real-time conversational widgets for GoHighLevel.",
      "Automated subscription billing with Stripe.",
      "Built administrative tools with product and support teams.",
    ],
    numbers: ["200+ enterprise clients", "50% reduction in payment-processing latency", "25% improvement in user retention"],
    stack: ["Laravel", "React", "Vue.js", "TypeScript", "AWS", "Stripe", "REST APIs"],
  },
  {
    id: "high-traffic-web-platforms",
    name: "High-Traffic Web Platforms",
    year: "2018 - 2022",
    kind: "Work",
    tagline: "Production websites and subscription-management experiences for major platforms.",
    problem: "High-traffic services required maintainable architecture and reliable customer-facing workflows.",
    built: [
      "Built and maintained ufone.com, telenorsmartteams.com and whereworks.com.",
      "Developed privacy and subscription-management interfaces for Ufone.",
      "Created reusable application components, backend systems and third-party REST integrations.",
    ],
    numbers: ["Three named production platforms"],
    stack: ["PHP", "Laravel", "Node.js", "MySQL", "JavaScript", "Bootstrap", "jQuery", "REST APIs"],
  },
];

export const projectById = (id: string) => projects.find((project) => project.id === id);
