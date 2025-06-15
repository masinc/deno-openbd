#!/usr/bin/env -S deno run --allow-net
/**
 * Example: Error handling patterns
 * Usage: deno run --allow-net examples/error_handling.ts
 */

import { getBook } from "../mod.ts";

async function main() {
  console.log("🚨 Testing error handling patterns...\n");

  // Test 1: Invalid ISBN
  console.log("Test 1: Invalid ISBN");
  const invalidResult = await getBook("invalid-isbn-123");

  if (invalidResult.isOk()) {
    const book = invalidResult.value;
    if (book === null) {
      console.log("✅ Correctly handled: Invalid ISBN returned null");
    } else {
      console.log("❌ Unexpected: Invalid ISBN returned book data");
    }
  } else {
    console.log("❌ Error:", invalidResult.error.message);
  }

  // Test 2: Non-existent but valid format ISBN
  console.log("\nTest 2: Non-existent ISBN (valid format)");
  const nonExistentResult = await getBook("9781234567897");

  if (nonExistentResult.isOk()) {
    const book = nonExistentResult.value;
    if (book === null) {
      console.log("✅ Correctly handled: Non-existent ISBN returned null");
    } else {
      console.log("❌ Unexpected: Non-existent ISBN returned book data");
    }
  } else {
    console.log("❌ Error:", nonExistentResult.error.message);
  }

  // Test 3: Empty string
  console.log("\nTest 3: Empty ISBN");
  const emptyResult = await getBook("");

  if (emptyResult.isOk()) {
    const book = emptyResult.value;
    if (book === null) {
      console.log("✅ Correctly handled: Empty ISBN returned null");
    } else {
      console.log("❌ Unexpected: Empty ISBN returned book data");
    }
  } else {
    console.log("❌ Error:", emptyResult.error.message);
  }

  // Test 4: Multiple ISBNs with mix of valid and invalid
  console.log("\nTest 4: Mixed valid and invalid ISBNs");
  const mixedResult = await getBook([
    "9784101092058", // Valid
    "invalid-isbn", // Invalid
    "9781234567897", // Valid format but non-existent
    "9784062748895", // Valid
  ]);

  if (mixedResult.isOk()) {
    const data = mixedResult.value;
    if (typeof data === "object" && "books" in data) {
      console.log("✅ Mixed ISBN test results:");
      console.log(`   Found books: ${data.books.length}`);
      console.log(`   Not found: ${data.notFound.length}`);
      console.log(`   Not found ISBNs: ${data.notFound.join(", ")}`);
    }
  } else {
    console.log("❌ Error:", mixedResult.error.message);
  }

  // Test 5: Result pattern matching
  console.log("\nTest 5: Result pattern matching");
  const result = await getBook("9784101092058");

  result
    .map((book) => {
      if (book) {
        console.log(`✅ Success: Found "${book.title}" by ${book.author}`);
        return book.title;
      } else {
        console.log("ℹ️  No book found");
        return null;
      }
    })
    .mapErr((error) => {
      console.log(`❌ Error occurred: ${error.message}`);
      return error;
    });

  console.log("\n🎉 Error handling tests completed!");
}

if (import.meta.main) {
  main().catch(console.error);
}
