// zod:
import {
    z,
}                           from 'zod'

// models:
import {
    type ProductVisibility,
    type VariantVisibility,
    type Category,
}                           from '@prisma/client'
import {
    type VariantDetail,
    type VariantGroupDetail,
    type StockDetail,
    type ProductDetail,
    type ProductUpdateRequest,
    type CategoryDetail,
    type CategoryPageRequest,
    type CategoryUpdateRequest,
    type CategoryDeleteRequest,
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
    PaginationArgSchema,
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
    keywords           : z.array(z.string().trim().min(1).max(50)).max(50),
    
    images             : z.array(ImageUrlSchema),
    
    variantGroups      : z.array(VariantGroupDetailSchema),
    stocks             : z.array(StockDetailSchema),
    categories         : z.array(ModelIdSchema),
}) satisfies z.Schema<ProductDetail>;

export const ProductUpdateRequestSchema = MutationArgsSchema<Omit<ProductDetail, 'stocks'> & { stocks?: StockDetail['value'][] }>(
    ProductDetailSchema.omit({ stocks: true })
    .merge(
        z.object({
            stocks : z.array(StockDetailSchema.shape.value).optional(),
        }) satisfies z.Schema<{ stocks?: StockDetail['value'][] }>
    )
) satisfies z.Schema<ProductUpdateRequest>;



export const CategoryDetailSchema = z.object({
    // records:
    id                 : ModelIdSchema,
    
    
    
    // data:
    visibility         : ProductVisibilitySchema,
    
    name               : ModelNameSchema,
    
    path               : SlugSchema,
    
    excerpt            : z.string().trim().min(1).max(200).nullable(),
    description        : JsonSchema.nullable(),
    
    images             : z.array(ImageUrlSchema),
    
    subcategories      : z.lazy((): z.ZodArray<z.ZodType<CategoryDetail, z.ZodTypeDef, CategoryDetail>, 'many'> => z.array(CategoryDetailSchema)),
}) satisfies z.Schema<CategoryDetail>;

export const CategoryPageRequestSchema   = PaginationArgSchema.merge(
    z.object({
        parent : ModelIdSchema.nullable(),
    }) satisfies z.Schema<{ parent : Category['parentId'] }>
) satisfies z.Schema<CategoryPageRequest>;

export const CategoryUpdateRequestSchema = MutationArgsSchema<CategoryDetail & { parent : Category['parentId'] }>(
    CategoryDetailSchema
    .merge(
        z.object({
            parent : ModelIdSchema.nullable(),
        }) satisfies z.Schema<{ parent : Category['parentId'] }>
    )
) satisfies z.Schema<CategoryUpdateRequest>;

export const CategoryDeleteRequestSchema = MutationArgsSchema<Pick<CategoryDetail, 'id'>>(
    CategoryDetailSchema.pick({ id: true })
) satisfies z.Schema<CategoryDeleteRequest>;
