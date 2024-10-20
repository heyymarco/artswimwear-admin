// cssfn:
import {
    // writes css in javascript:
    rule,
    children,
    descendants,
    style,
    scope,
    
    
    
    // strongly typed of css variables:
    cssVars,
    switchOf,
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



// variables:
interface CategoryPreviewVars {
    minImageHeight         : any
    titleSize              : any
    
    paddingInline          : any
    paddingBlock           : any
    
    decoratorPaddingInline : any
    decoratorPaddingBlock  : any
}
const [categoryPreviewVars] = cssVars<CategoryPreviewVars>({ prefix: 'catPrev' });



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
                '"preview ... ............."', 'auto', // the extra rest space if the `subcategories` is shorter than `preview`
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
            [categoryPreviewVars.paddingInline] : paddingVars.paddingInline,
            [categoryPreviewVars.paddingBlock ] : paddingVars.paddingBlock,
            paddingInline : categoryPreviewVars.paddingInline,
            paddingBlock  : categoryPreviewVars.paddingBlock,
            
            [categoryPreviewVars.decoratorPaddingInline] : spacers.sm,
            [categoryPreviewVars.decoratorPaddingBlock ] : spacers.sm,
            
            
            
            // children:
            ...descendants(['.name', 'p'], {
                margin: 0,
            }),
            ...descendants('.edit', {
                // do not alter the `.edit` button in `.name`:
                // ...rule(':not(.overlay)', {
                //     marginInlineStart: '0.25em',
                // }),
                
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
            ...rule('& :has(>.edit.overlay)', { // select any element having children('>.edit.overlay') but within <CategoryPreview>
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
                
                /*
                    :is(.flat) >   *  > .wh287.wh287 > .preview
                        <ul>     <li>   &&&&&&&&&&&&&&&&&&&&&&&
                */
                ...rule(':is(.flat)>*>&', {
                    border: borderVars.border,
                    
                    // [borderVars.borderWidth] : basics.borderWidth,
                    [borderVars.borderStartStartRadius] : basics.borderRadius,
                    [borderVars.borderStartEndRadius  ] : basics.borderRadius,
                    [borderVars.borderEndStartRadius  ] : basics.borderRadius,
                    [borderVars.borderEndEndRadius    ] : basics.borderRadius,
                }),
                ...rule(':is(.flat):has(>*>&)', {
                    gap: spacers.sm,
                }),
                
                
                
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
                    // follows <parent>'s borderRadius
                    
                    /*
                        :not(:is(.flat)) > * > .wh287.wh287 > .preview > .image
                                 <ul>    <li>  &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
                    */
                    ...rule(':not(:is(.flat))>*>&', { // when the <ListItem> is not .flat => follows the <ListItem>'s borderRadius, otherwise keeps the 4 edges has borderRadius(es)
                        [borderVars.borderWidth           ] : '0px',
                        
                        [borderVars.borderStartStartRadius] : groupableVars.borderStartStartRadius,
                        [borderVars.borderStartEndRadius  ] : '0px',
                        [borderVars.borderEndStartRadius  ] : groupableVars.borderEndStartRadius,
                        [borderVars.borderEndEndRadius    ] : '0px',
                    }),
                    
                    
                    
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
                    `calc(100% + ${categoryPreviewVars.decoratorPaddingInline})`,
                    categoryPreviewVars.decoratorPaddingBlock,
                ]],
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
                gap: spacers.xs, // a space between <Check>, <EditButton>, and <VisibilityBadge>
                
                
                
                // children:
                ...rule('.selectable', {
                    ...children(['.decorator', '.edit', '.visibility'], {
                        // positions:
                        position: 'relative',
                        insetInlineStart : `calc(0px - (${spacers.sm} + ${categoryPreviewVars.paddingInline} + 1em))`,
                        insetBlockStart  : `calc(${categoryPreviewVars.decoratorPaddingBlock} - ${categoryPreviewVars.paddingBlock})`,
                    }),
                    ...children('.decorator', {
                        // children:
                        ...children(':first-child', {
                            // spacings:
                            marginInlineEnd : `calc(${spacers.sm} + ${categoryPreviewVars.paddingInline})`,
                            
                            
                            
                            // typos:
                            fontSize: 'inherit',
                        }),
                    }),
                }),
                ...children('.decorator', {
                    // typos:
                    fontSize: switchOf(categoryPreviewVars.titleSize, typos.fontSizeXl),
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
