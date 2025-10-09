import { assertEquals } from "deno/assert";
import * as Mock from "deno/mock";
import { NbaService } from "../../../nba/service/NbaService.ts";
import { NbaSportsDataDAO } from "../../../nba/dao/NbaSportsDataDAO.ts";
import { SupabaseDbDAO } from "../../../nba/dao/SupabaseDbDAO.ts";

Deno.test("NbaService.syncNbaGamesRange - loops per day and calls syncNbaGameData", async () => {
  // Arrange
  const sportsDao = {} as unknown as NbaSportsDataDAO;
  const dbDao = {} as unknown as SupabaseDbDAO;
  const svc = new NbaService(sportsDao, dbDao);

  const callArgs: string[] = [];
  const stub = Mock.stub(svc, "syncNbaGameData", async (date?: string) => {
    if (date) callArgs.push(date);
    return await Promise.resolve(`ok ${date}`);
  });
  try {
    const msg = await svc.syncNbaGamesRange("2025-03-01", "2025-03-03");
    assertEquals(callArgs, ["2025-03-01", "2025-03-02", "2025-03-03"]);
    assertEquals(typeof msg, "string");
  } finally {
    stub.restore();
  }
});
