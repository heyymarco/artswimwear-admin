// models:
import {
    type Stock,
}                           from '@prisma/client'

// models:
import {
    type ProductPreview,
}                           from './types'
import {
    // types:
    type Prisma,
}                           from '@/models'

// ORMs:
import {
    type prisma,
}                           from '@/libs/prisma.server'

// internals:
import {
    // types:
    type VariantDetail,
    type VariantGroupDetail,
    
    type TemplateVariantDetail,
}                           from './types'
import {
    // utilities:
    selectId,
}                           from '../utilities'



// utilities:
export const productPreviewSelect = {
    id             : true,
    name           : true,
    price          : true,
    shippingWeight : true,
    images         : true,
    
    variantGroups : {
        select : {
            variants : {
                select : {
                    id         : true,
                    
                    visibility : true,
                    
                    name       : true,
                },
                orderBy : {
                    sort : 'asc',
                },
            },
        },
        orderBy : {
            sort : 'asc',
        },
    },
} satisfies Prisma.ProductSelect;
export const convertProductPreviewDataToProductPreview = (productPreviewData: Awaited<ReturnType<typeof prisma.product.findFirstOrThrow<{ select: typeof productPreviewSelect }>>>): ProductPreview => {
    const {
        images,        // take
        variantGroups, // take
    ...restProduct} = productPreviewData;
    return {
        ...restProduct,
        image         : images?.[0],
        variantGroups : (
            variantGroups
            .map(({variants}) =>
                variants
            )
        ),
    };
};



export const productDetailSelect = {
    id             : true,
                
    visibility     : true,
    
    name           : true,
    
    price          : true,
    shippingWeight : true,
    
    stock          : true,
    
    path           : true,
    
    excerpt        : true,
    description    : true,
    
    images         : true,
    
    variantGroups : {
        select: {
            id                 : true,
            
            sort               : true,
            
            name               : true,
            hasDedicatedStocks : true,
            
            variants           : {
                select: {
                    id             : true,
                    
                    visibility     : true,
                    sort           : true,
                    
                    name           : true,
                    price          : true,
                    shippingWeight : true,
                    images         : true,
                },
                orderBy : {
                    sort: 'asc',
                },
            },
        },
        orderBy : {
            sort: 'asc',
        },
    },
    stocks : {
        select: {
            id         : true,
            
            value      : true,
            
            variantIds : true,
        },
    },
} satisfies Prisma.ProductSelect;



export const templateVariantGroupDetailSelect = {
    id                 : true,
    
    name               : true,
    hasDedicatedStocks : true,
    
    variants   : {
        select: {
            id             : true,
            
            visibility     : true,
            sort           : true,
            
            name           : true,
            price          : true,
            shippingWeight : true,
            images         : true,
        },
        // doesn't work:
        // orderBy : {
        //     sort: 'asc',
        // },
    },
} satisfies Prisma.TemplateVariantGroupSelect;



export interface VariantGroupDiff {
    variantGroupOris : VariantGroupDetail[]
    
    variantGroupDels : string[]
    variantGroupAdds : (Omit<VariantGroupDetail, 'id'|'variants'> & Pick<VariantDiff, 'variantAdds'>)[]
    variantGroupMods : (Omit<VariantGroupDetail,      'variants'> & VariantDiff)[]
}
export interface VariantDiff {
    variantOris      : VariantDetail[]
    
    variantDels      : string[]
    variantAdds      : Omit<VariantDetail, 'id'>[]
    variantMods      : VariantDetail[]
}
export const createVariantGroupDiff = (variantGroups: VariantGroupDetail[], variantGroupOris : VariantGroupDetail[]): VariantGroupDiff => {
    const variantGroupDels : VariantGroupDiff['variantGroupDels'] = (() => {
        const postedIds  : string[] = variantGroups.map(selectId);
        const currentIds : string[] = variantGroupOris.map(selectId);
        return currentIds.filter((currentId) => !postedIds.includes(currentId));
    })();
    const variantGroupAdds : VariantGroupDiff['variantGroupAdds'] = [];
    const variantGroupMods : VariantGroupDiff['variantGroupMods'] = [];
    let variantGroupSortCounter = 0;
    for (const {id: groupId, sort, variants, ...restVariantGroup} of variantGroups) {
        const {
            variantOris,
            
            variantDels,
            variantAdds,
            variantMods,
        } = ((): VariantDiff => {
            const variantOris : VariantDiff['variantOris'] = variantGroupOris.find(({id: parentId}) => (parentId === groupId))?.variants ?? [];
            
            const variantDels : VariantDiff['variantDels'] = (() => {
                const postedIds  : string[] = variants.map(selectId);
                const currentIds : string[] = variantOris.map(selectId) ?? [];
                return currentIds.filter((currentId) => !postedIds.includes(currentId));
            })();
            const variantAdds : VariantDiff['variantAdds'] = [];
            const variantMods : VariantDiff['variantMods'] = [];
            let variantSortCounter = 0;
            for (const {id: variantId, sort, ...restVariant} of variants) {
                if (!variantId || (variantId[0] === ' ')) {
                    variantAdds.push({
                        // data:
                        sort: variantSortCounter++, // normalize sort, zero based
                        ...restVariant,
                    });
                    continue;
                } // if
                
                
                
                variantMods.push({
                    // data:
                    id   : variantId,
                    sort : variantSortCounter++, // normalize sort, zero based
                    ...restVariant,
                });
            } // for
            return {
                variantOris,
                
                variantDels,
                variantAdds,
                variantMods,
            };
        })();
        
        
        
        if (!groupId || (groupId[0] === ' ')) {
            variantGroupAdds.push({
                // data:
                sort: variantGroupSortCounter++, // normalize sort, zero based
                ...restVariantGroup,
                
                // relations:
                variantAdds,
            });
            continue;
        } // if
        
        
        
        variantGroupMods.push({
            // data:
            id   : groupId,
            sort : variantGroupSortCounter++, // normalize sort, zero based
            ...restVariantGroup,
            
            // relations:
            variantOris,
            
            variantDels,
            variantAdds,
            variantMods,
        });
    } // for
    return {
        variantGroupOris,
        
        variantGroupDels,
        variantGroupAdds,
        variantGroupMods,
    };
}



