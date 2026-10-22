export const CONTENT_LOCALES = ["en", "es"] as const;

export type ContentLocale = (typeof CONTENT_LOCALES)[number];

export const DEFAULT_CONTENT_LOCALE: ContentLocale = "en";

export const toContentLocale = (value: unknown): ContentLocale =>
  typeof value === "string" && (CONTENT_LOCALES as readonly string[]).includes(value)
    ? (value as ContentLocale)
    : DEFAULT_CONTENT_LOCALE;
