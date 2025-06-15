import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import {
  fetchBooksByISBN,
  fetchCoverage,
  type FetchError,
} from "./low-level.ts";
import type { Book, BookInfo, CoverageResponse } from "../types.ts";

/**
 * High-level API client for OpenBD
 * Provides user-friendly interface with convenience methods
 * This is what users will interact with
 */

export type OpenBDClientError = FetchError | {
  type: "not_found";
  message: string;
  isbn: string;
};

// Helper function to convert Book to BookInfo
function bookToBookInfo(book: Book): BookInfo {
  const onix = book.onix;
  const summary = book.summary;
  const hanmoto = book.hanmoto;

  return {
    // Basic identification
    isbn: summary.isbn,
    title: summary.title,

    // Author and contributor information
    author: summary.author,
    contributors: onix.DescriptiveDetail.Contributor?.map((c) => ({
      name: c.PersonName.content,
      role: c.ContributorRole,
      sequenceNumber: c.SequenceNumber,
    })),

    // Publication information
    publisher: summary.publisher,
    publishedDate: summary.pubdate,
    imprint: onix.PublishingDetail?.Imprint?.ImprintName,

    // Series and volume
    series: summary.series || undefined,
    volume: summary.volume || undefined,

    // Physical attributes
    productForm: onix.DescriptiveDetail.ProductForm,
    pageCount: onix.DescriptiveDetail.Extent?.find((e) => e.ExtentType === "00")
        ?.ExtentValue
      ? parseInt(
        onix.DescriptiveDetail.Extent.find((e) => e.ExtentType === "00")!
          .ExtentValue,
      )
      : undefined,

    // Identifiers and URLs
    coverUrl: summary.cover || undefined,

    // Content information
    description: onix.CollateralDetail?.TextContent?.find((t) =>
      t.TextType === "04"
    )?.Text,
    subjects: onix.DescriptiveDetail.Subject?.map((s) => ({
      code: s.SubjectCode,
      scheme: s.SubjectSchemeIdentifier,
      heading: s.SubjectHeadingText,
    })),

    // Availability and pricing
    availability: onix.ProductSupply?.SupplyDetail.ProductAvailability,
    price: onix.ProductSupply?.SupplyDetail.Price?.map((p) => ({
      amount: p.PriceAmount,
      currency: p.CurrencyCode,
      type: p.PriceType,
    })),

    // Publisher-specific data (from hanmoto)
    publisherInfo: hanmoto
      ? {
        name: hanmoto.hanmotoinfo?.name || summary.publisher,
        url: hanmoto.hanmotoinfo?.url,
        hasPreview: hanmoto.hastameshiyomi || hanmoto.hastachiyomi,
        isLightNovel: hanmoto.lanove,
      }
      : undefined,
  };
}

// Overloaded function signatures
export function getBook(
  isbn: string,
): Promise<Result<BookInfo | null, OpenBDClientError>>;
export function getBook(
  isbns: string[],
): Promise<
  Result<{ books: BookInfo[]; notFound: string[] }, OpenBDClientError>
>;

/**
 * Get book information by ISBN(s)
 * @param isbns - Single ISBN string or array of ISBNs
 * @returns Result containing book info or books array with not found ISBNs
 */
export async function getBook(
  isbns: string | string[],
): Promise<
  Result<
    BookInfo | null | { books: BookInfo[]; notFound: string[] },
    OpenBDClientError
  >
> {
  const isArray = Array.isArray(isbns);
  const isbnArray = isArray ? isbns : [isbns];

  const result = await fetchBooksByISBN(isbnArray);

  if (result.isErr()) {
    return err(result.error);
  }

  const response = result.value;

  if (!isArray) {
    // Single ISBN case
    const book = response[0];
    if (book === null) {
      return ok(null);
    }
    return ok(bookToBookInfo(book));
  } else {
    // Multiple ISBNs case
    const books: BookInfo[] = [];
    const notFound: string[] = [];

    response.forEach((book, index) => {
      if (book === null) {
        notFound.push(isbnArray[index]);
      } else {
        books.push(bookToBookInfo(book));
      }
    });

    return ok({ books, notFound });
  }
}

/**
 * Get list of all available ISBNs in OpenBD database
 * @returns Result containing array of ISBNs or error
 */
export async function getCoverage(): Promise<
  Result<CoverageResponse, OpenBDClientError>
> {
  const result = await fetchCoverage();

  if (result.isErr()) {
    return err(result.error);
  }

  return ok(result.value);
}
