/**
 * OpenBD API Client Library for Deno
 *
 * A type-safe client library for accessing OpenBD (Open Bibliography Data) API,
 * which provides bibliographic information and book covers for Japanese publications.
 *
 * @module
 */

// Export high-level API functions (user-facing)
export {
  getBook,
  getCoverage,
  type OpenBDClientError,
} from "./src/client/high-level.ts";

// Export types for user convenience
export type {
  Book,
  BookInfo,
  CoverageResponse,
  Hanmoto,
  OnixSchema,
  OpenBDResponse,
  Summary,
} from "./src/types.ts";

// Export schemas for testing
export {
  BookSchema,
  CoverageResponseSchema,
  OpenBDResponseSchema,
} from "./src/types.ts";

// Export type guard functions
export { isValidBook, isValidResponse } from "./src/types.ts";
