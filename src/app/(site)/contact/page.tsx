import { FileText, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/blocks/forms";
import { Facebook, Github, Instagram, Linkedin, Whatsapp } from "@/components/brand-icons";
import { Breadcrumbs, JsonLd, PageHead } from "@/components/site/site-shell";
import { cv as codeCv } from "@/content/cv";
import { readCv } from "@/lib/persona/cv";
import { lt } from "@/lib/persona/text";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbLd, describe, graph, pageMetadata, PERSON_ID, WEBSITE_ID } from "@/lib/seo";
import { withBase } from "@/lib/utils";
import { otherPersonaMetadata, otherPersonaPage } from "@/components/site/other-persona";
import { currentPersona } from "@/server/persona/resolve";

const PATH = "/contact/";
const TITLE = "Contact and hiring";

export async function generateMetadata() {
  const other = await otherPersonaMetadata("contact");
  if (other) return other;
  const persona = await currentPersona();
  const { identity } = persona.compiled.doc;
  const cv = readCv(persona.compiled.doc.document.data, codeCv, persona.compiled.number > 0 || persona.compiled.versionId !== null);
  const intro = [cv.title, lt(identity.location, persona.lang), cv.availability].filter(Boolean).join(" · ");
  return pageMetadata({
    path: PATH,
    title: TITLE,
    description: describe(`Contact ${identity.name}: ${intro}`),
    person: { name: identity.name, givenName: identity.givenName, familyName: identity.familyName },
  });
}

const trail = [
  { name: "Home", path: "/" },
  { name: "Contact", path: PATH },
];

export default async function ContactPage() {
  const other = await otherPersonaPage("contact");
  if (other) return other;
  const persona = await currentPersona();
  const { identity } = persona.compiled.doc;
  const cv = readCv(persona.compiled.doc.document.data, codeCv, persona.compiled.number > 0 || persona.compiled.versionId !== null);
  const intro = [cv.title, lt(identity.location, persona.lang), cv.availability].filter(Boolean).join(" · ");
  const description = describe(`Contact ${identity.name}: ${intro}`);
  const contactPage = {
    "@type": "ContactPage",
    "@id": `${absoluteUrl(PATH)}#page`,
    url: absoluteUrl(PATH),
    name: `Contact ${identity.name}`,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": PERSON_ID },
  };
  const socialIcons: Record<string, typeof Github> = { github: Github, linkedin: Linkedin, facebook: Facebook, instagram: Instagram, whatsapp: Whatsapp };
  const rows: { icon: typeof Mail | typeof Github; label: string; value: string; href?: string }[] = [
    ...(identity.email ? [{ icon: Mail, label: "Email", value: identity.email, href: `mailto:${identity.email}` }] : []),
    ...(identity.phone ? [{ icon: Phone, label: "Phone / WhatsApp", value: identity.phone, href: `tel:${identity.phone.replace(/[^\d+]/g, "")}` }] : []),
    ...identity.links.map((link) => ({
      icon: socialIcons[link.kind as keyof typeof socialIcons] ?? Github,
      label: link.label,
      value: link.href.replace(/^https?:\/\/(www\.)?/, ""),
      href: link.href,
    })),
    ...(identity.location ? [{ icon: MapPin, label: "Location", value: lt(identity.location, persona.lang) }] : []),
  ];
  const cvHref = `/${persona.compiled.doc.document.slug}/`;
  return (
    <>
      <JsonLd data={graph(contactPage, breadcrumbLd(trail))} />
      <Breadcrumbs trail={trail} />
      <PageHead eyebrow="Hire me" title="Contact and hiring" intro={intro || undefined} />

      {cv.availability && <section aria-labelledby="looking" className="public-section">
        <h2 id="looking" className="display public-section-title">
          Availability
        </h2>
        <p className="mt-4 leading-relaxed text-muted">{cv.availability}</p>
      </section>}

      {rows.length > 0 && <section aria-labelledby="reach" className="public-section">
        <h2 id="reach" className="display public-section-title">
          How to reach me
        </h2>
        <ul className="mt-4 divide-y divide-line">
          {rows.map((r) => (
            <li key={r.label} className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 py-3">
              <r.icon className="size-5 shrink-0 text-faint" />
              <span className="public-meta w-24 shrink-0 text-muted sm:w-36">{r.label}</span>
              {r.href ? (
                <a href={r.href} target={r.href.startsWith("http") ? "_blank" : undefined} rel={r.href.startsWith("http") ? "me noreferrer" : undefined} className="min-w-0 flex-1 break-all font-semibold hover:underline">
                  {r.value}
                </a>
              ) : (
                <span className="font-semibold">{r.value}</span>
              )}
            </li>
          ))}
        </ul>
        <a href={withBase(cvHref)} className="btn btn-ghost mt-4">
          <FileText className="size-4" /> View my CV
        </a>
      </section>}

      <section id="message" aria-labelledby="message-h" className="scroll-mt-24">
        <h2 id="message-h" className="display public-section-title mb-4">
          Send a message
        </h2>
        <ContactForm />
      </section>
    </>
  );
}
