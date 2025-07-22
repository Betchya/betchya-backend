import { assert, assertEquals } from "deno/assert";
import * as Mock from "deno/mock";
import { RouterBuilder, SupportedHttpMethod } from "../../shared/RouterBuilder.ts";
import { NbaController } from "../../nba/controller/NbaController.ts";
import { NbaService } from "../../nba/service/NbaService.ts";

// Mock the NbaController to isolate the service layer
const defaultMockNbaServiceMethods = {
   syncNbaTeamData: Mock.stub(NbaService.prototype, "syncNbaTeamData", async () => await Promise.resolve(("Teams updated successfully"))),
};

const buildMockNbaControllerFromStubs = (stubs: {[key: string]: Mock.Stub} = defaultMockNbaServiceMethods) => {
  return new NbaController(stubs as unknown as NbaService);
};

// Create a test instance of the controller with the mocked service
const defaultNbaController = buildMockNbaControllerFromStubs();

const getAppWithMocks = (controller: NbaController = defaultNbaController) => RouterBuilder.builder().withBasePath("/nba")
  .withRoute(
    SupportedHttpMethod.POST,
    "/teams",
    controller.updateTeams.bind(controller),
  )
  .build();

Deno.test("Router should configure POST /nba/teams endpoint correctly", () => {
  const app = getAppWithMocks();

  // Verify the router has the expected route
  const route = app.routes.find(
    (r) => r.method === SupportedHttpMethod.POST && r.path === "/nba/teams",
  );
  assert(route, "POST /nba/teams route should be defined");
  assertEquals(route?.method, SupportedHttpMethod.POST);
  assertEquals(route?.path, "/nba/teams");
});

Deno.test("POST /nba/teams should call NbaService.updateTeams and return success response", async () => {
  const app = getAppWithMocks();

  // Create a mock HTTP request
  const request = new Request("http://localhost:8000/nba/teams", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  // Call the router's fetch method
  const response = await app.fetch(request);

  // Verify the response
  assertEquals(response.status, 200);
  const responseBody = await response.json();
  assertEquals(responseBody.message, "Teams updated successfully");

  // Verify the mocked service method was called
  assertEquals(defaultMockNbaServiceMethods.syncNbaTeamData.calls.length, 1);
});

Deno.test("POST /nba/teams should handle service errors gracefully", async () => {
  // Override the mock to simulate an error
  const mocks = {
    syncNbaTeamData: Mock.stub(NbaService.prototype, "syncNbaTeamData", async () => await Promise.reject(new Error("Service error"))),
  };
  const mockNbaController = buildMockNbaControllerFromStubs(mocks)
  const app = getAppWithMocks(mockNbaController);

  // Create a mock HTTP request
  const request = new Request("http://localhost/nba/teams", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  // Call the router's fetch method
  const response = await app.fetch(request);

  // Verify the error response
  assertEquals(response.status, 500);
  const responseBody = await response.json();
  assertEquals(responseBody.message, "Failed to update NBA teams: Service error");
});