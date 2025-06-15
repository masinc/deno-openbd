import { assertEquals, assertExists } from "@std/assert";

// Test that all exports from mod.ts can be imported correctly
Deno.test("mod.ts exports can be imported", async () => {
  const mod = await import("./mod.ts");

  // Test function exports
  assertExists(mod.getBook);
  assertEquals(typeof mod.getBook, "function");

  assertExists(mod.getCoverage);
  assertEquals(typeof mod.getCoverage, "function");

  assertExists(mod.isValidBook);
  assertEquals(typeof mod.isValidBook, "function");

  assertExists(mod.isValidResponse);
  assertEquals(typeof mod.isValidResponse, "function");

  // Test schema exports
  assertExists(mod.BookSchema);
  assertExists(mod.OpenBDResponseSchema);
  assertExists(mod.CoverageResponseSchema);

  // Test that schemas have parse method (are Zod schemas)
  assertEquals(typeof mod.BookSchema.parse, "function");
  assertEquals(typeof mod.OpenBDResponseSchema.parse, "function");
  assertEquals(typeof mod.CoverageResponseSchema.parse, "function");
});
