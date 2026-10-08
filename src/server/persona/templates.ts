import "server-only";
import type { PersonaDocInput } from "@/lib/persona/schema";

/**
 * Starting points for a new persona in the admin. The marriage template follows a
 * biodata's usual sections, with the visibility each item usually gets; every value is left empty for
 * the owner to fill in (empty items are ignored by the chat and the AI until they have a value).
 */

export function blankPersona(name: string, displayName = "Your Name"): PersonaDocInput {
  return {
    v: 1,
    name,
    identity: { name: displayName, shortName: displayName.split(" ")[0] || displayName, initials: displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "ME" },
    site: { indexable: false, defaultLang: "en", languages: ["en"] },
    hero: { staticIntro: `Hi, I'm ${displayName}.`, pools: [{ id: "hello", lines: [`Hi, I'm ${displayName}.`] }], schedule: [] },
    sections: [{ key: "about", title: "About me", display: "paragraphs", visibility: "public", items: [{ id: "intro", text: "" }] }],
    questions: [{ id: "about", label: "About me", prompt: "Who are you?", icon: "user", primary: true, keywords: ["about", "who"], answers: ["A few words about me:"], blocks: [{ kind: "section", key: "about" }] }],
    landing: ["about"],
    sidebar: [{ title: "Ask about", questionIds: ["about"], icons: true }],
    fallback: { answers: ["That's outside what this chat covers. Try one of these:"] },
  };
}

const fact = (id: string, label: string, ur: string, visibility?: "unlocked" | "private") => ({ id, label: { en: label, ur }, value: "", ...(visibility ? { visibility } : {}) });

