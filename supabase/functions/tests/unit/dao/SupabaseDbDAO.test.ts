import { assertEquals } from "deno/assert";
import { SupabaseDbDAO, SupabaseSchemaType } from "../../../nba/dao/SupabaseDbDAO.ts";

Deno.test("SupabaseDbDAO.upsertRecords - success returns data, no error", async () => {
  // Arrange fake client chain: schema()->from()->upsert()
  let upsertCallCount = 0;
  const fakeUpsert = async (..._args: unknown[]) => {
    upsertCallCount += 1;
    return await Promise.resolve({ data: [{ ok: true }], error: null });
  };
  const fakeFrom = () => ({ upsert: fakeUpsert });
  const fakeSchema = () => ({ from: fakeFrom });
  const fakeClient = { schema: fakeSchema } as unknown as Record<string, unknown>;

  const rows: Array<{ gameid: number }> = [{ gameid: 1 }];

  // Act
  // Construct DAO with injected fake client
  const dao = new SupabaseDbDAO(SupabaseSchemaType.NBA, fakeClient as unknown as object as any);
  const { data, error } = await dao.upsertRecords(rows, "games", "gameid");

  // Assert
  // ensure non-null and array
  assertEquals(data !== null && Array.isArray(data), true);
  const arr = (data ?? []) as unknown[];
  assertEquals(arr.length, 1);
  assertEquals(error, null);
  assertEquals(upsertCallCount, 1);
});

Deno.test("SupabaseDbDAO.upsertRecords - surfaces error from client", async () => {
  const fakeError = { message: "boom" } as const;
  let upsertCallCount = 0;
  const fakeUpsert = async () => {
    upsertCallCount += 1;
    return await Promise.resolve({ data: null, error: fakeError });
  };
  const fakeClient = { schema: () => ({ from: () => ({ upsert: fakeUpsert }) }) } as unknown as Record<string, unknown>;
  const dao = new SupabaseDbDAO(SupabaseSchemaType.NBA, fakeClient as unknown as object as any);
  const { data, error } = await dao.upsertRecords([], "games", "gameid");
  assertEquals(data, null);
  assertEquals(error, fakeError as unknown);
  assertEquals(upsertCallCount, 1);
});
