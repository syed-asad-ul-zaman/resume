import { ImageResponse } from "next/og";
import { cv as codeCv } from "@/content/cv";
import { projectById, projects } from "@/content/projects";
import { readCv } from "@/lib/persona/cv";
import { lt } from "@/lib/persona/text";
import { currentPersona } from "@/server/persona/resolve";

// One link-preview image per project, served at /og/<project-id>.png (the extension skips the
// trailingSlash redirect). Generated at build time in the site's light palette.
export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ file: string }> }) {
  const { file } = await ctx.params;
  const slug = file.replace(/\.png$/, "");
  if (!projectById(slug)) return new Response("Not found", { status: 404 });
  const persona = await currentPersona();
  if (!persona.compiled.doc.legacy) return new Response("Not found", { status: 404 });
  const cv = readCv(persona.compiled.doc.document.data, codeCv, persona.compiled.number > 0 || persona.compiled.versionId !== null);
  const project = cv.projects[projects.findIndex((item) => item.id === slug)];
  if (!project) return new Response("Not found", { status: 404 });
  const identity = persona.compiled.doc.identity;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "80px 96px", background: "#f6f4ef", color: "#1f1d1a" }}>
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, textTransform: "uppercase", color: "#6b665d" }}>
          {project.meta}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>{project.name}</div>
          <div style={{ fontSize: 36, marginTop: 24, lineHeight: 1.3, color: "#57524a", maxWidth: 980 }}>{project.text}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", fontSize: 32 }}>
          <div style={{ display: "flex", width: 56, height: 56, borderRadius: 16, background: "#b5400f", color: "#fff", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, marginRight: 20 }}>
            {identity.initials}
          </div>
          <div style={{ display: "flex" }}>{`${identity.name} · ${lt(identity.role, persona.lang) || cv.title}`}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
