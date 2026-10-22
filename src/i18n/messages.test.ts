import { describe, expect, it } from "vitest";

import en from "../../messages/en.json";
import es from "../../messages/es.json";

type Tree = { [key: string]: string | Tree };

const flatten = (tree: Tree, prefix = ""): Record<string, string> =>
  Object.entries(tree).reduce<Record<string, string>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string"
      ? { ...acc, [path]: value }
      : { ...acc, ...flatten(value, path) };
  }, {});

const placeholders = (value: string) =>
  Array.from(value.matchAll(/\{(\w+)/g), (match) => match[1]).sort();

describe("messages", () => {
  const english = flatten(en);
  const spanish = flatten(es);

  it("define the same keys in every language", () => {
    expect(Object.keys(spanish).sort()).toEqual(Object.keys(english).sort());
  });

  it("never leave a translation empty", () => {
    for (const [key, value] of [...Object.entries(english), ...Object.entries(spanish)]) {
      expect(value.trim(), key).not.toBe("");
    }
  });

  it("use the same placeholders in every language", () => {
    for (const key of Object.keys(english)) {
      expect(placeholders(spanish[key]), key).toEqual(placeholders(english[key]));
    }
  });
});
