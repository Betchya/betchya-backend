// This imported is needed to load the .env file:
import "https://deno.land/x/dotenv@v3.2.2/load.ts";
import { assertEquals, assertFalse } from "jsr:@std/assert";
import { isValidTeam } from "../update-nba-teams/util/validator.ts";
import { mapTeamToDBRecord } from "../update-nba-teams/util/mapper.ts";
import { updateNbaTeams } from "../update-nba-teams/index.ts";
import type { NbaTeamRecord, SportsDataTeamRO, UpsertRecordsFunction } from "../update-nba-teams/types.ts";

// Example valid and invalid team data for SportsData.io
const validTeam : NbaTeamRecord = {
  teamid: 1,
  teamabbreviation: "GSW",
  city: "San Francisco",
  teamname: "Warriors",
  conference: "Western",
  division: "Pacific",
  active: true,
  recordlastupdated: new Date().toISOString(),
};

const invalidSportsDataTeam : unknown = {
  TeamID: "not-a-number",
  Key: "GSW",
  City: "San Francisco",
  Name: "Warriors",
  Conference: "Western",
  Division: "Pacific",
  Active: true,
};

const validSportsDataTeam : SportsDataTeamRO = {
  TeamID: 1,
  Key: "GSW",
  City: "San Francisco",
  Name: "Warriors",
  Conference: "Western",
  Division: "Pacific",
  Active: true,
};

Deno.test("isValidTeam returns true for valid team", () => {
  assertEquals(isValidTeam(validSportsDataTeam), true);
});

Deno.test("isValidTeam returns false for invalid team", () => {
  assertFalse(isValidTeam(invalidSportsDataTeam));
});

Deno.test("mapTeamToDBRecord maps fields correctly", () => {
  const transformed = mapTeamToDBRecord(validSportsDataTeam);
  assertEquals(transformed.teamid, validTeam.teamid);
  assertEquals(transformed.teamabbreviation, validTeam.teamabbreviation);
  assertEquals(transformed.city, validTeam.city);
  assertEquals(transformed.teamname, validTeam.teamname);
  assertEquals(transformed.conference, validTeam.conference);
  assertEquals(transformed.division, validTeam.division);
  assertEquals(transformed.active, validTeam.active);
  assertEquals(typeof transformed.recordlastupdated,  "string");
});

Deno.test("updateNbaTeams returns 200 for valid teams and no db error", async () => {
  const fetchTeams = async () => await Promise.resolve([validSportsDataTeam]);
  const upsertFn: UpsertRecordsFunction = async (_upsertData) => await Promise.resolve({ data: [], error: null });
  const res = await updateNbaTeams(fetchTeams, upsertFn);
  assertEquals(res, "NBA teams updated successfully.");
});

Deno.test("updateNbaTeams returns 500 for DB error", async () => {
  const fetchTeams = async () => await Promise.resolve([validSportsDataTeam]);
  const upsertFn: UpsertRecordsFunction = async (_upsertData) => await Promise.reject("db upsert failed");
  const res = await updateNbaTeams(fetchTeams, upsertFn);
  assertEquals(res, "Failed to update NBA teams: db upsert failed");
});

Deno.test("updateNbaTeams returns 500 for invalid team", async () => {
  const fetchTeams = async () => await Promise.resolve([invalidSportsDataTeam]);
  const upsertFn: UpsertRecordsFunction = async (_upsertData) => await Promise.resolve({ data: null, error: null });
  const res = await updateNbaTeams(fetchTeams, upsertFn);
  assertEquals(res, "Failed to update NBA teams: No valid NBA teams found in API response.");
});

Deno.test("updateNbaTeams returns 500 for non-array API response", async () => {
  const fetchTeams = async () => await Promise.reject("not an array");
  const upsertFn: UpsertRecordsFunction = async (_upsertData) => await Promise.resolve({ data: null, error: null });
  const res = await updateNbaTeams(fetchTeams, upsertFn);
  assertEquals(res, "Failed to update NBA teams: not an array");
});

Deno.test("updateNbaTeams returns 500 if fetchTeams throws", async () => {
  const fetchTeams = async () => await Promise.reject("fetch fail");
  const upsertFn: UpsertRecordsFunction = async (_upsertData) => await Promise.resolve({ data: null, error: null });
  const res = await updateNbaTeams(fetchTeams, upsertFn);
  assertEquals(res, "Failed to update NBA teams: fetch fail");
});

Deno.test("updateNbaTeams returns 500 if upsertFn throws", async () => {
  const fetchTeams = async () => await Promise.resolve([validSportsDataTeam]);
  const upsertFn: UpsertRecordsFunction = async (_upsertData) => await Promise.reject("upsert fail");
  const res = await updateNbaTeams(fetchTeams, upsertFn);
  assertEquals(res, "Failed to update NBA teams: upsert fail");
});