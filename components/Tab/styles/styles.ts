// cssfn:
import {
    // writes css in javascript:
    rule,
    variants,
    states,
    children,
    style,
    vars,
    
    
    
    // reads/writes css variables configuration:
    usesCssProps,
    usesPrefixedProps,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
    
    
    
    // groups a list of UIs into a single UI:
    usesGroupable,
    
    
    
    // a capability of UI to expand/reduce its size or toggle the visibility:
    ifCollapsing,
    ifCollapsed,
    usesCollapsible,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // configs:
    basics,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import {
    // configs:
    tabs,
}                           from './config'



export const usesTabPanelLayout = () => {
    // dependencies:
    
    // inefficient: just for single animation:
    // // features:
    // const {animationRule, animationVars} = usesAnimation();
    
    // capabilities:
    const {groupableVars  } = usesGroupable();
    
    // more efficient:
    // states:
    const {collapsibleVars} = usesCollapsible();
    
    
    
    return style({
        // layouts:
        ...style({
            // positions:
            gridArea      : '1/1/1/1', // the options are overlapping each other, so the parent takes the maximum width & height of children
            
            
            
            // scrolls:
            overflow      : 'auto', // enable horz & vert scrolling
            
            
            
            // spacings:
            marginInline  : `calc(0px - ${groupableVars.paddingInline})`, // cancel out parent's padding with negative margin
            marginBlock   : `calc(0px - ${groupableVars.paddingBlock })`, // cancel out parent's padding with negative margin
            paddingInline : groupableVars.paddingInline,                  // restore parent's padding with positive margin
            paddingBlock  : groupableVars.paddingBlock,                   // restore parent's padding with positive margin
            
            
            
            // customize:
            ...usesCssProps(usesPrefixedProps(tabs, 'panel')), // apply config's cssProps starting with panel***
            
            
            
            // animations:
         // anim          : animationVars.anim,   // inefficient: just for single animation
            anim          : collapsibleVars.anim, // more efficient
        }),
        
        
        
        // inefficient: just for single animation:
        // // features:
        // ...animationRule(), // must be placed at the last
    });
};
export const usesTabPanelStates = () => {
    // dependencies:
    
    // states:
    const {collapsibleRule} = usesCollapsible(usesPrefixedProps(tabs, 'panel'));
    
    
    
    return style({
        // states:
        ...collapsibleRule(),
        ...states([
            ifCollapsing({
                // appearances:
                visibility   : 'hidden', // hide the <TabPanel> while   consuming space
            }),
            ifCollapsed({
                // appearances:
             // do not remove the <TabPanel> from DOM, causing <TabBody>'s width changing when switching tab
             // display      : 'none',   // hide the <TabPanel> without consuming space
                visibility   : 'hidden', // hide the <TabPanel> while   consuming space
            }),
        ]),
    });
};

export const usesTabBodyLayout = () => {
    // dependencies:
    
    // features:
    const {borderVars} = usesBorder();
    
    
    
    return style({
        // layouts:
        display      : 'grid',
        justifyItems : 'stretch', // overlaps each <TabPanel> to anothers
        alignItems   : 'stretch', // overlaps each <TabPanel> to anothers
        
        
        
        // scrolls:
        overflow     : 'hidden', // force <TabPanel> to activate the `overflow: 'auto'`
        
        
        
        // borders:
        [borderVars.borderStartStartRadius] : '0px', // remove top radius
        [borderVars.borderStartEndRadius  ] : '0px', // remove top radius
        borderBlockStartWidth               : '0px', // remove top border (already applied by <Tab>)
        
        
        
        // children:
        ...children('.tabPanel', style({
            // layouts:
            ...usesTabPanelLayout(),
            
            // states:
            ...usesTabPanelStates(),
        })),
        
        
        
        // customize:
        ...usesCssProps(usesPrefixedProps(tabs, 'body')), // apply config's cssProps starting with body***
    });
};
export const usesTabBodyVariants = () => {
    return style({
        ...variants([
            rule('.fitContent', {
                // children:
                ...children('.tabPanel', {
                    // states:
                    ...states([
                        ifCollapsed({
                            // sizes:
                            // remove the height while maintaining it's width:
                            maxBlockSize : 0,
                            overflowY    : 'hidden',
                        }),
                    ]),
                }),
            }),
        ]),
    });
};

export const usesTabLayout = () => {
    // dependencies:
    
    // features:
    const {borderVars   } = usesBorder();
    const {paddingVars  } = usesPadding();
    
    // capabilities:
    const {groupableRule} = usesGroupable({
        orientationInlineSelector : null, // never  => the <TabHeader> & <TabBody> are never  stacked in horizontal
        orientationBlockSelector  : '&',  // always => the <TabHeader> & <TabBody> are always stacked in vertical
        itemsSelector             : ':nth-child(n)', // select <TabHeader> & <TabBody>
    });
    
    
    
    return style({
        // features:
        ...groupableRule(), // make a nicely rounded corners
        
        
        
        // layouts:
        ...style({
            // children:
            ...children('.tabBody', style({
                // layouts:
                ...usesTabBodyLayout(),
                
                // variants:
                ...usesTabBodyVariants(),
            })),
            
            
            
            // borders:
         // border                 : borderVars.border, // no need border
         // borderRadius           : borderVars.borderRadius,
            borderStartStartRadius : borderVars.borderStartStartRadius,
            borderStartEndRadius   : borderVars.borderStartEndRadius,
            borderEndStartRadius   : borderVars.borderEndStartRadius,
            borderEndEndRadius     : borderVars.borderEndEndRadius,
            
            
            
            // spacings:
         // padding                : paddingVars.padding,
            paddingInline          : paddingVars.paddingInline,
            paddingBlock           : paddingVars.paddingBlock,
            
            
            
            // customize:
            ...usesCssProps(tabs), // apply config's cssProps
        }),
        
        
        
        // features:
        
        // use manually applying `borderRule` feature to avoid useless `borderVars.borderColorFn` & `borderVars.borderColor`
     // ...borderRule(),  // must be placed at the last
        
        // manually applying `borderRule` feature:
        ...vars({
            // borders:
            [borderVars.borderStartStartRadius] : '0px',
            [borderVars.borderStartEndRadius  ] : '0px',
            [borderVars.borderEndStartRadius  ] : basics.borderRadius,
            [borderVars.borderEndEndRadius    ] : basics.borderRadius,
        }),
        
        // use manually applying `paddingRule` feature to avoid useless `paddingVars.padding`
     // ...paddingRule(), // must be placed at the last
        
        // manually applying `paddingRule` feature:
        ...vars({
            // spacings:
            [paddingVars.paddingInline        ] : '0px',
            [paddingVars.paddingBlock         ] : '0px',
        }),
    });
};

export default () => style({
    // layouts:
    ...usesTabLayout(),
});
