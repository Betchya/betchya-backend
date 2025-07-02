import { SportsDataTeamRO } from "../types.ts";

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