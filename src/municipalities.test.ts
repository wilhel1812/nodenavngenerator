import { describe, expect, it } from "vitest";
import { municipalities, parseMunicipalities } from "./municipalities";

describe("municipality dependency", () => {
  it("loads the complete pinned register", () => {
    expect(municipalities.length).toBeGreaterThan(350);
    expect(municipalities).toContainEqual({
      number: "0301",
      name: "Oslo - Oslove",
      code: "OSL",
    });
  });

  it("rejects an unexpected schema", () => {
    expect(() => parseMunicipalities("name,code\nOslo,OSL")).toThrow(
      "Unexpected municipality CSV header",
    );
  });
});
