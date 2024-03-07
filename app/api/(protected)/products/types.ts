// models:
import type {
    ProductVariant,
    ProductVariantGroup,
    Product,
    Stock,
}                           from '@prisma/client'



// types:
export interface ProductPreview
    extends
        Pick<Product,
            |'id'
            |'name'
            |'price'
            |'shippingWeight'
        >
{
    image: Required<Product>['images'][number]|undefined
}

export interface ProductVariantDetail
    extends
        Omit<ProductVariant,
            |'createdAt'
            |'updatedAt'
            
            |'productVariantGroupId'
        >
{
}
export interface ProductVariantGroupDetail
    extends
        Omit<ProductVariantGroup,
            |'createdAt'
            |'updatedAt'
            
            |'productId'
        >
{
    productVariants : ProductVariantDetail[]
}
export interface StockDetail
    extends
        Omit<Stock,
            |'productId'
        >
{
}
export interface ProductDetail
    extends
        Omit<Product,
            |'createdAt'
            |'updatedAt'
        >
{
    productVariantGroups : ProductVariantGroupDetail[]
    stocks               : StockDetail[]
}
