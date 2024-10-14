// models:
import {
    type Variant,
    type VariantGroup,
    
    type TemplateVariant,
    type TemplateVariantGroup,
    
    type Product,
    
    type Stock,
    
    type Category,
}                           from '@prisma/client'
import {
    type MutationArgs,
    type PaginationArgs,
}                           from '../commons'



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

export interface ProductUpdateRequest
    extends
        MutationArgs<
            &Omit<ProductDetail, 'stocks'>
            &{ stocks?: StockDetail['value'][] }
        >
{
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



export interface CategoryPreview
    extends
        Pick<Category,
            // records:
            |'id'
            
            // data:
            |'visibility'
            
            |'name'
        >
{
    image         : Category['images'][number] | null
    subcategories : CategoryPreview[]
}

export interface CategoryDetail
    extends
        Omit<Category,
            // records:
            |'createdAt'
            |'updatedAt'
            
            // relations:
            |'parentId'
        >
{
    subcategories : CategoryPreview[]
}

export interface CategoryPageRequest
    extends
        PaginationArgs
{
    parent : Category['parentId']
}

export interface CategoryUpdateRequest
    extends
        MutationArgs<
            &CategoryDetail
            &{ parent : Category['parentId'] }
        >
{
}

export interface CategoryDeleteRequest
    extends
        MutationArgs<Pick<CategoryDetail, 'id'>>
{
}
export interface CategoryDeleteParam
    extends
        CategoryDeleteRequest
{
    parent : Category['parentId']
}
