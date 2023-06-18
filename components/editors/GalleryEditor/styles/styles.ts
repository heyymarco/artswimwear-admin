// cssfn:
import {
    // writes css in javascript:
    rule,
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
    // size options of UI:
    usesResizable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // styles:
    onContentStylesChange,
    usesContentLayout,
    usesContentVariants,
}                           from '@reusable-ui/content'         // a base component

// internals:
import {
    // configs:
    gedits,
    cssGeditConfig,
}                           from './config'



// styles:
export const onGalleryEditorStylesChange = watchChanges(onContentStylesChange, cssGeditConfig.onChange);

export const usesGalleryEditorLayout = () => {
    return style({
        // layouts:
        ...usesContentLayout(),
        ...style({
            // layouts:
            display             : 'grid',        // use css block grid for layouting, the core of our GalleryEditor layout
            gridAutoFlow        : 'row',         // items direction is to inline & wrap's direction is to block
            gridAutoRows        : gedits.itemRaiseRowHeight,
            gridTemplateColumns : `repeat(auto-fill, minmax(${gedits.itemMinColumnWidth}, 1fr))`,
            gridTemplateRows    : '1fr',         // consistent height for each item
            
            // item default sizes:
            justifyItems        : 'stretch',     // each item fills the entire Gallery's column width
            alignItems          : 'stretch',     // consistent height for each item
            
            
            
            // children:
            ...children(':nth-child(n)', {
                // sizes:
                inlineSize : 'unset', // we need to manage the <img>'s width
                
                
                
                // accessibilities:
                cursor     : 'move',
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(gedits, 'item')), // apply config's cssProps starting with item***
                
                
                
                // states:
                ...rule('.dropped', {
                    scale: '120%',
                }),
                ...rule('.shifted', {
                    opacity: 0.5,
                }),
            }),
            
            
            
            // customize:
            ...usesCssProps(gedits), // apply config's cssProps
        }),
    });
};

export const usesGalleryEditorVariants = () => {
    // dependencies:
    
    // variants:
    const {resizableRule} = usesResizable(gedits);
    
    
    
    return style({
        // variants:
        ...usesContentVariants(),
        ...resizableRule(),
    });
};

export default () => style({
    // layouts:
    ...usesGalleryEditorLayout(),
    
    // variants:
    ...usesGalleryEditorVariants(),
});