/** A blank English and Urdu marriage biodata template; the owner supplies all personal details. */
export function marriagePersona(): PersonaDocInput {
  return {
    v: 1,
    name: "Marriage",
    identity: {
      name: "Your Name",
      shortName: "Your Name",
      initials: "YN",
    },
    site: {
      indexable: false,
      defaultLang: "en",
      languages: ["en", "ur"],
      title: { en: "Marriage biodata", ur: "شادی کا بائیو ڈیٹا" },
      description: {
        en: "A private marriage biodata template. Its owner can add details about education, career, family, values and expectations.",
        ur: "شادی کے بائیو ڈیٹا کا ایک نجی سانچہ۔ اس میں تعلیم، پیشہ، خاندان، اقدار اور توقعات کی معلومات شامل کی جا سکتی ہیں۔",
      },
      keywords: ["marriage biodata", "شادی کا بائیو ڈیٹا"],
    },
    labels: {
      composerPlaceholder: { en: "Ask about me, my family, my values…", ur: "میرے، میرے خاندان یا میری اقدار کے بارے میں پوچھیں…" },
      composerPlaceholderAi: { en: "Ask me anything a family would like to know…", ur: "خاندان جو کچھ جاننا چاہے، مجھ سے پوچھیں…" },
      askHint: { en: "The AI answers from my biodata", ur: "AI میرے بائیو ڈیٹا سے جواب دیتا ہے" },
      askHintNoMatch: { en: "No ready-made answer for that - the AI answers from my biodata", ur: "اس کا تیار جواب موجود نہیں — AI میرے بائیو ڈیٹا سے جواب دے گا" },
      thinking: { en: "Reading my biodata...", ur: "میرا بائیو ڈیٹا دیکھ رہا ہوں..." },
      thinkingStatus: { en: "Reading my biodata", ur: "میرا بائیو ڈیٹا دیکھ رہا ہوں" },
      aiDisclaimer: { en: "Answered by AI from my biodata - it can be imperfect.", ur: "AI نے میرے بائیو ڈیٹا سے جواب دیا ہے — اس میں غلطی ہو سکتی ہے۔" },
      footerAi: { en: "Listed answers are written by me; anything else is answered by AI, from my biodata only.", ur: "فہرست میں موجود جوابات میں نے لکھے ہیں؛ باقی سوالات کے جواب AI صرف میرے بائیو ڈیٹا سے دیتا ہے۔" },
      footerNoAi: { en: "Every answer here is written by me.", ur: "یہاں ہر جواب میں نے خود لکھا ہے۔" },
      documentButton: { en: "Biodata", ur: "بائیو ڈیٹا" },
      documentDownload: { en: "Download biodata", ur: "بائیو ڈیٹا ڈاؤن لوڈ کریں" },
      availability: { en: "Looking for [a ]life partner", ur: "شریکِ حیات کی تلاش [میں]" },
      availabilityTitle: { en: "How to get in touch with my family", ur: "میرے خاندان سے رابطہ کیسے کریں" },
      gatedText: {
        en: "My family shares that part privately. If you have an access code, enter it below - or send a request and we'll get back to you.",
        ur: "یہ معلومات میرا خاندان نجی طور پر شیئر کرتا ہے۔ اگر آپ کے پاس رسائی کوڈ ہے تو نیچے درج کریں، ورنہ درخواست بھیجیں اور ہم آپ سے رابطہ کریں گے۔",
      },
    },
    hero: {
      staticIntro: { en: "Welcome. This biodata is shared by its owner.", ur: "خوش آمدید۔ یہ بائیو ڈیٹا اس کے مالک نے شیئر کیا ہے۔" },
      pools: [
        { id: "hello", lines: [{ en: "Welcome to this biodata.", ur: "اس بائیو ڈیٹا میں خوش آمدید۔" }] },
      ],
      schedule: [],
    },
    sections: [
      {
        key: "personal",
        title: { en: "Personal information", ur: "ذاتی معلومات" },
        display: "facts",
        visibility: "public",
        inSite: true,
        items: [
          fact("full-name", "Full name", "پورا نام"),
          fact("age", "Age", "عمر"),
          fact("date-of-birth", "Date of birth", "تاریخِ پیدائش", "unlocked"),
          fact("height", "Height", "قد"),
          fact("weight", "Weight", "وزن"),
          fact("blood-group", "Blood group", "بلڈ گروپ"),
          fact("complexion", "Complexion", "رنگت"),
          fact("marital-status", "Marital status", "ازدواجی حیثیت"),
          fact("religion", "Religion", "مذہب"),
          fact("present-area", "Lives in", "رہائش"),
          fact("present-address", "Present address", "موجودہ پتہ", "unlocked"),
          fact("home-district", "Home district", "آبائی ضلع"),
          fact("languages", "Languages", "زبانیں"),
        ],
      },
      {
        key: "faith",
        title: { en: "Faith & lifestyle", ur: "مذہبی معمولات اور طرزِ زندگی" },
        display: "facts",
        visibility: "public",
        inSite: true,
        items: [fact("prayer", "Prayer", "نماز"), fact("fasting", "Fasting", "روزہ"), fact("lifestyle", "Daily life", "روزمرہ زندگی"), fact("hobbies", "Hobbies", "مشاغل"), fact("smoking", "Smoking", "تمباکو نوشی")],
      },
      { key: "about-me", title: { en: "About me", ur: "میرے بارے میں" }, display: "paragraphs", visibility: "public", inSite: true, items: [{ id: "intro", text: "" }] },
      {
        key: "education",
        title: { en: "Education", ur: "تعلیم" },
        display: "timeline",
        visibility: "public",
        inSite: true,
        items: [
          { id: "degree", label: { en: "Degree", ur: "ڈگری" }, meta: { en: "Institution", ur: "ادارہ" }, period: "" },
          { id: "hsc", label: "HSC", meta: "", period: "" },
          { id: "ssc", label: "SSC", meta: "", period: "" },
        ],
      },
      {
        key: "career",
        title: { en: "Career", ur: "پیشہ" },
        display: "facts",
        visibility: "public",
        inSite: true,
        items: [
          fact("profession", "Profession", "پیشہ"),
          fact("employer", "Employer", "ادارہ"),
          fact("experience", "Experience", "تجربہ"),
          fact("income", "Monthly income", "ماہانہ آمدنی", "unlocked"),
          fact("plans", "Plans (abroad, relocation)", "مستقبل کے منصوبے"),
        ],
      },
      {
        key: "family",
        title: { en: "Family", ur: "خاندانی معلومات" },
        display: "facts",
        visibility: "public",
        inSite: true,
        items: [
          fact("father-profession", "Father's profession", "والد کا پیشہ"),
          fact("mother-profession", "Mother's profession", "والدہ کا پیشہ"),
          fact("siblings", "Siblings", "بہن بھائی"),
          fact("family-type", "Family type", "خاندان کی نوعیت"),
          fact("father-name", "Father's name", "والد کا نام", "unlocked"),
          fact("mother-name", "Mother's name", "والدہ کا نام", "unlocked"),
          fact("siblings-details", "Siblings in detail", "بہن بھائیوں کی تفصیل", "unlocked"),
        ],
      },
      {
        key: "looking-for",
        title: { en: "What I'm looking for", ur: "مجھے کیسا شریکِ حیات چاہیے" },
        display: "facts",
        visibility: "public",
        inSite: true,
        items: [fact("age-range", "Age", "عمر"), fact("education", "Education", "تعلیم"), fact("practice", "Religious practice", "مذہبی معمولات"), fact("location", "Location", "رہائش"), fact("other", "Also important to me", "دیگر اہم باتیں")],
      },
      { key: "photos", title: { en: "Photos", ur: "تصاویر" }, display: "gallery", visibility: "unlocked", inDocument: false, items: [] },
      {
        key: "contact",
        title: { en: "Contact (guardian)", ur: "رابطہ (سرپرست)" },
        display: "facts",
        visibility: "unlocked",
        items: [fact("guardian", "Guardian", "سرپرست"), fact("guardian-phone", "Guardian's phone", "سرپرست کا فون"), fact("my-phone", "My phone", "میرا فون"), fact("email", "Email", "ای میل"), fact("best-time", "Best time to call", "رابطے کا مناسب وقت")],
      },
      { key: "notes", title: { en: "Private notes", ur: "ذاتی نوٹس" }, display: "list", visibility: "private", inChat: false, inDocument: false, items: [] },
    ],
    questions: [
      { id: "about", label: { en: "About me", ur: "میرے بارے میں" }, prompt: { en: "Tell me about yourself.", ur: "اپنے بارے میں بتائیں۔" }, icon: "user", primary: true, keywords: ["about", "who", "yourself", "تعارف", "میرے بارے میں"], answers: [{ en: "Here is a short introduction:", ur: "میرا مختصر تعارف:" }], blocks: [{ kind: "section", key: "about-me" }, { kind: "section", key: "personal" }], followUps: ["family", "career", "looking-for"] },
      { id: "family", label: { en: "Family", ur: "خاندان" }, prompt: { en: "Tell me about your family.", ur: "اپنے خاندان کے بارے میں بتائیں۔" }, icon: "users", primary: true, keywords: ["family", "parents", "father", "mother", "siblings", "خاندان", "والد", "والدہ", "بہن بھائی"], answers: [{ en: "My family:", ur: "میرا خاندان:" }], blocks: [{ kind: "section", key: "family" }], followUps: ["about", "contact", "looking-for"] },
      { id: "career", label: { en: "Education & career", ur: "تعلیم اور پیشہ" }, prompt: { en: "What do you study and do for work?", ur: "آپ نے کیا تعلیم حاصل کی ہے اور کیا کام کرتے ہیں؟" }, icon: "graduation-cap", primary: true, keywords: ["education", "study", "university", "job", "work", "career", "income", "تعلیم", "ملازمت", "پیشہ"], answers: [{ en: "My education and work:", ur: "میری تعلیم اور کام:" }], blocks: [{ kind: "section", key: "education" }, { kind: "section", key: "career" }], followUps: ["about", "faith", "looking-for"] },
      { id: "faith", label: { en: "Faith & lifestyle", ur: "مذہبی معمولات اور طرزِ زندگی" }, prompt: { en: "How do you practise your faith, and how do you live day to day?", ur: "آپ اپنے مذہب پر کیسے عمل کرتے ہیں اور روزمرہ زندگی کیسی ہے؟" }, icon: "moon", primary: true, keywords: ["faith", "religion", "prayer", "namaz", "salah", "lifestyle", "hobby", "نماز", "مذہب", "مشاغل"], answers: [{ en: "My faith and daily life:", ur: "میرے مذہبی معمولات اور روزمرہ زندگی:" }], blocks: [{ kind: "section", key: "faith" }], followUps: ["looking-for", "family", "about"] },
      { id: "looking-for", label: { en: "What I'm looking for", ur: "مجھے کیسا شریکِ حیات چاہیے" }, prompt: { en: "What are you looking for in a partner?", ur: "آپ اپنے شریکِ حیات میں کیا خصوصیات چاہتے ہیں؟" }, icon: "heart", primary: true, keywords: ["partner", "looking", "expect", "expectation", "bride", "wife", "شریک حیات", "توقعات"], answers: [{ en: "What matters to me in a life partner:", ur: "شریکِ حیات میں میرے لیے اہم باتیں:" }], blocks: [{ kind: "section", key: "looking-for" }], followUps: ["faith", "family", "contact"] },
      { id: "photos", label: { en: "Photos", ur: "تصاویر" }, prompt: { en: "Can I see your photos?", ur: "کیا میں آپ کی تصاویر دیکھ سکتا ہوں؟" }, icon: "image", primary: true, visibility: "unlocked", keywords: ["photo", "photos", "picture", "تصاویر", "تصویر"], answers: [{ en: "A few photos:", ur: "چند تصاویر:" }], blocks: [{ kind: "section", key: "photos" }], followUps: ["contact", "about"] },
      { id: "biodata", label: { en: "Biodata", ur: "بائیو ڈیٹا" }, prompt: { en: "Can I download your biodata?", ur: "کیا میں آپ کا بائیو ڈیٹا ڈاؤن لوڈ کر سکتا ہوں؟" }, icon: "file-text", primary: true, keywords: ["biodata", "bio", "pdf", "download", "بائیو ڈیٹا"], answers: [{ en: "Here is my biodata:", ur: "یہ میرا بائیو ڈیٹا ہے:" }], blocks: [{ kind: "download" }], followUps: ["contact", "family"] },
      { id: "contact", label: { en: "Contact my family", ur: "میرے خاندان سے رابطہ" }, prompt: { en: "How can we contact your family?", ur: "ہم آپ کے خاندان سے کیسے رابطہ کر سکتے ہیں؟" }, icon: "phone", primary: true, keywords: ["contact", "phone", "call", "guardian", "number", "رابطہ", "فون", "سرپرست"], answers: [{ en: "Families can reach mine like this - or send a request here and we'll get back to you:", ur: "آپ میرے خاندان سے یہاں دی گئی معلومات کے ذریعے رابطہ کر سکتے ہیں، یا درخواست بھیجیں اور ہم آپ سے رابطہ کریں گے:" }], blocks: [{ kind: "request-access" }], followUps: ["family", "looking-for"] },
      { id: "privacy", label: { en: "Privacy", ur: "رازداری" }, prompt: { en: "How do you use my data?", ur: "آپ میرا ڈیٹا کیسے استعمال کرتے ہیں؟" }, icon: "shield-check", keywords: ["privacy", "data", "cookies", "رازداری", "ڈیٹا"], answers: [{ en: "Simply and honestly. Here's exactly what this site keeps, and you can change your choice any time:", ur: "سادگی اور دیانت داری سے۔ اس سائٹ پر محفوظ معلومات کی تفصیل یہاں ہے، اور آپ کسی بھی وقت اپنی پسند بدل سکتے ہیں:" }], blocks: [{ kind: "privacy" }], followUps: ["about", "contact"] },
    ],
    fallback: { answers: [{ en: "That's outside what I've shared here. Try one of these:", ur: "اس بارے میں یہاں معلومات موجود نہیں۔ ان میں سے کوئی سوال آزمائیں:" }] },
    landing: ["about", "family", "career", "looking-for", "contact"],
    sidebar: [{ title: { en: "Ask about", ur: "ان موضوعات کے بارے میں پوچھیں" }, questionIds: ["about", "family", "career", "faith", "looking-for", "photos", "biodata", "contact"], icons: true }],
    defaultFollowUps: ["about", "family", "looking-for"],
    availability: { show: false, action: "contact" },
    rules: {
      voice: { en: "Warm, humble, respectful and honest, like a young man introducing himself to a family. No boasting.", ur: "خلوص، عاجزی، احترام اور دیانت داری سے بات کریں، جیسے ایک نوجوان اپنا تعارف ایک خاندان سے کروا رہا ہو۔ مبالغہ نہ کریں۔" },
      audience: "Families and prospective partners",
      boundaries: [
        "Never discuss past relationships, politics or other families; decline politely.",
        "Never share anything about the family beyond the knowledge given; for contact, point to the request form.",
        "If something isn't in the knowledge, say it hasn't been shared here and offer the contact request.",
      ],
      language: "match",
      maxWords: 80,
    },
    document: { kind: "biodata", slug: "biodata", fileName: "Biodata.pdf", title: { en: "Biodata", ur: "بائیو ڈیٹا" }, language: "English & Urdu", showPhoto: false, gated: true, sections: ["personal", "about-me", "education", "career", "family", "faith", "looking-for", "contact"] },
    access: {
      mode: "request",
      requestIntro: { en: "Tell us who you are and how you know us, and my family will get back to you.", ur: "اپنا تعارف اور ہمارے ساتھ اپنا تعلق بتائیں، میرا خاندان آپ سے رابطہ کرے گا۔" },
      codeHint: { en: "Have an access code from my family? Enter it here.", ur: "کیا آپ کے پاس میرے خاندان کا دیا ہوا رسائی کوڈ ہے؟ یہاں درج کریں۔" },
    },
    checks: [
      { q: "Tell me about your family", expect: { route: "topic", intentIdIn: ["family"] } },
      { q: "What is your guardian's phone number?", expect: { route: "gated" } },
      { q: "آپ کا قد کتنا ہے؟", lang: "ur", expect: { mustNotInclude: ["undefined"] } },
    ],
  };
}
