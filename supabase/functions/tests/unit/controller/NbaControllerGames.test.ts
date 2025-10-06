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
    "/games",
    controller.updateGames.bind(controller),
  )
  .build();

Deno.test("POST /nba/games - route wiring exists", () => {
  const defaultMockNbaServiceMethods = {
    syncNbaGameData: Mock.stub(NbaService.prototype, "syncNbaGameData", async () => await Promise.resolve("ok")),
  };
  try {
    const controller = new NbaController(defaultMockNbaServiceMethods as unknown as NbaService);
    const app = getAppWithController(controller);
    const route = app.routes.find((r) => r.method === SupportedHttpMethod.POST && r.path === "/nba/games");
    assertEquals(!!route, true);
  } finally {
    defaultMockNbaServiceMethods.syncNbaGameData.restore();
  }
});

Deno.test("POST /nba/games - valid date returns 200 and calls service", async () => {
  const mocks = {
    syncNbaGameData: Mock.stub(NbaService.prototype, "syncNbaGameData", async () => await Promise.resolve("Games updated successfully for 2025-03-01.")),
  };
  try {
    const controller = new NbaController(mocks as unknown as NbaService);
    // Bind the method to the instance with the stubbed prototype
    const app = getAppWithController(controller);

    const req = new Request("http://localhost/nba/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: "2025-03-01" }),
    });

    const res = await app.fetch(req);
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.message, "Games updated successfully for 2025-03-01.");
    assertEquals(mocks.syncNbaGameData.calls.length, 1);
  } finally {
    mocks.syncNbaGameData.restore();
  }
});

Deno.test("POST /nba/games - invalid format returns 400 and does not call service", async () => {
  const mocks = {
    syncNbaGameData: Mock.stub(NbaService.prototype, "syncNbaGameData", async () => await Promise.resolve("ok")),
  };
  try {
    const controller = new NbaController(mocks as unknown as NbaService);
    const app = getAppWithController(controller);

    const req = new Request("http://localhost/nba/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: "2025-2-1" }), // invalid format (not zero-padded)
    });

    const res = await app.fetch(req);
    assertEquals(res.status, 400);
    const body = await res.json();
    assertEquals(body.message, "Invalid date. Expected format: YYYY-MM-DD");
    assertEquals(mocks.syncNbaGameData.calls.length, 0);
  } finally {
    mocks.syncNbaGameData.restore();
  }
});

Deno.test("POST /nba/games - trims whitespace and accepts valid date", async () => {
  const mocks = {
    syncNbaGameData: Mock.stub(NbaService.prototype, "syncNbaGameData", async () => await Promise.resolve("ok")),
  };
  try {
    const controller = new NbaController(mocks as unknown as NbaService);
    const app = getAppWithController(controller);

    const req = new Request("http://localhost/nba/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: " 2025-03-01 " }), // whitespace around valid date
    });

    const res = await app.fetch(req);
    assertEquals(res.status, 200);
    assertEquals(mocks.syncNbaGameData.calls.length, 1);
  } finally {
    mocks.syncNbaGameData.restore();
  }
});

Deno.test("POST /nba/games - leap year date accepted", async () => {
  const mocks = {
    syncNbaGameData: Mock.stub(NbaService.prototype, "syncNbaGameData", async () => await Promise.resolve("ok")),
  };
  try {
    const controller = new NbaController(mocks as unknown as NbaService);
    const app = getAppWithController(controller);

    const req = new Request("http://localhost/nba/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: "2024-02-29" }), // valid leap day
    });

    const res = await app.fetch(req);
    assertEquals(res.status, 200);
    assertEquals(mocks.syncNbaGameData.calls.length, 1);
  } finally {
    mocks.syncNbaGameData.restore();
  }
});

Deno.test("POST /nba/games - invalid date returns 400 and does not call service", async () => {
  const mocks = {
    syncNbaGameData: Mock.stub(NbaService.prototype, "syncNbaGameData", async () => await Promise.resolve("ok")),
  };
  try {
    const controller = new NbaController(mocks as unknown as NbaService);
    const app = getAppWithController(controller);

    const req = new Request("http://localhost/nba/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: "2025-02-30" }), // invalid date
    });

    const res = await app.fetch(req);
    assertEquals(res.status, 400);
    const body = await res.json();
    assertEquals(body.message, "Invalid date. Expected format: YYYY-MM-DD");
    assertEquals(mocks.syncNbaGameData.calls.length, 0);
  } finally {
    mocks.syncNbaGameData.restore();
  }
});

Deno.test("POST /nba/games - no date provided returns 200 and calls service with default", async () => {
  const mocks = {
    syncNbaGameData: Mock.stub(NbaService.prototype, "syncNbaGameData", async () => await Promise.resolve("Games updated successfully for today.")),
  };
  try {
    const controller = new NbaController(mocks as unknown as NbaService);
    const app = getAppWithController(controller);

    const req = new Request("http://localhost/nba/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const res = await app.fetch(req);
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(typeof body.message, "string");
    assertEquals(mocks.syncNbaGameData.calls.length, 1);
  } finally {
    mocks.syncNbaGameData.restore();
  }
});
