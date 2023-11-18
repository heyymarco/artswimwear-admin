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
    paymentEditors,
    cssPaymentEditorConfig,
}                           from './config'



// styles:
export const onPaymentEditorStylesChange = watchChanges(onIndicatorStylesChange, cssPaymentEditorConfig.onChange);

export const usesPaymentEditorLayout = () => {
    return style({
        // layouts:
        ...usesIndicatorLayout(),
        ...style({
            // layouts:
            display      : 'grid',
            gridAutoRows : 'auto',
            gridAutoFlow : 'row',
            
            
            
            // customize:
            ...usesCssProps(paymentEditors), // apply config's cssProps
        }),
    });
};

export const usesPaymentEditorVariants = () => {
    // dependencies:
    
    // variants:
    const {resizableRule} = usesResizable(paymentEditors);
    
    
    
    return style({
        // variants:
        ...usesIndicatorVariants(),
        ...resizableRule(),
    });
};

export const usesPaymentEditorStates = usesIndicatorStates;

export default style({
    // layouts:
    ...usesPaymentEditorLayout(),
    
    // variants:
    ...usesPaymentEditorVariants(),
    
    // states:
    ...usesPaymentEditorStates(),
});
