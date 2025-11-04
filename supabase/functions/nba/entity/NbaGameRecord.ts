import { SupabaseDbRecord } from "../../shared/types.ts";
import { SportsDataGameRO } from "../ro/SportsDataGameRO.ts";

interface NbaGameRecord extends SupabaseDbRecord {
  gameid: number;
  gamedatetime: string; // ISO timestamp (UTC)
  gamestatus: string;
  hometeamid: number;
  awayteamid: number;
  season: number;
  seasontype: string;
  venue: string | null;
  recordlastupdated: string;
}

const mapSportsDataGameToDBRecord = (game: SportsDataGameRO): NbaGameRecord => {
  const venue = game.Stadium?.Name ?? null;
  // Prefer DateTimeUTC if available to avoid timezone ambiguities; fallback to DateTime
  // Normalize to ISO UTC string for timestamptz column
  const dateSource = game.DateTimeUTC ?? game.DateTime;
  const isoDate = new Date(dateSource).toISOString();

  return {
    gameid: game.GameID,
    gamedatetime: isoDate,
    gamestatus: game.Status,
    hometeamid: game.HomeTeamID,
    awayteamid: game.AwayTeamID,
    season: game.Season,
    seasontype: String(game.SeasonType),
    venue,
    recordlastupdated: new Date().toISOString(),
  };
};

export { mapSportsDataGameToDBRecord };
export type { NbaGameRecord };
