"use client";

import { IntentLink } from "@/components/chat/intent-link";
import { useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  Download,
  FileText,
  Link,
  Mail,
  MapPin,
  Phone,
  UserRoundPlus,
} from "lucide-react";
import { Github, Linkedin } from "@/components/brand-icons";
import { ContactForm, FeedbackForm } from "./forms";
import { PrivacyChoice } from "@/components/consent";
import { cloud, languages, skills } from "@/content/details";
import { experience, type Job } from "@/content/experience";
import { profile } from "@/content/profile";
import { projectById, projects } from "@/content/projects";
import { usePersona } from "@/lib/persona/context";
import { QIcon } from "@/lib/persona/icons";
import type { Block } from "@/lib/persona/types";
import { cn } from "@/lib/utils";
import { RequestAccess } from "./request-access";
import { SectionBlock } from "./section-block";

type Ask = (intentId: string) => void;

export function BlockView({ block, onAsk }: { block: Block; onAsk: Ask }) {
  switch (block.kind) {
    case "stats":
    return <Stats />;
    case "focus":
    return <Focus />;
    case "beliefs":
    return <PublishedSection sectionKey="beliefs" fallback={null} />;
    case "privacy":
      return <PrivacyChoice />;
    case "experience":
      return <Experience />;
    case "projects":
      return <ProjectGrid onAsk={onAsk} />;
    case "project":
      return <ProjectDetail id={block.id} />;
    case "skills":
      return <Skills />;
    case "cloud":
      return <CloudList />;
    case "education":
      return <Education />;
    case "languages":
      return <LanguageBars />;
    case "contact":
      return <ContactCard />;
    case "hire":
      return <HireMe />;
    case "download":
      return <DownloadCard />;
    case "quotes":
      return (
        <>
          <PublishedSection sectionKey="recommendations" fallback={null} />
          <SectionBlock sectionKey="team-notes" />
        </>
      );
    case "stack":
      return <PublishedSection sectionKey="this-site" fallback={null} />;
    case "suggest":
      return <Suggest onAsk={onAsk} />;
    case "contact-form":
      return <ContactForm />;
    case "feedback-form":
      return <FeedbackForm />;
    case "section":
      return <SectionBlock sectionKey={block.key} />;
    case "request-access":
      return <RequestAccess />;
  }
}

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* clipboard blocked - the visible text can still be selected */
    }
  };
  return { copied, copy };
}

const Tags = ({ items, className }: { items: readonly string[]; className?: string }) => (
  <ul className={cn("flex flex-wrap gap-1.5", className)}>
    {items.map((s) => (
      <li key={s} className="tag">
        {s}
      </li>
    ))}
  </ul>
);

function PublishedSection({ sectionKey, fallback }: { sectionKey: string; fallback: ReactNode }) {
  const { section } = usePersona();
  return section(sectionKey) ? <SectionBlock sectionKey={sectionKey} /> : fallback;
}

