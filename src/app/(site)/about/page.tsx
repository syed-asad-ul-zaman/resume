import Link from "next/link";
import { Breadcrumbs, JsonLd, PageHead } from "@/components/site/site-shell";
import { cv as codeCv } from "@/content/cv";
import { photos } from "@/content/photos";
import { readCv } from "@/lib/persona/cv";
import { lt } from "@/lib/persona/text";
import { breadcrumbLd, describe, graph, pageMetadata, profilePageLd } from "@/lib/seo";
import { withBase } from "@/lib/utils";
import { otherPersonaMetadata, otherPersonaPage } from "@/components/site/other-persona";
import { clientSection } from "@/server/persona/compile";
import { currentPersona } from "@/server/persona/resolve";

const PATH = "/about/";
const TITLE = "About";

export async function generateMetadata() {
  const other = await otherPersonaMetadata("about");
  if (other) return other;
  const persona = await currentPersona();
  const cv = readCv(persona.compiled.doc.document.data, codeCv, persona.compiled.number > 0 || persona.compiled.versionId !== null);
  const identity = persona.compiled.doc.identity;
  return pageMetadata({
    path: PATH,
    title: TITLE,
    description: describe(`About ${identity.name}: ${cv.profile}`),
    person: { name: identity.name, givenName: identity.givenName, familyName: identity.familyName },
  });
}

const trail = [
  { name: "Home", path: "/" },
  { name: "About", path: PATH },
];

export default async function AboutPage() {
  const other = await otherPersonaPage("about");
  if (other) return other;
  const persona = await currentPersona();
  const { identity } = persona.compiled.doc;
  const cv = readCv(persona.compiled.doc.document.data, codeCv, persona.compiled.number > 0 || persona.compiled.versionId !== null);
  const photo = identity.photos[0] ?? (persona.compiled.number > 0 || persona.compiled.versionId !== null ? { width: 1, height: 1 } : photos[0]);
  const photoSrc = identity.avatar?.src || identity.photos[0]?.src || cv.photo || (persona.compiled.number > 0 || persona.compiled.versionId !== null ? "" : photos[0].src);
  const role = lt(identity.role, persona.lang) || cv.title;
  const location = lt(identity.location, persona.lang);
  const beliefsSection = persona.compiled.doc.sections.find((section) => section.key === "beliefs");
  const visibleBeliefs = beliefsSection
    ? clientSection(beliefsSection, persona.tier, persona.lang).items.map((item) => item.text ?? item.value ?? item.label).filter(Boolean)
    : [];
  return (
    <>
      <JsonLd data={graph(profilePageLd(PATH, `About ${identity.name}`), breadcrumbLd(trail))} />
      <Breadcrumbs trail={trail} />
      <PageHead eyebrow={cv.title || undefined} title={`About ${identity.name}`} intro={cv.profile || undefined} />

      {cv.showPhoto && photoSrc && (
        <figure className="mb-12 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBase(photoSrc)}
            alt={`Portrait of ${identity.name}`}
            width={photo.width}
            height={photo.height}
            className="h-56 w-auto rounded-2xl object-cover shadow-sm"
            loading="eager"
            fetchPriority="high"
          />
          {(role || location || cv.availability) && <figcaption className="text-sm text-muted">
            {[identity.name, role, location].filter(Boolean).join(" · ")}
            {cv.availability && <><br />{cv.availability}.</>}
          </figcaption>}
        </figure>
      )}

      {cv.highlights.length > 0 && <section aria-labelledby="numbers" className="mb-12">
        <h2 id="numbers" className="display text-2xl">
          Highlights
        </h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {cv.highlights.map((highlight, i) => (
            <li key={`${i}-${highlight}`} className="card p-4">
              <p className="text-sm leading-relaxed">{highlight}</p>
            </li>
          ))}
        </ul>
      </section>}

      {cv.skills.length > 0 && <section aria-labelledby="what" className="mb-12">
        <h2 id="what" className="display text-2xl">
          What I do
        </h2>
        <dl className="mt-4 divide-y divide-line">
          {cv.skills.map((skill, i) => (
            <div key={`${i}-${skill.k}`} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
              <dt className="shrink-0 font-semibold sm:w-36">{skill.k}</dt>
              <dd className="text-muted">{skill.v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm">
          See my <Link href="/experience/" className="font-semibold underline-offset-4 hover:underline">experience</Link>, the{" "}
          <Link href="/projects/" className="font-semibold underline-offset-4 hover:underline">projects I&apos;ve built</Link> and my{" "}
          <Link href="/skills/" className="font-semibold underline-offset-4 hover:underline">skills</Link>.
        </p>
      </section>}

      {visibleBeliefs.length > 0 && (
        <section id="beliefs" aria-labelledby="beliefs-h" className="mb-12 scroll-mt-24">
          <h2 id="beliefs-h" className="display text-2xl">
            What I believe
          </h2>
          <ul className="mt-4 space-y-2">
            {visibleBeliefs.map((belief, i) => (
              <li key={`${i}-${belief}`} className="font-serif text-xl leading-snug">
                &ldquo;{belief}&rdquo;
              </li>
            ))}
          </ul>
        </section>
      )}

      {Object.values(cv.education).some((value) => value.trim()) || cv.courses.length > 0 ? <section id="education" aria-labelledby="education-h" className="mb-12 scroll-mt-24">
        <h2 id="education-h" className="display text-2xl">
          Education
        </h2>
        <div className="mt-4">
          {([cv.education.degree, cv.education.school, cv.education.year].filter(Boolean).length > 0) && <h3 className="font-semibold">
            {[cv.education.degree, cv.education.school, cv.education.year].filter(Boolean).join(" - ")}
          </h3>}
          {cv.education.note && <p className="mt-1 text-muted">{cv.education.note}</p>}
          {cv.courses.length > 0 && (
            <p className="mt-3 text-sm text-muted">
              <span className="font-semibold text-fg">Continued learning:</span> {cv.courses.join(", ")}
            </p>
          )}
        </div>
      </section> : null}
    </>
  );
}
