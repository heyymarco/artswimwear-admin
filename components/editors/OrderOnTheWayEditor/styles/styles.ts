// cssfn:
import {
    // writes css in javascript:
    children,
    style,
    
    
    
    // reads/writes css variables configuration:
    usesCssProps,
    
    
    
    // writes complex stylesheets in simpler way:
    watchChanges,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // size options of UI:
    usesResizable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // styles:
    onIndicatorStylesChange,
    usesIndicatorLayout,
    usesIndicatorVariants,
    usesIndicatorStates,
}                           from '@reusable-ui/indicator'       // a base component

// internals:
import {
    // configs:
    orderOnTheWayEditors,
    cssOrderOnTheWayEditorConfig,
}                           from './config'



// styles:
export const onOrderOnTheWayEditorStylesChange = watchChanges(onIndicatorStylesChange, cssOrderOnTheWayEditorConfig.onChange);

export const usesOrderOnTheWayEditorLayout = () => {
    return style({
        // layouts:
        ...usesIndicatorLayout(),
        ...style({
            // layouts:
            display : 'grid',
            
            
            
            // children:
            ...children('hr', {
                margin: 0,
            }),
            
            
            
            // customize:
            ...usesCssProps(orderOnTheWayEditors), // apply config's cssProps
        }),
    });
};

export const usesOrderOnTheWayEditorVariants = () => {
    // dependencies:
    
    // variants:
    const {resizableRule} = usesResizable(orderOnTheWayEditors);
    
    
    
    return style({
        // variants:
        ...usesIndicatorVariants(),
        ...resizableRule(),
    });
};

export const usesOrderOnTheWayEditorStates = usesIndicatorStates;

export default style({
    // layouts:
    ...usesOrderOnTheWayEditorLayout(),
    
    // variants:
    ...usesOrderOnTheWayEditorVariants(),
    
    // states:
    ...usesOrderOnTheWayEditorStates(),
});
