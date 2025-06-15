import { assertEquals } from "@std/assert";
import {
  BookSchema,
  CoverageResponseSchema,
  HanmotoSchema,
  OnixSchema,
  OpenBDResponseSchema,
  SummarySchema,
  isValidBook,
  isValidResponse,
  type Book,
  type BookInfo,
  type CoverageResponse,
  type Hanmoto,
  type Onix,
  type OpenBDResponse,
  type Summary,
} from "./types.ts";

// Test Summary schema
Deno.test("SummarySchema validation", () => {
  const validSummary = {
    isbn: "9784101092058",
    title: "新編銀河鉄道の夜",
    volume: "",
    series: "新潮文庫",
    publisher: "新潮社",
    pubdate: "2012-04",
    cover: "https://cover.openbd.jp/9784101092058.jpg",
    author: "宮沢賢治/著 宮川健郎/編",
  };

  const result = SummarySchema.safeParse(validSummary);
  assertEquals(result.success, true);

  if (result.success) {
    assertEquals(result.data.isbn, "9784101092058");
    assertEquals(result.data.title, "新編銀河鉄道の夜");
    assertEquals(result.data.publisher, "新潮社");
  }

  // Test invalid summary (missing required field)
  const invalidSummary = {
    isbn: "9784101092058",
    // title missing
    volume: "",
    series: "",
    publisher: "新潮社",
    pubdate: "2012-04",
    cover: "",
    author: "",
  };

  const invalidResult = SummarySchema.safeParse(invalidSummary);
  assertEquals(invalidResult.success, false);
});

// Test Hanmoto schema
Deno.test("HanmotoSchema validation", () => {
  const validHanmoto = {
    datecreated: "2020-01-01",
    datemodified: "2020-01-02",
    datekoukai: "2020-01-03",
    daterelease: "2020-01-04",
    dateshuppan: "2020-01-05",
    lanove: false,
    hastameshiyomi: true,
    hastachiyomi: false,
    reviews: [
      {
        post_user: "user1",
        reviewer: "reviewer1",
        source_id: 1,
        kubun_id: 2,
        source: "source1",
        choyukan: "評価1",
        han: "判定1",
        link: "https://example.com/review1",
        appearance: "掲載1",
        gou: "号1",
      },
    ],
    hanmotoinfo: {
      name: "出版社名",
      yomi: "しゅっぱんしゃめい",
      url: "https://publisher.example.com",
      twitter: "@publisher",
      facebook: "publisher",
    },
    // Additional fields should be allowed due to passthrough()
    extraField: "This should be allowed",
  };

  const result = HanmotoSchema.safeParse(validHanmoto);
  assertEquals(result.success, true);

  if (result.success) {
    assertEquals(result.data.lanove, false);
    assertEquals(result.data.hastameshiyomi, true);
    assertEquals(result.data.reviews?.[0].source_id, 1);
    assertEquals(result.data.hanmotoinfo?.name, "出版社名");
    // @ts-ignore: extraField is allowed by passthrough
    assertEquals(result.data.extraField, "This should be allowed");
  }

  // Test minimal valid hanmoto (all fields optional)
  const minimalHanmoto = {};
  const minimalResult = HanmotoSchema.safeParse(minimalHanmoto);
  assertEquals(minimalResult.success, true);
});

// Test ONIX schema
Deno.test("OnixSchema validation", () => {
  const validOnix = {
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
  };

  const result = OnixSchema.safeParse(validOnix);
  assertEquals(result.success, true);

  if (result.success) {
    assertEquals(result.data.RecordReference, "9784101092058");
    assertEquals(result.data.ProductIdentifier.IDValue, "9784101092058");
  }

  // Test invalid ONIX (missing required nested field)
  const invalidOnix = {
    RecordReference: "9784101092058",
    NotificationType: "03",
    ProductIdentifier: {
      ProductIDType: "15",
      // IDValue missing
    },
    DescriptiveDetail: {
      TitleDetail: {
        TitleType: "01",
        TitleElement: {
          TitleElementLevel: "01",
          TitleText: {
            content: "Title",
          },
        },
      },
    },
  };

  const invalidResult = OnixSchema.safeParse(invalidOnix);
  assertEquals(invalidResult.success, false);
});

