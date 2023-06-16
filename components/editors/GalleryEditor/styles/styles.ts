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
export const onMasonryStylesChange = watchChanges(onContentStylesChange, cssGeditConfig.onChange);

export const usesMasonryLayout = () => {
    return style({
        // layouts:
        ...usesContentLayout(),
        ...style({
            // layouts:
            display             : 'grid',        // use css block grid for layouting, the core of our Masonry layout
            gridAutoFlow        : 'row',         // items direction is to inline & masonry's direction is to block
            gridAutoRows        : gedits.itemRaiseRowHeight,
            gridTemplateColumns : `repeat(auto-fill, minmax(${gedits.itemMinColumnWidth}, 1fr))`,
            gridTemplateRows    : '1fr',         // consistent height for each item
            
            // item default sizes:
            justifyItems        : 'stretch',     // each item fills the entire Gallery's column width
            alignItems          : 'stretch',     // consistent height for each item
            
            
            
            // children:
            ...children('*', {
                // sizes:
                inlineSize : 'unset', // we need to manage the <img>'s width
                
                
                
                // accessibilities:
                cursor     : 'move',
                ...children('*', {
                    pointerEvents : 'none',
                }),
            }),
            
            
            
            // customize:
            ...usesCssProps(gedits), // apply config's cssProps
        }),
    });
};

export const usesMasonryVariants = () => {
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
    ...usesMasonryLayout(),
    
    // variants:
    ...usesMasonryVariants(),
});
