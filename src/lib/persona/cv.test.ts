import { describe, expect, it } from "vitest";
import { cv as codeCv } from "@/content/cv";
import { DEFAULT_CV_REFERENCES, EMPTY_CV, readCv } from "./cv";
import { PersonaDocSchema } from "./schema";
import { jobPersonaInput } from "@/server/persona/import-job";

describe("CV references", () => {
  it("does not inherit missing published CV fields from the code snapshot", () => {
    expect(readCv(undefined, codeCv, true)).toEqual(EMPTY_CV);
    expect(readCv({ profile: "Current profile", projects: [{}], experience: [{}] }, codeCv, true)).toMatchObject({
      title: "",
      availability: "",
      profile: "Current profile",
      highlights: [],
      skills: [],
      experience: [],
      projects: [],
      education: { degree: "", school: "", year: "", note: "" },
      courses: [],
      languages: [],
      references: { enabled: false, label: "", text: "", linkText: "", url: "" },
    });
  });

  it("reads defaults and edited reference values from saved CV JSON", () => {
    const fallback = readCv(undefined, codeCv);
    expect(fallback.references).toEqual(DEFAULT_CV_REFERENCES);
    expect(
      readCv(
        { references: { ...DEFAULT_CV_REFERENCES, url: "https://www.linkedin.com/in/syed-asad-ul-zaman?openSection=recommendations" } },
        codeCv,
      ).references.url,
    ).toBe("https://www.linkedin.com/in/syed-asad-ul-zaman/details/recommendations/");
    expect(
      readCv(
        { references: { enabled: false, label: "References", text: "Ask me.", linkText: "Recommendations", url: "https://example.com/recommendations" } },
        codeCv,
      ).references,
    ).toEqual({
      enabled: false,
      label: "References",
      text: "Ask me.",
      linkText: "Recommendations",
      url: "https://example.com/recommendations",
    });
  });

  it("validates the references structure in the persona document schema", () => {
    const doc = jobPersonaInput();
    const valid = PersonaDocSchema.parse({
      ...doc,
      document: {
        ...doc.document,
        data: { references: DEFAULT_CV_REFERENCES },
      },
    });
    expect(valid.document.data?.references).toEqual(DEFAULT_CV_REFERENCES);

    const invalid = PersonaDocSchema.safeParse({
      ...doc,
      document: {
        ...doc.document,
        data: { references: { ...DEFAULT_CV_REFERENCES, url: "javascript:alert(1)" } },
      },
    });
    expect(invalid.success).toBe(false);
  });
});