// Test Book schema
Deno.test("BookSchema validation", () => {
  const validBook = {
    summary: {
      isbn: "9784101092058",
      title: "新編銀河鉄道の夜",
      volume: "",
      series: "",
      publisher: "新潮社",
      pubdate: "2012-04",
      cover: "",
      author: "",
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
    hanmoto: {
      lanove: false,
    },
  };

  const result = BookSchema.safeParse(validBook);
  assertEquals(result.success, true);

  // Test without optional hanmoto
  const bookWithoutHanmoto = {
    summary: validBook.summary,
    onix: validBook.onix,
  };

  const resultWithoutHanmoto = BookSchema.safeParse(bookWithoutHanmoto);
  assertEquals(resultWithoutHanmoto.success, true);
});

// Test OpenBDResponse schema
Deno.test("OpenBDResponseSchema validation", () => {
  const validBook = {
    summary: {
      isbn: "9784101092058",
      title: "Test",
      volume: "",
      series: "",
      publisher: "Test",
      pubdate: "2023",
      cover: "",
      author: "",
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
              content: "Test",
            },
          },
        },
      },
    },
  };

  // Test with book and null (typical response)
  const validResponse = [validBook, null];
  const result = OpenBDResponseSchema.safeParse(validResponse);
  assertEquals(result.success, true);

  // Test empty response
  const emptyResponse: unknown[] = [];
  const emptyResult = OpenBDResponseSchema.safeParse(emptyResponse);
  assertEquals(emptyResult.success, true);

  // Test all nulls
  const nullResponse = [null, null, null];
  const nullResult = OpenBDResponseSchema.safeParse(nullResponse);
  assertEquals(nullResult.success, true);

  // Test invalid response (non-array)
  const invalidResponse = { not: "array" };
  const invalidResult = OpenBDResponseSchema.safeParse(invalidResponse);
  assertEquals(invalidResult.success, false);
});

// Test CoverageResponse schema
Deno.test("CoverageResponseSchema validation", () => {
  const validCoverage = ["9784101092058", "9784062748895", "9784101092065"];
  const result = CoverageResponseSchema.safeParse(validCoverage);
  assertEquals(result.success, true);

  // Test empty coverage
  const emptyCoverage: string[] = [];
  const emptyResult = CoverageResponseSchema.safeParse(emptyCoverage);
  assertEquals(emptyResult.success, true);

  // Test invalid coverage (numbers instead of strings)
  const invalidCoverage = [123, 456];
  const invalidResult = CoverageResponseSchema.safeParse(invalidCoverage);
  assertEquals(invalidResult.success, false);
});

// Test type guard functions
Deno.test("Type guard functions", () => {
  const validBook = {
    summary: {
      isbn: "9784101092058",
      title: "Test",
      volume: "",
      series: "",
      publisher: "Test",
      pubdate: "2023",
      cover: "",
      author: "",
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
              content: "Test",
            },
          },
        },
      },
    },
  };

  // Test isValidBook
  assertEquals(isValidBook(validBook), true);
  assertEquals(isValidBook(null), false);
  assertEquals(isValidBook({}), false);
  assertEquals(isValidBook("not a book"), false);

  // Test isValidResponse
  const validResponse = [validBook, null];
  assertEquals(isValidResponse(validResponse), true);
  assertEquals(isValidResponse([]), true);
  assertEquals(isValidResponse(null), false);
  assertEquals(isValidResponse("not array"), false);
  assertEquals(isValidResponse([1, 2, 3]), false);
});

// Test TypeScript type inference
Deno.test("TypeScript type inference", () => {
  // Test that TypeScript types can be used correctly
  const summary: Summary = {
    isbn: "9784101092058",
    title: "Test Title",
    volume: "",
    series: "",
    publisher: "Test Publisher",
    pubdate: "2023",
    cover: "",
    author: "Test Author",
  };

  assertEquals(summary.isbn, "9784101092058");
  assertEquals(summary.title, "Test Title");

  const bookInfo: BookInfo = {
    isbn: "9784101092058",
    title: "Test Book",
    author: "Test Author", 
    publisher: "Test Publisher",
    publishedDate: "2023-01-01",
  };

  assertEquals(bookInfo.isbn, "9784101092058");
  assertEquals(bookInfo.title, "Test Book");

  // Test optional fields
  bookInfo.series = "Test Series";
  bookInfo.pageCount = 200;
  assertEquals(bookInfo.series, "Test Series");
  assertEquals(bookInfo.pageCount, 200);
});

// Test complex nested validation
Deno.test("Complex nested structure validation", () => {
  const complexOnix = {
    RecordReference: "9784101092058",
    NotificationType: "03",
    ProductIdentifier: {
      ProductIDType: "15",
      IDValue: "9784101092058",
    },
    DescriptiveDetail: {
      TitleDetail: {
        TitleType: "01",
        TitleElement: [
          {
            TitleElementLevel: "01",
            TitleText: {
              content: "Main Title",
              collationkey: "main title",
            },
            PartNumber: "1",
          },
          {
            TitleElementLevel: "02",
            TitleText: {
              content: "Subtitle",
            },
          },
        ],
      },
      Contributor: [
        {
          SequenceNumber: "1",
          ContributorRole: ["A01"],
          PersonName: {
            content: "Author Name",
            collationkey: "author name",
          },
        },
      ],
      ProductForm: "BC",
      Extent: [
        {
          ExtentType: "00",
          ExtentValue: "234",
          ExtentUnit: "03",
        },
      ],
      Subject: [
        {
          SubjectSchemeIdentifier: "20",
          SubjectCode: "910",
          SubjectHeadingText: "Japanese Literature",
        },
      ],
    },
  };

  const result = OnixSchema.safeParse(complexOnix);
  assertEquals(result.success, true);

  if (result.success) {
    const titleElements = result.data.DescriptiveDetail.TitleElement;
    if (Array.isArray(titleElements)) {
      assertEquals(titleElements.length, 2);
      assertEquals(titleElements[0].TitleText.content, "Main Title");
    }
  }
});