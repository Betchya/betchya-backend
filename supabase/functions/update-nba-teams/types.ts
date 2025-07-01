// Types for SportsData.io NBA Team Response parsing and DB upserting in Supabase

interface SportsDataTeamRO {
    TeamID: number;
    Key: string;
    City: string;
    Name: string;
    Conference: string;
    Division: string;
    Active: boolean;
};

interface NbaTeamRecord {
    teamid: number;
    teamabbreviation: string;
    city: string;
    teamname: string;
    conference: string;
    division: string;
    active: boolean;
    recordlastupdated: string;
};

type UpsertRecordsFunction = (upsertData: NbaTeamRecord[]) => Promise<{ data: unknown[] | null; error: { message: string } | null }>;


export type { SportsDataTeamRO, NbaTeamRecord, UpsertRecordsFunction };