function Stats() {
  const { legacyCv } = usePersona();
  if (legacyCv) {
    return (
      <ul className="grid gap-3 md:grid-cols-2">
        {legacyCv.highlights.map((highlight, i) => (
          <li key={`${i}-${highlight}`} data-gs="row" className="card p-4 text-[15px] leading-relaxed md:p-5">
            {highlight}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {profile.stats.map((s) => (
        <li key={s.label} data-gs="pop" className="card p-4 md:p-5">
          <div data-gs="count" className="display text-4xl tabular-nums md:text-[2.6rem]">{s.value}</div>
          <div className="mt-2 text-sm leading-snug text-muted">{s.label}</div>
        </li>
      ))}
    </ul>
  );
}

function Focus() {
  const { legacyCv } = usePersona();
  if (legacyCv) {
    return (
      <div className="card p-4 text-[15px] leading-relaxed text-muted md:p-5">
        {legacyCv.profile}
      </div>
    );
  }
  return (
    <ul className="card divide-y divide-line">
      {profile.focus.map((f) => (
        <li key={f.area} data-gs="row" className="flex flex-col gap-1 p-4 sm:flex-row sm:gap-5 md:px-5">
          <span className="shrink-0 font-semibold sm:w-36">{f.area}</span>
          <span className="text-[15px] leading-relaxed text-muted">{f.text}</span>
        </li>
      ))}
    </ul>
  );
}

function Experience() {
  const { legacyCv } = usePersona();
  const jobs: Job[] = legacyCv
    ? legacyCv.experience.map((job) => ({
        ...job,
        engagements: job.engagements.map((engagement) => ({
          ...engagement,
          role: "",
          stack: engagement.stack.split(",").map((item) => item.trim()).filter(Boolean),
        })),
      }))
    : experience;
  return (
    <ol className="relative space-y-8 pl-6 md:pl-8">
      <span data-gs="line" aria-hidden="true" className="absolute top-1 bottom-1 left-0 w-px bg-line" />
      {jobs.map((job) => (
        <li key={job.company} className="relative">
          <span data-gs="dot" className="absolute top-2 -left-[29px] size-2.5 rounded-full bg-accent ring-4 ring-bg md:-left-[37px]" />
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="display text-2xl md:text-[1.7rem]">{job.company}</h3>
            <span className="text-sm font-medium text-faint">{job.period}</span>
          </div>
          <p className="mt-1 font-semibold">
            {job.role} <span className="font-normal text-muted">· {job.location}</span>
          </p>
          {job.context && <p className="text-sm text-muted">{job.context}</p>}
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[16px] leading-relaxed marker:text-faint">
            {job.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          {job.engagements && (
            <div className="mt-5 space-y-3">
              {job.engagements.map((e) => (
                <details key={e.title} data-gs="row" className="group border-l-2 border-line pl-4 open:border-accent/60 md:pl-5">
                  <summary className="flex cursor-pointer items-start justify-between gap-3 rounded-lg py-2 pr-1">
                    <div className="min-w-0">
                      <div className="text-[17px] font-semibold">{e.title}</div>
                      <div className="text-sm text-muted">
                        {e.role} · {e.period}
                      </div>
                    </div>
                    <ChevronDown className="mt-1 size-5 shrink-0 text-faint transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="pt-1 pb-3">
                    <ul className="list-disc space-y-1.5 pl-5 text-[16px] leading-relaxed marker:text-faint">
                      {e.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                    {e.stack && <Tags items={e.stack} className="mt-3" />}
                  </div>
                </details>
              ))}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

function ProjectGrid({ onAsk }: { onAsk: Ask }) {
  const { legacyCv } = usePersona();
  const entries = legacyCv?.projects ?? projects.map((p) => ({ name: p.name, meta: p.stack.join(", "), text: p.tagline }));
  return (
    <div className="space-y-3">
      {entries.map((p, i) => {
        const projectId = projects[i]?.id;
        const content = (
          <>
            <div className="min-w-0 flex-1">
              {p.meta && <div className="eyebrow">{p.meta}</div>}
              <h3 className="display mt-2 text-[1.5rem] md:text-[1.7rem]">{p.name}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted md:text-base">{p.text}</p>
              <Tags items={p.meta.split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 6)} className="mt-3" />
            </div>
            {projectId && (
              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-faint transition-colors group-hover:border-surface-strong group-hover:text-fg">
                <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            )}
          </>
        );
        const className = "card group flex w-full items-start gap-4 p-5 text-left md:p-6";
        return projectId ? (
          <IntentLink key={`${i}-${p.name}`} intentId={`project-${projectId}`} onPick={onAsk} aria-label={`${p.name}: read the full story`} data-gs="row" className={`${className} transition-colors hover:border-surface-strong hover:bg-bg-soft`}>
            {content}
          </IntentLink>
        ) : (
          <article key={`${i}-${p.name}`} data-gs="row" className={className}>
            {content}
          </article>
        );
      })}
    </div>
  );
}

function ProjectDetail({ id }: { id: string }) {
  const { legacyCv } = usePersona();
  const projectIndex = projects.findIndex((project) => project.id === id);
  const current = projectIndex >= 0 ? legacyCv?.projects[projectIndex] : undefined;
  if (current) {
    return (
      <article className="card overflow-hidden">
        <header className="border-b border-line bg-bg-soft p-5 md:p-6">
          {current.meta && <div className="eyebrow">{current.meta}</div>}
          <h3 className="display mt-2 text-3xl md:text-4xl">{current.name}</h3>
          <p className="mt-2 text-muted">{current.text}</p>
        </header>
        {current.meta && (
          <div className="p-5 md:p-6">
            <Tags items={current.meta.split(",").map((tag) => tag.trim()).filter(Boolean)} />
          </div>
        )}
      </article>
    );
  }
  const p = projectById(id);
  if (!p) return null;
  return (
    <article className="card overflow-hidden">
      <header className="border-b border-line bg-bg-soft p-5 md:p-6">
        <div className="eyebrow">
          {p.kind} · {p.year}
        </div>
        <h3 className="display mt-2 text-3xl md:text-4xl">{p.name}</h3>
        <p className="mt-2 text-muted">{p.problem}</p>
      </header>
      <div className="space-y-5 p-5 md:p-6">
        <div>
          <div className="eyebrow mb-2">What I built</div>
          <ul className="list-disc space-y-1.5 pl-5 text-[16px] leading-relaxed marker:text-accent">
            {p.built.map((b) => (
              <li key={b} data-gs="row">
                {b}
              </li>
            ))}
          </ul>
        </div>
        <Figures items={p.numbers} />
        <Tags items={p.stack} />
        {p.link && (
          <a href={p.link.href} target="_blank" rel="noreferrer" className="btn btn-ghost">
            <Github className="size-4" /> {p.link.label}
          </a>
        )}
      </div>
    </article>
  );
}

/** "~29k lines of code" → **~29k** lines of code, joined with dots. Each dot ends the item before it, so no line starts with one. */
function Figures({ items }: { items: readonly string[] }) {
  return (
    // Separators are drawn by .dot-list (CSS) so one never dangles at the end or start of a line.
    <p className="dot-list text-[15px] text-muted">
      {items.map((n) => {
        const [head, ...rest] = n.split(" ");
        const numeric = /\d/.test(head);
        return (
          <span key={n}>
            {numeric ? (
              <>
                <span className="font-semibold text-fg">{head}</span>
                {" "}
                {rest.join(" ")}
              </>
            ) : (
              <span className="font-semibold text-fg">{n}</span>
            )}
          </span>
        );
      })}
    </p>
  );
}

function Skills() {
  const { legacyCv } = usePersona();
  const groups = legacyCv ? legacyCv.skills.map((skill) => ({ group: skill.k, items: skill.v.split(",").map((item) => item.trim()).filter(Boolean) })) : skills;
  return (
    <div className="card divide-y divide-line">
      {groups.map((g, i) => (
        <section key={`${i}-${g.group}`} data-gs="row" className="flex flex-col gap-2.5 p-4 sm:flex-row sm:gap-5 md:px-5">
          <h3 className="shrink-0 text-[15px] font-semibold sm:w-36 sm:pt-0.5">{g.group}</h3>
          <Tags items={g.items} />
        </section>
      ))}
    </div>
  );
}

function CloudList() {
  const { legacyCv } = usePersona();
  const entries = legacyCv
    ? legacyCv.skills.filter((skill) => /cloud|devops/i.test(skill.k)).map((skill) => ({ name: skill.k, where: skill.v }))
    : cloud;
  return (
    <ul className="card divide-y divide-line">
      {entries.map((c) => (
        <li key={c.name} data-gs="row" className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4 md:px-5">
          <span className="font-semibold sm:w-56 sm:shrink-0">{c.name}</span>
          <span className="text-[15px] text-muted">{c.where}</span>
        </li>
      ))}
    </ul>
  );
}

function Education() {
  const cv = usePersona().legacyCv;
  if (!cv) return null;
  const { education, courses } = cv;
  return (
    <div className="space-y-3">
      <article className="card p-5 md:p-6">
        <div className="eyebrow">{education.year}</div>
        <h3 className="display mt-2 text-2xl md:text-3xl">{education.degree}</h3>
        <p className="mt-1 font-semibold text-muted">{education.school}</p>
        {education.note && <p className="mt-4 text-[16px]">{education.note}</p>}
      </article>
      {courses.length > 0 && (
        <div className="card p-5 md:p-6">
          <div className="eyebrow mb-3">Continued learning</div>
          <Tags items={courses} />
        </div>
      )}
    </div>
  );
}

function LanguageBars() {
  const { legacyCv } = usePersona();
  const entries = legacyCv ? legacyCv.languages.map((language) => ({ name: language.name, level: language.level, cefr: "", score: 0 })) : languages;
  if (!entries.length) return null;
  return (
    <ul className="card divide-y divide-line">
      {entries.map((l) => (
        <li key={l.name} data-gs="row" className="flex items-center justify-between gap-4 p-4 md:p-5">
          <div>
            <div className="text-lg font-semibold">{l.name}</div>
            <div className="text-sm text-muted">{l.level}</div>
          </div>
          {l.cefr ? (
            <div className="flex items-center gap-3">
              <div className="flex gap-1" aria-label={`${l.score} of 6`}>
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={i} data-gs="bar" className={cn("h-2 w-5 rounded-full md:w-7", i < l.score ? "bg-fg" : "bg-surface-strong")} />
                ))}
              </div>
              <span className="w-14 text-right text-sm font-semibold">{l.cefr}</span>
            </div>
          ) : (
            <span className="text-sm font-semibold">{l.level}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

function downloadVCard(identity: ReturnType<typeof usePersona>["identity"]) {
  const linkedin = identity.links.find((link) => link.kind === "linkedin")?.href;
  const vcf = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${identity.name}`,
    ...(identity.role ? [`TITLE:${identity.role}`] : []),
    ...(identity.email ? [`EMAIL;TYPE=INTERNET:${identity.email}`] : []),
    ...(identity.phone ? [`TEL;TYPE=CELL:${identity.phone}`] : []),
    ...(linkedin ? [`URL:${linkedin}`] : []),
    "END:VCARD",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([vcf], { type: "text/vcard" }));
  const fileName = identity.name.replace(/[^A-Za-z0-9-]+/g, "-");
  const a = Object.assign(document.createElement("a"), { href: url, download: `${fileName || "contact"}.vcf` });
  a.click();
  URL.revokeObjectURL(url);
}

function ContactCard() {
  const { copied, copy } = useCopy();
  const { identity } = usePersona();
  const rows = [
    ...(identity.email ? [{ key: "email", icon: Mail, label: "Email", value: identity.email, href: `mailto:${identity.email}`, copy: true }] : []),
    ...(identity.phone ? [{ key: "phone", icon: Phone, label: "Phone / WhatsApp", value: identity.phone, href: `tel:${identity.phone.replace(/[^\d+]/g, "")}`, copy: true }] : []),
    ...(identity.location ? [{ key: "loc", icon: MapPin, label: "Location", value: identity.location }] : []),
    ...identity.links.map((link, i) => ({ key: `link-${link.kind}-${i}`, icon: Link, label: link.label, value: link.href, href: link.href })),
  ];
  return (
    <div className="space-y-3">
      <ul className="card divide-y divide-line">
        {rows.map((r) => (
          <li key={r.key} data-gs="row" className="flex items-center gap-3 px-4 py-3 md:px-5">
            <r.icon className="size-5 shrink-0 text-faint" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-faint">{r.label}</div>
              {r.href ? (
                <a
                  href={r.href}
                  target={r.href.startsWith("https://") ? "_blank" : undefined}
                  rel={r.href.startsWith("https://") ? "noopener noreferrer" : undefined}
                  // Phones: a taller hit area (py-2.5 -my-2.5) without moving the layout.
                  className="-my-2.5 block truncate py-2.5 font-semibold hover:underline"
                >
                  {r.value}
                </a>
              ) : (
                <div className="font-semibold">{r.value}</div>
              )}
            </div>
            {"copy" in r && r.copy && (
              <button type="button" className="icon-btn" onClick={() => copy(r.key, r.value)} aria-label={`Copy ${r.label}`}>
                {copied === r.key ? <Check className="size-4 text-accent" /> : <Copy className="size-4" />}
              </button>
            )}
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => downloadVCard(identity)} className="btn btn-ghost">
        <UserRoundPlus className="size-4" /> Save contact (.vcf)
      </button>
    </div>
  );
}

function HireMe() {
  const { document: doc, fileHref, identity, legacyCv } = usePersona();
  if (!legacyCv) return null;
  const subject = encodeURIComponent(`Opportunity for ${identity.name}`);
  const linkedin = identity.links.find((link) => link.kind === "linkedin")?.href;
  return (
    <div className="card overflow-hidden">
      <div className="grid gap-px bg-line sm:grid-cols-2">
        <div data-gs="pop" className="bg-card p-4 md:p-5">
          <div className="eyebrow">Role</div>
          <div className="mt-1.5 text-[15px] leading-snug font-semibold">{legacyCv.title}</div>
        </div>
        <div data-gs="pop" className="bg-card p-4 md:p-5">
          <div className="eyebrow">Availability</div>
          <div className="mt-1.5 text-[15px] leading-snug font-semibold">{legacyCv.availability}</div>
        </div>
      </div>
      {legacyCv.profile && <p className="border-t border-line p-4 text-[15px] leading-relaxed text-muted md:p-5">{legacyCv.profile}</p>}
      <div className="border-t border-line">
        <div className="eyebrow px-4 pt-4 md:px-5">What I bring</div>
        <dl className="divide-y divide-line">
          {legacyCv.skills.map((skill, i) => (
            <div key={`${skill.k}-${i}`} data-gs="row" className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:gap-5 md:px-5">
              <dt className="shrink-0 text-sm font-semibold sm:w-44">{skill.k}</dt>
              <dd className="text-[15px] leading-relaxed text-muted">{skill.v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-line p-4 md:p-5">
        {identity.email && <a href={`mailto:${identity.email}?subject=${subject}`} className="btn btn-primary"><Mail className="size-4" /> Email me</a>}
        {identity.phone && <a href={`tel:${identity.phone.replace(/[^\d+]/g, "")}`} className="btn btn-ghost" aria-label={`Call ${identity.phone}`}><Phone className="size-4" /> Call me</a>}
        {doc.pdfUrl && (
          <a href={fileHref(doc.pdfUrl)} download className="btn btn-ghost">
            <Download className="size-4" /> {doc.download}
          </a>
        )}
        {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost"><Linkedin className="size-4" /> LinkedIn</a>}
      </div>
    </div>
  );
}

function DownloadCard() {
  const { document: doc, fileHref, href, labels, legacy } = usePersona();
  return (
    <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center md:p-5">
      <div className="flex items-center gap-4">
        <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent">
          <FileText className="size-7" />
        </div>
        <div>
          <div className="font-semibold">{doc.pdfUrl ? doc.fileName : doc.label}</div>
          <div className="text-sm text-muted">
            {doc.pdfUrl ? "PDF · " : ""}
            {doc.language}
            {doc.updated ? ` · Updated ${doc.updated}` : ""}
          </div>
        </div>
      </div>
      <div className="flex gap-2 sm:ml-auto">
        {doc.pdfUrl && (
          <a href={fileHref(doc.pdfUrl)} download className="btn btn-primary">
            <Download className="size-4" /> {legacy ? "Download" : labels.documentDownload}
          </a>
        )}
        <a href={href(doc.pageUrl)} className={doc.pdfUrl ? "btn btn-ghost" : "btn btn-primary"}>
          {doc.open ? labels.documentWeb : labels.requestAccess}
        </a>
      </div>
    </div>
  );
}

function Suggest({ onAsk }: { onAsk: Ask }) {
  const { primary } = usePersona();
  return (
    <div className="flex flex-wrap gap-2">
      {primary.slice(0, 8).map((i) => (
        <IntentLink key={i.id} intentId={i.id} onPick={onAsk} className="chip">
          <QIcon name={i.icon} className="size-4 text-faint" /> {i.label}
        </IntentLink>
      ))}
    </div>
  );
}
