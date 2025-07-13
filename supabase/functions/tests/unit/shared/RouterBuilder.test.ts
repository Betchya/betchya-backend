import { assertEquals, assertThrows } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { Context } from 'hono';
import { RouterBuilder, SupportedHttpMethod } from '../../../shared/RouterBuilder.ts';

Deno.test("build - should register routes correctly", () => {
    const app = RouterBuilder.builder()
        .withBasePath("/base-path")
        .withRoute(SupportedHttpMethod.POST, "/test", async (c: Context) => await Promise.resolve(c.json({ success: true })))
        .build();
    
    assertEquals(app.routes.length, 2);
    assertEquals(app.routes[0].method, "POST");
    assertEquals(app.routes[0].path, "/base-path/test");
    assertEquals(app.routes[1].method, "ALL");
    assertEquals(app.routes[1].path, "/base-path/test");
});

Deno.test("build - should throw error if base path is not set", () => {
    assertThrows(
        () => RouterBuilder.builder().build(),
        Error,
        "Base path is required and must be set using withBasePath"
    );
});

Deno.test("withBasePath - should throw error for invalid base path", () => {
    assertThrows(
        () => RouterBuilder.builder().withBasePath("api"),
        Error,
        "Base path must start with a forward slash (/)"
    );
});

Deno.test("addRoute - should throw error for duplicate route", () => {
    const handler = async (c: Context) => await Promise.resolve(c.json({ success: true }));

    assertThrows(
        () => RouterBuilder.builder()
            .withRoute(SupportedHttpMethod.POST, "/test", handler)
            .withRoute(SupportedHttpMethod.POST, "/test", handler),
        Error,
        "Route POST /test already exists"
    );
});

Deno.test("addRoute - should throw error for duplicate route", () => {
    const handler = async (c: Context) => await Promise.resolve(c.json({ success: true }));

    assertThrows(
        () => RouterBuilder.builder()
            .withRoute(SupportedHttpMethod.POST, "/test", handler)
            .withRoute(SupportedHttpMethod.POST, "/test", handler),
        Error,
        "Route POST /test already exists"
    );
});
