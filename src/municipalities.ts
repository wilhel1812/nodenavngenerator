import source from "../vendor/norske-kommuneforkortelser/data/kommuner.csv?raw";

export type Municipality = {
  number: string;
  name: string;
  code: string;
};

function parseLine(line: string): string[] {
  const fields: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      fields.push(field);
      field = "";
    } else {
      field += character;
    }
  }

  fields.push(field);
  return fields;
}

export function parseMunicipalities(csv: string): Municipality[] {
  const [header, ...rows] = csv.trim().split(/\r?\n/);
  if (header !== "kommunenummer,kommunenavn,forkortelse") {
    throw new Error("Unexpected municipality CSV header");
  }

  const municipalities = rows.map((row) => {
    const [number, name, code] = parseLine(row);
    if (!/^\d{4}$/.test(number) || !name || !/^[A-Z]{3}$/.test(code)) {
      throw new Error(`Invalid municipality row: ${row}`);
    }
    return { number, name, code };
  });

  const numbers = new Set(municipalities.map(({ number }) => number));
  const codes = new Set(municipalities.map(({ code }) => code));
  if (
    numbers.size !== municipalities.length ||
    codes.size !== municipalities.length
  ) {
    throw new Error("Municipality numbers and abbreviations must be unique");
  }

  return municipalities.sort((a, b) =>
    a.name.localeCompare(b.name, "nb", { sensitivity: "base" }),
  );
}

export const municipalities = parseMunicipalities(source);
