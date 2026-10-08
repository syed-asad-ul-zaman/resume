import { ImageResponse } from "next/og";
import { cv as codeCv } from "@/content/cv";
import { readCv } from "@/lib/persona/cv";
import { lt } from "@/lib/persona/text";
import { currentPersona } from "@/server/persona/resolve";

// The link preview for every page (served at /og.png): name and role only, in the site's light palette.
// A route handler instead of the opengraph-image file convention: that one is served at
// /opengraph-image, which trailingSlash 308-redirects; a path with an extension is not redirected.
// layout.tsx points openGraph.images and twitter.images here.
export const dynamic = "force-dynamic";

const size = { width: 1200, height: 630 };

export async function GET() {
  const persona = await currentPersona();
  const { identity } = persona.compiled.doc;
  const cv = readCv(persona.compiled.doc.document.data, codeCv, persona.compiled.number > 0 || persona.compiled.versionId !== null);
  const role = lt(identity.role, persona.lang) || cv.title;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#f6f4ef",
          color: "#1f1d1a",
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 28,
            background: "#b5400f",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 44,
            fontWeight: 700,
            marginBottom: 48,
          }}
        >
          {identity.initials}
        </div>
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>{identity.name}</div>
        <div style={{ fontSize: 44, marginTop: 20, color: "#b5400f" }}>{role}</div>
      </div>
    ),
    size,
  );
}
