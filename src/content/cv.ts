// The printable CV (/cv and its generated PDF), aligned with the supplied resume.

export const cv = {
  /** European CVs (DE/FR/NL...) usually include a photo; set false for UK/US/IE applications. */
  showPhoto: true,
  title: "Senior Full-Stack & AI Systems Engineer",
  availability: "Based in Islamabad, Pakistan · Willing to relocate",
  photo: "/images/syed-asad-cv.webp",

  profile:
    "Senior Full-Stack & AI Systems Engineer with 8+ years of experience (2018-Present) architecting high-traffic SaaS solutions, distributed microservices and AI-powered web platforms. Experienced in Node.js/NestJS, Python/Flask, Laravel, React/Next.js and Vue/Nuxt, with specialist expertise in RAG pipelines, vector databases and LLM API integrations. Led multidisciplinary teams, improved architectural scalability by 40%, and helped facilitate $500,000+ in subscription transactions with 99.9% reliability.",

  highlights: [
    "Improved architectural elasticity by 40% through AWS resource optimization for a medical SaaS platform.",
    "Built an embeddable AI chatbot with Python, Flask, OpenAI, Anthropic, RAG and vector database integrations.",
    "Supported secure handling of medical data for more than 100,000 users with JWT authentication, encryption and granular RBAC.",
    "Facilitated $500,000+ in subscription payments at a 99.9% success rate and reduced support tickets by 30%.",
    "Led a cross-functional team of five engineers delivering a B2B asset and telemetry platform.",
  ],

  skills: [
    { k: "Languages", v: "PHP, JavaScript, TypeScript, Python, SQL, HTML5, CSS3" },
    { k: "AI & LLM", v: "RAG pipelines, vector databases (pgvector / Pinecone), OpenAI API, Anthropic API, embeddable chat widgets" },
    { k: "Back end", v: "Laravel, Node.js, NestJS, Express.js, Slim, CodeIgniter, Flask, REST APIs, GraphQL, microservices" },
    { k: "Front end", v: "React, Next.js, Vue.js, Nuxt.js, Livewire, Inertia.js, Tailwind CSS, MUI, Bootstrap, Alpine.js" },
    { k: "Data", v: "PostgreSQL, MySQL, Redis, MongoDB, SQLite, Supabase, pgvector, Pinecone" },
    { k: "Cloud & DevOps", v: "AWS EC2 and S3, Docker, GitHub Actions, CI/CD, Linux, Vercel, Laravel Forge, Nomad" },
    { k: "Security & integrations", v: "JWT, encryption, RBAC, OAuth, RabbitMQ, Stripe, PayPal, Alfa Bank, Firebase / FCM, MeiliSearch" },
    { k: "Testing", v: "Jest, Cypress, React Testing Library" },
  ],

  experience: [
    {
      company: "Healthstay.io",
      role: "Senior Full Stack Engineer",
      period: "Oct 2024 - Present",
      location: "Dubai, UAE · Remote",
      context: "Full-time",
      bullets: [
        "Developed a medical SaaS solution and improved architectural elasticity by 40% through AWS resource optimization.",
        "Implemented JWT authentication, encryption and granular RBAC for sensitive medical data.",
        "Improved frontend performance by 25% by migrating legacy systems to Nuxt.js with code splitting and lazy loading.",
        "Built CI/CD frameworks, real-time monitoring and automated incident response.",
        "Created an embeddable AI chatbot microservice with Python, Flask, OpenAI, Anthropic, RAG and vector search.",
      ],
      engagements: [],
    },
    {
      company: "GasVisor",
      role: "Lead Full Stack Engineer",
      period: "Dec 2024 - May 2025",
      location: "Germany · Remote",
      context: "Contract, part-time",
      bullets: [
        "Led a five-engineer cross-functional team delivering a B2B asset, location and telemetry platform.",
        "Migrated legacy Directus systems to scalable microservices and integrated Supabase auth, RBAC and RabbitMQ.",
      ],
      engagements: [],
    },
    {
      company: "Scala Sports",
      role: "Senior Full Stack Engineer",
      period: "Dec 2023 - Dec 2024",
      location: "Netherlands · Remote",
      context: "Full-time",
      bullets: [
        "Built backend services for a platform serving 10,000+ active users and automated league administration through LTA / USTA integrations.",
        "Integrated Stripe and PayPal for $500,000+ in subscription transactions with 99.9% success.",
        "Built a real-time administration dashboard that reduced support tickets by 30%.",
      ],
      engagements: [],
    },
    {
      company: "Orbit360 Inc",
      role: "Senior Full Stack Developer",
      period: "Jan 2023 - Apr 2024",
      location: "Pakistan · Remote",
      context: "Long-term contract",
      bullets: [
        "Built a SaaS onboarding framework and real-time conversational widgets deployed across 200+ enterprise clients.",
        "Automated Stripe subscription billing, reducing payment-processing latency by 50%.",
      ],
      engagements: [],
    },
    {
      company: "SyntecX Global Corporation",
      role: "Full Stack Developer",
      period: "Jan 2020 - Dec 2022",
      location: "Pakistan · On-site",
      context: "Full-time",
      bullets: [
        "Built and maintained ufone.com, telenorsmartteams.com and whereworks.com.",
        "Developed Ufone privacy and subscription-management interfaces using PHP, Laravel, Node.js and MySQL.",
      ],
      engagements: [],
    },
    {
      company: "GetNet Digitals",
      role: "PHP Developer",
      period: "Jan 2018 - Dec 2019",
      location: "Pakistan · On-site",
      context: "Full-time",
      bullets: [
        "Built backend systems, interactive JavaScript / AJAX interfaces, REST APIs and third-party integrations.",
      ],
      engagements: [],
    },
  ],

  projects: [
    {
      name: "Medical SaaS & AI Support Chatbot",
      meta: "Python, Flask, OpenAI, Anthropic, RAG, vector databases, Nuxt.js, AWS",
      text: "A medical platform with an embeddable AI patient-support chatbot, secure access controls and improved frontend performance.",
    },
    {
      name: "GasVisor B2B Asset Platform",
      meta: "NestJS, Next.js, GraphQL, RabbitMQ, PostgreSQL, Redis",
      text: "A microservices platform for managing assets, locations and telemetry devices, delivered by a team of five.",
    },
    {
      name: "Scala Sports",
      meta: "Laravel, Vue.js, Filament, Livewire, Stripe, PayPal",
      text: "Sports-community and league-management services for 10,000+ users, with automated payments and real-time match coordination.",
    },
    {
      name: "SaaS Onboarding & Conversation Widgets",
      meta: "Laravel, React, Vue.js, TypeScript, AWS, Stripe",
      text: "Onboarding and real-time conversational tools deployed across 200+ enterprise clients.",
    },
    {
      name: "High-Traffic Web Platforms",
      meta: "PHP, Laravel, Node.js, MySQL, JavaScript",
      text: "Production web platforms and subscription-management interfaces for Ufone, Telenor Smart Teams and Whereworks.",
    },
  ],

  education: {
    degree: "Bachelor's Studies in Computer Science",
    school: "Northern University, Pakistan",
    year: "2021",
    note: "Completed advanced modules in object-oriented programming, discrete mathematics, algorithms and data structures.",
  },

  courses: [],
  languages: [],
  references: {
    enabled: true,
    label: "References",
    text: "Professional references and client recommendations are available upon request or viewable directly on LinkedIn.",
    linkText: "View Verified LinkedIn Recommendations",
    url: "https://www.linkedin.com/in/syed-asad-ul-zaman/details/recommendations/",
  },
};
