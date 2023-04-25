// cssfn:
import {
    // writes css in javascript:
    states,
    children,
    style,
    vars,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // animation stuff of UI:
    usesAnimation,
    
    
    
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
    collapses,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



export const usesTabPanelLayout = () => {
    // dependencies:
    
    // features:
    const {animationRule, animationVars} = usesAnimation();
    
    
    
    return style({
        // layouts:
        ...style({
            // positions:
            gridArea: '1/1/1/1', // the options are overlapping each other, so the parent takes the maximum width & height of children
            
            
            
            // animations:
            anim : animationVars.anim,
        }),
        
        
        
        // features:
        ...animationRule(), // must be placed at the last
    });
};
export const usesTabPanelStates = () => {
    // dependencies:
    
    // states:
    const {collapsibleRule} = usesCollapsible(collapses);
    
    
    
    return style({
        // states:
        ...collapsibleRule(),
        ...states([
            ifCollapsing({
                // appearances:
                visibility : 'hidden', // hide the <TabPanel> while   consuming space
            }),
            ifCollapsed({
                // appearances:
                display    : 'none',   // hide the <TabPanel> without consuming space
            }),
        ]),
    });
};
export const usesTabBodyLayout = () => {
    // dependencies:
    
    // features:
    const {borderVars   } = usesBorder();
    
    
    
    return style({
        // layouts:
        display      : 'grid',
        justifyItems : 'stretch', // overlaps each <TabPanel> to anothers
        alignItems   : 'stretch', // overlaps each <TabPanel> to anothers
        
        
        
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
    });
};
export const usesTabLayout = () => {
    // dependencies:
    
    // features:
    const {borderVars   } = usesBorder();
    const {paddingVars  } = usesPadding();
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
            ...children('.tabBody', usesTabBodyLayout()),
            
            
            
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
