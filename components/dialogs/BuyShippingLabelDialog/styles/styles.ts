// cssfn:
import {
    // writes css in javascript:
    rule,
    fallback,
    descendants,
    children,
    scope,
    
    
    
    // strongly typed of css variables:
    switchOf,
    
    
    
    // reads/writes css variables configuration:
    usesCssProps,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a responsive management system:
    breakpoints,
    
    
    
    // a typography management system:
    secondaries,
    
    
    
    // a border (stroke) management system:
    borders,
    borderRadiuses,
    
    
    
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a responsive management system:
    ifScreenWidthAtLeast,
    ifScreenWidthSmallerThan,
    ifScreenWidthBetween,
    
    
    
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
    // base-components:
    basics,
    
    
    
    // base-content-components:
    containers,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// styles:
export default () => {
    
    // dependencies:
    
    // features:
    const {borderVars    } = usesBorder();
    const {paddingVars   } = usesPadding();
    
    // capabilities:
    const {groupableVars } = usesGroupable();
    
    
    
    return [
        scope('dialog', {
            boxSizing     : 'border-box',
            maxInlineSize : `${breakpoints.md}px`,
            maxBlockSize  : `${breakpoints.md}px`,
        }, {specificityWeight: 4}),
        scope('layoutLoading', {
            // layouts:
            display: 'grid',
            justifyContent: 'center',
            alignContent: 'center',
        }, {specificityWeight: 2}),
        scope('layout', {
            // layouts:
            display: 'grid',
            gridTemplate: [[
                '"progressCheckout" auto',
                '"currentStep     " 1fr', // the biggest part
                '/',
                '1fr'
            ]],
            
            
            
            // spacings:
            gapInline: `calc(${containers.paddingInline} / 2)`,
            gapBlock : containers.paddingBlockMd,
        }, {specificityWeight: 2}),
        scope('progressCheckout', {
            gridArea: 'progressCheckout',
            
            
            
            // remove <section>'s and <article>'s padding to follow <container>'s padding:
            ...children(['&', 'article'], {
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
            }),
        }, {specificityWeight: 2}),
        scope('currentStepLayout', {
            gridArea: 'currentStep',
            
            
            
            display: 'grid',
            gapBlock: containers.paddingBlock,
            
            ...children(['section', 'aside'], {
                ...children(['&', 'article'], {
                    [paddingVars.paddingInline] : '0px',
                    [paddingVars.paddingBlock ] : '0px',
                }),
            }),
        }, {specificityWeight: 2}),
        scope('checkout', {
            display: 'grid',
            
            // decrease indent on sub section(s):
            // ...children('article', {
            //     ...children('section', {
            //         ...children(['&', 'article'], {
            //             [paddingVars.paddingInline] : '0px',
            //             [paddingVars.paddingBlock ] : '0px',
            //         }),
            //     }),
            // }),
        }, {specificityWeight: 2}),
        scope('noSize', {
            contain: 'inline-size',
        }),
        scope('selectShipping', {
            // layouts:
            display                         : 'grid',
            
            // narrow screen: without eta:
            gridTemplateColumns             : '[decor-start] max-content [decor-end label-start] 1fr [label-end currency-start] max-content [currency-end amount-start] max-content [amount-end]',
            ...ifScreenWidthAtLeast('sm', {
                // wide screen: with eta:
                gridTemplateColumns         : '[decor-start] max-content [decor-end label-start] 1fr [label-end eta-start] max-content [eta-end currency-start] max-content [currency-end amount-start] max-content [amount-end]',
            }),
            
            
            
            // children:
            ...children('li', {
                // children:
                ...children('&', {
                    gridRowEnd              : 'span 2',
                }),
                ...children(['&', ':first-child'], { // <li> & <ListItem>
                    // positions:
                    gridColumn              : '1 / -1',
                    
                    
                    
                    // layouts:
                    display                 : 'grid',
                    gridTemplateColumns     : 'subgrid',
                }),
                ...children([':first-child'], { // <ListItem>
                    // layouts:
                    gridTemplateRows        : '[row1-start] max-content [row1-end row2-start] max-content [row2-end]',
                    
                    
                    
                    // spacings:
                    columnGap               : spacers.md,
                    rowGap                  : spacers.xxs,
                    padding                 : spacers.md,
                }),
                ...children(':first-child', { // <ListItem>
                    // layouts:
                    alignItems              : 'center', // center vertically
                    
                    
                    
                    // children:
                    // ...children('*', {
                    //     gridRow             : 'row1-start / row2-end',
                    // }),
                    ...children('[role="radio"]', {
                        // positions:
                        gridArea            : 'row1-start / decor-start / row2-end / decor-end',
                    }),
                    ...children('.label', {
                        // positions:
                        gridArea            : 'row1-start / label-start / row1-end / label-end',
                        ...ifScreenWidthAtLeast('sm', {
                            gridArea        : 'row1-start / label-start / row2-end / label-end',
                        }),
                    }),
                    ...children('.eta', {
                        // positions:
                        gridArea            : 'row2-start / label-start / row2-end / label-end',
                        ...ifScreenWidthAtLeast('sm', {
                            gridArea        : 'row1-start / eta-start / row2-end / eta-end',
                        }),
                    }),
                    ...children('.cost', {
                        // positions:
                        alignSelf: 'center',
                        gridArea            : 'row1-start / currency-start / row2-end / amount-end',
                        
                        
                        
                        // layouts:
                        display             : 'grid',
                        gridTemplateColumns : 'subgrid',
                        ...children('.currencySign', {
                            // customize:
                            ...usesCssProps(secondaries),
                        }),
                        
                        
                        
                        // spacings:
                        gap                 : 'inherit',
                        
                        
                        
                        // typos:
                        whiteSpace          : 'nowrap',
                        textAlign           : 'end',
                    }),
                }),
            }),
        }, {specificityWeight: 3}),
        scope('selectionBadge', {
            display: 'inline-block',
        }, {specificityWeight: 2}),
        scope('navFooter', {
            // layouts:
            // back & next are stacked vertically, with back on the bottom:
            display: 'flex',
            flexDirection: 'column-reverse',
            alignItems: 'stretch',
            // back & next are stacked horizontally:
            ...ifScreenWidthAtLeast('sm', {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }),
            flexWrap: 'nowrap',
            
            
            
            // spacings:
            gap: '1rem',
        }, {specificityWeight: 4}),
    ];
};
