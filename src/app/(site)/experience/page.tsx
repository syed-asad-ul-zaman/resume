import Link from "next/link";
import { Breadcrumbs, JsonLd, PageHead } from "@/components/site/site-shell";
import { cv as codeCv } from "@/content/cv";
import { readCv } from "@/lib/persona/cv";
import { breadcrumbLd, describe, graph, pageMetadata, webPageLd } from "@/lib/seo";
import { otherPersonaMetadata, otherPersonaPage } from "@/components/site/other-persona";
import { currentPersona } from "@/server/persona/resolve";

const PATH = "/experience/";
const TITLE = "Experience";

export async function generateMetadata() {
  const other = await otherPersonaMetadata("experience");
  if (other) return other;
  const persona = await currentPersona();
  const cv = readCv(persona.compiled.doc.document.data, codeCv, persona.compiled.number > 0 || persona.compiled.versionId !== null);
  const identity = persona.compiled.doc.identity;
  return pageMetadata({
    path: PATH,
    title: TITLE,
    description: describe(`Professional experience of ${identity.name}: ${cv.profile}`),
    person: { name: identity.name, givenName: identity.givenName, familyName: identity.familyName },
  });
}

const trail = [
  { name: "Home", path: "/" },
  { name: "Experience", path: PATH },
];

export default async function ExperiencePage() {
  const other = await otherPersonaPage("experience");
  if (other) return other;
  const persona = await currentPersona();
  const { identity } = persona.compiled.doc;
  const cv = readCv(persona.compiled.doc.document.data, codeCv, persona.compiled.number > 0 || persona.compiled.versionId !== null);
  const role = identity.role || cv.title;
  const intro = [cv.profile, role, cv.availability].filter(Boolean).join(" · ");
  const description = describe(`Work experience of ${identity.name}: ${intro}`);
  return (
    <>
      <JsonLd data={graph(webPageLd(PATH, `Experience - ${identity.name}`, description), breadcrumbLd(trail))} />
      <Breadcrumbs trail={trail} />
      <PageHead eyebrow="Career" title="Experience" intro={intro || undefined} />

      {cv.experience.length > 0 && <ol className="public-list-flow">
        {cv.experience.map((job, i) => (
          <li key={`${i}-${job.company}`}>
            <article>
              <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="display public-section-title">
                  {job.role} <span className="text-muted">· {job.company}</span>
                </h2>
                <p className="public-meta font-semibold text-faint">{job.period}</p>
              </header>
              <p className="public-meta mt-1 text-muted">
                {job.location}
                {job.context ? ` · ${job.context}` : ""}
              </p>
              <ul className="mt-4 list-disc space-y-1.5 pl-5 leading-relaxed marker:text-faint">
                {job.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>

              {job.engagements.map((e, j) => (
                <section key={`${j}-${e.title}`} className="mt-6 border-l-2 border-line pl-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="public-copy font-semibold">{e.title}</h3>
                    <p className="public-meta text-faint">{e.period}</p>
                  </div>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 leading-relaxed marker:text-faint">
                    {e.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  {e.stack && (
                    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies">
                      {e.stack.split(",").map((s) => s.trim()).filter(Boolean).map((s) => (
                        <li key={s} className="tag">
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </article>
          </li>
        ))}
      </ol>}

      {cv.experience.length > 0 && <p className="mt-10 text-sm">
        The work above in detail: <Link href="/projects/" className="font-semibold underline-offset-4 hover:underline">projects and case studies</Link>, or
        the <Link href="/cv/" className="font-semibold underline-offset-4 hover:underline">full CV</Link>.
      </p>}
    </>
  );
}
