import { z } from "zod/v4";

// Common types
const TitleTextSchema = z.object({
  content: z.string(),
  collationkey: z.string().optional(),
});

const PersonNameSchema = z.object({
  content: z.string(),
  collationkey: z.string().optional(),
});

// Summary schema (basic book information)
export const SummarySchema = z.object({
  isbn: z.string(),
  title: z.string(),
  volume: z.string(),
  series: z.string(),
  publisher: z.string(),
  pubdate: z.string(),
  cover: z.string(),
  author: z.string(),
});

// ONIX schemas (detailed bibliographic data)
const TitleDetailSchema = z.object({
  TitleType: z.string(),
  TitleElement: z.union([
    z.object({
      TitleElementLevel: z.string(),
      TitleText: TitleTextSchema,
      PartNumber: z.string().optional(),
    }),
    z.array(z.object({
      TitleElementLevel: z.string(),
      TitleText: TitleTextSchema,
      PartNumber: z.string().optional(),
    })),
  ]),
});

const ContributorSchema = z.object({
  SequenceNumber: z.string(),
  ContributorRole: z.array(z.string()),
  PersonName: PersonNameSchema,
});

const CollectionSchema = z.object({
  CollectionType: z.string(),
  TitleDetail: TitleDetailSchema,
});

const DescriptiveDetailSchema = z.object({
  TitleDetail: TitleDetailSchema,
  Contributor: z.array(ContributorSchema).optional(),
  Collection: CollectionSchema.optional(),
  ProductForm: z.string().optional(),
  ProductFormDetail: z.string().optional(),
  PrimaryContentType: z.string().optional(),
  EpubType: z.string().optional(),
  EpubTypeVersion: z.string().optional(),
  Extent: z.array(z.object({
    ExtentType: z.string(),
    ExtentValue: z.string(),
    ExtentUnit: z.string(),
  })).optional(),
  Subject: z.array(z.object({
    SubjectSchemeIdentifier: z.string(),
    SubjectCode: z.string(),
    SubjectHeadingText: z.string().optional(),
  })).optional(),
  Audience: z.array(z.object({
    AudienceCodeType: z.string(),
    AudienceCodeValue: z.string(),
  })).optional(),
});

const TextContentSchema = z.object({
  TextType: z.string(),
  ContentAudience: z.string(),
  Text: z.string(),
});

const CollateralDetailSchema = z.object({
  TextContent: z.array(TextContentSchema).optional(),
  SupportingResource: z.array(z.object({
    ResourceContentType: z.string(),
    ContentAudience: z.string(),
    ResourceMode: z.string(),
    ResourceVersion: z.array(z.object({
      ResourceForm: z.string(),
      ResourceVersionFeature: z.array(z.object({
        ResourceVersionFeatureType: z.string(),
        FeatureValue: z.string(),
      })).optional(),
      ResourceLink: z.string(),
    })),
  })).optional(),
});

const PublishingDetailSchema = z.object({
  Imprint: z.object({
    ImprintIdentifier: z.array(z.object({
      ImprintIDType: z.string(),
      IDValue: z.string(),
    })).optional(),
    ImprintName: z.string(),
  }).optional(),
  Publisher: z.object({
    PublisherIdentifier: z.array(z.object({
      PublisherIDType: z.string(),
      IDValue: z.string(),
    })).optional(),
    PublisherName: z.string(),
  }).optional(),
  PublishingDate: z.array(z.object({
    PublishingDateRole: z.string(),
    Date: z.string(),
  })).optional(),
});

const PriceSchema = z.object({
  PriceType: z.string(),
  PriceAmount: z.string(),
  CurrencyCode: z.string(),
});

const SupplyDetailSchema = z.object({
  Supplier: z.object({
    SupplierRole: z.string(),
    SupplierIdentifier: z.array(z.object({
      SupplierIDType: z.string(),
      IDValue: z.string(),
    })).optional(),
    SupplierName: z.string(),
  }),
  ProductAvailability: z.string(),
  Price: z.array(PriceSchema).optional(),
});

const ProductSupplySchema = z.object({
  SupplyDetail: SupplyDetailSchema,
});

export const OnixSchema = z.object({
  RecordReference: z.string(),
  NotificationType: z.string(),
  ProductIdentifier: z.object({
    ProductIDType: z.string(),
    IDValue: z.string(),
  }),
  DescriptiveDetail: DescriptiveDetailSchema,
  CollateralDetail: CollateralDetailSchema.optional(),
  PublishingDetail: PublishingDetailSchema.optional(),
  ProductSupply: ProductSupplySchema.optional(),
});

// Hanmoto schema (publisher-specific data)
export const HanmotoSchema = z.object({
  datecreated: z.string().optional(),
  datemodified: z.string().optional(),
  datekoukai: z.string().optional(),
  daterelease: z.string().optional(),
  lanove: z.boolean().optional(),
  hastameshiyomi: z.boolean().optional(),
  hastachiyomi: z.boolean().optional(),
  reviews: z.array(z.object({
    post_user: z.string(),
    reviewer: z.string(),
    source_id: z.number(),
    kubun_id: z.number(),
    source: z.string(),
    choyaku: z.string(),
    han: z.string(),
    link: z.string(),
    appearance: z.string(),
    gou: z.string(),
  })).optional(),
  hanmotoinfo: z.object({
    name: z.string(),
    yomi: z.string(),
    url: z.string(),
    twitter: z.string().optional(),
    facebook: z.string().optional(),
  }).optional(),
}).passthrough(); // Allow additional unknown fields

// Main book schema
export const BookSchema = z.object({
  summary: SummarySchema,
  onix: OnixSchema,
  hanmoto: HanmotoSchema.optional(),
});

// API response schema
export const OpenBDResponseSchema = z.array(
  z.union([BookSchema, z.null()]),
);

// TypeScript types derived from schemas
export type Summary = z.infer<typeof SummarySchema>;
export type Onix = z.infer<typeof OnixSchema>;
export type Hanmoto = z.infer<typeof HanmotoSchema>;
export type Book = z.infer<typeof BookSchema>;
export type OpenBDResponse = z.infer<typeof OpenBDResponseSchema>;

// Helper types for common use cases
export type BookInfo = {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publishedDate: string;
  series?: string;
  volume?: string;
  coverUrl?: string;
};

// Type guard functions
export function isValidBook(data: unknown): data is Book {
  return BookSchema.safeParse(data).success;
}

export function isValidResponse(data: unknown): data is OpenBDResponse {
  return OpenBDResponseSchema.safeParse(data).success;
}
