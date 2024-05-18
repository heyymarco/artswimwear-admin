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
    orderCanceledEditors,
    cssOrderCanceledEditorConfig,
}                           from './config'



// styles:
export const onOrderCanceledEditorStylesChange = watchChanges(onIndicatorStylesChange, cssOrderCanceledEditorConfig.onChange);

export const usesOrderCanceledEditorLayout = () => {
    return style({
        // layouts:
        ...usesIndicatorLayout(),
        ...style({
            // layouts:
            display      : 'grid',
            gridAutoRows : 'auto',
            gridAutoFlow : 'row',
            
            
            
            // customize:
            ...usesCssProps(orderCanceledEditors), // apply config's cssProps
        }),
    });
};

export const usesOrderCanceledEditorVariants = () => {
    // dependencies:
    
    // variants:
    const {resizableRule} = usesResizable(orderCanceledEditors);
    
    
    
    return style({
        // variants:
        ...usesIndicatorVariants(),
        ...resizableRule(),
    });
};

export const usesOrderCanceledEditorStates = usesIndicatorStates;

export default style({
    // layouts:
    ...usesOrderCanceledEditorLayout(),
    
    // variants:
    ...usesOrderCanceledEditorVariants(),
    
    // states:
    ...usesOrderCanceledEditorStates(),
});
