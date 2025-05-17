// This imported is needed to load the .env file:
import "https://deno.land/x/dotenv@v3.2.2/load.ts";
console.log("SUPABASE_URL:", Deno.env.get("SUPABASE_URL"));
import { assertEquals, assert } from "std/testing/asserts.ts";
import { isValidTeam, transformTeam, updateNbaTeams } from "./index.ts";
import type { TeamUpsertData } from "./index.ts";

// Example valid and invalid team data for SportsData.io
const validTeam = {
  TeamID: 1,
  Key: "GSW",
  City: "San Francisco",
  Name: "Warriors",
  Conference: "Western",
  Division: "Pacific",
  Active: true,
};

const invalidTeam = {
  TeamID: "not-a-number",
  Key: "GSW",
  City: "San Francisco",
  Name: "Warriors",
  Conference: "Western",
  Division: "Pacific",
  Active: true,
};

Deno.test("isValidTeam returns true for valid team", () => {
  assert(isValidTeam(validTeam));
});

Deno.test("isValidTeam returns false for invalid team", () => {
  assertEquals(isValidTeam(invalidTeam), false);
});

Deno.test("transformTeam maps fields correctly", () => {
  const transformed = transformTeam(validTeam);
  assertEquals(transformed.TeamID, validTeam.TeamID);
  assertEquals(transformed.TeamAbbreviation, validTeam.Key);
  assertEquals(transformed.City, validTeam.City);
  assertEquals(transformed.TeamName, validTeam.Name);
  assertEquals(transformed.Conference, validTeam.Conference);
  assertEquals(transformed.Division, validTeam.Division);
  assertEquals(transformed.Active, validTeam.Active);
  assert(typeof transformed.RecordLastUpdated === "string");
});

Deno.test("updateNbaTeams returns 200 for valid teams and no db error", async () => {
  const fetchTeams = async () => [validTeam];
  const upsertFn = async (_teams: TeamUpsertData[]) => ({ error: null });
  const res = await updateNbaTeams(fetchTeams, upsertFn);
  assertEquals(res.status, 200);
});

Deno.test("updateNbaTeams returns 500 for DB error", async () => {
  const fetchTeams = async () => await [validTeam];
  const upsertFn = async (_teams: TeamUpsertData[]) => await ({ error: { message: "db fail" } });
  const res = await updateNbaTeams(fetchTeams, upsertFn);
  assertEquals(res.status, 500);
});

Deno.test("updateNbaTeams returns 500 for invalid team", async () => {
  const fetchTeams = async () => await [invalidTeam];
  const upsertFn = async (_teams: TeamUpsertData[]) => await ({ error: null });
  const res = await updateNbaTeams(fetchTeams, upsertFn);
  assertEquals(res.status, 500);
});
