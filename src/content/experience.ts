export type Engagement = {
  title: string;
  role: string;
  period: string;
  bullets: string[];
  stack?: string[];
};

export type Job = {
  company: string;
  role: string;
  period: string;
  location: string;
  context?: string;
  bullets: string[];
  engagements?: Engagement[];
};

export const experience: Job[] = [
  {
    company: "Healthstay.io",
    role: "Senior Full Stack Engineer",
    period: "Oct 2024 - Present",
    location: "Dubai, UAE · Remote",
    context: "Full-time",
    bullets: [
      "Led development of a medical SaaS product and improved architectural elasticity by 40% through AWS resource optimization and EC2 calibration.",
      "Implemented JWT authentication, encryption and granular RBAC to protect sensitive medical data for a large user population.",
      "Improved frontend performance by 25% by migrating legacy systems to Nuxt.js with code splitting and lazy loading.",
      "Built CI/CD, real-time monitoring and automated incident response workflows.",
      "Developed an embeddable AI support chatbot using Python, Flask, OpenAI and Anthropic APIs with a RAG pipeline and vector database.",
    ],
  },
  {
    company: "GasVisor",
    role: "Lead Full Stack Engineer",
    period: "Dec 2024 - May 2025",
    location: "Germany · Remote",
    context: "Contract, part-time",
    bullets: [
      "Led a cross-functional team of five engineers building a B2B platform for managing assets, locations and telemetry devices.",
      "Designed a microservices backend and migrated legacy Directus systems to a scalable production infrastructure.",
      "Built part of the platform interface and improved administrative workflows.",
      "Implemented Supabase authentication, RBAC and RabbitMQ for real-time processing of distributed hardware data.",
    ],
  },
  {
    company: "Scala Sports",
    role: "Senior Full Stack Engineer",
    period: "Dec 2023 - Dec 2024",
    location: "Netherlands · Remote",
    context: "Full-time",
    bullets: [
      "Built backend infrastructure for a sports platform serving more than 10,000 active users and automated league administration through LTA and USTA API integrations.",
      "Integrated Stripe and PayPal, facilitating over $500,000 in subscription revenue with a 99.9% transaction success rate.",
      "Developed an administrative dashboard with Filament and Livewire for real-time match coordination, reducing support tickets by 30%.",
    ],
  },
  {
    company: "Orbit360 Inc",
    role: "Senior Full Stack Developer",
    period: "Jan 2023 - Apr 2024",
    location: "Pakistan · Remote",
    context: "Long-term contract",
    bullets: [
      "Designed a SaaS onboarding framework and real-time conversational widgets for GoHighLevel, deployed across 200+ enterprise clients.",
      "Automated subscription billing through Stripe and reduced payment-processing latency by 50%.",
      "Partnered with product and support teams to improve user experience and build administrative tooling.",
    ],
  },
  {
    company: "SyntecX Global Corporation",
    role: "Full Stack Developer",
    period: "Jan 2020 - Dec 2022",
    location: "Pakistan · On-site",
    context: "Full-time",
    bullets: [
      "Built and maintained high-traffic web platforms including ufone.com, telenorsmartteams.com and whereworks.com.",
      "Developed dynamic interfaces for Ufone privacy and subscription-management features.",
      "Created modular, reusable application code and REST APIs using PHP, Laravel, Node.js and MySQL.",
    ],
  },
  {
    company: "GetNet Digitals",
    role: "PHP Developer",
    period: "Jan 2018 - Dec 2019",
    location: "Pakistan · On-site",
    context: "Full-time",
    bullets: [
      "Developed and maintained backend systems integrating with distributed web services.",
      "Built interactive interfaces with JavaScript, AJAX and jQuery alongside frontend teams.",
      "Designed and deployed REST APIs and third-party integrations.",
    ],
  },
];
