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
    onTheWayEditors,
    cssOnTheWayEditorConfig,
}                           from './config'



// styles:
export const onOnTheWayEditorStylesChange = watchChanges(onIndicatorStylesChange, cssOnTheWayEditorConfig.onChange);

export const usesOnTheWayEditorLayout = () => {
    return style({
        // layouts:
        ...usesIndicatorLayout(),
        ...style({
            // layouts:
            display      : 'grid',
            gridAutoRows : 'auto',
            gridAutoFlow : 'row',
            
            
            
            // customize:
            ...usesCssProps(onTheWayEditors), // apply config's cssProps
        }),
    });
};

export const usesOnTheWayEditorVariants = () => {
    // dependencies:
    
    // variants:
    const {resizableRule} = usesResizable(onTheWayEditors);
    
    
    
    return style({
        // variants:
        ...usesIndicatorVariants(),
        ...resizableRule(),
    });
};

export const usesOnTheWayEditorStates = usesIndicatorStates;

export default style({
    // layouts:
    ...usesOnTheWayEditorLayout(),
    
    // variants:
    ...usesOnTheWayEditorVariants(),
    
    // states:
    ...usesOnTheWayEditorStates(),
});
