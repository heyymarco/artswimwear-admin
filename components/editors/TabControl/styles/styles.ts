// cssfn:
import {
    // writes css in javascript:
    rule,
    children,
    style,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // border (stroke) stuff of UI:
    usesBorder,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



export const usesTabControlBodyLayout = () => {
    // dependencies:
    
    // features:
    const {borderVars} = usesBorder();
    
    
    
    return style({
        // children:
        ...children('.tabBody', {
            // layouts:
            display      : 'grid',
            justifyItems : 'stretch', // overlaps each <TabOption> to anothers
            alignItems   : 'stretch', // overlaps each <TabOption> to anothers
            
            
            
            // borders:
            [borderVars.borderStartStartRadius] : '0px', // remove top radius
            [borderVars.borderStartEndRadius  ] : '0px', // remove top radius
            borderBlockStartWidth               : '0px', // remove top border (already applied by <Tab>)
            
            
            
            // children:
            ...children('.tabOption', {
                // positions:
                gridArea: '1/1/1/1', // the options are overlapping each other, so the parent takes the maximum width & height of children
                
                
                
                // appearances:
                ...rule(':not(.expanded)', {
                    // appearances:
                    visibility: 'hidden', // hide inactive <TabOption>
                }),
            }),
        }),
    });
};

export default () => style({
    // layouts:
    ...usesTabControlBodyLayout(),
});
