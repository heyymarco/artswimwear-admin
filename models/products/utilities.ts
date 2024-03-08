// models:
import type {
    Stock,
}                           from '@prisma/client'

// internals:
import type {
    ProductVariantDetail,
    ProductVariantGroupDetail,
}                           from './types'



// utilities:
export interface ProductVariantDiff {
    productVariantDels      : string[]
    productVariantAdds      : Omit<ProductVariantDetail, 'id'>[]
    productVariantMods      : ProductVariantDetail[]
}
export interface ProductVariantGroupDiff {
    productVariantGroupOris : ProductVariantGroupDetail[]
    productVariantGroupDels : string[]
    productVariantGroupAdds : (Omit<ProductVariantGroupDetail, 'id'|'productVariants'> & Pick<ProductVariantDiff, 'productVariantAdds'>)[]
    productVariantGroupMods : (Omit<ProductVariantGroupDetail,      'productVariants'> & ProductVariantDiff)[]
}
export const createProductVariantGroupDiff = (productVariantGroups: ProductVariantGroupDetail[], productVariantGroupOris : ProductVariantGroupDetail[]): ProductVariantGroupDiff => {
    const productVariantGroupDels : ProductVariantGroupDiff['productVariantGroupDels'] = (() => {
        const postedIds  : string[] = productVariantGroups.map(({id}) => id);
        const currentIds : string[] = productVariantGroupOris.map(({id}) => id);
        return currentIds.filter((currentId) => !postedIds.includes(currentId));
    })();
    const productVariantGroupAdds : ProductVariantGroupDiff['productVariantGroupAdds'] = [];
    const productVariantGroupMods : ProductVariantGroupDiff['productVariantGroupMods'] = [];
    let productVariantGroupSortCounter = 0;
    for (const {id, sort, productVariants, ...restProductVariantGroup} of productVariantGroups) {
        const {
            productVariantDels,
            productVariantAdds,
            productVariantMods,
        } = ((): ProductVariantDiff => {
            const productVariantDels : ProductVariantDiff['productVariantDels'] = (() => {
                const postedIds  : string[] = productVariants.map(({id}) => id);
                const currentIds : string[] = productVariantGroupOris.find(({id: groupId}) => (groupId === id))?.productVariants.map(({id}) => id) ?? [];
                return currentIds.filter((currentId) => !postedIds.includes(currentId));
            })();
            const productVariantAdds : ProductVariantDiff['productVariantAdds'] = [];
            const productVariantMods : ProductVariantDiff['productVariantMods'] = [];
            let productVariantSortCounter = 0;
            for (const {id, sort, ...restProductVariant} of productVariants) {
                if (!id || (id[0] === ' ')) {
                    productVariantAdds.push({
                        // data:
                        sort: productVariantSortCounter++, // normalize sort, zero based
                        ...restProductVariant,
                    });
                    continue;
                } // if
                
                
                
                productVariantMods.push({
                    // data:
                    id,
                    sort: productVariantSortCounter++, // normalize sort, zero based
                    ...restProductVariant,
                });
            } // for
            return {
                productVariantDels,
                productVariantAdds,
                productVariantMods,
            };
        })();
        
        
        
        if (!id || (id[0] === ' ')) {
            productVariantGroupAdds.push({
                // data:
                sort: productVariantGroupSortCounter++, // normalize sort, zero based
                ...restProductVariantGroup,
                
                // relations:
                productVariantAdds,
            });
            continue;
        } // if
        
        
        
        productVariantGroupMods.push({
            // data:
            id,
            sort: productVariantGroupSortCounter++, // normalize sort, zero based
            ...restProductVariantGroup,
            
            // relations:
            productVariantDels,
            productVariantAdds,
            productVariantMods,
        });
    } // for
    return {
        productVariantGroupOris,
        
        productVariantGroupDels,
        productVariantGroupAdds,
        productVariantGroupMods,
    };
}



