// cssfn:
import {
    // writes css in javascript:
    rule,
    states,
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
    // a spacer (gap) management system:
    spacers,
    
    
    
    // animation stuff of UI:
    usesAnimation,
    
    
    
    // size options of UI:
    usesResizable,
    
    
    
    // a capability of UI to be disabled:
    usesDisableable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // styles:
    onBasicStylesChange,
    usesBasicLayout,
    usesBasicVariants,
}                           from '@reusable-ui/basic'           // a base component

// internals:
import {
    // elements:
    uploadImageNoImageElm,
    uploadImageImageElm,
    
    uploadImageSelectButtonElm,
    uploadImageDeleteButtonElm,
    uploadImageRetryButtonElm,
    uploadImageCancelButtonElm,
    
    uploadImageInputFileElm,
}                           from './elements'
import {
    // configs:
    uploadImages,
    cssUploadImageConfig,
}                           from './config'



// styles:
export const onUploadImageStylesChange = watchChanges(onBasicStylesChange, cssUploadImageConfig.onChange);

export const usesUploadImageLayout = () => {
    // dependencies:
    
    // features:
    const {animationRule , animationVars } = usesAnimation(uploadImages as any);
    
    
    
    return style({
        // layouts:
        ...usesBasicLayout(),
        ...style({
            // layouts:
            display             : 'grid',        // use css block grid for layouting, the core of our UploadImage layout
            gridAutoFlow        : 'row',         // items direction is to inline & wrap's direction is to block
            gridAutoRows        : uploadImages.itemRaiseRowHeight,
            gridTemplateColumns : `repeat(auto-fill, minmax(${uploadImages.itemMinColumnWidth}, 1fr))`,
            gridTemplateRows    : '1fr',         // consistent height for each item
            
            // item default sizes:
            justifyItems        : 'stretch',     // each item fills the entire Gallery's column width
            alignItems          : 'stretch',     // consistent height for each item
            
            
            
            // children:
            
            
            
            // customize:
            ...usesCssProps(uploadImages), // apply config's cssProps
        }),
    });
};

export const usesUploadImageVariants = () => {
    // dependencies:
    
    // variants:
    const {resizableRule} = usesResizable(uploadImages);
    
    
    
    return style({
        // variants:
        ...usesBasicVariants(),
        ...resizableRule(),
    });
};

export default () => style({
    // layouts:
    ...usesUploadImageLayout(),
    
    // variants:
    ...usesUploadImageVariants(),
});
