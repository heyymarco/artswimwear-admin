// zod:
import {
    z,
}                           from 'zod'

// models:
import {
    type ProductVisibility,
    type VariantVisibility,
}                           from '@prisma/client'
import {
    type VariantDetail,
    type VariantGroupDetail,
    type StockDetail,
    type ProductDetail,
    type ProductUpdateRequest,
    type CategoryPreview,
    type CategoryDetail,
    type CategoryUpdateRequest,
}                           from './types'
import {
    ModelIdSchema,
    ModelNameSchema,
    ImageUrlSchema,
    SlugSchema,
    NonNegativeCurrencyAmountSchema,
    NonNegativeWeightSchema,
    QuantitySchema,
    JsonSchema,
    
    MutationArgsSchema,
}                           from '../commons'



// schemas:
export const ProductVisibilitySchema = z.enum([
    'PUBLISHED',
    'HIDDEN',
    'DRAFT',
]) satisfies z.Schema<ProductVisibility>;



export const VariantVisibilitySchema = z.enum([
    'PUBLISHED',
    'DRAFT',
]) satisfies z.Schema<VariantVisibility>;



export const VariantDetailSchema = z.object({
    // records:
    id                 : ModelIdSchema,
    
    
    
    // data:
    visibility         : VariantVisibilitySchema,
    sort               : z.number().int().finite(),
    
    name               : ModelNameSchema,
    
    price              : NonNegativeCurrencyAmountSchema.nullable(),
    shippingWeight     : NonNegativeWeightSchema.nullable(),
    
    images             : z.array(ImageUrlSchema),
}) satisfies z.Schema<VariantDetail>;



export const VariantGroupDetailSchema = z.object({
    // records:
    id                 : ModelIdSchema,
    
    
    
    // data:
    sort               : z.number().int().finite(),
    
    name               : ModelNameSchema,
    hasDedicatedStocks : z.boolean(),
    
    variants           : z.array(VariantDetailSchema),
}) satisfies z.Schema<VariantGroupDetail>;



export const StockDetailSchema = z.object({
    // records:
    id                 : ModelIdSchema,
    
    
    
    // data:
    value              : QuantitySchema.nullable(),
    
    
    
    // relations:
    variantIds         : z.array(ModelIdSchema),
}) satisfies z.Schema<StockDetail>;



export const ProductDetailSchema = z.object({
    // records:
    id                 : ModelIdSchema,
    
    
    
    // data:
    visibility         : ProductVisibilitySchema,
    
    name               : ModelNameSchema,
    
    price              : NonNegativeCurrencyAmountSchema,
    shippingWeight     : NonNegativeWeightSchema.nullable(),
    
    stock              : QuantitySchema.nullable(),
    
    path               : SlugSchema,
    
    excerpt            : z.string().trim().min(1).max(200).nullable(),
    description        : JsonSchema.nullable(),
    
    images             : z.array(ImageUrlSchema),
    
    variantGroups      : z.array(VariantGroupDetailSchema),
    stocks             : z.array(StockDetailSchema),
}) satisfies z.Schema<ProductDetail>;

export const ProductUpdateRequestSchema = MutationArgsSchema<Omit<ProductDetail, 'stocks'> & { stocks?: StockDetail['value'][] }>(
    ProductDetailSchema.omit({ stocks: true })
    .merge(
        z.object({
            stocks : z.array(StockDetailSchema.shape.value).optional(),
        }) satisfies z.Schema<{ stocks?: StockDetail['value'][] }>
    )
) satisfies z.Schema<ProductUpdateRequest>;



export const CategoryPreviewSchema : z.ZodType<CategoryPreview> = z.object({
    // records:
    id                 : ModelIdSchema,
    
    
    
    // data:
    visibility         : ProductVisibilitySchema,
    
    name               : ModelNameSchema,
    
    image              : ImageUrlSchema.nullable(),
    
    subcategories      : z.lazy(() => z.array(CategoryPreviewSchema)),
}) satisfies z.Schema<CategoryPreview>;

export const CategoryDetailSchema : z.ZodType<CategoryDetail> = z.object({
    // records:
    id                 : ModelIdSchema,
    
    
    
    // data:
    visibility         : ProductVisibilitySchema,
    
    name               : ModelNameSchema,
    
    path               : SlugSchema,
    
    excerpt            : z.string().trim().min(1).max(200).nullable(),
    description        : JsonSchema.nullable(),
    
    images             : z.array(ImageUrlSchema),
    
    subcategories      : z.array(CategoryPreviewSchema),
}) satisfies z.Schema<CategoryDetail>;

export const CategoryUpdateRequestSchema = MutationArgsSchema<Omit<CategoryDetail, 'stocks'> & { stocks?: StockDetail['value'][] }>(
    CategoryDetailSchema
) satisfies z.Schema<CategoryUpdateRequest>;
