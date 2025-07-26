import { assertEquals, assertRejects } from "deno/assert";
import * as Mock from "deno/mock";
import { NbaSportsDataDAO } from "../../../nba/dao/NbaSportsDataDAO.ts";
import { SupabaseDbDAO, SupabaseSchemaType } from "../../../nba/dao/SupabaseDbDAO.ts";
import { NbaService } from "../../../nba/service/NbaService.ts";
import { SportsDataTeamRO } from "../../../nba/ro/SportsDataTeamRO.ts";

const validSportsDataTeam : SportsDataTeamRO = {
  TeamID: 1,
  Key: "GSW",
  City: "San Francisco",
  Name: "Warriors",
  Conference: "Western",
  Division: "Pacific",
  Active: true,
};

const invalidSportsDataTeam : unknown = {
  TeamID: "not-a-number",
  Key: "GSW",
  City: "San Francisco",
  Name: "Warriors",
  Conference: "Western",
  Division: "Pacific",
  Active: true,
};

// Mock the DAO Layer to isolate the service layer
const DEFAULT_MOCKS = {
    nbaSportsDataDAO: {
        getAllTeams: Mock.stub(NbaSportsDataDAO.prototype, "getAllTeams", async () => await Promise.resolve([validSportsDataTeam])),
    },
    supabaseDbDAO: {
        upsertRecords: Mock.stub(SupabaseDbDAO.prototype, "upsertRecords", async () => await Promise.resolve({ data: null, error: null})),
    },
};

const buildMockNbaServiceFromStubs = (stubs: {[key: string]: {[key: string]: Mock.Stub}} = DEFAULT_MOCKS) => {
    const { nbaSportsDataDAO, supabaseDbDAO} = {...DEFAULT_MOCKS, ...stubs};
    return new NbaService(nbaSportsDataDAO as unknown as NbaSportsDataDAO, supabaseDbDAO as unknown as SupabaseDbDAO);
};

// Create a test instance of the controller with the mocked service
const defaultNbaService = buildMockNbaServiceFromStubs();

Deno.test("syncNbaTeamData - handles successful SportsData response and Supabase DB upsert", async () => {
    const result = await defaultNbaService.syncNbaTeamData();

    assertEquals(result, "DB updated successfully.");
});

Deno.test("syncNbaTeamData - handles empty SportsData response - throws Error", () => {
    const mockEmptySportsData = {
        nbaSportsDataDAO: {
            getAllTeams: Mock.stub(NbaSportsDataDAO.prototype, "getAllTeams", async () => await Promise.resolve([])),
        }
    };

    try {
        const nbaService = buildMockNbaServiceFromStubs(mockEmptySportsData);

        assertRejects(() => nbaService.syncNbaTeamData(), Error, "Invalid API response: expected array of teams");
    } finally {
        mockEmptySportsData.nbaSportsDataDAO.getAllTeams.restore();
    }
});

Deno.test("syncNbaTeamData - handles empty validated, mapped SportsDataTeamRO to NbaTeamRecords - throws Error", () => {
    const mockInvalidSportsData = {
        nbaSportsDataDAO: {
            getAllTeams: Mock.stub(NbaSportsDataDAO.prototype, "getAllTeams", async () => await Promise.resolve([invalidSportsDataTeam as SportsDataTeamRO])),
        }
    };

    try {
        const nbaService = buildMockNbaServiceFromStubs(mockInvalidSportsData);

        assertRejects(() => nbaService.syncNbaTeamData(), "Invalid API Response: No valid data found in NBA All Teams Sports Data."); 
    } finally {
        mockInvalidSportsData.nbaSportsDataDAO.getAllTeams.restore();
    }
});

Deno.test("syncNbaTeamData - handles Supabase DB upsertRecords error - throws Error", () => {
    const mockSupabaseDBUpsertError = {
        supabaseDbDAO: {
            upsertRecords: Mock.stub(SupabaseDbDAO.prototype, "upsertRecords", async () => await Promise.reject({ data: null, error: null})),
        }
    };

    try {
        const nbaService = buildMockNbaServiceFromStubs(mockSupabaseDBUpsertError);

        assertRejects(() => nbaService.syncNbaTeamData());
    } finally {
        mockSupabaseDBUpsertError.supabaseDbDAO.upsertRecords.restore();
    }
});