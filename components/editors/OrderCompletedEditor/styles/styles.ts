// cssfn:
import {
    // writes css in javascript:
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
    orderCompletedEditors,
    cssOrderCompletedEditorConfig,
}                           from './config'



// styles:
export const onOrderCompletedEditorStylesChange = watchChanges(onIndicatorStylesChange, cssOrderCompletedEditorConfig.onChange);

export const usesOrderCompletedEditorLayout = () => {
    return style({
        // layouts:
        ...usesIndicatorLayout(),
        ...style({
            // layouts:
            display      : 'grid',
            gridAutoRows : 'auto',
            gridAutoFlow : 'row',
            
            
            
            // customize:
            ...usesCssProps(orderCompletedEditors), // apply config's cssProps
        }),
    });
};

export const usesOrderCompletedEditorVariants = () => {
    // dependencies:
    
    // variants:
    const {resizableRule} = usesResizable(orderCompletedEditors);
    
    
    
    return style({
        // variants:
        ...usesIndicatorVariants(),
        ...resizableRule(),
    });
};

export const usesOrderCompletedEditorStates = usesIndicatorStates;

export default style({
    // layouts:
    ...usesOrderCompletedEditorLayout(),
    
    // variants:
    ...usesOrderCompletedEditorVariants(),
    
    // states:
    ...usesOrderCompletedEditorStates(),
});
