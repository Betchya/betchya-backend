import { SupabaseDbDAO } from "../dao/SupabaseDbDAO.ts";
import { NbaSportsDataDAO } from "../dao/NbaSportsDataDAO.ts";

import { mapNbaTeamToDBRecord } from "../entity/NbaTeamRecord.ts";
import { SportsDataTeamRO, isValidTeam } from "../ro/SportsDataTeamRO.ts";

import { NbaTeamRecord } from "../entity/NbaTeamRecord.ts";
import { isValidPlayer, SportsDataPlayerRO } from "../ro/SportsDataPlayerRO.ts";
import { mapNbaPlayerToDBRecord, NbaPlayerRecord } from "../entity/NbaPlayerRecord.ts";

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

   syncNbaPlayerData = async (): Promise<string> => {
    const nbaActivePlayersResponse: SportsDataPlayerRO[] = await this.sportsDataDAO.getAllActivePlayers();
    if (!Array.isArray(nbaActivePlayersResponse) || nbaActivePlayersResponse.length === 0) {
        throw new Error('Invalid API response: expected array of teams');
    }
  
    const validatedRecords: NbaPlayerRecord[] = nbaActivePlayersResponse.filter(isValidPlayer).map(mapNbaPlayerToDBRecord);
    if (validatedRecords.length === 0) {
      throw new Error(`Invalid API Response: No valid data found in NBA Active Players Sports Data.`);
    }

    const { error } = await this.supabaseDbDao.upsertRecords<NbaPlayerRecord>(validatedRecords, "players", 'playerid');
    if (error) {
      const errorMsg = error?.message ? error.message : JSON.stringify(error);
      throw new Error(`Database error: ${errorMsg}`);
    }

    return `DB updated successfully.`;
  }
}

export { NbaService };