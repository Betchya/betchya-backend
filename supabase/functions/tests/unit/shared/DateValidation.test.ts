import { assertEquals } from "deno/assert";
import { isValidYYYYMMDDDate, normalizeYYYYMMDD } from "../../../shared/DateValidation.ts";

Deno.test("isValidYYYYMMDDDate - accepts valid dates incl leap day", () => {
  assertEquals(isValidYYYYMMDDDate("2025-03-01"), true);
  assertEquals(isValidYYYYMMDDDate("2024-02-29"), true); // leap year
});

Deno.test("isValidYYYYMMDDDate - rejects invalid formats and invalid calendar dates", () => {
  assertEquals(isValidYYYYMMDDDate("2025-3-1"), false); // not zero-padded
  assertEquals(isValidYYYYMMDDDate("2025-02-30"), false); // invalid calendar
  assertEquals(isValidYYYYMMDDDate("not-a-date"), false);
});

Deno.test("normalizeYYYYMMDD - trims and returns undefined when empty or non-string", () => {
  assertEquals(normalizeYYYYMMDD(" 2025-03-01 "), "2025-03-01");
  assertEquals(normalizeYYYYMMDD("   "), undefined);
  assertEquals(normalizeYYYYMMDD(undefined), undefined);
});
