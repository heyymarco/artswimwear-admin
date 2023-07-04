// cssfn:
import {
    // writes css in javascript:
    children,
    style,
    
    
    
    // reads/writes css variables configuration:
    usesCssProps,
    usesPrefixedProps,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // size options of UI:
    usesResizable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // styles:
    usesBasicLayout,
    usesBasicVariants,
}                           from '@reusable-ui/basic'           // a base component

// internals:
import {
    // elements:
    headingEditorElm,
    alignmentEditorElm,
}                           from './elements'
import {
    // configs:
    wysiwygEditors,
}                           from './config'



// styles:
export const usesToolbarLayout = () => {
    return style({
        // layouts:
        ...usesBasicLayout(),
        ...style({
            // layouts:
            display        : 'flex',   // use block flexbox, so it takes the entire parent's width
            flexDirection  : 'row',    // items are stacked horizontally
            justifyContent : 'center', // center items (text, icon, etc) horizontally
            alignItems     : 'center', // center items (text, icon, etc) vertically
            flexWrap       : 'wrap',   // allows the items (text, icon, etc) to wrap to the next row if no sufficient width available
            
            
            
            // children:
            ...children(headingEditorElm, {
                // sizes:
                boxSizing  : 'content-box', // the final size is excluding borders & paddings
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(wysiwygEditors, 'headingEditor')), // apply config's cssProps starting with headingEditor***
            }),
            ...children(alignmentEditorElm, {
                // sizes:
                boxSizing  : 'content-box', // the final size is excluding borders & paddings
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(wysiwygEditors, 'alignmentEditor')), // apply config's cssProps starting with alignmentEditor***
            }),
            
            
            
            // customize:
            ...usesCssProps(usesPrefixedProps(wysiwygEditors, 'toolbar')), // apply config's cssProps starting with toolbar***
        }),
    });
};

export const usesToolbarVariants = () => {
    // dependencies:
    
    // variants:
    const {resizableRule} = usesResizable(usesPrefixedProps(wysiwygEditors, 'toolbar'));
    
    
    
    return style({
        // variants:
        ...usesBasicVariants(),
        ...resizableRule(),
    });
};

export default () => style({
    // layouts:
    ...usesToolbarLayout(),
    
    // variants:
    ...usesToolbarVariants(),
});
