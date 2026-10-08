import { cv as codeCv } from "@/content/cv";
import { projects } from "@/content/projects";
import { hasCvDocumentContent, readCv } from "@/lib/persona/cv";
import { SITE_PAGES } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { headers } from "next/headers";
import { lt } from "@/lib/persona/text";
import { clientSection } from "@/server/persona/compile";
import { sitePages } from "@/server/persona/pages";
import { currentPersona, type ResolvedPersona } from "@/server/persona/resolve";
import { personaUrl } from "@/server/persona/urls";

// A plain-text summary for AI assistants and LLM crawlers (llmstxt.org), built from the same content.
// Per persona: the job persona's from src/content; others from their public facts only.
export async function GET() {
  const p = await currentPersona();
  if (!p.compiled.doc.legacy) return personaLlms(p, await headers());
  const { identity, document } = p.compiled.doc;
  const cv = readCv(document.data, codeCv, p.compiled.number > 0 || p.compiled.versionId !== null);
  const headline = [cv.title, lt(identity.headline, p.lang), lt(identity.location, p.lang), cv.availability].filter(Boolean).join(". ");
  const contact = [
    ...(identity.email ? [`- Email: ${identity.email}`] : []),
    ...identity.links.map((link) => `- ${link.label}: ${link.href}`),
  ];
  const lines = [
    `# ${identity.name}`,
    "",
    ...(headline ? [`> ${headline}`, ""] : []),
    ...(cv.profile ? [cv.profile, ""] : []),
    "## Pages",
    ...SITE_PAGES.map((p) => `- [${p.label}](${absoluteUrl(p.path)})`),
    ...(hasCvDocumentContent(cv)
      ? [`- [CV](${absoluteUrl("/cv/")}): printable CV, also as a PDF at ${absoluteUrl(`/${document.fileName}`)}`]
      : [`- [CV](${absoluteUrl("/cv/")})`]),
    `- [Chat](${absoluteUrl("/")}): ask about my work in a chat interface`,
    "",
    ...(cv.experience.length
      ? ["## Experience", ...cv.experience.map((j) => `- ${[j.role, j.company].filter(Boolean).join(", ")}${[j.period, j.location].filter(Boolean).length ? ` (${[j.period, j.location].filter(Boolean).join(", ")})` : ""}`), ""]
      : []),
    ...(cv.projects.length
      ? [
          "## Projects",
          ...cv.projects.map((project, i) =>
            projects[i]
              ? `- [${project.name}](${absoluteUrl(`/projects/${projects[i].id}/`)}): ${project.text}`
              : `- ${project.name}: ${project.text}`,
          ),
          "",
        ]
      : []),
    ...(contact.length ? ["## Contact", ...contact, ""] : []),
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}

function personaLlms(p: ResolvedPersona, h: Headers) {
  const { doc } = p.compiled;
  const pub = { ...p, tier: "public" as const, lang: doc.site.defaultLang };
  const id = doc.identity;
  const summary = lt(doc.site.description, "en") || lt(id.summary, "en");
  const facts = doc.sections
    .filter((s) => s.visibility === "public" && s.inChat)
    .map((s) => clientSection(s, "public", "en"))
    .filter((s) => s.items.length);
  const lines = [
    `# ${id.name}`,
    "",
    `> ${[lt(id.role, "en"), lt(id.headline, "en"), lt(id.location, "en")].filter(Boolean).join(". ")}`,
    "",
    ...(summary ? [summary, ""] : []),
    "## Pages",
    `- [Chat](${personaUrl(pub, h, "/")}): ask about ${id.shortName} in a chat`,
    ...sitePages(pub)
      .filter((x) => x.kind === "section" || !doc.document.gated)
      .map((x) => `- [${x.title}](${personaUrl(pub, h, x.path)})`),
    "",
    ...facts.flatMap((s) => [
      `## ${s.title}`,
      ...s.items.map((it) => `- ${[it.period, it.label, it.value ?? it.text, it.meta].filter(Boolean).join(" | ").replace(/\n+/g, " ")}`),
      "",
    ]),
    "Details beyond these are shared privately with families and people who have an access code.",
    "",
  ];
  if (!doc.site.indexable) return new Response("", { status: 404 });
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=600" } });
}
