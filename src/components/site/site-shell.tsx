import Link from "next/link";
import { ArrowLeft, Download, MessageSquareText } from "lucide-react";
import { Facebook, Github, Instagram, Linkedin, Whatsapp } from "@/components/brand-icons";
import { ThemeToggle } from "@/components/theme-provider";
import { avatarSrc } from "@/content/photos";
import { SITE_PAGES } from "@/lib/seo";
import { cv as codeCv } from "@/content/cv";
import { hasCvDocumentContent, readCv } from "@/lib/persona/cv";
import { lt } from "@/lib/persona/text";
import { withBase } from "@/lib/utils";
import { resolvedLabels, visibleAt } from "@/server/persona/compile";
import { personaPath } from "@/server/persona/pages";
import type { ResolvedPersona } from "@/server/persona/resolve";

const SOCIAL_ICONS = {
  github: Github,
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
  whatsapp: Whatsapp,
} as const;
const isSocialKind = (kind: string): kind is keyof typeof SOCIAL_ICONS => Object.hasOwn(SOCIAL_ICONS, kind);

/** The classic, readable pages (About, Experience, Projects...): plain HTML that search engines index. */
export function SiteShell({ p, children }: { p: ResolvedPersona; children: React.ReactNode }) {
  const { doc } = p.compiled;
  const identity = doc.identity;
  const published = p.compiled.number > 0 || p.compiled.versionId !== null;
  const cv = readCv(doc.document.data, codeCv, published);
  const showCvDownload = !published || hasCvDocumentContent(cv);
  const shortName = identity.shortName;
  const role = lt(identity.role, p.lang) || cv.title;
  const headline = lt(identity.headline, p.lang) || cv.profile;
  const photo = identity.avatar?.src || identity.photos[0]?.src || cv.photo || (!published ? avatarSrc : undefined);
  const cvPdf = `/${doc.document.fileName}`;
  const socialLinks = doc.identity.links.flatMap((link) =>
    isSocialKind(link.kind) ? [{ ...link, Icon: SOCIAL_ICONS[link.kind] }] : [],
  );
  const availability = doc.availability;
  const labels = resolvedLabels(doc, p.lang);
  const action = availability.action ? p.compiled.questionsById.get(availability.action) : undefined;
  const actionHref = action && visibleAt(action.visibility, p.tier) ? personaPath(p, action.page ?? `/ask/${action.id}/`) : undefined;
  const availabilityText = labels.availability.split(/(\[[^\]]*\])/).filter(Boolean);
  const showAvailability = p.compiled.versionId !== null && availability.show;
  const availabilityClassName = "flex shrink-0 items-center gap-2 rounded-full border border-line px-2.5 py-1.5 text-xs font-semibold transition-colors hover:border-surface-strong hover:bg-surface sm:px-3 sm:text-sm";
  const availabilityContent = (
    <>
      <span className="size-2 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
      <span className="whitespace-nowrap">
        {availabilityText.map((part, i) =>
          part.startsWith("[") ? (
            <span key={i} className="hidden sm:inline">{part.slice(1, -1)}</span>
          ) : (
            part
          ),
        )}
      </span>
    </>
  );

  return (
    <div className="min-h-dvh bg-bg">
      <header className="sticky top-0 z-20 border-b border-line bg-bg/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4 md:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 rounded-xl" aria-label={`${shortName} - home`}>
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={withBase(photo)} alt="" width={32} height={32} className="size-8 rounded-full object-cover ring-1 ring-line" />
            ) : (
              <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-surface text-xs font-semibold">{identity.initials}</span>
            )}
            <span className="hidden font-semibold tracking-tight sm:inline">{shortName}</span>
          </Link>
          {showAvailability && (
            actionHref ? (
              <Link href={actionHref} title={labels.availabilityTitle} className={availabilityClassName}>
                {availabilityContent}
              </Link>
            ) : (
              <span title={labels.availabilityTitle} className={availabilityClassName}>
                {availabilityContent}
              </span>
            )
          )}
          <nav aria-label="Main" className="no-scrollbar ml-auto flex items-center gap-0.5 overflow-x-auto">
            {SITE_PAGES.map((p) => (
              <Link key={p.path} href={p.path} className="rounded-lg px-2.5 py-2 text-sm font-medium whitespace-nowrap text-muted transition-colors hover:bg-surface hover:text-fg">
                {p.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-3xl px-5 py-10 md:px-6 md:py-14">
        {children}
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-10 md:flex-row md:items-start md:justify-between md:px-6">
          <div className="max-w-sm">
            <p className="font-semibold">{shortName}</p>
            {(role || headline) && <p className="mt-1 text-sm text-muted">{[role, headline].filter(Boolean).join(" · ")}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/" className="btn btn-primary py-2 text-sm">
                <MessageSquareText className="size-4" /> Ask me in the chat
              </Link>
              {showCvDownload && <a href={withBase(cvPdf)} download className="btn btn-ghost py-2 text-sm">
                <Download className="size-4" /> CV (PDF)
              </a>}
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
              {SITE_PAGES.map((p) => (
                <Link key={p.path} href={p.path} className="text-muted hover:text-fg">
                  {p.label}
                </Link>
              ))}
              <Link href="/cv/" className="text-muted hover:text-fg">
                CV
              </Link>
            </nav>
            <nav aria-label="Social links" className="flex items-center gap-2">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="me noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** Visible breadcrumbs (the matching BreadcrumbList JSON-LD is emitted by each page). */
export function Breadcrumbs({ trail }: { trail: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {trail.map((t, i) => (
          <li key={t.path} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === trail.length - 1 ? (
              <span aria-current="page" className="text-fg">
                {t.name}
              </span>
            ) : (
              <Link href={t.path} className="hover:text-fg hover:underline">
                {i === 0 ? (
                  <span className="inline-flex items-center gap-1">
                    <ArrowLeft className="size-3.5" aria-hidden="true" /> {t.name}
                  </span>
                ) : (
                  t.name
                )}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function JsonLd({ data }: { data: string }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: data.replace(/</g, "\\u003c") }} />;
}

/** Big page heading + intro, the same on every content page. */
export function PageHead({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <header className="mb-10">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="display mt-3 text-4xl md:text-5xl">{title}</h1>
      {intro && <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p>}
    </header>
  );
}