export interface StockInfo {
    value             : number|null
    productVariantIds : string[]
}
export const createStockMap = (productVariantGroupDiff: Pick<ProductVariantGroupDiff, 'productVariantGroupOris'|'productVariantGroupAdds'|'productVariantGroupMods'>, currentStocks: Pick<Stock, 'value'|'productVariantIds'>[], updatedProductVariantGroups: (Pick<ProductVariantGroupDetail, 'id'|'sort'|'hasDedicatedStocks'> & { productVariants: Pick<ProductVariantGroupDetail['productVariants'][number], 'id'>[] })[]): StockInfo[] => {
    //#region normalize productVariantGroupUpdated
    interface ProductVariantUpdated {
        productVariantAdds      : Pick<ProductVariantDetail, 'id'>[]
        productVariantMods      : Pick<ProductVariantDetail, 'id'>[]
    }
    interface ProductVariantGroupUpdated {
        productVariantGroupAdds : (Pick<ProductVariantGroupDetail, 'sort'> & Pick<ProductVariantUpdated, 'productVariantAdds'>)[]
        productVariantGroupMods : (Pick<ProductVariantGroupDetail, 'sort'> & ProductVariantUpdated)[]
    }
    const {
        productVariantGroupAdds,
        productVariantGroupMods,
    } = ((): ProductVariantGroupUpdated => {
        const productVariantGroupModIds = productVariantGroupDiff.productVariantGroupMods.map(({id}) => id);
        const productVariantGroupAdds   : ProductVariantGroupUpdated['productVariantGroupAdds'] = [];
        const productVariantGroupMods   : ProductVariantGroupUpdated['productVariantGroupMods'] = [];
        for (const {id, sort, hasDedicatedStocks, productVariants} of updatedProductVariantGroups) {
            // conditions:
            if (!hasDedicatedStocks) continue;
            
            
            
            const {
                productVariantAdds,
                productVariantMods,
            } = ((): ProductVariantUpdated => {
                const productVariantGroupMod = productVariantGroupDiff.productVariantGroupMods.find(({id: groupId}) => (groupId === id));
                const productVariantModIds   = productVariantGroupMod?.productVariantMods.map(({id}) => id);
                const productVariantAdds     : ProductVariantUpdated['productVariantAdds'] = [];
                for (const {id} of productVariants) {
                    if (!productVariantModIds?.includes(id)) {
                        productVariantAdds.push({
                            // data:
                            id,
                        });
                        continue;
                    } // if
                } // for
                return {
                    productVariantAdds,
                    productVariantMods : productVariantGroupMod?.productVariantMods ?? [],
                };
            })();
            
            
            
            if (!productVariantGroupModIds.includes(id)) {
                productVariantGroupAdds.push({
                    // data:
                    sort,
                    
                    
                    
                    // relations:
                    productVariantAdds,
                });
                continue;
            } // if
            
            
            
            // changed from not_exists => exists:
            // if the group was previously `hasDedicatedStocks === false` => treat `productVariantMods` as `productVariantAdds`:
            if (!productVariantGroupDiff.productVariantGroupOris.find(({id: groupId}) => (groupId === id))?.hasDedicatedStocks) {
                productVariantGroupAdds.push({
                    // data:
                    sort,
                    
                    
                    
                    // relations:
                    productVariantAdds : [
                        ...productVariantMods,
                        ...productVariantAdds,
                    ],
                });
                continue;
            } // IF
            
            
            
            productVariantGroupMods.push({
                // data:
                sort,
                
                
                
                // relations:
                productVariantAdds,
                productVariantMods,
            });
        } // for
        return {
            productVariantGroupAdds,
            productVariantGroupMods,
        };
    })();
    //#endregion normalize productVariantGroupUpdated
    
    
    
    type ProductVariantGroupUpdate =
        &Pick<ProductVariantGroupDetail, 'sort'>
        &Pick<ProductVariantUpdated, 'productVariantAdds'>
        &Partial<Pick<ProductVariantUpdated, 'productVariantMods'>>
    const productVariantGroupUpdates : ProductVariantGroupUpdate[] = [
        ...productVariantGroupMods, // the mods first
        ...productVariantGroupAdds, // then the adds
    ];
    interface StockInfoRaw {
        value           : number|null
        productVariants : { groupSort: number, id: string }[]
    }
    const expandStockInfo = (variantGroupIndex: number, baseStockInfo: StockInfoRaw, expandedStockInfos: StockInfoRaw[]): void => {
        const productVariantGroupUpdate = productVariantGroupUpdates[variantGroupIndex];
        if (!productVariantGroupUpdate) { // end of variantGroup(s) => resolved as current `baseStockInfo`
            expandedStockInfos.push(baseStockInfo);
            return;
        } // if
        
        
        
        // recursively expands:
        
        const baseProductVariants = baseStockInfo.productVariants;
        
        if (productVariantGroupUpdate.productVariantMods) {
            for (const productVariantMod of productVariantGroupUpdate.productVariantMods) {
                const currentProductVariants = [
                    ...baseProductVariants,
                    {
                        groupSort : productVariantGroupUpdate.sort,
                        id        : productVariantMod.id,
                    },
                ];
                const currentProductVariantIds = currentProductVariants.map(({id}) => id);
                
                
                
                const currentStock = (
                    currentStocks
                    .find(({productVariantIds}) =>
                        (productVariantIds.length === currentProductVariantIds.length)
                        &&
                        productVariantIds.every((idA) => currentProductVariantIds.includes(idA))
                        &&
                        currentProductVariantIds.every((idB) => productVariantIds.includes(idB))
                    )
                    ?.value
                    ??
                    null
                );
                
                
                
                expandStockInfo(
                    variantGroupIndex + 1,
                    /* baseStockInfo: */{
                        value           : currentStock,
                        productVariants : currentProductVariants,
                    },
                    expandedStockInfos
                );
            } // for
        } // if
        
        for (const productVariantAdd of productVariantGroupUpdate.productVariantAdds) {
            const currentProductVariants = [
                ...baseProductVariants,
                {
                    groupSort : productVariantGroupUpdate.sort,
                    id        : productVariantAdd.id,
                },
            ];
            
            
            
            expandStockInfo(
                variantGroupIndex + 1,
                /* baseStockInfo: */{
                    value           : (
                        (productVariantAdd === productVariantGroupUpdate.productVariantAdds[0])
                        ? baseStockInfo.value
                        : null
                    ),
                    productVariants : currentProductVariants,
                },
                expandedStockInfos
            );
        } // for
    }
    
    
    
    const expandedStockInfos: StockInfoRaw[] = [];
    expandStockInfo(0, /* baseStockInfo: */{ value: null, productVariants: [] }, expandedStockInfos);
    
    expandedStockInfos.forEach(({productVariants}) => {
        // sort each variant by variantGroup's sort:
        productVariants.sort(({groupSort: groupSortA}, {groupSort: groupSortB}) => groupSortA - groupSortB);
    });
    
    return expandedStockInfos.map(({productVariants, ...restStockInfo}) => ({
        ...restStockInfo,
        productVariantIds : productVariants.map(({id}) => id),
    }));
}
