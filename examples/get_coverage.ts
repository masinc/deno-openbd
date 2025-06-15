#!/usr/bin/env -S deno run --allow-net
/**
 * Example: Get coverage information (all available ISBNs)
 * Usage: deno run --allow-net examples/get_coverage.ts
 */

import { getCoverage } from "../mod.ts";

async function main() {
  console.log("📊 Getting OpenBD coverage information...\n");

  const result = await getCoverage();

  if (result.isOk()) {
    const isbns = result.value;

    console.log("✅ Coverage data retrieved!");
    console.log(`📚 Total available ISBNs: ${isbns.length.toLocaleString()}`);

    console.log("\n📖 First 10 ISBNs:");
    isbns.slice(0, 10).forEach((isbn, index) => {
      console.log(`   ${index + 1}. ${isbn}`);
    });

    console.log("\n📖 Last 10 ISBNs:");
    isbns.slice(-10).forEach((isbn, index) => {
      console.log(`   ${isbns.length - 10 + index + 1}. ${isbn}`);
    });

    // Find some Japanese ISBNs (starting with 978-4)
    const japaneseIsbns = isbns.filter((isbn) => isbn.startsWith("9784")).slice(
      0,
      5,
    );
    if (japaneseIsbns.length > 0) {
      console.log("\n🇯🇵 Sample Japanese ISBNs (978-4 prefix):");
      japaneseIsbns.forEach((isbn, index) => {
        console.log(`   ${index + 1}. ${isbn}`);
      });
    }
  } else {
    console.error("❌ Error:", result.error.message);
  }
}

if (import.meta.main) {
  main().catch(console.error);
}
