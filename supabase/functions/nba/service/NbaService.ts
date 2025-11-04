import { SupabaseDbDAO } from "../dao/SupabaseDbDAO.ts";
import { NbaSportsDataDAO } from "../dao/NbaSportsDataDAO.ts";

import { mapNbaTeamToDBRecord } from "../entity/NbaTeamRecord.ts";
import { SportsDataTeamRO, isValidTeam } from "../ro/SportsDataTeamRO.ts";
import { SportsDataGameRO, isValidGame } from "../ro/SportsDataGameRO.ts";

import { NbaTeamRecord } from "../entity/NbaTeamRecord.ts";
import { mapSportsDataGameToDBRecord } from "../entity/NbaGameRecord.ts";
import type { NbaGameRecord } from "../entity/NbaGameRecord.ts";

class NbaService {
  private sportsDataDAO: NbaSportsDataDAO;
  private supabaseDbDao: SupabaseDbDAO;

  constructor(sportsDataDAO: NbaSportsDataDAO, supabaseDbDao: SupabaseDbDAO) {
    this.sportsDataDAO = sportsDataDAO;
    this.supabaseDbDao = supabaseDbDao;
  }

  syncNbaTeamData = async (): Promise<string> => {
    const nbaAllTeamsResponse: SportsDataTeamRO[] = await this.sportsDataDAO.getAllTeams();
    if (!Array.isArray(nbaAllTeamsResponse) || nbaAllTeamsResponse.length === 0) {
        throw new Error('Invalid API response: expected array of teams');
    }
  
    const validatedRecords: NbaTeamRecord[] = nbaAllTeamsResponse.filter(isValidTeam).map(mapNbaTeamToDBRecord);
    if (validatedRecords.length === 0) {
      throw new Error(`Invalid API Response: No valid data found in NBA All Teams Sports Data.`);
    }

    const { error } = await this.supabaseDbDao.upsertRecords<NbaTeamRecord>(validatedRecords, "teams", 'teamid');
    if (error) {
      const errorMsg = error?.message ? error.message : JSON.stringify(error);
      throw new Error(`Database error: ${errorMsg}`);
    }

    return `DB updated successfully.`;
  }

  syncNbaGameData = async (date?: string): Promise<string> => {
    // Default to today's date in UTC if not provided (YYYY-MM-DD)
    const targetDate = date ?? new Date().toISOString().slice(0, 10);

    const gamesResponse: SportsDataGameRO[] = await this.sportsDataDAO.getGamesByDate(targetDate);
    if (!Array.isArray(gamesResponse) || gamesResponse.length === 0) {
      throw new Error(`Invalid API response: expected array of games for ${targetDate}`);
    }

    const validatedRecords: NbaGameRecord[] = gamesResponse
      .filter(isValidGame)
      .map(mapSportsDataGameToDBRecord);

    if (validatedRecords.length === 0) {
      throw new Error(`Invalid API Response: No valid data found in NBA Games for ${targetDate}.`);
    }

    const { error } = await this.supabaseDbDao.upsertRecords<NbaGameRecord>(validatedRecords, "games", "gameid");
    if (error) {
      const errorMsg = error?.message ? error.message : JSON.stringify(error);
      throw new Error(`Database error: ${errorMsg}`);
    }

    return `Games updated successfully for ${targetDate}.`;
  }
}

export { NbaService };