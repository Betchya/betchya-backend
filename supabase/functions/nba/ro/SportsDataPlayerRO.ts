import { SportsDataRO } from "../../shared/types.ts"; // Import the base type for SportsData response

// Types for SportsData.io NBA Team Response parsing and DB upserting in Supabase
interface SportsDataPlayerRO extends SportsDataRO { 
    PlayerID: number,
    Status: string, // Active, Inactive
    TeamID: number,
    Team: string,
    Jersey: number,
    PositionCategory: string,
    Position: string,
    FirstName: string,
    LastName: string,
    BirthDate: Date, // ISO 8601 date string
    BirthCity: string,
    BirthState: string,
    BirthCountry: string,
    GlobalTeamID: number,
    Height: number, // Height in inches
    Weight: number, // Weight in pounds
};

const isValidPlayer = (player: unknown): player is SportsDataPlayerRO => {
    if (typeof player !== 'object' || player === null) {
        return false;
    }

    const typedPlayer = player as Partial<SportsDataPlayerRO>;
   return (
        typeof typedPlayer.PlayerID === 'number' &&
        typeof typedPlayer.Status === 'string' &&
        typeof typedPlayer.TeamID === 'number' &&
        typeof typedPlayer.Team === 'string' &&
        typeof typedPlayer.Jersey === 'number' &&
        typeof typedPlayer.PositionCategory === 'string' &&
        typeof typedPlayer.Position === 'string' &&
        typeof typedPlayer.FirstName === 'string' &&
        typeof typedPlayer.LastName === 'string' &&
        (
            typeof typedPlayer.BirthDate === 'string' ||
            typedPlayer.BirthDate instanceof Date
        ) &&
        typeof typedPlayer.BirthCity === 'string' &&
        typeof typedPlayer.BirthState === 'string' &&
        typeof typedPlayer.BirthCountry === 'string' &&
        typeof typedPlayer.GlobalTeamID === 'number' &&
        typeof typedPlayer.Height === 'number' &&
        typeof typedPlayer.Weight === 'number'
    );
};

export { isValidPlayer };

export type { SportsDataPlayerRO };