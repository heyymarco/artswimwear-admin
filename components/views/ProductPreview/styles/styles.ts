// cssfn:
import {
    // writes css in javascript:
    rule,
    children,
    descendants,
    style,
}                           from '@cssfn/core'          // writes css in javascript

import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a typography management system:
    typos,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
    
    
    
    // groups a list of UIs into a single UI:
    usesGroupable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    basics,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// configs:
import {
    commerces,
}                           from '@/config'



// styles:
const minImageHeight = 200; // 200px
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
                '"preview ... name      "', 'auto',
                '"preview ... .........."', spacers.sm,
                '"preview ... variants  "', 'auto',
                '"preview ... .........."', spacers.sm,
                '"preview ... price     "', 'auto',
                '"preview ... .........."', spacers.sm,
                '"preview ... stocks    "', 'auto',
                '"preview ... .........."', spacers.sm,
                '"preview ... visibility"', 'auto',
                '"preview ... .........."', spacers.sm, // the minimum space between visibility and fullEditor
                '"preview ... .........."', 'auto',     // the extra rest space (if any) between visibility and fullEditor
                '"preview ... fullEditor"', 'auto',
                '/',
                `calc(((${minImageHeight}px + (2 * ${paddingVars.paddingBlock})) * ${commerces.defaultProductAspectRatio}) - ${paddingVars.paddingInline}) ${spacers.md} 1fr`,
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
                ...rule(':not(.overlay)', {
                    marginInlineStart: '0.25em',
                }),
                
                // invert the edit overlay, so the edit overlay can be seen on busy background:
                ...rule('.overlay', {
                    // animations:
                    filter    : [['none'], '!important'],
                    animation : [['none'], '!important'],
                    
                    
                    
                    // children:
                    ...children('[role="img"]', {
                        transition: [
                            ['backdrop-filter' , basics.defaultAnimationDuration],
                            ['background-color', basics.defaultAnimationDuration],
                        ],
                        ...rule(':not(:hover)', {
                            backdropFilter  : [[
                                'invert(1)',
                            ]],
                            backgroundColor : 'transparent',
                        }),
                    }),
                }),
            }),
            // invert the edit overlay, so the edit overlay can be seen on busy background:
            ...rule('& :has(>.edit.overlay)', { // select any element having children('>.edit.overlay') but within <ProductPreview>
                filter : [['none'], '!important'],
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
                borderInlineEndWidth                : basics.borderWidth,
                
                
                
                // spacings:
                // cancel-out parent's padding with negative margin:
                marginInlineStart : negativePaddingInline,
                marginBlock       : negativePaddingBlock,
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
                
                
                
                // children:
                ...children('.image', {
                    // layouts:
                    ...rule('.noImage', {
                        // layouts:
                        display: 'grid',
                        
                        
                        
                        // spacings:
                        [paddingVars.paddingInline] : '0px',
                        [paddingVars.paddingBlock ] : '0px',
                        
                        
                        
                        // children:
                        ...children('*', {
                            opacity: 0.4,
                            
                            justifySelf : 'center', // center the <Icon>
                            alignSelf   : 'center', // center the <Icon>
                        }),
                    }),
                    
                    
                    
                    // spacings:
                    [paddingVars.paddingInline] : '0px',
                    [paddingVars.paddingBlock ] : '0px',
                    
                    
                    
                    // sizes:
                    boxSizing   : 'border-box',
                    aspectRatio : commerces.defaultProductAspectRatio,
                    
                    
                    
                    // borders:
                    // follows the <ListItem>'s borderRadius, otherwise keeps the 4 edges has borderRadius(es)
                    [borderVars.borderWidth           ] : '0px',
                    
                    [borderVars.borderStartStartRadius] : groupableVars.borderStartStartRadius,
                    [borderVars.borderStartEndRadius  ] : '0px',
                    [borderVars.borderEndStartRadius  ] : groupableVars.borderEndStartRadius,
                    [borderVars.borderEndEndRadius    ] : '0px',
                    
                    
                    
                    // children:
                    // a tweak for marco's <Image>:
                    ...children(['ul>li>.prodImg', '.prodImg'], {
                        inlineSize : '100%', // fills the entire <Carousel> area
                        blockSize  : '100%', // fills the entire <Carousel> area
                    }, { performGrouping: false }), // cannot grouping of different depth `:is(ul>li>.prodImg', .prodImg)`
                }),
            }),
            ...children('.floatingEdit', {
                translate: [[
                    `calc(100% + ${spacers.sm})`,
                    spacers.sm,
                ]],
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
