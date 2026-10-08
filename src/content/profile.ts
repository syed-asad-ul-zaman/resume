export const profile = {
  name: "Asad Ul Zaman Syed",
  shortName: "Asad Syed",
  givenName: "Asad Ul Zaman",
  familyName: "Syed",
  initials: "AS",
  role: "Senior Full-Stack & AI Systems Engineer",
  headline: "Full-stack SaaS · Distributed systems · RAG and AI integrations",
  location: "Islamabad, Pakistan",
  openTo: "Based in Islamabad, Pakistan; willing to relocate",
  /** The "Hire me" card. */
  hire: {
    lookingFor: [
      {
        k: "Roles",
        v: "Senior Full-Stack & AI Systems Engineer",
        note: "Building scalable SaaS products, distributed systems and practical AI experiences.",
      },
      {
        k: "Where",
        v: "Islamabad, Pakistan, or relocation",
        note: "Experienced with remote, on-site and cross-border teams.",
      },
    ],
    strengths: [
      { k: "AI systems", v: "RAG pipelines, vector databases, OpenAI and Anthropic APIs, embeddable chat experiences" },
      { k: "Back end", v: "Node.js, NestJS, Python, Flask, Laravel, microservices and REST / GraphQL APIs" },
      { k: "Front end", v: "React, Next.js, Vue, Nuxt, TypeScript and modern UI frameworks" },
      { k: "Data", v: "PostgreSQL, MySQL, Redis, MongoDB, SQLite, pgvector and Pinecone" },
      { k: "Cloud & delivery", v: "AWS, Docker, CI/CD, GitHub Actions, Vercel and Linux" },
      { k: "Security & payments", v: "JWT, encryption, RBAC, HIPAA-aligned controls, Stripe and PayPal" },
    ],
  },
  email: "syed.asad.ul.zaman@gmail.com",
  phone: "+92 333 1517696",
  phoneHref: "tel:+923331517696",
  links: {
    github: "https://github.com/syed-asad-ul-zaman",
    githubHandle: "github.com/syed-asad-ul-zaman",
    linkedin: "https://www.linkedin.com/in/syed-asad-ul-zaman/",
    linkedinHandle: "linkedin.com/in/syed-asad-ul-zaman",
    facebook: "https://www.facebook.com/syed.asad.ul.zaman",
    facebookHandle: "facebook.com/syed.asad.ul.zaman",
    instagram: "https://www.instagram.com/syed.asad.ul.zaman",
    instagramHandle: "instagram.com/syed.asad.ul.zaman",
  },
  cvPdf: "/Syed-Asad-Resume.pdf",
  cvUpdated: "September 2026",
  summary:
    "Senior Full-Stack & AI Systems Engineer with 8+ years of experience architecting high-traffic SaaS products, distributed microservices and AI-powered platforms. Experienced in Node.js, NestJS, Python, Flask, Laravel, React, Next.js, Vue and Nuxt, with specialist work in RAG pipelines, vector databases and LLM integrations. Led a five-engineer team, improved architectural scalability by 40%, supported data security for 100,000+ users, and helped deliver $500,000+ in subscription transactions at 99.9% reliability.",
  stats: [
    { value: "8+", label: "years building production software" },
    { value: "40%", label: "architectural scalability improvement" },
    { value: "100k+", label: "users covered by security controls" },
    { value: "$500k+", label: "subscription transactions facilitated" },
    { value: "99.9%", label: "payment transaction success rate" },
    { value: "5", label: "engineers led on a cross-functional team" },
  ],
  /** What I do, shown under "About me". */
  focus: [
    { area: "AI systems", text: "Build RAG-powered assistants with Python, Flask, LLM APIs and vector databases." },
    { area: "Full stack", text: "Deliver SaaS products with Node.js, NestJS, Laravel, React, Next.js, Vue and Nuxt." },
    { area: "Architecture", text: "Design scalable microservices, real-time workflows and reliable integrations." },
    { area: "Security", text: "Apply authentication, encryption and granular RBAC to applications handling sensitive data." },
    { area: "Delivery", text: "Automate builds, deployments and monitoring with AWS, Docker and GitHub Actions." },
  ],
} as const;

export type Profile = typeof profile;
