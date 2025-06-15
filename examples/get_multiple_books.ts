#!/usr/bin/env -S deno run --allow-net
/**
 * Example: Get multiple books information by ISBNs
 * Usage: deno run --allow-net examples/get_multiple_books.ts
 */

import { getBook } from "../mod.ts";

async function main() {
  console.log("📚 Getting multiple books information...\n");

  const isbns = [
    "9784101092058", // 新編銀河鉄道の夜
    "9784062748895", // 人間失格
    "1234567890123", // Invalid ISBN (for testing)
  ];

  console.log(`Searching for ${isbns.length} ISBNs:`);
  isbns.forEach((isbn, i) => console.log(`  ${i + 1}. ${isbn}`));
  console.log();

  const result = await getBook(isbns);

  if (result.isOk()) {
    const data = result.value;
    if (typeof data === "object" && "books" in data) {
      console.log(`✅ Found ${data.books.length} books:`);

      data.books.forEach((book, index) => {
        console.log(`\n📖 Book ${index + 1}:`);
        console.log(`   Title: ${book.title}`);
        console.log(`   Author: ${book.author}`);
        console.log(`   Publisher: ${book.publisher}`);
        console.log(`   ISBN: ${book.isbn}`);
        console.log(`   Published: ${book.publishedDate}`);
      });

      if (data.notFound.length > 0) {
        console.log(`\n❌ Not found (${data.notFound.length} ISBNs):`);
        data.notFound.forEach((isbn, index) => {
          console.log(`   ${index + 1}. ${isbn}`);
        });
      }
    }
  } else {
    console.error("❌ Error:", result.error.message);
  }
}

if (import.meta.main) {
  main().catch(console.error);
}
