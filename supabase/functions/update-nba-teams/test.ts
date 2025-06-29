// This imported is needed to load the .env file:
import "https://deno.land/x/dotenv@v3.2.2/load.ts";
import { assertEquals, assert } from "std/testing/asserts.ts";
import { isValidTeam, transformTeam, updateNbaTeams } from "./index.ts";
import type { TeamUpsertData } from "./index.ts";

// Example valid and invalid team data for SportsData.io
const validTeam = {
  teamid: 1,
  teamabbreviation: "GSW",
  city: "San Francisco",
  teamname: "Warriors",
  conference: "Western",
  division: "Pacific",
  active: true,
  recordlastupdated: new Date().toISOString(),
};

const invalidTeam = {
  teamid: "not-a-number",
  teamabbreviation: "GSW",
  city: "San Francisco",
  teamname: "Warriors",
  conference: "Western",
  division: "Pacific",
  active: true,
  recordlastupdated: new Date().toISOString(),
};

Deno.test("isValidTeam returns true for valid team", () => {
  assert(isValidTeam(validTeam));
});

Deno.test("isValidTeam returns false for invalid team", () => {
  assertEquals(isValidTeam(invalidTeam), false);
});

Deno.test("transformTeam maps fields correctly", () => {
  const transformed = transformTeam(validTeam);
  assertEquals(transformed.teamid, validTeam.teamid);
  assertEquals(transformed.teamabbreviation, validTeam.teamabbreviation);
  assertEquals(transformed.city, validTeam.city);
  assertEquals(transformed.teamname, validTeam.teamname);
  assertEquals(transformed.conference, validTeam.conference);
  assertEquals(transformed.division, validTeam.division);
  assertEquals(transformed.active, validTeam.active);
  assert(typeof transformed.recordlastupdated === "string");
});

Deno.test("updateNbaTeams returns 200 for valid teams and no db error", async () => {
  const fetchTeams = async () => [validTeam];
  const upsertFn = async (_teams: TeamUpsertData[]) => ({ error: null });
  const res = await updateNbaTeams(fetchTeams, upsertFn);
  assertEquals(res.status, 200);
});

Deno.test("updateNbaTeams returns 500 for DB error", async () => {
  const fetchTeams = async () => [validTeam];
  const upsertFn = async (_teams: TeamUpsertData[]) => ({ error: { message: "db fail" } });
  const res = await updateNbaTeams(fetchTeams, upsertFn);
  assertEquals(res.status, 500);
});

Deno.test("updateNbaTeams returns 500 for invalid team", async () => {
  const fetchTeams = async () => [invalidTeam];
  const upsertFn = async (_teams: TeamUpsertData[]) => ({ error: null });
  const res = await updateNbaTeams(fetchTeams, upsertFn);
  assertEquals(res.status, 500);
});

Deno.test("updateNbaTeams returns 500 for non-array API response", async () => {
  const fetchTeams = async () => ({ not: 'an array' } as unknown as unknown[]);
  const upsertFn = async (_teams: TeamUpsertData[]) => ({ error: null });
  const res = await updateNbaTeams(fetchTeams, upsertFn);
  assertEquals(res.status, 500);
});

Deno.test("updateNbaTeams returns 500 if fetchTeams throws", async () => {
  const fetchTeams = async () => { throw new Error("fetch fail"); };
  const upsertFn = async (_teams: TeamUpsertData[]) => ({ error: null });
  const res = await updateNbaTeams(fetchTeams, upsertFn);
  assertEquals(res.status, 500);
});

Deno.test("updateNbaTeams returns 500 if upsertFn throws", async () => {
  const fetchTeams = async () => [validTeam];
  const upsertFn = async (_teams: TeamUpsertData[]) => { throw new Error("upsert fail"); };
  const res = await updateNbaTeams(fetchTeams, upsertFn);
  assertEquals(res.status, 500);
});
