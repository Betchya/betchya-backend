import { NbaSupabaseDbDAO } from "../dao/NbaSupabaseDbDAO.ts";
import { NbaSportsDataDAO } from "../dao/NbaSportsDataDAO.ts";

import { mapNbaTeamToDBRecord } from "../entity/NbaTeamRecord.ts";
import * as TeamUtil from "../ro/SportsDataTeamRO.ts";

import { NbaTeamRecord } from "../entity/NbaTeamRecord.ts";

class SupabaseDbNbaService {
  private sportsDataDAO: NbaSportsDataDAO;
  private supabaseDbDao: NbaSupabaseDbDAO;

  constructor(sportsDataDAO: NbaSportsDataDAO, supabaseDbDao: NbaSupabaseDbDAO) {
    this.sportsDataDAO = sportsDataDAO;
    this.supabaseDbDao = supabaseDbDao;
  }

  syncNbaTeamData = async (tableName: string, conflictKey: string) => {
    const nbaAllTeamsResponse = await this.sportsDataDAO.getAllTeams();
    if (!Array.isArray(nbaAllTeamsResponse) || nbaAllTeamsResponse.length === 0) {
        throw new Error('Invalid API response: expected array of teams');
    }
  
    const validatedRecords: NbaTeamRecord[] = nbaAllTeamsResponse.filter(TeamUtil.isValidTeam).map(mapNbaTeamToDBRecord);
    if (validatedRecords.length === 0) {
      throw new Error(`Invalid API Response: No valid data found in NBA All Teams Sports Data.`);
    }

    const { error } = await this.supabaseDbDao.upsertRecords<NbaTeamRecord>(validatedRecords, tableName, conflictKey);
    if (error) {
      const errorMsg = error?.message ? error.message : JSON.stringify(error);
      throw new Error(`Database error: ${errorMsg}`);
    }

    return `DB updated successfully.`;
  }
}

export { SupabaseDbNbaService };