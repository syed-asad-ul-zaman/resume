import { describe, expect, it } from "vitest";
import { fallbackIntent, intents, primaryIntents } from "@/content/intents";
import { longestIntro, staticIntro } from "@/content/intro";
import { profile } from "@/content/profile";
import { normalizeLegacyPersonaDoc, PersonaDocSchema, formatIssues, type PersonaDocInput } from "@/lib/persona/schema";
import { clientView, compilePersona, docHash } from "./compile";
import { jobPersonaDoc, jobPersonaInput, normalizeLegacyJobPersonaDoc } from "./import-job";
import { forbiddenIn, forbiddenTerms } from "@/test/forbidden";

const tiny = (over: Partial<PersonaDocInput> = {}): PersonaDocInput => ({
  v: 1,
  name: "Test",
  identity: { name: "Test Person", shortName: "Test", initials: "TP" },
  hero: { staticIntro: "Hi.", pools: [{ id: "hello", lines: ["Hi."] }] },
  ...over,
});

describe("the job persona built from the code content", () => {
  const doc = jobPersonaDoc();
  const view = clientView(compilePersona("job", doc), "public", "en");

  it("is a valid persona document", () => {
    const parsed = PersonaDocSchema.safeParse(jobPersonaInput());
    expect(parsed.success ? [] : formatIssues(parsed.error)).toEqual([]);
  });

  it("has every question, in order, with the same wording", () => {
    expect(view.identity.links).toEqual([
      { kind: "github", label: "GitHub", href: profile.links.github },
      { kind: "linkedin", label: "LinkedIn", href: profile.links.linkedin },
      { kind: "facebook", label: "Facebook", href: profile.links.facebook },
      { kind: "instagram", label: "Instagram", href: profile.links.instagram },
    ]);
    expect(view.questions.map((q) => q.id)).toEqual(intents.map((i) => i.id));
    for (const i of intents) {
      const q = view.questions.find((x) => x.id === i.id)!;
      expect(q.label).toBe(i.label);
      expect(q.prompt).toBe(i.prompt);
      expect(q.answers).toEqual(i.answers);
      expect(q.blocks).toEqual(i.blocks);
      expect(q.followUps).toEqual(i.followUps);
      expect(q.keywords).toEqual(i.keywords);
      expect(!!q.primary).toBe(!!i.primary);
      // Every icon the code uses has a name, so none falls back to the default.
      expect(q.icon === "sparkles").toBe(["hire", "ai-systems"].includes(i.id));
    }
    expect(view.fallback.answers).toEqual(fallbackIntent.answers);
  });

  it("keeps the landing chips, sidebar groups and hero", () => {
    expect(view.landing).toEqual(["about", "experience", "projects", "skills", "hire"]);
    expect(view.sidebar[0].ids).toEqual(primaryIntents.map((i) => i.id));
    expect(view.sidebar[1].ids.every((id) => id.startsWith("project-"))).toBe(true);
    expect(view.hero.staticIntro).toBe(staticIntro);
    expect(view.hero.longest).toBe(longestIntro);
  });

  it("keeps today's exact wording", () => {
    expect(view.labels.thinking).toBe("Reading my CV...");
    expect(view.labels.composerAria).toBe(`Ask a question about ${profile.shortName}`);
    expect(view.labels.composerPlaceholderAi).toBe("Ask me anything about my work, projects, skills…");
    expect(view.labels.composerNoMatch).toBe(`I only answer questions about ${profile.shortName}. Press **Enter** anyway, or try “projects”, “skills” or “hire”.`);
    expect(view.document).toMatchObject({ label: "CV", download: "Download CV", pdfUrl: profile.cvPdf, pageUrl: "/cv/", fileName: profile.cvPdf.slice(1) });
    expect(view.availability).toEqual({ show: true, action: "hire" });
  });

  it.skipIf(!forbiddenTerms().length)("uses no confidential client names in its rules or sections", () => {
    expect(forbiddenIn(JSON.stringify(doc))).toEqual([]);
  });

  it("hashes the same document the same way", () => {
    expect(docHash(doc)).toBe(docHash(PersonaDocSchema.parse(jobPersonaInput())));
  });
});

