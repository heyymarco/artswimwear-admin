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
    
    uploadImageUploadProgressElm,
    uploadImageUploadErrorElm,
    
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
            display      : 'grid',
            gridTemplate : [[
                '"image ............" 1fr',
                '"image selectButton" auto',
                '"image deleteButton" auto',
                '"image  retryButton" auto',
                '"image cancelButton" auto',
                '"image ............" 1fr',
                '/',
                '1fr 1fr'
            ]],
            
            
            
            // spacings:
            gap : spacers.default,
            
            
            
            // children:
            ...children([uploadImageNoImageElm, uploadImageImageElm], {
                // positions:
                gridArea    : 'image',
                
                
                
                // sizes:
                justifySelf : 'center',
                alignSelf   : 'center',
            }),
            ...children(uploadImageNoImageElm, {
                ...children('::after', {
                    // layouts:
                    display        : 'flex',   // use block flexbox, so it takes the entire parent's width
                    flexDirection  : 'column', // items are stacked vertically
                    justifyContent : 'center', // center items vertically
                    alignItems     : 'center', // center items horizontally
                    flexWrap       : 'nowrap', // no wrapping
                }),
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(uploadImages, 'noImage')), // apply config's cssProps starting with noImage***
            }),
            ...children(uploadImageImageElm, {
                // customize:
                ...usesCssProps(usesPrefixedProps(uploadImages, 'image')), // apply config's cssProps starting with image***
            }),
            
            ...children([uploadImageUploadProgressElm, uploadImageUploadErrorElm], {
                // positions:
                gridArea : 'image',
            }),
            ...children(uploadImageUploadProgressElm, {
                // positions:
                alignSelf : 'center',
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(uploadImages, 'uploadProgress')), // apply config's cssProps starting with uploadProgress***
            }),
            ...children(uploadImageUploadErrorElm, {
                // customize:
                ...usesCssProps(usesPrefixedProps(uploadImages, 'uploadError')), // apply config's cssProps starting with uploadError***
            }),
            
            ...children(uploadImageSelectButtonElm, {
                // positions:
                gridArea: 'selectButton',
            }),
            ...children(uploadImageDeleteButtonElm, {
                // positions:
                gridArea: 'deleteButton',
            }),
            ...children(uploadImageRetryButtonElm, {
                // positions:
                gridArea: 'retryButton',
            }),
            ...children(uploadImageCancelButtonElm, {
                // positions:
                gridArea: 'cancelButton',
            }),
            
            ...children(uploadImageInputFileElm, {
                // layouts:
                display: 'none',
            }),
            
            
            
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
