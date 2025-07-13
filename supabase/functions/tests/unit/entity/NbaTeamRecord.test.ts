import { assertEquals } from "jsr:@std/assert";
import { mapNbaTeamToDBRecord } from "../../../nba/entity/NbaTeamRecord.ts";
import { NbaTeamRecord } from "../../../nba/entity/NbaTeamRecord.ts";
import { SportsDataTeamRO } from "../../../nba/ro/SportsDataTeamRO.ts";

const validSportsDataTeam : SportsDataTeamRO = {
  TeamID: 1,
  Key: "GSW",
  City: "San Francisco",
  Name: "Warriors",
  Conference: "Western",
  Division: "Pacific",
  Active: true,
};

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

Deno.test("mapTeamToDBRecord maps fields correctly", () => {
  const transformed = mapNbaTeamToDBRecord(validSportsDataTeam);
  assertEquals(transformed.teamid, validTeam.teamid);
  assertEquals(transformed.teamabbreviation, validTeam.teamabbreviation);
  assertEquals(transformed.city, validTeam.city);
  assertEquals(transformed.teamname, validTeam.teamname);
  assertEquals(transformed.conference, validTeam.conference);
  assertEquals(transformed.division, validTeam.division);
  assertEquals(transformed.active, validTeam.active);
  assertEquals(typeof transformed.recordlastupdated,  "string");
});
