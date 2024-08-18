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
        }, {specificityWeight: 4}),
        scope('layout', {
            display: 'grid',
            gapInline: `calc(${containers.paddingInline} / 2)`,
            gapBlock : containers.paddingBlockMd,
        }, {specificityWeight: 2}),
        scope('progressCheckout', {
            // remove <section>'s and <article>'s padding to follow <container>'s padding:
            ...children(['&', 'article'], {
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
            }),
        }, {specificityWeight: 2}),
        scope('currentStepLayout', {
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
        scope('navCheckout', {
            // remove <section>'s and <article>'s padding to follow <container>'s padding:
            ...children(['&', 'article'], {
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
            }),
            
            ...children('article', {
                // back & next are stacked vertically, with back on the bottom:
                display: 'flex',
                flexDirection: 'column-reverse',
                alignItems: 'stretch',
                gap: '1rem',
                // back & next are stacked horizontally:
                ...ifScreenWidthAtLeast('sm', {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }),
            }),
        }, {specificityWeight: 2}),
    ];
};
