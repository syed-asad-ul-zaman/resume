// Sentence pools for the typed hero. Keep each combination short enough for the four-line heading.
export type IntroPool = { id: string; lines: string[]; /** false = starts empty and joins later. */ firstPass?: boolean };

export const introPools: IntroPool[] = [
  { id: "hello", lines: ["Hi, I'm Asad Ul Zaman Syed.", "Hello, I'm Asad.", "Welcome, I'm Asad."] },
  {
    id: "role",
    lines: [
      "I'm a Senior Full-Stack Engineer.",
      "I build AI-powered platforms.",
      "I design distributed systems.",
      "I build secure SaaS products.",
      "I work across the full stack.",
    ],
  },
  {
    id: "experience",
    lines: [
      "I have 8+ years of experience.",
      "I build practical AI systems.",
      "I work with teams worldwide.",
      "I'm based in Islamabad, Pakistan.",
      "I'm willing to relocate.",
    ],
  },
  {
    id: "belief",
    firstPass: false,
    lines: [
      "I focus on measurable outcomes.",
      "I value reliable architecture.",
      "I build with security in mind.",
      "I turn complex ideas into products.",
      "I keep learning and improving.",
      "Ask me about my work.",
    ],
  },
];

/** Which part changes next, in a loop. The greeting changes rarely. */
export const introSchedule = ["belief", "role", "experience", "belief", "role", "experience", "belief", "role", "hello", "belief", "role", "experience"];

export const staticIntro =
  "Hi, I'm Asad Ul Zaman Syed. I'm a Senior Full-Stack & AI Systems Engineer with 8+ years of experience.";

/** The longest sentence the typing loop can ever show, used to size the heading. */
export const longestIntro = introPools
  .map((p) => p.lines.map((l) => l.replace(/\^\d+/g, "")).reduce((a, b) => (b.length > a.length ? b : a), ""))
  .join(" ");

/** Engineering principles reflected in the supplied experience. */
export const beliefs: string[] = [
  "I design for scalability and reliability.",
  "I build security into the system from the start.",
  "I use automation to remove repetitive work.",
  "I connect AI capabilities to practical user needs.",
  "I value measurable improvements over guesswork.",
];
