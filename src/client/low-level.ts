import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import {
  type CoverageResponse,
  CoverageResponseSchema,
  type OpenBDResponse,
  OpenBDResponseSchema,
} from "../types.ts";

/**
 * Low-level API client for OpenBD
 * Provides type-safe, simple calls to the OpenBD API
 * Internal use only - not exposed to end users
 */

const BASE_URL = "https://api.openbd.jp/v1";

export type FetchError = {
  type: "network" | "parse" | "validation";
  message: string;
  cause?: unknown;
};

/**
 * Fetch book data from OpenBD API by ISBN(s)
 * @param isbns - Single ISBN or array of ISBNs
 * @returns Result containing validated response or error
 */
export async function fetchBooksByISBN(
  isbns: string | string[],
): Promise<Result<OpenBDResponse, FetchError>> {
  try {
    const isbnList = Array.isArray(isbns) ? isbns : [isbns];
    const isbnParam = isbnList.join(",");
    const url = `${BASE_URL}/get?isbn=${encodeURIComponent(isbnParam)}`;

    const response = await fetch(url);

    if (!response.ok) {
      return err({
        type: "network",
        message: `HTTP ${response.status}: ${response.statusText}`,
      });
    }

    const data = await response.json();

    // Validate response with Zod schema
    const parseResult = OpenBDResponseSchema.safeParse(data);

    if (!parseResult.success) {
      return err({
        type: "validation",
        message: "Invalid response format from OpenBD API",
        cause: parseResult.error,
      });
    }

    return ok(parseResult.data);
  } catch (error) {
    return err({
      type: "network",
      message: "Failed to fetch data from OpenBD API",
      cause: error,
    });
  }
}

/**
 * Fetch coverage information from OpenBD API
 * @returns Result containing array of ISBNs or error
 */
export async function fetchCoverage(): Promise<
  Result<CoverageResponse, FetchError>
> {
  try {
    const url = `${BASE_URL}/coverage`;
    const response = await fetch(url);

    if (!response.ok) {
      return err({
        type: "network",
        message: `HTTP ${response.status}: ${response.statusText}`,
      });
    }

    const data = await response.json();

    // Validate response with Zod schema
    const parseResult = CoverageResponseSchema.safeParse(data);

    if (!parseResult.success) {
      return err({
        type: "validation",
        message: "Invalid coverage response format from OpenBD API",
        cause: parseResult.error,
      });
    }

    return ok(parseResult.data);
  } catch (error) {
    return err({
      type: "network",
      message: "Failed to fetch coverage data from OpenBD API",
      cause: error,
    });
  }
}
