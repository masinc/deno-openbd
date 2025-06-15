import { z } from "zod/v4";

// Common types
const TitleTextSchema: z.ZodObject<{
  content: z.ZodString;
  collationkey: z.ZodOptional<z.ZodString>;
}> = z.object({
  content: z.string(),
  collationkey: z.string().optional(),
});

const PersonNameSchema: z.ZodObject<{
  content: z.ZodString;
  collationkey: z.ZodOptional<z.ZodString>;
}> = z.object({
  content: z.string(),
  collationkey: z.string().optional(),
});

// Summary schema (basic book information)
export const SummarySchema: z.ZodObject<{
  isbn: z.ZodString;
  title: z.ZodString;
  volume: z.ZodString;
  series: z.ZodString;
  publisher: z.ZodString;
  pubdate: z.ZodString;
  cover: z.ZodString;
  author: z.ZodString;
}> = z.object({
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
const TitleDetailSchema: z.ZodObject<{
  TitleType: z.ZodString;
  TitleElement: z.ZodUnion<[
    z.ZodObject<{
      TitleElementLevel: z.ZodString;
      TitleText: typeof TitleTextSchema;
      PartNumber: z.ZodOptional<z.ZodString>;
    }>,
    z.ZodArray<
      z.ZodObject<{
        TitleElementLevel: z.ZodString;
        TitleText: typeof TitleTextSchema;
        PartNumber: z.ZodOptional<z.ZodString>;
      }>
    >,
  ]>;
}> = z.object({
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

const ContributorSchema: z.ZodObject<{
  SequenceNumber: z.ZodString;
  ContributorRole: z.ZodArray<z.ZodString>;
  PersonName: typeof PersonNameSchema;
}> = z.object({
  SequenceNumber: z.string(),
  ContributorRole: z.array(z.string()),
  PersonName: PersonNameSchema,
});

const CollectionSchema: z.ZodObject<{
  CollectionType: z.ZodString;
  TitleDetail: typeof TitleDetailSchema;
}> = z.object({
  CollectionType: z.string(),
  TitleDetail: TitleDetailSchema,
});

const DescriptiveDetailSchema: z.ZodObject<{
  TitleDetail: typeof TitleDetailSchema;
  Contributor: z.ZodOptional<z.ZodArray<typeof ContributorSchema>>;
  Collection: z.ZodOptional<typeof CollectionSchema>;
  ProductForm: z.ZodOptional<z.ZodString>;
  ProductFormDetail: z.ZodOptional<z.ZodString>;
  PrimaryContentType: z.ZodOptional<z.ZodString>;
  EpubType: z.ZodOptional<z.ZodString>;
  EpubTypeVersion: z.ZodOptional<z.ZodString>;
  Extent: z.ZodOptional<
    z.ZodArray<
      z.ZodObject<{
        ExtentType: z.ZodString;
        ExtentValue: z.ZodString;
        ExtentUnit: z.ZodString;
      }>
    >
  >;
  Subject: z.ZodOptional<
    z.ZodArray<
      z.ZodObject<{
        SubjectSchemeIdentifier: z.ZodString;
        SubjectCode: z.ZodString;
        SubjectHeadingText: z.ZodOptional<z.ZodString>;
      }>
    >
  >;
  Audience: z.ZodOptional<
    z.ZodArray<
      z.ZodObject<{
        AudienceCodeType: z.ZodString;
        AudienceCodeValue: z.ZodString;
      }>
    >
  >;
}> = z.object({
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

const TextContentSchema: z.ZodObject<{
  TextType: z.ZodString;
  ContentAudience: z.ZodString;
  Text: z.ZodString;
}> = z.object({
  TextType: z.string(),
  ContentAudience: z.string(),
  Text: z.string(),
});

const CollateralDetailSchema: z.ZodObject<{
  TextContent: z.ZodOptional<z.ZodArray<typeof TextContentSchema>>;
  SupportingResource: z.ZodOptional<
    z.ZodArray<
      z.ZodObject<{
        ResourceContentType: z.ZodString;
        ContentAudience: z.ZodString;
        ResourceMode: z.ZodString;
        ResourceVersion: z.ZodArray<
          z.ZodObject<{
            ResourceForm: z.ZodString;
            ResourceVersionFeature: z.ZodOptional<
              z.ZodArray<
                z.ZodObject<{
                  ResourceVersionFeatureType: z.ZodString;
                  FeatureValue: z.ZodString;
                }>
              >
            >;
            ResourceLink: z.ZodString;
          }>
        >;
      }>
    >
  >;
}> = z.object({
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

const PublishingDetailSchema: z.ZodObject<{
  Imprint: z.ZodOptional<
    z.ZodObject<{
      ImprintIdentifier: z.ZodOptional<
        z.ZodArray<
          z.ZodObject<{
            ImprintIDType: z.ZodString;
            IDValue: z.ZodString;
          }>
        >
      >;
      ImprintName: z.ZodString;
    }>
  >;
  Publisher: z.ZodOptional<
    z.ZodObject<{
      PublisherIdentifier: z.ZodOptional<
        z.ZodArray<
          z.ZodObject<{
            PublisherIDType: z.ZodString;
            IDValue: z.ZodString;
          }>
        >
      >;
      PublisherName: z.ZodString;
    }>
  >;
  PublishingDate: z.ZodOptional<
    z.ZodArray<
      z.ZodObject<{
        PublishingDateRole: z.ZodString;
        Date: z.ZodString;
      }>
    >
  >;
}> = z.object({
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

const PriceSchema: z.ZodObject<{
  PriceType: z.ZodString;
  PriceAmount: z.ZodString;
  CurrencyCode: z.ZodString;
}> = z.object({
  PriceType: z.string(),
  PriceAmount: z.string(),
  CurrencyCode: z.string(),
});

const SupplyDetailSchema: z.ZodObject<{
  Supplier: z.ZodOptional<
    z.ZodObject<{
      SupplierRole: z.ZodString;
      SupplierIdentifier: z.ZodOptional<
        z.ZodArray<
          z.ZodObject<{
            SupplierIDType: z.ZodString;
            IDValue: z.ZodString;
          }>
        >
      >;
      SupplierName: z.ZodString;
    }>
  >;
  ProductAvailability: z.ZodString;
  Price: z.ZodOptional<z.ZodArray<typeof PriceSchema>>;
}> = z.object({
  Supplier: z.object({
    SupplierRole: z.string(),
    SupplierIdentifier: z.array(z.object({
      SupplierIDType: z.string(),
      IDValue: z.string(),
    })).optional(),
    SupplierName: z.string(),
  }).optional(),
  ProductAvailability: z.string(),
  Price: z.array(PriceSchema).optional(),
});

const ProductSupplySchema: z.ZodObject<{
  SupplyDetail: typeof SupplyDetailSchema;
}> = z.object({
  SupplyDetail: SupplyDetailSchema,
});

export const OnixSchema: z.ZodObject<{
  RecordReference: z.ZodString;
  NotificationType: z.ZodString;
  ProductIdentifier: z.ZodObject<{
    ProductIDType: z.ZodString;
    IDValue: z.ZodString;
  }>;
  DescriptiveDetail: typeof DescriptiveDetailSchema;
  CollateralDetail: z.ZodOptional<typeof CollateralDetailSchema>;
  PublishingDetail: z.ZodOptional<typeof PublishingDetailSchema>;
  ProductSupply: z.ZodOptional<typeof ProductSupplySchema>;
}> = z.object({
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
export const HanmotoSchema: z.ZodObject<{
  datecreated: z.ZodOptional<z.ZodString>;
  datemodified: z.ZodOptional<z.ZodString>;
  datekoukai: z.ZodOptional<z.ZodString>;
  daterelease: z.ZodOptional<z.ZodString>;
  dateshuppan: z.ZodOptional<z.ZodString>;
  lanove: z.ZodOptional<z.ZodBoolean>;
  hastameshiyomi: z.ZodOptional<z.ZodBoolean>;
  hastachiyomi: z.ZodOptional<z.ZodBoolean>;
  reviews: z.ZodOptional<
    z.ZodArray<
      z.ZodObject<{
        post_user: z.ZodString;
        reviewer: z.ZodString;
        source_id: z.ZodNumber;
        kubun_id: z.ZodNumber;
        source: z.ZodString;
        choyukan: z.ZodString;
        han: z.ZodString;
        link: z.ZodString;
        appearance: z.ZodString;
        gou: z.ZodString;
      }>
    >
  >;
  hanmotoinfo: z.ZodOptional<
    z.ZodObject<{
      name: z.ZodString;
      yomi: z.ZodString;
      url: z.ZodString;
      twitter: z.ZodOptional<z.ZodString>;
      facebook: z.ZodOptional<z.ZodString>;
    }>
  >;
}> = z.object({
  datecreated: z.string().optional(),
  datemodified: z.string().optional(),
  datekoukai: z.string().optional(),
  daterelease: z.string().optional(),
  dateshuppan: z.string().optional(),
  lanove: z.boolean().optional(),
  hastameshiyomi: z.boolean().optional(),
  hastachiyomi: z.boolean().optional(),
  reviews: z.array(z.object({
    post_user: z.string(),
    reviewer: z.string(),
    source_id: z.number(),
    kubun_id: z.number(),
    source: z.string(),
    choyukan: z.string(),
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
export const BookSchema: z.ZodObject<{
  summary: typeof SummarySchema;
  onix: typeof OnixSchema;
  hanmoto: z.ZodOptional<typeof HanmotoSchema>;
}> = z.object({
  summary: SummarySchema,
  onix: OnixSchema,
  hanmoto: HanmotoSchema.optional(),
});

// API response schema
export const OpenBDResponseSchema: z.ZodArray<
  z.ZodUnion<[
    typeof BookSchema,
    z.ZodNull,
  ]>
> = z.array(
  z.union([BookSchema, z.null()]),
);

// Coverage response schema
export const CoverageResponseSchema: z.ZodArray<z.ZodString> = z.array(
  z.string(),
);

// TypeScript types derived from schemas
export type Summary = z.infer<typeof SummarySchema>;
export type Onix = z.infer<typeof OnixSchema>;
export type Hanmoto = z.infer<typeof HanmotoSchema>;
export type Book = z.infer<typeof BookSchema>;
export type OpenBDResponse = z.infer<typeof OpenBDResponseSchema>;
export type CoverageResponse = z.infer<typeof CoverageResponseSchema>;

// Helper types for common use cases
export type BookInfo = {
  // Basic identification
  isbn: string;
  title: string;

  // Author and contributor information
  author: string;
  contributors?: Array<{
    name: string;
    role: string[];
    sequenceNumber: string;
  }>;

  // Publication information
  publisher: string;
  publishedDate: string;
  imprint?: string;

  // Series and volume
  series?: string;
  volume?: string;

  // Physical attributes
  productForm?: string;
  pageCount?: number;

  // Identifiers and URLs
  coverUrl?: string;

  // Content information
  description?: string;
  subjects?: Array<{
    code: string;
    scheme: string;
    heading?: string;
  }>;

  // Availability and pricing
  availability?: string;
  price?: Array<{
    amount: string;
    currency: string;
    type: string;
  }>;

  // Publisher-specific data (from hanmoto)
  publisherInfo?: {
    name: string;
    url?: string;
    hasPreview?: boolean;
    isLightNovel?: boolean;
  };
};

// Type guard functions
export function isValidBook(data: unknown): data is Book {
  return BookSchema.safeParse(data).success;
}

export function isValidResponse(data: unknown): data is OpenBDResponse {
  return OpenBDResponseSchema.safeParse(data).success;
}
