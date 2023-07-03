// cssfn:
import {
    // writes css in javascript:
    rule,
    fallback,
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
    // removes browser's default stylesheet:
    stripoutList,
    stripoutScrollbar,
    stripoutMedia,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
    
    
    
    // size options of UI:
    usesResizable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // styles:
    onBasicStylesChange,
    usesBasicLayout,
    usesBasicVariants,
}                           from '@reusable-ui/basic'         // a base component

// internals:
import {
    // configs:
    wysiwygEditors,
    cssWysiwygEditorConfig,
}                           from './config'



export const usesWysiwygEditorLayout = () => {
    return style({
        // layouts:
        ...usesBasicLayout(),
        ...style({
            
            
            
            // customize:
            ...usesCssProps(wysiwygEditors), // apply config's cssProps
        }),
    });
};

export const usesWysiwygEditorVariants = () => {
    // dependencies:
    
    // variants:
    const {resizableRule} = usesResizable(wysiwygEditors);
    
    
    
    return style({
        // variants:
        ...usesBasicVariants(),
        ...resizableRule(),
    });
};

export default () => style({
    // layouts:
    ...usesWysiwygEditorLayout(),
    
    // variants:
    ...usesWysiwygEditorVariants(),
});
