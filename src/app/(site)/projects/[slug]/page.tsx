import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, JsonLd } from "@/components/site/site-shell";
import { cv as codeCv } from "@/content/cv";
import { projectById, projects } from "@/content/projects";
import { readCv } from "@/lib/persona/cv";
import { breadcrumbLd, describe, graph, pageMetadata, webPageLd } from "@/lib/seo";
import { currentPersona } from "@/server/persona/resolve";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const staticProject = projectById(slug);
  const persona = await currentPersona();
  if (!staticProject || !persona.compiled.doc.legacy) return {};
  const cv = readCv(persona.compiled.doc.document.data, codeCv, persona.compiled.number > 0 || persona.compiled.versionId !== null);
  const project = cv.projects[projects.findIndex((item) => item.id === slug)];
  if (!project) return {};
  return pageMetadata({
    path: `/projects/${slug}/`,
    title: `${project.name} - project`,
    description: describe(`${project.name}: ${project.text}`),
    person: {
      name: persona.compiled.doc.identity.name,
      givenName: persona.compiled.doc.identity.givenName,
      familyName: persona.compiled.doc.identity.familyName,
    },
  });
}

export default async function ProjectPage(props: Props) {
  const { slug } = await props.params;
  const staticProject = projectById(slug);
  const persona = await currentPersona();
  if (!staticProject || !persona.compiled.doc.legacy) notFound();

  const cv = readCv(persona.compiled.doc.document.data, codeCv, persona.compiled.number > 0 || persona.compiled.versionId !== null);
  const projectIndex = projects.findIndex((item) => item.id === slug);
  const project = cv.projects[projectIndex];
  if (!project) notFound();

  const path = `/projects/${slug}/`;
  const trail = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects/" },
    { name: project.name, path },
  ];
  const others = cv.projects
    .map((item, index) => ({ project: item, id: projects[index]?.id }))
    .filter((item) => item.id && item.id !== slug)
    .slice(0, 3);
  const tags = project.meta.split(",").map((tag) => tag.trim()).filter(Boolean);

  return (
    <>
      <JsonLd data={graph(webPageLd(path, `${project.name} - ${persona.compiled.doc.identity.name}`, project.text), breadcrumbLd(trail))} />
      <Breadcrumbs trail={trail} />

      <article>
        <header className="mb-10">
          <p className="eyebrow">{project.meta}</p>
          <h1 className="display mt-3 text-4xl md:text-5xl">{project.name}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{project.text}</p>
        </header>

        {tags.length > 0 && (
          <section aria-labelledby="stack" className="mb-10">
            <h2 id="stack" className="display text-2xl">
              Technologies
            </h2>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <li key={tag} className="tag">
                  {tag}
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      <aside aria-labelledby="more" className="mt-14 border-t border-line pt-8">
        <h2 id="more" className="display text-xl">
          More projects
        </h2>
        <ul className="mt-4 space-y-3">
          {others.map(({ project: other, id }) => (
            <li key={id}>
              <Link href={`/projects/${id}/`} className="font-semibold underline-offset-4 hover:underline">
                {other.name}
              </Link>
              <span className="text-muted"> - {other.text}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm">
          <Link href="/projects/" className="font-semibold underline-offset-4 hover:underline">
            All projects
          </Link>{" "}
          · <Link href={`/ask/project-${slug}/`} className="font-semibold underline-offset-4 hover:underline">Ask about it in the chat</Link>
        </p>
      </aside>
    </>
  );
}
