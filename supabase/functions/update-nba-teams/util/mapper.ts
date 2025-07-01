import { SportsDataTeamRO, NbaTeamRecord } from "../types.ts";

const mapTeamToDBRecord = (team: SportsDataTeamRO): NbaTeamRecord => {
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

export { mapTeamToDBRecord };