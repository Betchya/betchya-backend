import { SupabaseDbNbaDao } from "../dao/nba-supabase-db-dao.ts";
import { SportsDataNbaDAO } from "../dao/nba-sports-data-dao.ts";

import { mapNbaTeamToDBRecord } from "../entity/NbaTeamRecord.ts";
import * as TeamUtil from "../ro/SportsDataTeamRO.ts";

import { NbaTeamRecord } from "../entity/NbaTeamRecord.ts";

class SupabaseDbNbaService {
  private sportsDataDAO: SportsDataNbaDAO;
  private supabaseDbDao: SupabaseDbNbaDao;

  constructor(sportsDataDAO: SportsDataNbaDAO, supabaseDbDao: SupabaseDbNbaDao) {
    this.sportsDataDAO = sportsDataDAO;
    this.supabaseDbDao = supabaseDbDao;
  }

  syncNbaTeamData = async (tableName: string, conflictKey: string) => {
    try {
      const nbaAllTeamsResponse = await this.sportsDataDAO.getAllTeams();
      if (!Array.isArray(nbaAllTeamsResponse) || nbaAllTeamsResponse.length === 0) {
         throw new Error('Invalid API response: expected array of teams');
      }
    
      const validatedRecords: NbaTeamRecord[] = nbaAllTeamsResponse.filter(TeamUtil.isValidTeam).map(mapNbaTeamToDBRecord);
      if (validatedRecords.length === 0) {
        return `No valid data found in API response for syncing NBA teams.`;
      }
      console.log(`Valid NBA teams to upsert: ${validatedRecords}`);

      const { error } = await this.supabaseDbDao.upsertRecords<NbaTeamRecord>(validatedRecords, tableName, conflictKey);

      if (error) {
        const errorMsg = (typeof error === 'object' && error && 'message' in error)
          ? error.message
          : JSON.stringify(error);
        throw new Error(`Database error ${errorMsg}`);
      }
  
      return `DB updated successfully.`;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return `Failed to update NBA teams: ${message}`;
    }
  }
}

export { SupabaseDbNbaService };