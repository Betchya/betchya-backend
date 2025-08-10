import { SupabaseDbRecord } from "../../shared/types.ts"; // Import the base type for Supabase DB records
import { SportsDataPlayerRO } from "../ro/SportsDataPlayerRO.ts"; // Import the type for SportsData.io NBA Team response

interface NbaPlayerRecord extends SupabaseDbRecord {
    playerid: number;
    firstname: string;
    lastname: string;
    teamid: number;
    position: string;
    jerseynumber: number;
    playerheight: number;
    playerweight: number;
    birthdate: string;
    playerstatus: string;
    recordlastupdated: string;
};

const mapNbaPlayerToDBRecord = (player: SportsDataPlayerRO): NbaPlayerRecord => {
    return {
        playerid: player.PlayerID,
        firstname: player.FirstName,
        lastname: player.LastName,
        teamid: player.TeamID,
        position: player.Position,
        jerseynumber: player.Jersey,
        playerheight: player.Height,
        playerweight: player.Weight,
        birthdate: new Date(player.BirthDate).toISOString(),
        playerstatus: player.Status,
        recordlastupdated: new Date().toISOString(),
    };
};

export { mapNbaPlayerToDBRecord };

export type { NbaPlayerRecord };