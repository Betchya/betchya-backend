import { assertEquals } from "deno/assert";
import * as Mock from "deno/mock";
import { RouterBuilder, SupportedHttpMethod } from "../../../shared/RouterBuilder.ts";
import { NbaController } from "../../../nba/controller/NbaController.ts";
import { NbaService } from "../../../nba/service/NbaService.ts";

// Helper to build app with a mocked controller
const getAppWithController = (controller: NbaController) => RouterBuilder.builder()
  .withBasePath("/nba")
  .withRoute(
    SupportedHttpMethod.POST,
    "/games/range",
    controller.updateGamesRange.bind(controller),
  )
  .build();

Deno.test("POST /nba/games/range - invalid format returns 400 and does not call service", async () => {
  const mocks = {
    syncNbaGamesRange: Mock.stub(NbaService.prototype, "syncNbaGamesRange", async () => await Promise.resolve("ok")),
  };
  try {
    const controller = new NbaController(mocks as unknown as NbaService);
    const app = getAppWithController(controller);

    const req = new Request("http://localhost/nba/games/range", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate: "2025-2-1", endDate: "2025-03-01" }), // bad start format
    });

    const res = await app.fetch(req);
    assertEquals(res.status, 400);
    const body = await res.json();
    assertEquals(body.message, "Invalid dates. Expected format: YYYY-MM-DD");
    assertEquals(mocks.syncNbaGamesRange.calls.length, 0);
  } finally {
    mocks.syncNbaGamesRange.restore();
  }
});

Deno.test("POST /nba/games/range - end before start returns 400", async () => {
  const mocks = {
    syncNbaGamesRange: Mock.stub(NbaService.prototype, "syncNbaGamesRange", async () => await Promise.resolve("ok")),
  };
  try {
    const controller = new NbaController(mocks as unknown as NbaService);
    const app = getAppWithController(controller);

    const req = new Request("http://localhost/nba/games/range", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate: "2025-03-02", endDate: "2025-03-01" }),
    });

    const res = await app.fetch(req);
    assertEquals(res.status, 400);
    const body = await res.json();
    assertEquals(body.message, "Invalid range. startDate must be less than or equal to endDate.");
    assertEquals(mocks.syncNbaGamesRange.calls.length, 0);
  } finally {
    mocks.syncNbaGamesRange.restore();
  }
});

Deno.test("POST /nba/games/range - trims whitespace and accepts valid dates", async () => {
  const mocks = {
    syncNbaGamesRange: Mock.stub(NbaService.prototype, "syncNbaGamesRange", async () => await Promise.resolve("ok")),
  };
  try {
    const controller = new NbaController(mocks as unknown as NbaService);
    const app = getAppWithController(controller);

    const req = new Request("http://localhost/nba/games/range", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate: " 2025-03-01 ", endDate: " 2025-03-03 " }),
    });

    const res = await app.fetch(req);
    assertEquals(res.status, 200);
    assertEquals(mocks.syncNbaGamesRange.calls.length, 1);
    const [firstCallArgs] = mocks.syncNbaGamesRange.calls;
    assertEquals(firstCallArgs.args[0], "2025-03-01");
    assertEquals(firstCallArgs.args[1], "2025-03-03");
  } finally {
    mocks.syncNbaGamesRange.restore();
  }
});

Deno.test("POST /nba/games/range - leap day accepted", async () => {
  const mocks = {
    syncNbaGamesRange: Mock.stub(NbaService.prototype, "syncNbaGamesRange", async () => await Promise.resolve("ok")),
  };
  try {
    const controller = new NbaController(mocks as unknown as NbaService);
    const app = getAppWithController(controller);

    const req = new Request("http://localhost/nba/games/range", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate: "2024-02-29", endDate: "2024-03-01" }),
    });

    const res = await app.fetch(req);
    assertEquals(res.status, 200);
    assertEquals(mocks.syncNbaGamesRange.calls.length, 1);
  } finally {
    mocks.syncNbaGamesRange.restore();
  }
});

Deno.test("POST /nba/games/range - range too large returns 400", async () => {
  const mocks = {
    syncNbaGamesRange: Mock.stub(NbaService.prototype, "syncNbaGamesRange", async () => await Promise.resolve("ok")),
  };
  try {
    const controller = new NbaController(mocks as unknown as NbaService);
    const app = getAppWithController(controller);

    const req = new Request("http://localhost/nba/games/range", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate: "2025-01-01", endDate: "2025-02-15" }), // 46 days
    });

    const res = await app.fetch(req);
    assertEquals(res.status, 400);
    const body = await res.json();
    assertEquals(body.message, "Range too large. Max 31 days.");
    assertEquals(mocks.syncNbaGamesRange.calls.length, 0);
  } finally {
    mocks.syncNbaGamesRange.restore();
  }
});
