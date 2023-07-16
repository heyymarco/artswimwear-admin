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
    // a responsive management system:
    ifScreenWidthAtLeast,
    
    
    
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
            display             : 'grid',
            gridTemplateColumns : 'repeat(6, 1fr)',
            gridAutoRows        : 'auto',
            gridAutoFlow        : 'row',
            
            
            
            // children:
            ...children('*', {
                gridColumnEnd: 'span 6',
            }),
            ...ifScreenWidthAtLeast('sm', {
                ...children(['.firstName', '.lastName'], {
                    gridColumnEnd: 'span 3',
                }),
            }),
            ...ifScreenWidthAtLeast('lg', {
                ...children(['.zone', '.zip'], {
                    gridColumnEnd: 'span 3',
                }),
            }),
            ...ifScreenWidthAtLeast('xl', {
                ...children(['.city', '.zone', '.zip'], {
                    gridColumnEnd: 'span 2',
                }),
            }),
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
