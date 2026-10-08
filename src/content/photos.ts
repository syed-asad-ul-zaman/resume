export type Photo = { src: string; width: number; height: number; alt: string };

/** Photos shown in the viewer (the side arrows loop through them). Originals live in info/photos/originals. */
export const photos: Photo[] = [
  { src: "/images/syed-asad.webp", width: 2080, height: 4608, alt: "Asad Ul Zaman Syed, Senior Full-Stack & AI Systems Engineer" },
];

/** Face crop of the first photo, used for avatars. */
export const avatarSrc = "/images/syed-asad-avatar.webp";
