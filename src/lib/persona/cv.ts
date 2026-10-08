/**
 * The job persona's CV document (persona.document.data): the same shape as src/content/cv.ts. Edited in
 * the Studio, printed on /cv/ and into the PDF. Stored as loose JSON and read field by field. A
 * published document never inherits omitted fields from the code snapshot.
 */

export type CvEngagement = { title: string; period: string; bullets: string[]; stack: string };
export type CvJob = { company: string; role: string; period: string; location: string; context: string; bullets: string[]; engagements: CvEngagement[] };
export type CvReferences = { enabled: boolean; label: string; text: string; linkText: string; url: string };
export type CvData = {
  showPhoto: boolean;
  title: string;
  availability: string;
  photo: string;
  profile: string;
  highlights: string[];
  skills: { k: string; v: string }[];
  experience: CvJob[];
  projects: { name: string; meta: string; text: string }[];
  education: { degree: string; school: string; year: string; note: string };
  courses: string[];
  languages: { name: string; level: string }[];
  references: CvReferences;
};

export const EMPTY_CV: CvData = {
  showPhoto: false,
  title: "",
  availability: "",
  photo: "",
  profile: "",
  highlights: [],
  skills: [],
  experience: [],
  projects: [],
  education: { degree: "", school: "", year: "", note: "" },
  courses: [],
  languages: [],
  references: { enabled: false, label: "", text: "", linkText: "", url: "" },
};

export const DEFAULT_CV_REFERENCES: CvReferences = {
  enabled: true,
  label: "References",
  text: "Professional references and client recommendations are available upon request or viewable directly on LinkedIn.",
  linkText: "View Verified LinkedIn Recommendations",
  url: "https://www.linkedin.com/in/syed-asad-ul-zaman/details/recommendations/",
};

const LEGACY_RECOMMENDATIONS_URL = "https://www.linkedin.com/in/syed-asad-ul-zaman?openSection=recommendations";
type Rec = Record<string, unknown>;
const rec = (x: unknown): Rec => (x && typeof x === "object" && !Array.isArray(x) ? (x as Rec) : {});
const str = (x: unknown, d: string) => (typeof x === "string" ? x : d);
const strs = (x: unknown, d: string[]) => (Array.isArray(x) ? x.filter((s): s is string => typeof s === "string" && !!s.trim()) : d);
const list = <T>(x: unknown, d: T[], one: (r: Rec) => T) => (Array.isArray(x) ? x.map((v) => one(rec(v))) : d);
const httpsUrl = (x: unknown, fallback: string) =>
  typeof x === "string" && x.startsWith("https://") ? (x === LEGACY_RECOMMENDATIONS_URL ? fallback : x) : fallback;

export function readCv(value: unknown, fallback: CvData, strict = false): CvData {
  const defaults = strict ? EMPTY_CV : fallback;
  if (!value || typeof value !== "object" || Array.isArray(value)) return defaults;
  const v = value as Rec;
  const edu = rec(v.education);
  const references = rec(v.references);
  return {
    showPhoto: typeof v.showPhoto === "boolean" ? v.showPhoto : defaults.showPhoto,
    title: str(v.title, defaults.title),
    availability: str(v.availability, defaults.availability),
    photo: str(v.photo, defaults.photo),
    profile: str(v.profile, defaults.profile),
    highlights: strs(v.highlights, defaults.highlights),
    skills: list(v.skills, defaults.skills, (r) => ({ k: str(r.k, ""), v: str(r.v, "") })).filter((skill) => skill.k.trim() || skill.v.trim()),
    experience: list(v.experience, defaults.experience, (r) => ({
      company: str(r.company, ""),
      role: str(r.role, ""),
      period: str(r.period, ""),
      location: str(r.location, ""),
      context: str(r.context, ""),
      bullets: strs(r.bullets, []),
      engagements: list(r.engagements, [], (e) => ({ title: str(e.title, ""), period: str(e.period, ""), bullets: strs(e.bullets, []), stack: str(e.stack, "") }))
        .filter((engagement) => engagement.title.trim() || engagement.period.trim() || engagement.bullets.length || engagement.stack.trim()),
    })).filter((job) => job.company.trim() || job.role.trim() || job.period.trim() || job.location.trim() || job.context.trim() || job.bullets.length || job.engagements.length),
    projects: list(v.projects, defaults.projects, (r) => ({ name: str(r.name, ""), meta: str(r.meta, ""), text: str(r.text, "") }))
      .filter((project) => project.name.trim() || project.meta.trim() || project.text.trim()),
    education: { degree: str(edu.degree, defaults.education.degree), school: str(edu.school, defaults.education.school), year: str(edu.year, defaults.education.year), note: str(edu.note, defaults.education.note) },
    courses: strs(v.courses, defaults.courses),
    languages: list(v.languages, defaults.languages, (r) => ({ name: str(r.name, ""), level: str(r.level, "") }))
      .filter((language) => language.name.trim() || language.level.trim()),
    references: {
      enabled: typeof references.enabled === "boolean" ? references.enabled : defaults.references.enabled,
      label: str(references.label, defaults.references.label),
      text: str(references.text, defaults.references.text),
      linkText: str(references.linkText, defaults.references.linkText),
      url: httpsUrl(references.url, defaults.references.url),
    },
  };
}

export function hasCvContentForQuestion(id: string, cv: CvData): boolean {
  switch (id) {
    case "stats":
    case "surprise":
      return cv.highlights.length > 0;
    case "focus":
      return Boolean(cv.profile.trim());
    case "about":
      return Boolean(cv.profile.trim() || cv.highlights.length);
    case "experience":
    case "cro":
    case "now":
      return cv.experience.length > 0;
    case "projects":
      return cv.projects.length > 0;
    case "ai-systems":
      return (
        cv.projects.some((project) => /ai|llm|chatbot/i.test(`${project.name} ${project.meta} ${project.text}`)) ||
        cv.skills.some((skill) => /ai|llm/i.test(skill.k) && skill.v.trim())
      );
    case "skills":
      return cv.skills.some((skill) => skill.k.trim() || skill.v.trim());
    case "cloud":
      return cv.skills.some((skill) => /cloud|devops/i.test(skill.k) && skill.v.trim());
    case "education":
      return Boolean(Object.values(cv.education).some((value) => value.trim()) || cv.courses.length);
    case "languages":
      return cv.languages.some((language) => language.name.trim() || language.level.trim());
    case "hire":
      return Boolean(cv.title.trim() || cv.availability.trim());
    case "recommendations":
      return cv.references.enabled && Boolean(cv.references.text.trim() || cv.references.linkText.trim());
    default:
      return !id.startsWith("project-") || cv.projects.length > 0;
  }
}

const CV_BACKED_QUESTIONS = new Set([
  "about",
  "experience",
  "projects",
  "skills",
  "cloud",
  "ai-systems",
  "education",
  "languages",
  "now",
  "hire",
  "recommendations",
  "stats",
  "focus",
  "summary",
  "surprise",
]);

export function isCvBackedQuestion(id: string): boolean {
  return CV_BACKED_QUESTIONS.has(id) || id.startsWith("project-");
}

export function hasCvDocumentContent(cv: CvData): boolean {
  return Boolean(
    cv.title.trim() ||
      cv.availability.trim() ||
      cv.profile.trim() ||
      cv.highlights.length ||
      cv.skills.length ||
      cv.experience.length ||
      cv.projects.length ||
      Object.values(cv.education).some((value) => value.trim()) ||
      cv.courses.length ||
      cv.languages.length ||
      (cv.references.enabled && (cv.references.text.trim() || cv.references.linkText.trim())),
  );
}
