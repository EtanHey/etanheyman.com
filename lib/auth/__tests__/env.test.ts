import { expect, it } from "vitest";
import { cleanEnvValue } from "../env";

it.each([
  ["abc\\n", "abc"],
  ["abc\\r\\n", "abc"],
  ["abc\\r", "abc"],
  ["abc\\n\\r\\n\\r\n", "abc"],
  [" abc \n", "abc"],
  [" abc \\n \\r\n", "abc"],
  [undefined, undefined],
  ["", ""],
  ["abc", "abc"],
  ["ab\\ncd", "ab\\ncd"],
])("cleans OAuth env value %j to %j", (value, expected) => {
  expect(cleanEnvValue(value)).toBe(expected);
});
