import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { CvSheet } from "@/components/document/cv-sheet";
import { otherPersonaMetadata, otherPersonaPage } from "@/components/site/other-persona";
import { PersonaShell } from "@/components/site/persona-shell";
import { cv as codeCv } from "@/content/cv";
import { hasCvDocumentContent, readCv } from "@/lib/persona/cv";
import { describe } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { withBase } from "@/lib/utils";
import { currentPersona } from "@/server/persona/resolve";
import { PrintButton } from "./print-button";

export async function generateMetadata(): Promise<Metadata> {
  const other = await otherPersonaMetadata("cv");
  if (other) return other;
  const p = await currentPersona();
  const { identity } = p.compiled.doc;
  const cv = readCv(p.compiled.doc.document.data, codeCv, p.compiled.number > 0 || p.compiled.versionId !== null);
  const cvTitle = `CV - ${identity.name}`;
  const role = typeof identity.role === "string" ? identity.role : identity.role?.en ?? cv.title;
  const cvDescription = describe(`CV of ${identity.name}, ${role}: ${cv.profile}`);
  // A child openGraph/twitter object replaces the root layout's, so siteName and the image are repeated here.
  return {
    title: "CV",
    description: cvDescription,
    alternates: { canonical: absoluteUrl("/cv/") },
    openGraph: {
      type: "profile",
      siteName: identity.name,
      title: cvTitle,
      description: cvDescription,
      url: absoluteUrl("/cv/"),
      images: [{ url: "/og.png", width: 1200, height: 630, alt: `${identity.name} - ${role}` }],
    },
    twitter: { card: "summary_large_image", title: cvTitle, description: cvDescription, images: ["/og.png"] },
  };
}

export default async function CvPage() {
  // Another persona whose document lives at /cv/ shows it here, in its own page frame.
  const p = await currentPersona();
  if (!p.compiled.doc.legacy) {
    if (p.wrongLang) notFound();
    return <PersonaShell p={p}>{await otherPersonaPage("cv")}</PersonaShell>;
  }
  // The published CV (edited in the Studio), else the code content.
  const cv = readCv(p.compiled.doc.document.data, codeCv, p.compiled.number > 0 || p.compiled.versionId !== null);
  const showPdf = !(p.compiled.number > 0 || p.compiled.versionId !== null) || hasCvDocumentContent(cv);

  return (
    <div className="cv-root">
      <nav aria-label="CV actions" className="cv-toolbar no-print">
        {/* Phones get short labels (full names stay in aria-label), so the pills never wrap. */}
        <Link href="/" className="cv-tool" aria-label="Back to chat">
          <ArrowLeft className="size-4" aria-hidden="true" /> <span className="cv-tool-long">Back to chat</span>
          <span className="cv-tool-short">Chat</span>
        </Link>
        <div className="flex items-center gap-2">
          <PrintButton />
          {showPdf && <a href={withBase(`/${p.compiled.doc.document.fileName}`)} download className="cv-tool cv-tool-primary" aria-label="Download PDF">
            <Download className="size-4" aria-hidden="true" /> <span className="cv-tool-long">Download PDF</span>
            <span className="cv-tool-short">PDF</span>
          </a>}
        </div>
      </nav>

      <main>
        <CvSheet cv={cv} identity={p.compiled.doc.identity} lang={p.lang} />
      </main>
    </div>
  );
}