export interface TemplateVariantDiff {
    variantOris : TemplateVariantDetail[]
    
    variantDels : string[]
    variantAdds : Omit<TemplateVariantDetail, 'id'>[]
    variantMods : TemplateVariantDetail[]
}
export const createTemplateVariantDiff = (variants: TemplateVariantDetail[], variantOris : TemplateVariantDetail[]): TemplateVariantDiff => {
    const variantDels : TemplateVariantDiff['variantDels'] = (() => {
        const postedIds  : string[] = variants.map(selectId);
        const currentIds : string[] = variantOris.map(selectId) ?? [];
        return currentIds.filter((currentId) => !postedIds.includes(currentId));
    })();
    const variantAdds : TemplateVariantDiff['variantAdds'] = [];
    const variantMods : TemplateVariantDiff['variantMods'] = [];
    let variantSortCounter = 0;
    for (const {id: variantId, sort, ...restVariant} of variants) {
        if (!variantId || (variantId[0] === ' ')) {
            variantAdds.push({
                // data:
                sort: variantSortCounter++, // normalize sort, zero based
                ...restVariant,
            });
            continue;
        } // if
        
        
        
        variantMods.push({
            // data:
            id   : variantId,
            sort : variantSortCounter++, // normalize sort, zero based
            ...restVariant,
        });
    } // for
    return {
        variantOris,
        
        variantDels,
        variantAdds,
        variantMods,
    };
}



