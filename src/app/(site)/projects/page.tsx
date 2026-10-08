import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumbs, JsonLd, PageHead } from "@/components/site/site-shell";
import { cv as codeCv } from "@/content/cv";
import { projects } from "@/content/projects";
import { breadcrumbLd, describe, graph, pageMetadata, PERSON_ID, webPageLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { otherPersonaMetadata, otherPersonaPage } from "@/components/site/other-persona";
import { readCv } from "@/lib/persona/cv";
import { currentPersona } from "@/server/persona/resolve";

const PATH = "/projects/";
const TITLE = "Projects";

export async function generateMetadata() {
  const other = await otherPersonaMetadata("projects");
  if (other) return other;
  const persona = await currentPersona();
  const cv = readCv(persona.compiled.doc.document.data, codeCv, persona.compiled.number > 0 || persona.compiled.versionId !== null);
  const identity = persona.compiled.doc.identity;
  return pageMetadata({
    path: PATH,
    title: TITLE,
    description: describe(`Projects by ${identity.name}: ${cv.projects.slice(0, 4).map((project) => project.name).join(", ")}.`),
    person: { name: identity.name, givenName: identity.givenName, familyName: identity.familyName },
  });
}

const trail = [
  { name: "Home", path: "/" },
  { name: "Projects", path: PATH },
];

export default async function ProjectsPage() {
  const other = await otherPersonaPage("projects");
  if (other) return other;
  const persona = await currentPersona();
  const { identity } = persona.compiled.doc;
  const cv = readCv(persona.compiled.doc.document.data, codeCv, persona.compiled.number > 0 || persona.compiled.versionId !== null);
  const description = describe(`Projects by ${identity.name}: ${cv.projects.slice(0, 4).map((project) => project.name).join(", ")}.`);
  const itemList = {
    "@type": "ItemList",
    name: `Projects by ${identity.name}`,
    author: { "@id": PERSON_ID },
    itemListElement: cv.projects.map((project, i) => ({
      "@type": "ListItem",
      position: i + 1,
      ...(projects[i] ? { url: absoluteUrl(`/projects/${projects[i].id}/`) } : {}),
      name: project.name,
    })),
  };
  return (
    <>
      <JsonLd data={graph(webPageLd(PATH, `Projects - ${identity.name}`, description), breadcrumbLd(trail), itemList)} />
      <Breadcrumbs trail={trail} />
      <PageHead eyebrow="Work" title="Projects" intro={cv.profile || undefined} />

        {cv.projects.length > 0 && <ul className="space-y-4">
        {cv.projects.map((project, i) => (
          <li key={`${i}-${project.name}`}>
            <article className="card group relative p-5 transition-colors hover:bg-bg-soft md:p-6">
              <p className="eyebrow">{project.meta}</p>
              <h2 className="display mt-2 text-2xl">
                {projects[i] ? (
                  <Link href={`/projects/${projects[i].id}/`} className="after:absolute after:inset-0 after:rounded-[inherit]">
                    {project.name}
                  </Link>
                ) : (
                  project.name
                )}
              </h2>
              <p className="mt-2 leading-relaxed text-muted">{project.text}</p>
              <ArrowUpRight className="absolute top-5 right-5 size-5 text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </article>
          </li>
        ))}
      </ul>}
    </>
  );
}
