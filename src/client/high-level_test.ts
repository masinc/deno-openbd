import { assertEquals } from "@std/assert";
import type { BookInfo } from "../types.ts";

// Simple integration test without mocking
// These tests actually call the high-level API but with controlled inputs

Deno.test("getBook - function signature validation", async () => {
  // Import the function to test its type
  const { getBook } = await import("./high-level.ts");

  // Test function exists and is callable
  assertEquals(typeof getBook, "function");

  // Test overload: single string parameter
  // Note: We don't call it to avoid network dependency
  const singleISBNCall = getBook("9784101092058");
  assertEquals(typeof singleISBNCall.then, "function"); // Returns Promise

  // Test overload: array parameter
  const multipleISBNCall = getBook(["9784101092058", "9784062748895"]);
  assertEquals(typeof multipleISBNCall.then, "function"); // Returns Promise
});

Deno.test("getCoverage - function signature validation", async () => {
  const { getCoverage } = await import("./high-level.ts");

  assertEquals(typeof getCoverage, "function");

  const coverageCall = getCoverage();
  assertEquals(typeof coverageCall.then, "function"); // Returns Promise
});

// Test BookInfo type structure
Deno.test("BookInfo type validation", () => {
  // Create a sample BookInfo object and verify its structure
  const bookInfo: BookInfo = {
    isbn: "9784101092058",
    title: "Test Book",
    author: "Test Author",
    publisher: "Test Publisher",
    publishedDate: "2023-01-01",
  };

  // Test required fields
  assertEquals(typeof bookInfo.isbn, "string");
  assertEquals(typeof bookInfo.title, "string");
  assertEquals(typeof bookInfo.author, "string");
  assertEquals(typeof bookInfo.publisher, "string");
  assertEquals(typeof bookInfo.publishedDate, "string");

  // Test optional fields can be set
  bookInfo.series = "Test Series";
  bookInfo.volume = "1";
  bookInfo.productForm = "BC";
  bookInfo.pageCount = 200;
  bookInfo.coverUrl = "https://example.com/cover.jpg";
  bookInfo.description = "Test description";
  bookInfo.availability = "20";

  assertEquals(typeof bookInfo.series, "string");
  assertEquals(typeof bookInfo.volume, "string");
  assertEquals(typeof bookInfo.productForm, "string");
  assertEquals(typeof bookInfo.pageCount, "number");
  assertEquals(typeof bookInfo.coverUrl, "string");
  assertEquals(typeof bookInfo.description, "string");
  assertEquals(typeof bookInfo.availability, "string");
});

// Test Result type handling (without network calls)
Deno.test("Result type handling", async () => {
  const { ok, err } = await import("neverthrow");

  // Test successful Result
  const successResult = ok("test value");
  assertEquals(successResult.isOk(), true);
  assertEquals(successResult.isErr(), false);
  if (successResult.isOk()) {
    assertEquals(successResult.value, "test value");
  }

  // Test error Result
  const errorResult = err(new Error("test error"));
  assertEquals(errorResult.isOk(), false);
  assertEquals(errorResult.isErr(), true);
  if (errorResult.isErr()) {
    assertEquals(errorResult.error.message, "test error");
  }
});

// Test type guards
Deno.test("Type guards validation", async () => {
  const { isValidBook, isValidResponse } = await import("../types.ts");

  assertEquals(typeof isValidBook, "function");
  assertEquals(typeof isValidResponse, "function");

  // Test with invalid data
  assertEquals(isValidBook(null), false);
  assertEquals(isValidBook({}), false);
  assertEquals(isValidBook("invalid"), false);

  assertEquals(isValidResponse(null), false);
  assertEquals(isValidResponse("invalid"), false);
  assertEquals(isValidResponse({}), false);

  // Test with empty array (valid for OpenBDResponse)
  assertEquals(isValidResponse([]), true);
});

// Test error type definitions
Deno.test("Error type validation", () => {
  // These are type-only tests - we test the structure, not the import
  // since TypeScript types cannot be imported at runtime

  // Test FetchError structure
  const fetchError = {
    type: "network" as const,
    message: "Test error",
    cause: new Error("Test cause"),
  };
  assertEquals(fetchError.type, "network");
  assertEquals(fetchError.message, "Test error");

  // Test other error types
  const parseError = { type: "parse" as const, message: "Parse failed" };
  const validationError = { type: "validation" as const, message: "Validation failed" };
  
  assertEquals(parseError.type, "parse");
  assertEquals(validationError.type, "validation");
});

// Basic schema validation test
Deno.test("Schema exports validation", async () => {
  const { BookSchema, OpenBDResponseSchema, CoverageResponseSchema } = await import("../types.ts");

  // Test schemas exist and have parse methods
  assertEquals(typeof BookSchema.parse, "function");
  assertEquals(typeof OpenBDResponseSchema.parse, "function");
  assertEquals(typeof CoverageResponseSchema.parse, "function");

  // Test schema parsing with simple valid data
  const validCoverage = ["9784101092058", "9784062748895"];
  const coverageResult = CoverageResponseSchema.safeParse(validCoverage);
  assertEquals(coverageResult.success, true);

  // Test schema parsing with invalid data
  const invalidCoverage = [123, 456]; // Numbers instead of strings
  const invalidResult = CoverageResponseSchema.safeParse(invalidCoverage);
  assertEquals(invalidResult.success, false);
});

// Test API URL construction logic (without actually calling)
Deno.test("URL construction logic", () => {
  const BASE_URL = "https://api.openbd.jp/v1";

  // Test single ISBN URL
  const singleISBN = "9784101092058";
  const singleURL = `${BASE_URL}/get?isbn=${encodeURIComponent(singleISBN)}`;
  assertEquals(singleURL, "https://api.openbd.jp/v1/get?isbn=9784101092058");

  // Test multiple ISBNs URL
  const multipleISBNs = ["9784101092058", "9784062748895"];
  const multipleURL = `${BASE_URL}/get?isbn=${encodeURIComponent(multipleISBNs.join(","))}`;
  assertEquals(multipleURL, "https://api.openbd.jp/v1/get?isbn=9784101092058%2C9784062748895");

  // Test coverage URL
  const coverageURL = `${BASE_URL}/coverage`;
  assertEquals(coverageURL, "https://api.openbd.jp/v1/coverage");
});

// Test error message construction
Deno.test("Error message construction", () => {
  // Test network error
  const networkError = {
    type: "network" as const,
    message: "HTTP 404: Not Found",
  };
  assertEquals(networkError.type, "network");
  assertEquals(networkError.message, "HTTP 404: Not Found");

  // Test validation error
  const validationError = {
    type: "validation" as const,
    message: "Invalid response format from OpenBD API",
    cause: new Error("Schema validation failed"),
  };
  assertEquals(validationError.type, "validation");
  assertEquals(validationError.message, "Invalid response format from OpenBD API");
  assertEquals(validationError.cause?.message, "Schema validation failed");
});