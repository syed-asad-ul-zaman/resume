import Link from "next/link";
import { Breadcrumbs, JsonLd, PageHead } from "@/components/site/site-shell";
import { cv as codeCv } from "@/content/cv";
import { readCv } from "@/lib/persona/cv";
import { breadcrumbLd, describe, graph, pageMetadata, webPageLd } from "@/lib/seo";
import { otherPersonaMetadata, otherPersonaPage } from "@/components/site/other-persona";
import { currentPersona } from "@/server/persona/resolve";

const PATH = "/skills/";
const TITLE = "Skills";

export async function generateMetadata() {
  const other = await otherPersonaMetadata("skills");
  if (other) return other;
  const persona = await currentPersona();
  const cv = readCv(persona.compiled.doc.document.data, codeCv, persona.compiled.number > 0 || persona.compiled.versionId !== null);
  const identity = persona.compiled.doc.identity;
  const skillSummary = cv.skills.map((skill) => `${skill.k}: ${skill.v}`).join(". ");
  return pageMetadata({
    path: PATH,
    title: TITLE,
    description: describe(`Skills of ${identity.name}: ${skillSummary}`),
    person: { name: identity.name, givenName: identity.givenName, familyName: identity.familyName },
  });
}

const trail = [
  { name: "Home", path: "/" },
  { name: "Skills", path: PATH },
];

export default async function SkillsPage() {
  const other = await otherPersonaPage("skills");
  if (other) return other;
  const persona = await currentPersona();
  const { identity } = persona.compiled.doc;
  const cv = readCv(persona.compiled.doc.document.data, codeCv, persona.compiled.number > 0 || persona.compiled.versionId !== null);
  const description = describe(`Skills of ${identity.name}: ${cv.skills.map((skill) => `${skill.k}: ${skill.v}`).join(". ")}`);
  const cloudSkills = cv.skills.filter((skill) => /cloud|devops/i.test(skill.k));
  return (
    <>
      <JsonLd data={graph(webPageLd(PATH, `Skills - ${identity.name}`, description), breadcrumbLd(trail))} />
      <Breadcrumbs trail={trail} />
      <PageHead eyebrow="Tech stack" title="Skills" intro={cv.profile} />

      {cv.skills.length > 0 && <div className="public-list-flow-tight">
        {cv.skills.map((group, i) => (
          <section key={`${i}-${group.k}`} aria-labelledby={`g-${i}`}>
            <h2 id={`g-${i}`} className="public-copy font-semibold">
              {group.k}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {group.v.split(",").map((skill) => skill.trim()).filter(Boolean).map((s) => (
                <li key={s} className="tag">
                  {s}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>}

      {cloudSkills.length > 0 && <section id="cloud" aria-labelledby="cloud-h" className="public-section mt-12 scroll-mt-24">
        <h2 id="cloud-h" className="display public-section-title">
          Cloud and DevOps in practice
        </h2>
        <dl className="mt-4 divide-y divide-line">
          {cloudSkills.map((group, i) => (
            <div key={`${i}-${group.k}`} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
              <dt className="shrink-0 font-semibold sm:w-56">{group.k}</dt>
              <dd className="text-muted">{group.v}</dd>
            </div>
          ))}
        </dl>
      </section>}

      {(cv.projects.length > 0 || cv.experience.length > 0) && <p className="mt-10 text-sm">
        See these skills at work in my <Link href="/projects/" className="font-semibold underline-offset-4 hover:underline">projects</Link> and{" "}
        <Link href="/experience/" className="font-semibold underline-offset-4 hover:underline">experience</Link>.
      </p>}
    </>
  );
}
