import { SportsDataRO } from "../../shared/types.ts"; // Import the base type for SportsData response

// Types for SportsData.io NBA Team Response parsing and DB upserting in Supabase
interface SportsDataTeamRO extends SportsDataRO {
    TeamID: number;
    Key: string;
    City: string;
    Name: string;
    Conference: string;
    Division: string;
    Active: boolean;
};

const isValidTeam = (team: unknown): team is SportsDataTeamRO => {
    if (typeof team !== 'object' || team === null) {
        return false;
    }

    const typedTeam = team as Partial<SportsDataTeamRO>;
    return (
        typeof typedTeam.TeamID === 'number' &&
        typeof typedTeam.Key === 'string' &&
        typeof typedTeam.City === 'string' &&
        typeof typedTeam.Name === 'string' &&
        typeof typedTeam.Conference === 'string' &&
        typeof typedTeam.Division === 'string' &&
        typeof typedTeam.Active === 'boolean'
    );
};

export { isValidTeam };

export type { SportsDataTeamRO };