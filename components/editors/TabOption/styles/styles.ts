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



export const usesTabBodyLayout = () => {
    // dependencies:
    
    // features:
    const {borderVars} = usesBorder();
    
    
    
    return style({
        // layouts:
        display: 'grid',
        justifyItems: 'center',
        alignItems: 'center',
        
        
        
        // borders:
        [borderVars.borderStartStartRadius] : '0px',
        [borderVars.borderStartEndRadius  ] : '0px',
        borderBlockStartWidth               : '0px',
        
        
        
        // children:
        ...children('.toggleContent', {
            // positions:
            gridArea: '1/1/1/1', // the options are overlapping each other, so the parent takes the maximum width & height of children
            
            
            
            // appearances:
            ...rule(':not(.expanded)', {
                // appearances:
                visibility: 'hidden',
            }),
            
            
            
            // children:
            ...children('p', {
                // spacings:
                margin: 0,
            }),
        }),
    });
};

export default () => style({
    // layouts:
    ...usesTabBodyLayout(),
});
