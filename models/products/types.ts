// models:
import type {
    Variant,
    VariantGroup,
    Product,
    Stock,
}                           from '@prisma/client'



// types:
export interface VariantDetail
    extends
        Omit<Variant,
            |'createdAt'
            |'updatedAt'
            
            |'variantGroupId'
        >
{
}
export interface VariantGroupDetail
    extends
        Omit<VariantGroup,
            |'createdAt'
            |'updatedAt'
            
            |'productId'
        >
{
    variants : VariantDetail[]
}
export interface StockDetail
    extends
        Omit<Stock,
            |'productId'
        >
{
}

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

export interface ProductDetail
    extends
        Omit<Product,
            |'createdAt'
            |'updatedAt'
        >
{
    variantGroups : VariantGroupDetail[]
    stocks        : StockDetail[]
}
