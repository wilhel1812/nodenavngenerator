import { describe, expect, it } from "vitest";
import {
  byteLength,
  findMultibyteCharacters,
  generateName,
  normalizeSegment,
} from "./nameGenerator";

const complete = {
  role: "R",
  municipality: "OSL",
  location: "Tryvann",
  owner: "la8pv",
  suffix: "mm",
};

describe("name generator", () => {
  it("normalizes and assembles a complete name", () => {
    const result = generateName(complete);
    expect(result.displayName).toBe("R-OSL-TRYVANN-LA8PV-MM");
    expect(result.displayBytes).toBe(22);
    expect(result.copyable).toBe(true);
    expect(result.truncated).toBe(false);
  });

  it("removes empty optional fields without duplicate separators", () => {
    const result = generateName({ ...complete, owner: "", suffix: "" });
    expect(result.displayName).toBe("R-OSL-TRYVANN");
  });

  it("cleans separators, controls, and whitespace", () => {
    expect(normalizeSegment(" --Gamle---byen--\n")).toBe("GAMLE-BYEN");
  });

  it("counts UTF-8 bytes and reports actual multibyte characters", () => {
    expect(byteLength("KOLSÅS")).toBe(7);
    expect(findMultibyteCharacters("ÅÅ-📡")).toEqual([
      { character: "Å", bytesEach: 2, count: 2, totalBytes: 4 },
      { character: "📡", bytesEach: 4, count: 1, totalBytes: 4 },
    ]);
  });

  it("truncates only location on grapheme boundaries", () => {
    const result = generateName({
      ...complete,
      location: "Kjempelanglokasjon📡",
    });
    expect(result.truncated).toBe(true);
    expect(result.copyable).toBe(true);
    expect(result.displayBytes).toBeLessThanOrEqual(24);
    expect(result.displayName.endsWith("-LA8PV-MM")).toBe(true);
    expect(result.displayName).not.toContain("📡");
  });

  it("cannot copy when preserved fields leave no room for location", () => {
    const result = generateName({
      ...complete,
      location: "A",
      owner: "VELDIGLANGTEIERNAVN",
      suffix: "LANGT",
    });
    expect(result.copyable).toBe(false);
    expect(result.truncated).toBe(false);
  });

  it("requires role, municipality, and location", () => {
    const result = generateName({ ...complete, location: "" });
    expect(result.missingRequired).toBe(true);
    expect(result.copyable).toBe(false);
  });
});
