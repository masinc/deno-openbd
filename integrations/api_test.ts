import { assertEquals } from "@std/assert";
import { getBook, getCoverage } from "../src/client/high-level.ts";

// Integration tests that actually call the OpenBD API
// These tests require network access and are optional

Deno.test({
  name: "Integration: getBook with real ISBN",
  async fn() {
    // Test with a well-known ISBN that should exist
    const result = await getBook("9784101092058"); // 新編銀河鉄道の夜

    assertEquals(result.isOk(), true);
    if (result.isOk() && result.value) {
      const book = result.value;
      assertEquals(book.isbn, "9784101092058");
      assertEquals(typeof book.title, "string");
      assertEquals(typeof book.author, "string");
      assertEquals(typeof book.publisher, "string");
      assertEquals(typeof book.publishedDate, "string");
      
      // Book should have meaningful content
      assertEquals(book.title.length > 0, true);
      assertEquals(book.author.length > 0, true);
      assertEquals(book.publisher.length > 0, true);
    }
  },
});

Deno.test({
  name: "Integration: getBook with non-existent ISBN",
  async fn() {
    // Test with a valid format but non-existent ISBN
    const result = await getBook("9781234567890");

    assertEquals(result.isOk(), true);
    if (result.isOk()) {
      // Should return null for non-existent book
      assertEquals(result.value, null);
    }
  },
});

Deno.test({
  name: "Integration: getBook with multiple ISBNs",
  async fn() {
    const isbns = [
      "9784101092058", // Should exist
      "9781234567890", // Should not exist
      "9784062748895", // Should exist
    ];

    const result = await getBook(isbns);

    assertEquals(result.isOk(), true);
    if (result.isOk()) {
      const data = result.value;
      if (typeof data === "object" && "books" in data) {
        // Should find at least 1 book (possibly 2)
        assertEquals(data.books.length >= 1, true);
        assertEquals(data.books.length <= 2, true);
        
        // Should have at least 1 not found ISBN
        assertEquals(data.notFound.length >= 1, true);
        assertEquals(data.notFound.includes("9781234567890"), true);
        
        // All found books should have valid data
        for (const book of data.books) {
          assertEquals(typeof book.isbn, "string");
          assertEquals(typeof book.title, "string");
          assertEquals(book.isbn.length, 13); // ISBN-13 format
        }
      }
    }
  },
});

Deno.test({
  name: "Integration: getCoverage",
  async fn() {
    const result = await getCoverage();

    assertEquals(result.isOk(), true);
    if (result.isOk()) {
      const isbns = result.value;
      
      // Should return a large number of ISBNs
      assertEquals(isbns.length > 1000, true);
      
      // All should be strings
      for (const isbn of isbns.slice(0, 100)) { // Check first 100
        assertEquals(typeof isbn, "string");
        assertEquals(isbn.length, 13); // ISBN-13 format
        assertEquals(isbn.startsWith("978"), true); // Valid ISBN-13 prefix
      }
      
      // Should contain some known ISBNs
      const containsKnownISBN = isbns.includes("9784101092058") ||
                               isbns.includes("9784062748895");
      assertEquals(containsKnownISBN, true);
    }
  },
});

Deno.test({
  name: "Integration: Performance test",
  async fn() {
    const startTime = performance.now();
    
    const result = await getBook("9784101092058");
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // API call should complete within reasonable time (5 seconds)
    assertEquals(duration < 5000, true);
    assertEquals(result.isOk(), true);
  },
});

Deno.test({
  name: "Integration: Concurrent requests",
  async fn() {
    const isbns = [
      "9784101092058",
      "9784062748895", 
      "9784101092065",
    ];

    // Make concurrent requests
    const promises = isbns.map(isbn => getBook(isbn));
    const results = await Promise.all(promises);

    // All requests should succeed
    for (const result of results) {
      assertEquals(result.isOk(), true);
    }

    // Should get meaningful responses (at least some non-null)
    const books = results
      .filter(result => result.isOk())
      .map(result => result.isOk() ? result.value : null)
      .filter(book => book !== null);

    assertEquals(books.length >= 1, true);
  },
});

Deno.test({
  name: "Integration: Various ISBN formats",
  async fn() {
    const testCases = [
      "9784101092058",    // Standard format
      "",                 // Empty string
      "invalid",          // Invalid format
      "123",              // Too short
    ];

    for (const isbn of testCases) {
      const result = await getBook(isbn);
      
      // All should return ok (errors are wrapped in Result)
      assertEquals(result.isOk(), true);
      
      if (result.isOk()) {
        // Empty, invalid, or short ISBNs should return null
        if (!isbn || isbn.length !== 13 || !isbn.startsWith("978")) {
          assertEquals(result.value, null);
        }
      }
    }
  },
});