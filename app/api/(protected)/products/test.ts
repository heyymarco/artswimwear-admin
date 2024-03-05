// models:
import type {
    ProductVariant,
    ProductVariantGroup,
    Product,
    Stock,
}                           from '@prisma/client'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'



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
export interface ProductDetail
    extends
        Omit<Product,
            |'createdAt'
            |'updatedAt'
        >
{
    productVariantGroups : ProductVariantGroupDetail[]
}

const test = (async () => {
    //#region dummy data
    const productVariantGroups : ProductVariantGroupDetail[] = [
        {
            id   : 'colors-eifeigie',
            sort : 0,
            name : 'Colors',
            productVariants : [
                {
                    id             : 'red-fefief',
                    sort           : 0,
                    visibility     : 'PUBLISHED',
                    name           : 'Red',
                    price          : null,
                    shippingWeight : null,
                    images         : [],
                },
                {
                    id             : 'green-grehhe',
                    sort           : 1,
                    visibility     : 'PUBLISHED',
                    name           : 'Green',
                    price          : null,
                    shippingWeight : null,
                    images         : [],
                },
                {
                    id             : ' blue-beghe',
                    sort           : 2,
                    visibility     : 'PUBLISHED',
                    name           : 'Blue',
                    price          : null,
                    shippingWeight : null,
                    images         : [],
                },
                {
                    id             : ' violet-beghe',
                    sort           : 3,
                    visibility     : 'PUBLISHED',
                    name           : 'Violet',
                    price          : null,
                    shippingWeight : null,
                    images         : [],
                },
            ],
        },
        {
            id   : 'sizes-jhrh',
            sort : 1,
            name : 'Sizes',
            productVariants : [
                {
                    id             : 'sm-fefief',
                    sort           : 0,
                    visibility     : 'PUBLISHED',
                    name           : 'Sm',
                    price          : null,
                    shippingWeight : null,
                    images         : [],
                },
                {
                    id             : 'md-htjr',
                    sort           : 1,
                    visibility     : 'PUBLISHED',
                    name           : 'Md',
                    price          : null,
                    shippingWeight : null,
                    images         : [],
                },
                {
                    id             : ' lg-etgh',
                    sort           : 2,
                    visibility     : 'PUBLISHED',
                    name           : 'Lg',
                    price          : null,
                    shippingWeight : null,
                    images         : [],
                },
                {
                    id             : ' xl-hefg',
                    sort           : 3,
                    visibility     : 'PUBLISHED',
                    name           : 'Xl',
                    price          : null,
                    shippingWeight : null,
                    images         : [],
                },
            ],
        },
        {
            id   : ' fabrics-eifeigie',
            sort : 2,
            name : 'Fabrics',
            productVariants : [
                {
                    id             : ' cotton-jhrg',
                    sort           : 0,
                    visibility     : 'PUBLISHED',
                    name           : 'cotton',
                    price          : null,
                    shippingWeight : null,
                    images         : [],
                },
                {
                    id             : ' wool-jrf',
                    sort           : 1,
                    visibility     : 'PUBLISHED',
                    name           : 'wool',
                    price          : null,
                    shippingWeight : null,
                    images         : [],
                },
            ],
        },
    ];
    //#endregion dummy data
    
    
    
    //#region dummy productVariantGroups
    interface ProductVariantDiff {
        productVariantDels      : string[]
        productVariantAdds      : Omit<ProductVariantDetail, 'id'>[]
        productVariantMods      : ProductVariantDetail[]
    }
    interface ProductVariantGroupDiff {
        productVariantGroupOris : ProductVariantGroupDetail[]
        productVariantGroupDels : string[]
        productVariantGroupAdds : (Omit<ProductVariantGroupDetail, 'id'|'productVariants'> & Pick<ProductVariantDiff, 'productVariantAdds'>)[]
        productVariantGroupMods : (Omit<ProductVariantGroupDetail,      'productVariants'> & ProductVariantDiff)[]
    }
    const productVariantGroupDiffs : ProductVariantGroupDiff = {
        productVariantGroupOris: [
            {
                id: "cltb6v5js000kkb76mv6puqby",
                sort: 0,
                name: "Colors",
                productVariants: [
                    {
                        id: "cltb6v5js000lkb764cqgmp3p",
                        visibility: "PUBLISHED",
                        sort: 0,
                        name: "Red",
                        price: null,
                        shippingWeight: null,
                        images: [
                        ],
                    },
                    {
                        id: "cltb6v5js000mkb76fsz643ts",
                        visibility: "PUBLISHED",
                        sort: 1,
                        name: "Green",
                        price: null,
                        shippingWeight: null,
                        images: [
                        ],
                    },
                ],
            },
            {
                id: "cltb4aln10004kb766ka4d1lu",
                sort: 1,
                name: "Sizes",
                productVariants: [
                    {
                        id: "cltb4aln10005kb76doqnys5r",
                        visibility: "PUBLISHED",
                        sort: 0,
                        name: "Sm",
                        price: null,
                        shippingWeight: null,
                        images: [
                        ],
                    },
                    {
                        id: "cltb4aln10006kb766kddkivp",
                        visibility: "PUBLISHED",
                        sort: 1,
                        name: "Md",
                        price: null,
                        shippingWeight: null,
                        images: [
                        ],
                    },
                ],
            },
        ],
        productVariantGroupDels: [
        ],
        productVariantGroupAdds: [
            {
                sort: 2,
                name: "Fabrics",
                productVariantAdds: [
                    {
                        sort: 0,
                        visibility: "PUBLISHED",
                        name: "Cotton",
                        price: null,
                        shippingWeight: null,
                        images: [
                        ],
                    },
                    {
                        sort: 1,
                        visibility: "PUBLISHED",
                        name: "Wool",
                        price: null,
                        shippingWeight: null,
                        images: [
                        ],
                    },
                ],
            },
        ],
        productVariantGroupMods: [
            {
                id: "cltb6v5js000kkb76mv6puqby",
                sort: 0,
                name: "Colors",
                productVariantDels: [
                ],
                productVariantAdds: [
                {
                    sort: 2,
                    visibility: "PUBLISHED",
                    name: "Blue",
                    price: null,
                    shippingWeight: null,
                    images: [
                    ],
                },
                {
                    sort: 3,
                    visibility: "PUBLISHED",
                    name: "Violet",
                    price: null,
                    shippingWeight: null,
                    images: [
                    ],
                },
                ],
                productVariantMods: [
                {
                    id: "cltb6v5js000lkb764cqgmp3p",
                    sort: 0,
                    visibility: "PUBLISHED",
                    name: "Red",
                    price: null,
                    shippingWeight: null,
                    images: [
                    ],
                },
                {
                    id: "cltb6v5js000mkb76fsz643ts",
                    sort: 1,
                    visibility: "PUBLISHED",
                    name: "Green",
                    price: null,
                    shippingWeight: null,
                    images: [
                    ],
                },
                ],
            },
            {
                id: "cltb4aln10004kb766ka4d1lu",
                sort: 1,
                name: "Sizes",
                productVariantDels: [
                ],
                productVariantAdds: [
                    {
                        sort: 2,
                        visibility: "PUBLISHED",
                        name: "Lg",
                        price: null,
                        shippingWeight: null,
                        images: [
                        ],
                    },
                    {
                        sort: 3,
                        visibility: "PUBLISHED",
                        name: "Xl",
                        price: null,
                        shippingWeight: null,
                        images: [
                        ],
                    },
                ],
                productVariantMods: [
                    {
                        id: "cltb4aln10005kb76doqnys5r",
                        sort: 0,
                        visibility: "PUBLISHED",
                        name: "Sm",
                        price: null,
                        shippingWeight: null,
                        images: [
                        ],
                    },
                    {
                        id: "cltb4aln10006kb766kddkivp",
                        sort: 1,
                        visibility: "PUBLISHED",
                        name: "Md",
                        price: null,
                        shippingWeight: null,
                        images: [
                        ],
                    },
                ],
            },
        ],
    };
    //#endregion dummy productVariantGroups
    
    
    
    //#region normalize productVariantGroupUpdated
    const productDetail : ProductDetail = {
        id: "clovrcn8i0002kb2cx5i3yurv",
        visibility: "PUBLISHED",
        name: "Scrunchie - Mega Mendung",
        price: 99000,
        shippingWeight: null,
        stock: null,
        path: "scrunchie-mega-mendung",
        excerpt: null,
        description: null,
        images: [
            "https://huze1mgboiwun0iw.public.blob.vercel-storage.com/products/Scrunchie%20-%20Mega%20Mendung/spongebob-f1N1PKvGXwRIl2FEAJpFk5wrxTKqR4.jpg",
        ],
        productVariantGroups: [
            {
                id: "cltb6v5js000kkb76mv6puqby",
                sort: 0,
                name: "Colors",
                productVariants: [
                    {
                        id: "cltb6v5js000lkb764cqgmp3p",
                        visibility: "PUBLISHED",
                        sort: 0,
                        name: "Red",
                        price: null,
                        shippingWeight: null,
                        images: [
                        ],
                    },
                    {
                        id: "cltb6v5js000mkb76fsz643ts",
                        visibility: "PUBLISHED",
                        sort: 1,
                        name: "Green",
                        price: null,
                        shippingWeight: null,
                        images: [
                        ],
                    },
                    {
                        id: "cltduhko40003luuo19nk1obl",
                        visibility: "PUBLISHED",
                        sort: 2,
                        name: "Blue",
                        price: null,
                        shippingWeight: null,
                        images: [
                        ],
                    },
                    {
                        id: "cltduhko50004luuoyalabe8d",
                        visibility: "PUBLISHED",
                        sort: 3,
                        name: "Violet",
                        price: null,
                        shippingWeight: null,
                        images: [
                        ],
                    },
                ],
            },
            {
                id: "cltb4aln10004kb766ka4d1lu",
                sort: 1,
                name: "Sizes",
                productVariants: [
                    {
                        id: "cltb4aln10005kb76doqnys5r",
                        visibility: "PUBLISHED",
                        sort: 0,
                        name: "Sm",
                        price: null,
                        shippingWeight: null,
                        images: [
                        ],
                    },
                    {
                        id: "cltb4aln10006kb766kddkivp",
                        visibility: "PUBLISHED",
                        sort: 1,
                        name: "Md",
                        price: null,
                        shippingWeight: null,
                        images: [
                        ],
                    },
                    {
                        id: "cltduhko60005luuo9t2wlm9f",
                        visibility: "PUBLISHED",
                        sort: 2,
                        name: "Lg",
                        price: null,
                        shippingWeight: null,
                        images: [
                        ],
                    },
                    {
                        id: "cltduhko60006luuospv38z93",
                        visibility: "PUBLISHED",
                        sort: 3,
                        name: "Xl",
                        price: null,
                        shippingWeight: null,
                        images: [
                        ],
                    },
                ],
            },
            {
                id: "cltduhko30000luuoixwo344g",
                sort: 2,
                name: "Fabrics",
                productVariants: [
                    {
                        id: "cltduhko30001luuodtntvao8",
                        visibility: "PUBLISHED",
                        sort: 0,
                        name: "Cotton",
                        price: null,
                        shippingWeight: null,
                        images: [
                        ],
                    },
                    {
                        id: "cltduhko30002luuo1olykgx5",
                        visibility: "PUBLISHED",
                        sort: 1,
                        name: "Wool",
                        price: null,
                        shippingWeight: null,
                        images: [
                        ],
                    },
                ],
            },
        ],
    };
    const updatedProductVariantGroups = productDetail.productVariantGroups;
    
    interface ProductVariantUpdated {
        productVariantDels      : string[]
        productVariantAdds      : ProductVariantDetail[]
        productVariantMods      : ProductVariantDetail[]
    }
    interface ProductVariantGroupUpdated {
        productVariantGroupDels : string[]
        productVariantGroupAdds : (Omit<ProductVariantGroupDetail, 'productVariants'> & Pick<ProductVariantUpdated, 'productVariantAdds'>)[]
        productVariantGroupMods : (Omit<ProductVariantGroupDetail, 'productVariants'> & ProductVariantUpdated)[]
    }
    const productVariantGroupUpdated = ((): ProductVariantGroupUpdated => {
        const productVariantGroupModIds = productVariantGroupDiffs.productVariantGroupMods.map(({id}) => id);
        const productVariantGroupAdds   : ProductVariantGroupUpdated['productVariantGroupAdds'] = [];
        const productVariantGroupMods   : ProductVariantGroupUpdated['productVariantGroupMods'] = [];
        for (const {id, productVariants, ...restProductVariantGroup} of updatedProductVariantGroups) {
            const {
                productVariantDels,
                productVariantAdds,
                productVariantMods,
            } = ((): ProductVariantUpdated => {
                const productVariantGroupMod = productVariantGroupDiffs.productVariantGroupMods.find(({id: groupId}) => (groupId === id));
                const productVariantModIds   = productVariantGroupMod?.productVariantMods.map(({id}) => id);
                const productVariantAdds     : ProductVariantUpdated['productVariantAdds'] = [];
                for (const {id, ...restProductVariant} of productVariants) {
                    if (!productVariantModIds?.includes(id)) {
                        productVariantAdds.push({
                            // data:
                            id,
                            ...restProductVariant,
                        });
                        continue;
                    } // if
                } // for
                return {
                    productVariantDels : productVariantGroupMod?.productVariantDels ?? [],
                    productVariantAdds,
                    productVariantMods : productVariantGroupMod?.productVariantMods ?? [],
                };
            })();
            
            
            
            if (!productVariantGroupModIds.includes(id)) {
                productVariantGroupAdds.push({
                    // data:
                    id,
                    ...restProductVariantGroup,
                    
                    // relations:
                    productVariantAdds,
                });
                continue;
            } // if
            
            
            
            productVariantGroupMods.push({
                // data:
                id,
                ...restProductVariantGroup,
                
                // relations:
                productVariantDels,
                productVariantAdds,
                productVariantMods,
            });
        } // for
        return {
            productVariantGroupDels : productVariantGroupDiffs.productVariantGroupDels,
            productVariantGroupAdds,
            productVariantGroupMods,
        };
    })();
    console.log(productVariantGroupUpdated);
    //#endregion normalize productVariantGroupUpdated
    
    
    
    interface StockInfo {
        stock      : number|null
        variantIds : string[]
    }
    type ProductVariantUpd = Pick<ProductVariantUpdated, 'productVariantAdds'> & Partial<Pick<ProductVariantUpdated, 'productVariantMods'>>
    const expandStockInfo = async (productVariantUpds : ProductVariantUpd[], index: number, currentStocks: Pick<Stock, 'value'|'productVariantIds'>[], baseStockInfo: StockInfo, expandedStockInfos: StockInfo[]): Promise<void> => {
        const productVariantUpd = productVariantUpds[index];
        if (!productVariantUpd) { // end of variantGroup(s) => resolved as current `baseStockInfo`
            expandedStockInfos.push(baseStockInfo);
            return;
        } // if
        
        
        
        // recursively expands:
        
        const baseVariantIds = baseStockInfo.variantIds;
        
        if (productVariantUpd.productVariantMods) {
            const currentStock = (
                currentStocks
                .find(({productVariantIds}) =>
                    (productVariantIds.length === baseVariantIds.length)
                    &&
                    productVariantIds.every((idA) => baseVariantIds.includes(idA))
                    &&
                    baseVariantIds.every((idB) => productVariantIds.includes(idB))
                )
                ?.value
            );
            
            for (const productVariantMod of productVariantUpd.productVariantMods) {
                await expandStockInfo(
                    productVariantUpds,
                    index + 1,
                    currentStocks,
                    /* baseStockInfo: */{
                        stock      : (
                            ((currentStock !== undefined) && (productVariantMod === productVariantUpd.productVariantMods[0]))
                            ? currentStock
                            : null
                        ),
                        variantIds : [...baseVariantIds, productVariantMod.name],
                    },
                    expandedStockInfos
                );
            } // for
        } // if
        
        for (const productVariantAdd of productVariantUpd.productVariantAdds) {
            await expandStockInfo(
                productVariantUpds,
                index + 1,
                currentStocks,
                /* baseStockInfo: */{
                    stock      : null,
                    variantIds : [...baseVariantIds, productVariantAdd.name],
                },
                expandedStockInfos
            );
        } // for
    }
    const productVariantUpds : ProductVariantUpd[] = [
        ...productVariantGroupUpdated.productVariantGroupMods,
        ...productVariantGroupUpdated.productVariantGroupAdds,
    ];
    const currentStocks = await prisma.stock.findMany({
        where  : {
            productId : productDetail.id,
        },
        select : {
            value             : true,
            productVariantIds : true,
        },
    });
    
    const expandedStockInfos: StockInfo[] = [];
    await expandStockInfo(productVariantUpds, 0, currentStocks, /* baseStockInfo: */{ stock: 99, variantIds: [] }, expandedStockInfos);
    
    const expandedStockInfosEmpty: StockInfo[] = [];
    await expandStockInfo([], 0, currentStocks, /* baseStockInfo: */{ stock: 99, variantIds: [] }, expandedStockInfosEmpty);
    
    console.log(expandedStockInfos, expandedStockInfosEmpty);
});

Bun.serve({
    async fetch(req){
        await test();
        return new Response("Hello World!");
    }
});
