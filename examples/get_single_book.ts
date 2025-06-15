#!/usr/bin/env -S deno run --allow-net
/**
 * Example: Get single book information by ISBN
 * Usage: deno run --allow-net examples/get_single_book.ts
 */

import { getBook } from "../mod.ts";

async function main() {
  console.log("📚 Getting single book information...\n");

  const isbn = "9784101092058"; // 新編銀河鉄道の夜
  console.log(`Searching for ISBN: ${isbn}`);

  const result = await getBook(isbn);

  if (result.isOk()) {
    const book = result.value;
    if (book) {
      console.log("✅ Book found!");
      console.log(`📖 Title: ${book.title}`);
      console.log(`✍️  Author: ${book.author}`);
      console.log(`🏢 Publisher: ${book.publisher}`);
      console.log(`📅 Published: ${book.publishedDate}`);
      console.log(`📚 Series: ${book.series || "None"}`);
      console.log(`📄 Pages: ${book.pageCount || "Unknown"}`);

      if (book.description) {
        console.log(`📝 Description: ${book.description.substring(0, 200)}...`);
      }

      if (book.subjects && book.subjects.length > 0) {
        console.log(
          `🏷️  Subjects: ${
            book.subjects.map((s) => s.heading || s.code).join(", ")
          }`,
        );
      }

      if (book.publisherInfo) {
        console.log(`🏢 Publisher Info:`);
        console.log(`   Name: ${book.publisherInfo.name}`);
        console.log(
          `   Has Preview: ${book.publisherInfo.hasPreview ? "Yes" : "No"}`,
        );
        console.log(
          `   Light Novel: ${book.publisherInfo.isLightNovel ? "Yes" : "No"}`,
        );
      }
    } else {
      console.log("❌ Book not found");
    }
  } else {
    console.error("❌ Error:", result.error.message);
  }
}

if (import.meta.main) {
  main().catch(console.error);
}
