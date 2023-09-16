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
    onContentStylesChange,
    usesContentLayout,
    usesContentVariants,
}                           from '@reusable-ui/content'         // a base component

// internals:
import {
    // elements:
    uploadImageMediaGroup,
    uploadImageNoImageElm,
    uploadImagePreviewImageElm,
    uploadImageImageElm,
    uploadImageUploadProgressElm,
    uploadImageUploadErrorElm,
    
    uploadImageActionGroup,
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
export const onUploadImageStylesChange = watchChanges(onContentStylesChange, cssUploadImageConfig.onChange);

export const usesUploadImageLayout = () => {
    // dependencies:
    
    // features:
    const {animationRule , animationVars } = usesAnimation(uploadImages as any);
    
    
    
    return style({
        // layouts:
        ...usesContentLayout(),
        ...style({
            // layouts:
            display      : 'grid',
            gridTemplate : [[
                '"mediaGroup actionGroup" auto',
                '/',
                '1fr 1fr'
            ]],
            
            
            
            // spacings:
            gap : spacers.default,
            
            
            
            // children:
            ...children(uploadImageMediaGroup, {
                // layouts:
                display      : 'grid',
                gridTemplate : [[
                    '"media" auto',
                    '/',
                    'auto'
                ]],
                justifyContent : 'center', // center a whole items horizontally
                alignContent   : 'center', // center a whole items vertically
                
                
                
                // sizes:
                justifySelf    : 'center', // center the self horizontally
                alignSelf      : 'center', // center the self vertically
                
                
                
                // children:
                ...children([uploadImageNoImageElm, uploadImagePreviewImageElm, uploadImageImageElm, uploadImageUploadProgressElm, uploadImageUploadErrorElm], {
                    // positions:
                    gridArea : 'media',
                }),
                ...children([uploadImagePreviewImageElm, uploadImageImageElm], {
                    // sizes:
                    justifySelf    : 'stretch', // stretch the self horizontally
                    alignSelf      : 'stretch', // stretch the self vertically
                    minInlineSize  : 0,
                    minBlockSize   : 0,
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
                ...children(uploadImagePreviewImageElm, {
                    // customize:
                    ...usesCssProps(usesPrefixedProps(uploadImages, 'previewImage')), // apply config's cssProps starting with previewImage***
                }),
                ...children(uploadImageImageElm, {
                    // customize:
                    ...usesCssProps(usesPrefixedProps(uploadImages, 'image')), // apply config's cssProps starting with image***
                }),
                ...children([uploadImageUploadProgressElm, uploadImageUploadErrorElm], {
                    // positions:
                    zIndex : 1,
                }),
                ...children(uploadImageUploadProgressElm, {
                    // positions:
                    alignSelf : 'center', // center vertically
                    
                    
                    
                    // customize:
                    ...usesCssProps(usesPrefixedProps(uploadImages, 'uploadProgress')), // apply config's cssProps starting with uploadProgress***
                }),
                ...children(uploadImageUploadErrorElm, {
                    // layouts:
                    display     : 'grid',
                    
                    
                    
                    // sizes:
                    justifySelf : 'center', // center the self horizontally
                    alignSelf   : 'center', // center the self vertically
                    
                    
                    
                    // customize:
                    ...usesCssProps(usesPrefixedProps(uploadImages, 'uploadError')), // apply config's cssProps starting with uploadError***
                }),
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(uploadImages, 'media')), // apply config's cssProps starting with media***
            }),
            
            ...children(uploadImageActionGroup, {
                // positions:
                gridArea : 'actionGroup',
                
                
                
                // layouts:
                display         : 'flex',    // use block flexbox, so it takes the entire parent's width
                flexDirection   : 'column',  // the flex direction to vert
                justifyContent  : 'center',  // center items vertically
                alignItems      : 'stretch', // stretch items horizontally
                flexWrap        : 'nowrap',  // no wrapping
                
                
                
                // spacings:
                gap : spacers.default,
                
                
                
                // children:
                ...children(uploadImageSelectButtonElm, {
                    // customize:
                    ...usesCssProps(usesPrefixedProps(uploadImages, 'selectButton')), // apply config's cssProps starting with selectButton***
                }),
                ...children(uploadImageDeleteButtonElm, {
                    // customize:
                    ...usesCssProps(usesPrefixedProps(uploadImages, 'deleteButton')), // apply config's cssProps starting with deleteButton***
                }),
                ...children(uploadImageRetryButtonElm, {
                    // customize:
                    ...usesCssProps(usesPrefixedProps(uploadImages, 'retryButton')), // apply config's cssProps starting with retryButton***
                }),
                ...children(uploadImageCancelButtonElm, {
                    // customize:
                    ...usesCssProps(usesPrefixedProps(uploadImages, 'cancelButton')), // apply config's cssProps starting with cancelButton***
                }),
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(uploadImages, 'action')), // apply config's cssProps starting with action***
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
        ...usesContentVariants(),
        ...resizableRule(),
    });
};

export default () => style({
    // layouts:
    ...usesUploadImageLayout(),
    
    // variants:
    ...usesUploadImageVariants(),
});
