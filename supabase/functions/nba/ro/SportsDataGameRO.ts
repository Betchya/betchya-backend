import { SportsDataRO } from "../../shared/types.ts"; // Base type for SportsData responses

// Types for SportsData.io NBA Game Response parsing and DB upserting in Supabase
interface SportsDataGameRO extends SportsDataRO {
  GameID: number;
  Season: number;
  SeasonType: string | number; // e.g., "Regular", "Postseason" or numeric codes
  DateTime: string; // ISO timestamp
  DateTimeUTC?: string; // Preferred if provided by API
  Status: string; // e.g., "Scheduled", "InProgress", "Final"
  HomeTeamID: number;
  AwayTeamID: number;
  // Optional fields we may use later
  HomeTeam?: string; // Abbreviation like "LAL"
  AwayTeam?: string; // Abbreviation like "BOS"
  StadiumID?: number;
  Stadium?: { Name?: string } | null;
}

// Type guard to validate a SportsData.io NBA Game object
const isValidGame = (game: unknown): game is SportsDataGameRO => {
  if (typeof game !== 'object' || game === null) return false;

  const g = game as Partial<SportsDataGameRO>;
  return (
    typeof g.GameID === 'number' &&
    typeof g.Season === 'number' &&
    (typeof g.SeasonType === 'string' || typeof g.SeasonType === 'number') &&
    typeof g.DateTime === 'string' &&
    typeof g.Status === 'string' &&
    typeof g.HomeTeamID === 'number' &&
    typeof g.AwayTeamID === 'number'
  );
};

export { isValidGame };
export type { SportsDataGameRO };