describe("persona schema checks", () => {
  const issues = (input: PersonaDocInput) => {
    const r = PersonaDocSchema.safeParse(input);
    return r.success ? [] : formatIssues(r.error);
  };

  it("accepts a minimal persona and fills defaults", () => {
    const doc = PersonaDocSchema.parse(tiny());
    expect(doc.access.mode).toBe("open");
    expect(doc.site.languages).toEqual(["en"]);
    expect(doc.fallback.blocks).toEqual([{ kind: "suggest" }]);
  });

  it("upgrades missing summary and contact settings in saved legacy job drafts", () => {
    const legacyDraft = {
      ...jobPersonaInput(),
      sections: [
        { key: "summary", title: "Summary", items: [{ id: "intro", text: "Profile summary" }] },
        { key: "contact", title: "Contact", items: [{ id: "email", label: "Email", value: "person@example.com" }] },
      ],
    };
    const parsed = PersonaDocSchema.parse(normalizeLegacyPersonaDoc(legacyDraft));
    expect(parsed.sections.map(({ key, display, visibility }) => ({ key, display, visibility }))).toEqual([
      { key: "summary", display: "paragraphs", visibility: "public" },
      { key: "contact", display: "facts", visibility: "public" },
    ]);
  });

  it("strips saved Bangla translations without treating them as Urdu", () => {
    const base = tiny();
    const legacy: unknown = {
      ...base,
      site: { defaultLang: "bn", languages: ["en", "bn"] },
      identity: { ...base.identity, headline: { en: "Engineer", bn: "পুরকৌশলী" } },
      checks: [{ q: "test", lang: "bn", expect: {} }],
    };
    const parsed = PersonaDocSchema.parse(normalizeLegacyPersonaDoc(legacy));
    expect(parsed.site).toMatchObject({ defaultLang: "en", languages: ["en"] });
    expect(parsed.identity.headline).toEqual({ en: "Engineer" });
    expect(parsed.checks[0].lang).toBe("en");
  });

  it("restores code-defined questions when an older legacy draft omitted them", () => {
    const legacyDraft = { ...jobPersonaInput() };
    delete legacyDraft.questions;
    const parsed = PersonaDocSchema.safeParse(normalizeLegacyJobPersonaDoc(legacyDraft));
    expect(parsed.success ? [] : formatIssues(parsed.error)).toEqual([]);
    if (parsed.success) expect(parsed.data.questions).toHaveLength(intents.length);
  });

  it("replaces the old book icon on the saved Languages question", () => {
    const legacyDraft = jobPersonaInput();
    const languagesQuestion = legacyDraft.questions?.find((question) => question.id === "languages");
    if (!languagesQuestion) throw new Error("The job persona must include a Languages question.");
    languagesQuestion.icon = "book-open";
    const parsed = PersonaDocSchema.parse(normalizeLegacyJobPersonaDoc(legacyDraft));
    const view = clientView(compilePersona("job", parsed), "public", "en");
    expect(view.questions.find((question) => question.id === "languages")?.icon).toBe("languages");
  });

  it("uses published CV data in every legacy chat section", () => {
    const input = jobPersonaInput();
    const document = input.document;
    if (!document) throw new Error("The job persona must include a CV document.");
    document.data = {
      ...document.data,
      profile: "The latest profile summary.",
      highlights: ["The latest achievement."],
      experience: [{ company: "Latest Company", role: "Principal Engineer", period: "2025 - Present", location: "Remote", context: "Full-time", bullets: ["Latest responsibility"], engagements: [] }],
      projects: [{ name: "Latest Project", meta: "TypeScript, Postgres", text: "Latest project description." }],
      skills: [{ k: "Cloud & DevOps", v: "Neon, Docker" }],
      education: {
        degree: "Bachelor Studies in Computer Science",
        school: "Northern University Of Nowshera, KPK, Pakistan",
        year: "2021",
        note: "Online School Finder project",
      },
      courses: ["The Ultimate React Course"],
      languages: [{ name: "Urdu", level: "Native" }],
    };
    const parsed = PersonaDocSchema.parse(input);
    const view = clientView(compilePersona("job", parsed), "public", "en");
    expect(view.legacyCv).toMatchObject({
      experience: [{ company: "Latest Company", role: "Principal Engineer" }],
      projects: [{ name: "Latest Project", text: "Latest project description." }],
      skills: [{ k: "Cloud & DevOps", v: "Neon, Docker" }],
      education: { degree: "Bachelor Studies in Computer Science", school: "Northern University Of Nowshera, KPK, Pakistan" },
      courses: ["The Ultimate React Course"],
      languages: [{ name: "Urdu", level: "Native" }],
    });
    expect(view.sections.find((section) => section.key === "experience")?.items[0]).toMatchObject({
      label: "Principal Engineer",
      meta: "Latest Company · Remote · Full-time",
      details: ["Latest responsibility"],
    });
    expect(view.sections.find((section) => section.key === "stats")?.items[0]).toMatchObject({ text: "The latest achievement." });
    expect(view.sections.find((section) => section.key === "focus")?.items[0]).toMatchObject({ text: "The latest profile summary." });
    expect(view.sections.find((section) => section.key === "projects")?.items[0]).toMatchObject({
      label: "Latest Project",
      text: "Latest project description.",
      tags: ["TypeScript", "Postgres"],
    });
    expect(view.sections.find((section) => section.key === "skills")?.items[0]).toMatchObject({ label: "Cloud & DevOps", value: "Neon, Docker" });
    expect(view.sections.find((section) => section.key === "education")?.items[0]).toMatchObject({
      label: "Bachelor Studies in Computer Science",
      meta: "Northern University Of Nowshera, KPK, Pakistan",
      details: ["Course: The Ultimate React Course"],
    });
    expect(view.sections.find((section) => section.key === "languages")?.items[0]).toMatchObject({ label: "Urdu", value: "Native" });
    expect(view.questions.find((question) => question.id === "languages")?.answers).toEqual(["I speak Urdu (Native)."]);
    expect(view.questions.find((question) => question.id === "languages")?.blocks).toContainEqual({ kind: "languages" });
  });

  it("omits CV-backed topics and old section snapshots when published fields are absent", () => {
    const input = jobPersonaInput();
    if (!input.document) throw new Error("The job persona must include a CV document.");
    input.document.data = { profile: "Published profile only." };
    const parsed = PersonaDocSchema.parse(input);
    const view = clientView(compilePersona("job", parsed, { number: 1, versionId: "published-version" }), "public", "en");

    expect(view.legacyCv?.profile).toBe("Published profile only.");
    expect(view.legacyCv?.experience).toEqual([]);
    expect(view.questions.map((question) => question.id)).not.toContain("experience");
    expect(view.questions.map((question) => question.id)).not.toContain("projects");
    expect(view.questions.map((question) => question.id)).not.toContain("skills");
    expect(view.sections.find((section) => section.key === "experience")).toBeUndefined();
    expect(view.sections.find((section) => section.key === "projects")).toBeUndefined();
    expect(view.sections.find((section) => section.key === "skills")).toBeUndefined();
  });

  it("rejects follow-ups to unknown questions and reserved ids", () => {
    const out = issues(tiny({ questions: [{ id: "a", label: "A", prompt: "A?", answers: ["a"], followUps: ["nope"] }, { id: "ai", label: "x", prompt: "x", answers: ["x"] }] }));
    expect(out.join("\n")).toMatch(/Unknown question "nope"/);
    expect(out.join("\n")).toMatch(/"ai" is reserved/);
  });

  it("keeps private sections out of the chat and job-only cards out of other personas", () => {
    const out = issues(
      tiny({
        sections: [{ key: "secret", title: "Secret", display: "facts", visibility: "private", inChat: true }],
        questions: [{ id: "a", label: "A", prompt: "A?", answers: ["a"], blocks: [{ kind: "stats" }] }],
      }),
    );
    expect(out.join("\n")).toMatch(/private section can't be used in the chat/);
    expect(out.join("\n")).toMatch(/"stats" card only exists for the job persona/);
  });

  it("doesn't let a public answer show an unlocked section", () => {
    const out = issues(
      tiny({
        sections: [{ key: "family", title: "Family", display: "facts", visibility: "unlocked" }],
        questions: [{ id: "a", label: "A", prompt: "A?", answers: ["a"], blocks: [{ kind: "section", key: "family" }] }],
      }),
    );
    expect(out.join("\n")).toMatch(/public answer can't show the unlocked section "family"/);
  });
});

describe("what each visitor tier receives", () => {
  const doc = PersonaDocSchema.parse(
    tiny({
      access: { mode: "code" },
      site: { languages: ["en", "ur"] },
      sections: [
        {
          key: "about",
          title: "About",
          display: "facts",
          visibility: "public",
          items: [
            { id: "height", label: "Height", value: "5'8\"" },
            { id: "phone", label: "Phone", value: "+880 1000 000000", visibility: "unlocked" },
            { id: "note", label: "Note", value: "PRIVATE-NOTE", visibility: "private" },
          ],
        },
        { key: "family", title: "Family", display: "facts", visibility: "unlocked", items: [{ id: "father", label: "Father", value: "FATHER-NAME" }] },
        { key: "notes", title: "Notes", display: "list", visibility: "private", inChat: false, items: [{ id: "n", text: "PRIVATE-SECTION" }] },
      ],
      questions: [
        { id: "about", label: "About", prompt: "About?", answers: ["About me"], blocks: [{ kind: "section", key: "about" }] },
        { id: "family", label: { en: "Family", ur: "خاندان" }, prompt: "Family?", answers: ["My family"], visibility: "unlocked", blocks: [{ kind: "section", key: "family" }] },
      ],
      landing: ["about", "family"],
    }),
  );
  const c = compilePersona("test", doc);

  it("public visitors get public items only", () => {
    const v = clientView(c, "public", "en");
    const json = JSON.stringify(v);
    expect(v.questions.map((q) => q.id)).toEqual(["about"]);
    expect(v.landing).toEqual(["about"]);
    expect(json).not.toMatch(/\+880|FATHER-NAME|PRIVATE/);
    expect(v.access.gatedTitles).toEqual(["Family"]);
  });

  it("unlocked visitors get unlocked items too, never private ones", () => {
    const v = clientView(c, "unlocked", "ur");
    const json = JSON.stringify(v);
    expect(v.questions.map((q) => q.id)).toEqual(["about", "family"]);
    expect(v.questions[1].label).toBe("خاندان");
    expect(json).toMatch(/\+880/);
    expect(json).toMatch(/FATHER-NAME/);
    expect(json).not.toMatch(/PRIVATE/);
    expect(v.access.gatedTitles).toEqual([]);
  });
});
