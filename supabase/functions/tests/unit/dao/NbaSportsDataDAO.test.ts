import { assertEquals, assertRejects } from "deno/assert";
import * as Mock from "deno/mock";
import { NbaSportsDataDAO } from "../../../nba/dao/NbaSportsDataDAO.ts";
import type { SportsDataGameRO } from "../../../nba/ro/SportsDataGameRO.ts";

Deno.test("NbaSportsDataDAO.getGamesByDate - returns games for valid date", async () => {
  const validGame: SportsDataGameRO = {
    GameID: 123,
    Season: 2025,
    SeasonType: "Regular",
    DateTime: "2025-03-01T00:00:00",
    DateTimeUTC: "2025-03-01T00:00:00Z",
    Status: "Scheduled",
    HomeTeamID: 1,
    AwayTeamID: 2,
  };

  const fetchStub = Mock.stub(globalThis, "fetch", async () =>
    await Promise.resolve(new Response(JSON.stringify([validGame]), { status: 200 }))
  );
  try {
    const dao = new NbaSportsDataDAO();
    const data = await dao.getGamesByDate("2025-03-01");
    assertEquals(Array.isArray(data), true);
    assertEquals(data.length, 1);
    assertEquals(data[0].GameID, 123);
  } finally {
    fetchStub.restore();
  }
});

Deno.test("NbaSportsDataDAO.getGamesByDate - invalid date format throws", async () => {
  const fetchStub = Mock.stub(globalThis, "fetch", async () =>
    await Promise.resolve(new Response(JSON.stringify([]), { status: 200 }))
  );
  try {
    const dao = new NbaSportsDataDAO();
    await assertRejects(() => dao.getGamesByDate("2025/03/01"), Error, "Invalid date format");
    // fetch should not have been called
    assertEquals(fetchStub.calls.length, 0);
  } finally {
    fetchStub.restore();
  }
});

Deno.test("NbaSportsDataDAO.getGamesByDate - non-ok response throws", async () => {
  const fetchStub = Mock.stub(globalThis, "fetch", async () =>
    await Promise.resolve(new Response("server error", { status: 500, statusText: "Internal Server Error" }))
  );
  try {
    const dao = new NbaSportsDataDAO();
    await assertRejects(
      () => dao.getGamesByDate("2025-03-01"),
      Error,
      "Failed to fetch NBA games"
    );
  } finally {
    fetchStub.restore();
  }
});

Deno.test("NbaSportsDataDAO.getGamesByDate - invalid JSON throws", async () => {
  const fetchStub = Mock.stub(globalThis, "fetch", async () =>
    await Promise.resolve(new Response("not-json", { status: 200 }))
  );
  try {
    const dao = new NbaSportsDataDAO();
    await assertRejects(
      () => dao.getGamesByDate("2025-03-01"),
      Error,
      "Failed to parse JSON response"
    );
  } finally {
    fetchStub.restore();
  }
});
