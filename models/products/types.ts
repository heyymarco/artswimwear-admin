// models:
import {
    type Variant,
    type VariantGroup,
    
    type TemplateVariant,
    type TemplateVariantGroup,
    
    type Product,
    
    type Stock,
}                           from '@prisma/client'



// types:
export interface VariantPreview
    extends
    Pick<Variant,
        |'id'
        
        |'visibility'
        
        |'name'
    >
{
}
export interface VariantDetail
    extends
        Omit<Variant,
            |'createdAt'
            |'updatedAt'
            
            |'parentId'
        >
{
}
export interface VariantGroupDetail
    extends
        Omit<VariantGroup,
            |'createdAt'
            |'updatedAt'
            
            |'parentId'
        >
{
    variants : VariantDetail[]
}



export interface TemplateVariantDetail
    extends
        Omit<TemplateVariant,
            |'createdAt'
            |'updatedAt'
            
            |'parentId'
        >
{
}
export interface TemplateVariantGroupDetail
    extends
        Omit<TemplateVariantGroup,
            |'createdAt'
            |'updatedAt'
        >
{
    variants : TemplateVariantDetail[]
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
    image         : Required<Product>['images'][number]|undefined
    variantGroups : VariantPreview[][]
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



export interface StockDetail
    extends
        Omit<Stock,
            |'parentId'
        >
{
}



export interface ProductPricePart {
    priceParts : number[],
    quantity   : number
}
