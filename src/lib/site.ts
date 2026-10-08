// The public address of the site, for metadata, robots.txt and sitemap.xml. Set NEXT_PUBLIC_SITE_URL in
// production (next.config.ts warns when it's missing); locally it falls back to the dev server.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const siteName = "Asad Ul Zaman Syed";
export const siteTitle = "Senior Full-Stack & AI Systems Engineer";
export const siteDescription =
  "Asad Ul Zaman Syed is a Senior Full-Stack & AI Systems Engineer building scalable SaaS, distributed systems and AI-powered platforms.";

/** Absolute URL for a path on this site, e.g. absoluteUrl("/cv/"). */
export const absoluteUrl = (path: string) => `${siteUrl}${basePath}${path}`;
