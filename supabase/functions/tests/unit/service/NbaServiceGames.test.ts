import { assertEquals, assertRejects } from "deno/assert";
import * as Mock from "deno/mock";
import { NbaService } from "../../../nba/service/NbaService.ts";
import { NbaSportsDataDAO } from "../../../nba/dao/NbaSportsDataDAO.ts";
import { SupabaseDbDAO } from "../../../nba/dao/SupabaseDbDAO.ts";
import type { SportsDataGameRO } from "../../../nba/ro/SportsDataGameRO.ts";

const validGame: SportsDataGameRO = {
  GameID: 42,
  Season: 2025,
  SeasonType: "Regular",
  DateTime: "2025-03-01T00:00:00",
  DateTimeUTC: "2025-03-01T00:00:00Z",
  Status: "Scheduled",
  HomeTeamID: 10,
  AwayTeamID: 20,
};

const DEFAULT_MOCKS = {
  nbaSportsDataDAO: {
    getGamesByDate: Mock.stub(NbaSportsDataDAO.prototype, "getGamesByDate", async () => await Promise.resolve([validGame])),
  },
  supabaseDbDAO: {
    upsertRecords: Mock.stub(SupabaseDbDAO.prototype, "upsertRecords", async () => await Promise.resolve({ data: null, error: null })),
  },
};

const buildMockNbaServiceFromStubs = (stubs: { [k: string]: { [k: string]: Mock.Stub } } = DEFAULT_MOCKS) => {
  const { nbaSportsDataDAO, supabaseDbDAO } = { ...DEFAULT_MOCKS, ...stubs };
  return new NbaService(nbaSportsDataDAO as unknown as NbaSportsDataDAO, supabaseDbDAO as unknown as SupabaseDbDAO);
};

Deno.test("syncNbaGameData - handles success for provided date", async () => {
  const svc = buildMockNbaServiceFromStubs();
  const msg = await svc.syncNbaGameData("2025-03-01");
  assertEquals(msg, "Games updated successfully for 2025-03-01.");
});

Deno.test("syncNbaGameData - defaults to today when date not provided", async () => {
  const svc = buildMockNbaServiceFromStubs();
  const msg = await svc.syncNbaGameData();
  const prefix = "Games updated successfully for ";
  assertEquals(msg.startsWith(prefix), true);
});

Deno.test("syncNbaGameData - handles empty SportsData response (throws)", () => {
  const mocks = {
    nbaSportsDataDAO: {
      getGamesByDate: Mock.stub(NbaSportsDataDAO.prototype, "getGamesByDate", async () => await Promise.resolve([])),
    },
  };
  try {
    const svc = buildMockNbaServiceFromStubs(mocks);
    assertRejects(() => svc.syncNbaGameData("2025-03-01"), Error, "expected array of games");
  } finally {
    mocks.nbaSportsDataDAO.getGamesByDate.restore();
  }
});

Deno.test("syncNbaGameData - handles no valid mapped records (throws)", () => {
  const mocks = {
    nbaSportsDataDAO: {
      // invalid shape -> filtered out by isValidGame
      getGamesByDate: Mock.stub(NbaSportsDataDAO.prototype, "getGamesByDate", async () => await Promise.resolve([{ GameID: "x" } as unknown as SportsDataGameRO])),
    },
  };
  try {
    const svc = buildMockNbaServiceFromStubs(mocks);
    assertRejects(() => svc.syncNbaGameData("2025-03-01"), Error, "No valid data");
  } finally {
    mocks.nbaSportsDataDAO.getGamesByDate.restore();
  }
});

Deno.test("syncNbaGameData - surfaces DB upsert error", () => {
  const mocks = {
    supabaseDbDAO: {
      upsertRecords: Mock.stub(SupabaseDbDAO.prototype, "upsertRecords", async () => await Promise.reject(new Error("db failed"))),
    },
  };
  try {
    const svc = buildMockNbaServiceFromStubs(mocks);
    assertRejects(() => svc.syncNbaGameData("2025-03-01"));
  } finally {
    mocks.supabaseDbDAO.upsertRecords.restore();
  }
});
