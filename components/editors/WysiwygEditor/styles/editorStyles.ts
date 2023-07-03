// cssfn:
import {
    // writes css in javascript:
    rule,
    variants,
    children,
    style,
    scope,
    mainScope,
    
    
    
    // reads/writes css variables configuration:
    usesCssProps,
    usesPrefixedProps,
    
    
    
    // writes complex stylesheets in simpler way:
    watchChanges,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // size options of UI:
    usesResizable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // styles:
    onContentStylesChange,
    ContentChildrenMediaOptions,
    usesContentChildrenMediaOptions,
    usesContentLayout,
    usesContentVariants,
    usesContentChildren,
}                           from '@reusable-ui/content'         // a base component

// internals:
import {
    // elements:
    editableElm,
    placeholderElm,
}                           from './elements'
import {
    // configs:
    wysiwygEditors,
    cssWysiwygEditorConfig,
}                           from './config'



// styles:
export const onCarouselStylesChange = watchChanges(onContentStylesChange, cssWysiwygEditorConfig.onChange);



export const usesEditableLayout = () => {
    // dependencies:
    
    // features:
    const {borderRule: editableBorderRule} = usesBorder({
        borderWidth : '0px',
    });
    
    
    
    return style({
        // children:
        ...children(editableElm, {
            // layouts:
            ...usesContentLayout(),
            ...style({
                // customize:
                ...usesCssProps(wysiwygEditors), // apply config's cssProps
            }),
            
            
            
            // features:
            ...editableBorderRule(), // must be placed at the last
        }),
    });
};

export const usesEditableVariants = () => {
    // dependencies:
    
    // variants:
    const {resizableRule} = usesResizable(wysiwygEditors);
    
    
    
    return style({
        // children:
        ...children(editableElm, {
            // variants:
            ...usesContentVariants(),
            ...resizableRule(),
        }),
    });
};

export const usesEditableChildren = () => {
    return style({
        // children:
        ...children(editableElm, {
            // children:
            ...usesContentChildren(),
        }),
    });
};

export default () => style({
    // layouts:
    ...usesEditableLayout(),
    
    // variants:
    ...usesEditableVariants(),
    
    // children:
    ...usesEditableChildren(),
});
