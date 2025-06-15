import { assertEquals } from "@std/assert";
import { assertSpyCall, stub } from "@std/testing/mock";
import { fetchBooksByISBN, fetchCoverage } from "./low-level.ts";

// Mock data for testing
const mockBookResponse = [
  {
    summary: {
      isbn: "9784101092058",
      title: "新編銀河鉄道の夜",
      volume: "",
      series: "",
      publisher: "新潮社",
      pubdate: "2012-04",
      cover: "https://cover.openbd.jp/9784101092058.jpg",
      author: "宮沢賢治/著 宮川健郎/編",
    },
    onix: {
      RecordReference: "9784101092058",
      NotificationType: "03",
      ProductIdentifier: {
        ProductIDType: "15",
        IDValue: "9784101092058",
      },
      DescriptiveDetail: {
        TitleDetail: {
          TitleType: "01",
          TitleElement: {
            TitleElementLevel: "01",
            TitleText: {
              content: "新編銀河鉄道の夜",
            },
          },
        },
      },
    },
  },
  null, // Test null response for non-existent book
];

const mockCoverageResponse = [
  "9784101092058",
  "9784062748895",
  "9784101092065",
];

Deno.test("fetchBooksByISBN - single ISBN success", async () => {
  // Mock fetch to return successful response
  const fetchStub = stub(
    globalThis,
    "fetch",
    () =>
      Promise.resolve(new Response(JSON.stringify([mockBookResponse[0]]), {
        status: 200,
        headers: { "content-type": "application/json" },
      })),
  );

  try {
    const result = await fetchBooksByISBN("9784101092058");

    // Verify fetch was called with correct URL
    assertSpyCall(fetchStub, 0, {
      args: ["https://api.openbd.jp/v1/get?isbn=9784101092058"],
    });

    // Verify successful result
    assertEquals(result.isOk(), true);
    if (result.isOk()) {
      assertEquals(result.value.length, 1);
      assertEquals(result.value[0]?.summary.isbn, "9784101092058");
      assertEquals(result.value[0]?.summary.title, "新編銀河鉄道の夜");
    }
  } finally {
    fetchStub.restore();
  }
});

Deno.test("fetchBooksByISBN - multiple ISBNs success", async () => {
  const fetchStub = stub(
    globalThis,
    "fetch",
    () =>
      Promise.resolve(new Response(JSON.stringify(mockBookResponse), {
        status: 200,
        headers: { "content-type": "application/json" },
      })),
  );

  try {
    const result = await fetchBooksByISBN([
      "9784101092058",
      "invalid-isbn",
    ]);

    // Verify fetch was called with comma-separated ISBNs
    assertSpyCall(fetchStub, 0, {
      args: [
        "https://api.openbd.jp/v1/get?isbn=9784101092058%2Cinvalid-isbn",
      ],
    });

    assertEquals(result.isOk(), true);
    if (result.isOk()) {
      assertEquals(result.value.length, 2);
      assertEquals(result.value[0]?.summary.isbn, "9784101092058");
      assertEquals(result.value[1], null); // Invalid ISBN returns null
    }
  } finally {
    fetchStub.restore();
  }
});

Deno.test("fetchBooksByISBN - network error", async () => {
  const fetchStub = stub(
    globalThis,
    "fetch",
    () => {
      return Promise.reject(new Error("Network error"));
    },
  );

  try {
    const result = await fetchBooksByISBN("9784101092058");

    assertEquals(result.isErr(), true);
    if (result.isErr()) {
      assertEquals(result.error.type, "network");
      assertEquals(
        result.error.message,
        "Failed to fetch data from OpenBD API",
      );
    }
  } finally {
    fetchStub.restore();
  }
});

Deno.test("fetchBooksByISBN - HTTP error", async () => {
  const fetchStub = stub(
    globalThis,
    "fetch",
    () =>
      Promise.resolve(new Response("Not Found", {
        status: 404,
        statusText: "Not Found",
      })),
  );

  try {
    const result = await fetchBooksByISBN("9784101092058");

    assertEquals(result.isErr(), true);
    if (result.isErr()) {
      assertEquals(result.error.type, "network");
      assertEquals(result.error.message, "HTTP 404: Not Found");
    }
  } finally {
    fetchStub.restore();
  }
});

Deno.test("fetchBooksByISBN - invalid JSON response", async () => {
  const fetchStub = stub(
    globalThis,
    "fetch",
    () =>
      Promise.resolve(new Response("invalid json", {
        status: 200,
        headers: { "content-type": "application/json" },
      })),
  );

  try {
    const result = await fetchBooksByISBN("9784101092058");

    assertEquals(result.isErr(), true);
    if (result.isErr()) {
      assertEquals(result.error.type, "network");
    }
  } finally {
    fetchStub.restore();
  }
});

Deno.test("fetchBooksByISBN - schema validation error", async () => {
  const invalidResponse = [{ invalid: "data" }];
  const fetchStub = stub(
    globalThis,
    "fetch",
    () =>
      Promise.resolve(new Response(JSON.stringify(invalidResponse), {
        status: 200,
        headers: { "content-type": "application/json" },
      })),
  );

  try {
    const result = await fetchBooksByISBN("9784101092058");

    assertEquals(result.isErr(), true);
    if (result.isErr()) {
      assertEquals(result.error.type, "validation");
      assertEquals(
        result.error.message,
        "Invalid response format from OpenBD API",
      );
    }
  } finally {
    fetchStub.restore();
  }
});

Deno.test("fetchCoverage - success", async () => {
  const fetchStub = stub(
    globalThis,
    "fetch",
    () =>
      Promise.resolve(new Response(JSON.stringify(mockCoverageResponse), {
        status: 200,
        headers: { "content-type": "application/json" },
      })),
  );

  try {
    const result = await fetchCoverage();

    assertSpyCall(fetchStub, 0, {
      args: ["https://api.openbd.jp/v1/coverage"],
    });

    assertEquals(result.isOk(), true);
    if (result.isOk()) {
      assertEquals(result.value.length, 3);
      assertEquals(result.value[0], "9784101092058");
    }
  } finally {
    fetchStub.restore();
  }
});

Deno.test("fetchCoverage - error", async () => {
  const fetchStub = stub(
    globalThis,
    "fetch",
    () =>
      Promise.resolve(new Response("Internal Server Error", {
        status: 500,
        statusText: "Internal Server Error",
      })),
  );

  try {
    const result = await fetchCoverage();

    assertEquals(result.isErr(), true);
    if (result.isErr()) {
      assertEquals(result.error.type, "network");
      assertEquals(result.error.message, "HTTP 500: Internal Server Error");
    }
  } finally {
    fetchStub.restore();
  }
});
