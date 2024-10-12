// cssfn:
import {
    children,
    descendants,
    style,
}                           from '@cssfn/core'          // writes css in javascript
import { spacers, typos, usesBorder, usesGroupable, usesPadding } from '@reusable-ui/core';
import { basics } from '@reusable-ui/components';
import { commerces } from '@/config';



// styles:
const minImageHeight = 170; // 170px
const usesProductPreviewLayout = () => { // the <ListItem> of product list
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
                '"images ... name      "', 'auto',
                '"images ... .........."', spacers.sm,
                '"images ... variants  "', 'auto',
                '"images ... .........."', spacers.sm,
                '"images ... price     "', 'auto',
                '"images ... .........."', spacers.sm,
                '"images ... stocks    "', 'auto',
                '"images ... .........."', spacers.sm,
                '"images ... visibility"', 'auto',
                '"images ... .........."', spacers.sm, // the minimum space between visibility and fullEditor
                '"images ... .........."', 'auto',     // the extra rest space (if any) between payment and fullEditor
                '"images ... fullEditor"', 'auto',
                '/',
                `calc((${minImageHeight}px + (2 * ${paddingVars.paddingBlock})) * ${commerces.defaultProductAspectRatio}) ${spacers.md} 1fr`,
            ]],
            
            
            
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
            ...descendants('.value', {
                fontWeight: typos.fontWeightSemibold,
            }),
            ...descendants('.noValue', {
                // appearances:
                opacity    : 0.5,
                
                
                
                // typos:
                fontSize   : basics.fontSizeSm,
                fontStyle  : 'italic',
            }),
            ...descendants('.edit', {
                marginInlineStart: '0.25em',
            }),
            ...children('.images', {
                // positions:
                gridArea    : 'images',
                
                justifySelf : 'stretch', // stretch the self horizontally
                alignSelf   : 'stretch', // stretch the self vertically
                
                
                
                // sizes:
                aspectRatio : commerces.defaultProductAspectRatio,
                
                
                
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
                
                
                
                // children:
                ...children('ul>li>.prodImg', {
                    inlineSize : '100%',
                    blockSize  : '100%',
                }),
            }),
            ...children('.name', {
                gridArea: 'name',
                fontSize: typos.fontSizeXl,
            }),
            ...children('.variants', {
                gridArea : 'variants',
                display  : 'flex',
                flexWrap : 'wrap',
                gap      : spacers.xs,
            }),
            ...children('.price', {
                gridArea: 'price',
            }),
            ...children('.stocks', {
                gridArea: 'stocks',
            }),
            ...children('.visibility', {
                gridArea: 'visibility',
            }),
            ...children('.fullEditor', {
                gridArea: 'fullEditor',
                
                
                
                // typos:
                ...children('button', {
                    textDecoration: 'none',
                }),
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

export default style({
    // layouts:
    ...usesProductPreviewLayout(),
});
