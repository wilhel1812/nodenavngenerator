export const MAX_BYTES = 24;

export type NameInput = {
  role: string;
  municipality: string;
  location: string;
  owner: string;
  suffix: string;
};

export type NameResult = {
  displayName: string;
  fullName: string;
  displayBytes: number;
  fullBytes: number;
  missingRequired: boolean;
  copyable: boolean;
  truncated: boolean;
  multibyte: MultibyteCharacter[];
};

export type MultibyteCharacter = {
  character: string;
  bytesEach: number;
  count: number;
  totalBytes: number;
};

const encoder = new TextEncoder();

export function byteLength(value: string): number {
  return encoder.encode(value).length;
}

export function normalizeSegment(value: string): string {
  return value
    .normalize("NFC")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .replace(/\s+/g, " ")
    .replace(/-{2,}/g, "-")
    .replace(/^[\s-]+|[\s-]+$/g, "")
    .toLocaleUpperCase("nb-NO");
}

function graphemes(value: string): string[] {
  const segmenter = new Intl.Segmenter("nb", { granularity: "grapheme" });
  return Array.from(segmenter.segment(value), ({ segment }) => segment);
}

export function findMultibyteCharacters(
  value: string,
): MultibyteCharacter[] {
  const counts = new Map<string, number>();
  for (const character of graphemes(value)) {
    if (character === "-") continue;
    const bytes = byteLength(character);
    if (bytes > 1) counts.set(character, (counts.get(character) ?? 0) + 1);
  }

  return Array.from(counts, ([character, count]) => {
    const bytesEach = byteLength(character);
    return { character, bytesEach, count, totalBytes: bytesEach * count };
  });
}

function join(parts: string[]): string {
  return parts.filter(Boolean).join("-");
}

export function generateName(input: NameInput): NameResult {
  const role = normalizeSegment(input.role);
  const municipality = normalizeSegment(input.municipality);
  const location = normalizeSegment(input.location);
  const owner = normalizeSegment(input.owner);
  const suffix = normalizeSegment(input.suffix);
  const missingRequired = !role || !municipality || !location;
  const fullName = join([role, municipality, location, owner, suffix]);
  const fullBytes = byteLength(fullName);

  if (missingRequired || fullBytes <= MAX_BYTES) {
    return {
      displayName: fullName,
      fullName,
      displayBytes: fullBytes,
      fullBytes,
      missingRequired,
      copyable: !missingRequired && fullBytes <= MAX_BYTES,
      truncated: false,
      multibyte: findMultibyteCharacters(fullName),
    };
  }

  let shortenedLocation = "";
  for (const character of graphemes(location)) {
    const candidate = join([
      role,
      municipality,
      shortenedLocation + character,
      owner,
      suffix,
    ]);
    if (byteLength(candidate) > MAX_BYTES) break;
    shortenedLocation += character;
  }

  if (!shortenedLocation) {
    return {
      displayName: fullName,
      fullName,
      displayBytes: fullBytes,
      fullBytes,
      missingRequired: false,
      copyable: false,
      truncated: false,
      multibyte: findMultibyteCharacters(fullName),
    };
  }

  const displayName = join([
    role,
    municipality,
    shortenedLocation,
    owner,
    suffix,
  ]);

  return {
    displayName,
    fullName,
    displayBytes: byteLength(displayName),
    fullBytes,
    missingRequired: false,
    copyable: true,
    truncated: true,
    multibyte: findMultibyteCharacters(displayName),
  };
}
