import reference from "./unlocode.json";
import type { Language } from "./i18n";

export function countryOptions(language: Language) {
  const names = new Intl.DisplayNames([language], { type: "region" });
  const collator = new Intl.Collator(language);
  return reference.countries
    .map((code) => ({ code, name: names.of(code) ?? code }))
    .sort((a, b) => collator.compare(a.name, b.name));
}

export function normalizePlaceCode(value: string): string {
  return value.replace(/[a-z]/g, (letter) => letter.toUpperCase());
}

export async function loadPlaceNames(country: string, signal: AbortSignal) {
  const response = await fetch(
    `${import.meta.env.BASE_URL}unlocode/${reference.edition}/${country}.json`,
    { signal },
  );
  if (!response.ok) throw new Error(`UN/LOCODE lookup failed: ${response.status}`);
  return (await response.json()) as Record<string, string>;
}
