import { Mail, MapPin, Phone } from "lucide-react";
import { Facebook, Github, Instagram, Linkedin, Whatsapp } from "@/components/brand-icons";
import { profile } from "@/content/profile";
import type { CvData } from "@/lib/persona/cv";
import type { LText } from "@/lib/persona/text";
import type { Lang } from "@/lib/persona/types";
import { lt } from "@/lib/persona/text";
import { withBase } from "@/lib/utils";
import "./cv.css";

/**
 * The CV as a sheet of paper: used by /cv/ (and so the PDF) and by the live preview in the Studio, so
 * what the owner edits is exactly what gets printed. Contact details come from the profile.
 */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="cv-section">
      <h2 className="cv-h2">{title}</h2>
      {children}
    </section>
  );
}

type CvIdentity = {
  name: string;
  role?: LText;
  location?: LText;
  email?: string;
  phone?: string;
  links: { kind: string; label: string; href: string }[];
};

const SOCIAL_ICONS = { github: Github, linkedin: Linkedin, facebook: Facebook, instagram: Instagram, whatsapp: Whatsapp } as const;
const isSocialKind = (kind: string): kind is keyof typeof SOCIAL_ICONS => Object.hasOwn(SOCIAL_ICONS, kind);

export function CvSheet({ cv, identity, lang = "en" }: { cv: CvData; identity?: CvIdentity; lang?: Lang }) {
  const owner = identity ?? {
    name: profile.name,
    location: profile.location,
    email: profile.email,
    phone: profile.phone,
    links: [{ kind: "linkedin", label: profile.links.linkedinHandle, href: profile.links.linkedin }],
  };
  const contacts = [
    ...(owner.location ? [{ icon: MapPin, label: lt(owner.location, lang) }] : []),
    ...(owner.email ? [{ icon: Mail, label: owner.email, href: `mailto:${owner.email}` }] : []),
    ...(owner.phone ? [{ icon: Phone, label: owner.phone, href: `tel:${owner.phone.replace(/[^\d+]/g, "")}` }] : []),
    ...owner.links.flatMap((link) =>
      isSocialKind(link.kind) ? [{ icon: SOCIAL_ICONS[link.kind], label: link.label, href: link.href }] : [],
    ),
  ];

  return (
    <article className="cv-sheet">
      <header className="cv-header">
        {cv.showPhoto && cv.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={withBase(cv.photo)} alt={`Photo of ${owner.name}`} width={240} height={240} className="cv-photo" />
        )}
        <div className="min-w-0 flex-1">
          <h1 className="cv-name">{owner.name}</h1>
          {(lt(owner.role, lang) || cv.title) && <p className="cv-title">{lt(owner.role, lang) || cv.title}</p>}
          <ul className="cv-contacts">
            {contacts.map((c) => (
              <li key={c.label}>
                <c.icon className="cv-icon" aria-hidden="true" />
                {c.href ? <a href={c.href}>{c.label}</a> : <span>{c.label}</span>}
              </li>
            ))}
          </ul>
        </div>
      </header>
      {cv.availability && <p className="cv-availability">{cv.availability}</p>}

      {cv.profile && <Section title="Profile">
        <p className="cv-text">{cv.profile}</p>
      </Section>}

      {cv.highlights.length > 0 && <Section title="Key achievements">
        <ul className="cv-bullets">
          {cv.highlights.map((h, i) => (
            <li key={`${i}-${h}`}>{h}</li>
          ))}
        </ul>
      </Section>}

      {cv.skills.length > 0 && <Section title="Core skills">
        <dl className="cv-skills">
          {cv.skills.map((s, i) => (
            <div key={`${i}-${s.k}`} className="cv-skill">
              <dt>{s.k}</dt>
              <dd>{s.v}</dd>
            </div>
          ))}
        </dl>
      </Section>}

      {cv.experience.length > 0 && <Section title="Professional experience">
        <div className="cv-jobs">
          {cv.experience.map((job, j) => (
            <div key={`${j}-${job.company}`} className="cv-job">
              <div className="cv-row">
                <h3 className="cv-h3">
                  {job.role} <span className="cv-at">· {job.company}</span>
                </h3>
                <span className="cv-date">{job.period}</span>
              </div>
              <p className="cv-meta">
                {job.location}
                {job.context ? ` · ${job.context}` : ""}
              </p>
              <ul className="cv-bullets">
                {job.bullets.map((b, i) => (
                  <li key={`${i}-${b}`}>{b}</li>
                ))}
              </ul>
              {job.engagements.map((e, k) => (
                <div key={`${k}-${e.title}`} className="cv-engagement">
                  <div className="cv-row">
                    <h4 className="cv-h4">{e.title}</h4>
                    <span className="cv-date">{e.period}</span>
                  </div>
                  <ul className="cv-bullets">
                    {e.bullets.map((b, i) => (
                      <li key={`${i}-${b}`}>{b}</li>
                    ))}
                  </ul>
                  <p className="cv-stack">
                    <span>Stack:</span> {e.stack}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>}

      {cv.projects.length > 0 && <Section title="Selected projects">
        <ul className="cv-bullets cv-projects">
          {cv.projects.map((p, i) => (
            <li key={`${i}-${p.name}`}>
              <strong>{p.name}</strong> <span className="cv-faint">({p.meta})</span> - {p.text}
            </li>
          ))}
        </ul>
      </Section>}

      {(Object.values(cv.education).some((value) => value.trim()) || cv.courses.length > 0 || cv.languages.length > 0) && <div className="cv-two">
        {(Object.values(cv.education).some((value) => value.trim()) || cv.courses.length > 0) && <Section title="Education">
          <div className="cv-avoid">
            <div className="cv-row">
              {cv.education.degree && <h3 className="cv-h4">{cv.education.degree}</h3>}
              {cv.education.year && <span className="cv-date">{cv.education.year}</span>}
            </div>
            {cv.education.school && <p className="cv-meta">{cv.education.school}</p>}
            {cv.education.note && <p className="cv-text">{cv.education.note}</p>}
            {cv.courses.length > 0 && <p className="cv-stack"><span>Courses:</span> {cv.courses.join(", ")}</p>}
          </div>
        </Section>}

        {cv.languages.length > 0 && (
          <Section title="Languages">
            <ul className="cv-langs">
              {cv.languages.map((l, i) => (
                <li key={`${i}-${l.name}`}>
                  <span className="font-semibold">{l.name}</span>
                  <span>{l.level}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>}

      {cv.references.enabled && (cv.references.text.trim() || cv.references.linkText.trim()) && (
        <Section title={cv.references.label}>
          <p className="cv-text">
            {cv.references.text}{" "}
            {cv.references.linkText && (
              <a href={cv.references.url} target="_blank" rel="noopener noreferrer" className="cv-reference-link">
                {cv.references.linkText}
              </a>
            )}
          </p>
        </Section>
      )}
    </article>
  );
}
