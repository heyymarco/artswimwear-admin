// cssfn:
import {
    // writes css in javascript:
    children,
    style,
    
    
    
    // reads/writes css variables configuration:
    usesCssProps,
    usesPrefixedProps,
    
    
    
    // writes complex stylesheets in simpler way:
    watchChanges,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // background stuff of UI:
    usesBackground,
    
    
    
    // size options of UI:
    usesResizable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // styles:
    onIndicatorStylesChange,
    usesIndicatorLayout,
    usesIndicatorVariants,
}                           from '@reusable-ui/indicator'       // a base component

// internals:
import {
    // configs:
    grips,
    cssGripConfig,
}                           from './config'



// styles:
export const onGripStylesChange = watchChanges(onIndicatorStylesChange, cssGripConfig.onChange);

export const usesGripLayout = () => {
    // dependencies:
    
    // features:
    const {backgroundVars} = usesBackground();
    
    
    
    return style({
        // layouts:
        ...usesIndicatorLayout(),
        ...style({
            // layouts:
            display             : 'grid',
            gridTemplateColumns : 'repeat(3, 1fr)',
            gridTemplateRows    : 'repeat(3, 1fr)',
            justifyItems        : 'center',
            alignItems          : 'center',
            
            
            
            // children:
            ...children('*', {
                // accessibilities:
                pointerEvents   : 'none', // no interaction, just for decoration purpose
                
                
                
                // backgrounds:
                backgroundColor : backgroundVars.altBackgColor,
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(grips, 'dot')), // apply config's cssProps starting with dot***
            }),
            
            
            
            // customize:
            ...usesCssProps(grips), // apply config's cssProps
        }),
    });
};

export const usesGripVariants = () => {
    // dependencies:
    
    // variants:
    const {resizableRule} = usesResizable(grips);
    
    
    
    return style({
        // variants:
        ...usesIndicatorVariants(),
        ...resizableRule(),
    });
};

export default () => style({
    // layouts:
    ...usesGripLayout(),
    
    // variants:
    ...usesGripVariants(),
});