export interface StockInfo {
    value      : number|null
    variantIds : string[]
}
export const createStockMap = (variantGroupDiff: Pick<VariantGroupDiff, 'variantGroupOris'|'variantGroupAdds'|'variantGroupMods'>, currentStocks: Pick<Stock, 'value'|'variantIds'>[], updatedVariantGroups: (Pick<VariantGroupDetail, 'id'|'sort'|'hasDedicatedStocks'> & { variants: Pick<VariantGroupDetail['variants'][number], 'id'>[] })[]): StockInfo[] => {
    //#region normalize variantGroupUpdated
    interface VariantUpdated {
        variantAdds      : Pick<VariantDetail, 'id'>[]
        variantMods      : Pick<VariantDetail, 'id'>[]
    }
    interface VariantGroupUpdated {
        variantGroupAdds : (Pick<VariantGroupDetail, 'sort'> & Pick<VariantUpdated, 'variantAdds'>)[]
        variantGroupMods : (Pick<VariantGroupDetail, 'sort'> & VariantUpdated)[]
    }
    const {
        variantGroupAdds,
        variantGroupMods,
    } = ((): VariantGroupUpdated => {
        const variantGroupModIds = variantGroupDiff.variantGroupMods.map(selectId);
        const variantGroupAdds   : VariantGroupUpdated['variantGroupAdds'] = [];
        const variantGroupMods   : VariantGroupUpdated['variantGroupMods'] = [];
        for (const {id: groupId, sort, hasDedicatedStocks, variants} of updatedVariantGroups) {
            // conditions:
            if (!hasDedicatedStocks) continue;
            
            
            
            const {
                variantAdds,
                variantMods,
            } = ((): VariantUpdated => {
                const variantGroupMod = variantGroupDiff.variantGroupMods.find(({id: parentId}) => (parentId === groupId));
                const variantModIds   = variantGroupMod?.variantMods.map(selectId);
                const variantAdds     : VariantUpdated['variantAdds'] = [];
                for (const {id: variantId} of variants) {
                    if (!variantModIds?.includes(variantId)) {
                        variantAdds.push({
                            // data:
                            id: variantId,
                        });
                        continue;
                    } // if
                } // for
                return {
                    variantAdds,
                    variantMods : variantGroupMod?.variantMods ?? [],
                };
            })();
            
            
            
            if (!variantGroupModIds.includes(groupId)) {
                variantGroupAdds.push({
                    // data:
                    sort,
                    
                    
                    
                    // relations:
                    variantAdds,
                });
                continue;
            } // if
            
            
            
            // changed from not_exists => exists:
            // if the group was previously `hasDedicatedStocks === false` => treat `variantMods` as `variantAdds`:
            if (!variantGroupDiff.variantGroupOris.find(({id: parentId}) => (parentId === groupId))?.hasDedicatedStocks) {
                variantGroupAdds.push({
                    // data:
                    sort,
                    
                    
                    
                    // relations:
                    variantAdds : [
                        ...variantMods,
                        ...variantAdds,
                    ],
                });
                continue;
            } // IF
            
            
            
            variantGroupMods.push({
                // data:
                sort,
                
                
                
                // relations:
                variantAdds,
                variantMods,
            });
        } // for
        return {
            variantGroupAdds,
            variantGroupMods,
        };
    })();
    //#endregion normalize variantGroupUpdated
    
    
    
    type VariantGroupUpdate =
        &Pick<VariantGroupDetail, 'sort'>
        &Pick<VariantUpdated, 'variantAdds'>
        &Partial<Pick<VariantUpdated, 'variantMods'>>
    const variantGroupUpdates : VariantGroupUpdate[] = [
        ...variantGroupMods, // the mods first
        ...variantGroupAdds, // then the adds
    ];
    interface StockInfoRaw {
        value    : number|null
        variants : { groupSort: number, id: string }[]
    }
    const expandStockInfo = (variantGroupIndex: number, baseStockInfo: StockInfoRaw, expandedStockInfos: StockInfoRaw[]): void => {
        const variantGroupUpdate = variantGroupUpdates[variantGroupIndex];
        if (!variantGroupUpdate) { // end of variantGroup(s) => resolved as current `baseStockInfo`
            expandedStockInfos.push(baseStockInfo);
            return;
        } // if
        
        
        
        // recursively expands:
        
        const baseVariants = baseStockInfo.variants;
        
        if (variantGroupUpdate.variantMods) {
            for (const variantMod of variantGroupUpdate.variantMods) {
                const currentVariants = [
                    ...baseVariants,
                    {
                        groupSort : variantGroupUpdate.sort,
                        id        : variantMod.id,
                    },
                ];
                const requiredVariantIds = currentVariants.map(selectId);
                
                
                
                const matchingStocks = (
                    currentStocks
                    .filter(({variantIds: providedVariantIds}) =>
                        (requiredVariantIds.length <= providedVariantIds.length)
                        &&
                        requiredVariantIds.every((requiredVariantId) => providedVariantIds.includes(requiredVariantId))
                    )
                    .map(({value}) => value)
                );
                const currentStock = (
                    !matchingStocks.length
                    ? null
                    : (
                        (matchingStocks.length === 1)
                        ? matchingStocks[0]
                        : (
                            matchingStocks
                            .reduce((accum, current): number|null => {
                                if (current === null) return accum; // ignore null
                                if (accum === null) return current;
                                return (accum + current);
                            }, null)
                        )
                    )
                );
                
                
                
                expandStockInfo(
                    variantGroupIndex + 1,
                    /* baseStockInfo: */{
                        value    : currentStock,
                        variants : currentVariants,
                    },
                    expandedStockInfos
                );
            } // for
        } // if
        
        for (const variantAdd of variantGroupUpdate.variantAdds) {
            const currentVariants = [
                ...baseVariants,
                {
                    groupSort : variantGroupUpdate.sort,
                    id        : variantAdd.id,
                },
            ];
            
            
            
            expandStockInfo(
                variantGroupIndex + 1,
                /* baseStockInfo: */{
                    value    : (
                        (variantAdd === variantGroupUpdate.variantAdds[0])
                        ? baseStockInfo.value
                        : null
                    ),
                    variants : currentVariants,
                },
                expandedStockInfos
            );
        } // for
    }
    
    
    
    const expandedStockInfos: StockInfoRaw[] = [];
    expandStockInfo(0, /* baseStockInfo: */{ value: null, variants: [] }, expandedStockInfos);
    
    expandedStockInfos.forEach(({variants}) => {
        // sort each variant by variantGroup's sort:
        variants.sort(({groupSort: groupSortA}, {groupSort: groupSortB}) => groupSortA - groupSortB);
    });
    
    return expandedStockInfos.map(({variants, ...restStockInfo}) => ({
        ...restStockInfo,
        variantIds : variants.map(selectId),
    }));
}
