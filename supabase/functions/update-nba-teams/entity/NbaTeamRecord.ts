import { SupabaseDbRecord } from "../../shared/types.ts"; // Import the base type for Supabase DB records
import { SportsDataTeamRO } from "../ro/SportsDataTeamRO.ts"; // Import the type for SportsData.io NBA Team response

interface NbaTeamRecord extends SupabaseDbRecord {
    teamid: number;
    teamabbreviation: string;
    city: string;
    teamname: string;
    conference: string;
    division: string;
    active: boolean;
    recordlastupdated: string;
};

const mapNbaTeamToDBRecord = (team: SportsDataTeamRO): NbaTeamRecord => {
    return {
        teamid: team.TeamID,
        teamabbreviation: team.Key,
        city: team.City,
        teamname: team.Name,
        conference: team.Conference,
        division: team.Division,
        active: team.Active,
        recordlastupdated: new Date().toISOString(),
    };
};

export { mapNbaTeamToDBRecord };

export type { NbaTeamRecord };