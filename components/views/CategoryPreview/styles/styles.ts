// cssfn:
import {
    // writes css in javascript:
    children,
    descendants,
    style,
    scope,
    
    
    
    // strongly typed of css variables:
    cssVars,
    switchOf,
}                           from '@cssfn/core'          // writes css in javascript
import { spacers, typos, usesBorder, usesGroupable, usesPadding } from '@reusable-ui/core';
import { basics } from '@reusable-ui/components';
import { commerces } from '@/config';



// variables:
interface CategoryPreviewVars {
    minImageHeight : any
    titleSize      : any
}
const [categoryPreviewVars] = cssVars<CategoryPreviewVars>();



// styles:
const minImageHeight = 120; // 200px
const minImageHeightSub = 80; // 80px
const usesCategoryPreviewLayout = () => { // the <ListItem> of category list
    // dependencies:
    
    // capabilities:
    const {groupableRule, groupableVars} = usesGroupable({
        orientationInlineSelector : null,     // craft the <Carousel>'s borderRadius manually
        orientationBlockSelector  : null,     // craft the <Carousel>'s borderRadius manually
        itemsSelector             : '.items', // select the <Carousel>
    });
    
    // features:
    const {borderRule , borderVars } = usesBorder({ borderWidth: '0px' });
    const {paddingRule, paddingVars} = usesPadding({
        paddingInline : '1rem',
        paddingBlock  : '1rem',
    });
    
    // spacings:
    const positivePaddingInline = groupableVars.paddingInline;
    const positivePaddingBlock  = groupableVars.paddingBlock;
    const negativePaddingInline = `calc(0px - ${positivePaddingInline})`;
    const negativePaddingBlock  = `calc(0px - ${positivePaddingBlock })`;
    
    
    
    return style({
        // capabilities:
        ...groupableRule(), // make a nicely rounded corners
        
        
        
        // layouts:
        ...style({
            // layouts:
            display: 'grid',
            gridTemplate: [[
                '"preview ... name         "', 'auto',
                '"preview ... ............."', spacers.sm,
                '"preview ... subcategories"', 'max-content',
                '/',
                `calc(((${switchOf(categoryPreviewVars.minImageHeight, `${minImageHeight}px`)} + (2 * ${paddingVars.paddingBlock})) * ${commerces.defaultProductAspectRatio}) - ${paddingVars.paddingInline}) ${spacers.md} 1fr`,
            ]],
            alignItems : 'start',
            
            
            
            // borders:
            // follows <parent>'s borderRadius
            border                   : borderVars.border,
         // borderRadius             : borderVars.borderRadius,
            borderStartStartRadius   : borderVars.borderStartStartRadius,
            borderStartEndRadius     : borderVars.borderStartEndRadius,
            borderEndStartRadius     : borderVars.borderEndStartRadius,
            borderEndEndRadius       : borderVars.borderEndEndRadius,
            [borderVars.borderWidth] : '0px', // only setup borderRadius, no borderStroke
            
            
            
            // spacings:
         // padding       : paddingVars.padding,
            paddingInline : paddingVars.paddingInline,
            paddingBlock  : paddingVars.paddingBlock,
            
            
            
            // children:
            ...descendants(['.name', 'p'], {
                margin: 0,
            }),
            ...children('.preview', {
                // positions:
                gridArea    : 'preview',
                
                justifySelf : 'stretch', // stretch the self horizontally
                alignSelf   : 'stretch', // stretch the self vertically
                
                
                
                // layouts:
                display: 'grid',
                alignItems: 'start',
                
                
                
                // borders:
                // follows <parent>'s borderRadius
                [borderVars.borderStartStartRadius] : groupableVars.borderStartStartRadius,
                [borderVars.borderStartEndRadius  ] : '0px',
                [borderVars.borderEndStartRadius  ] : groupableVars.borderEndStartRadius,
                [borderVars.borderEndEndRadius    ] : '0px',
                [borderVars.borderWidth           ] : '0px', // only setup borderRadius, no borderStroke
                borderInlineEndWidth : basics.borderWidth,
                
                
                
                // spacings:
                // cancel-out parent's padding with negative margin:
                marginInlineStart : negativePaddingInline,
                marginBlock       : negativePaddingBlock,
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
                
                
                
                // children:
                ...children('.image', {
                    // sizes:
                    aspectRatio : commerces.defaultProductAspectRatio,
                    
                    
                    
                    // children:
                    ...children('ul>li>.prodImg', {
                        inlineSize : '100%',
                        blockSize  : '100%',
                    }),
                }),
            }),
            ...children('.name', {
                // positions:
                gridArea   : 'name',
                justifyContent : 'start',
                alignItems : 'center',
                
                
                
                // layouts:
                display: 'grid',
                gridTemplate: [[
                    '"decorator edit visibility" auto',
                    '/',
                    'max-content min-content min-content'
                ]],
                
                
                
                // spacings:
                gap: spacers.xs,
                
                
                
                // children:
                ...children('.decorator', {
                    // typos:
                    fontSize: switchOf(categoryPreviewVars.titleSize, typos.fontSizeXl),
                    
                    
                    
                    // children:
                    ...children(':first-child', {
                        // spacings:
                        marginInlineEnd: spacers.sm,
                        
                        
                        
                        // typos:
                        fontSize: 'inherit',
                    }),
                }),
                ...children('.visibility', {
                    // positions:
                    gridArea : 'visibility',
                    
                    
                    
                    // spacings:
                    padding       : spacers.xs,
                    
                    
                    
                    // typos:
                    lineHeight    : 1,
                }),
                ...children('.edit', {
                    gridArea: 'edit',
                }),
            }),
            ...children('.subcategories', {
                // positions:
                gridArea   : 'subcategories',
            }),
            ...descendants('[role="dialog"]', {
                // remove the padding of <Dialog>'s backdrop:
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
            }),
        }),
        
        
        
        // features:
        ...borderRule(),  // must be placed at the last
        ...paddingRule(), // must be placed at the last
    });
};
const usesSubcategoryPreviewLayout = () => {
    return style({
        [categoryPreviewVars.minImageHeight] : `${minImageHeightSub}px`,
        [categoryPreviewVars.titleSize     ] : typos.fontSizeLg,
    });
};

export default () => [
    scope('categoryPreview', {
        ...usesCategoryPreviewLayout(),
    }, { specificityWeight: 2 }),
    scope('categoryPreviewSub', {
        ...usesSubcategoryPreviewLayout(),
    }, { specificityWeight: 2 }),
];
