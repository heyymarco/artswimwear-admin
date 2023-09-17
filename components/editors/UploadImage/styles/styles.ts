// cssfn:
import {
    // writes css in javascript:
    rule,
    states,
    descendants,
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
    
    
    
    // a typography management system:
    typos,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // animation stuff of UI:
    usesAnimation,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
    
    
    
    // groups a list of UIs into a single UI:
    usesGroupable,
    
    
    
    // size options of UI:
    usesResizable,
    
    
    
    // a capability of UI to be disabled:
    usesDisableable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internals:
import {
    // elements:
    uploadImageMediaGroupElm,
    uploadImageMediaGroupInnerElm,
    uploadImageUploadingTitleElm,
    uploadImageUploadingErrorTitleElm,
    uploadImageNoImageElm,
    uploadImagePreviewImageElm,
    uploadImageImageElm,
    uploadImageUploadProgressElm,
    uploadImageUploadErrorElm,
    
    uploadImageActionGroupElm,
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
export const onUploadImageStylesChange = watchChanges(cssUploadImageConfig.onChange);

export const usesUploadImageLayout = () => {
    // dependencies:
    
    // capabilities:
    const {groupableRule, groupableVars} = usesGroupable({
        orientationInlineSelector : null, // never
        orientationBlockSelector  : '&',  // always
        itemsSelector             : [uploadImagePreviewImageElm, uploadImageActionGroupElm],
    });
    
    // features:
    const {borderRule    , borderVars    } = usesBorder();
    const {animationRule , animationVars } = usesAnimation(uploadImages as any);
    const {paddingRule   , paddingVars   } = usesPadding();
    
    
    
    return style({
        // layouts:
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
            ...children(uploadImageMediaGroupElm, {
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
                ...descendants([uploadImageUploadingTitleElm, uploadImageUploadingErrorTitleElm, 'p'], {
                    margin    : 0,        // no margin for <p>, <h1>...<h6>
                    textAlign : 'center', // center text for <p>, <h1>...<h6>
                }),
                ...descendants([uploadImageUploadingTitleElm, uploadImageUploadingErrorTitleElm], {
                    fontSize : typos.fontSizeMd,
                    
                    
                    
                    // customize:
                    ...usesCssProps(usesPrefixedProps(uploadImages, 'title')), // apply config's cssProps starting with title***
                }),
                ...children([uploadImageNoImageElm, uploadImagePreviewImageElm, uploadImageImageElm, uploadImageMediaGroupInnerElm], {
                    // positions:
                    gridArea : 'media',
                }),
                ...children([uploadImagePreviewImageElm, uploadImageImageElm], {
                    // sizes:
                    justifySelf    : 'stretch', // stretch the self horizontally
                    alignSelf      : 'stretch', // stretch the self vertically
                    minInlineSize  : 0,
                    minBlockSize   : 0,
                    
                    
                    
                    // borders:
                    border                 : borderVars.border,
                 // borderRadius           : borderVars.borderRadius,
                    borderStartStartRadius : borderVars.borderStartStartRadius,
                    borderStartEndRadius   : borderVars.borderStartEndRadius,
                    borderEndStartRadius   : borderVars.borderEndStartRadius,
                    borderEndEndRadius     : borderVars.borderEndEndRadius,
                    
                    overflow               : 'hidden', // clip the children at the rounded corners
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
                ...children(uploadImageMediaGroupInnerElm, {
                    // positions:
                    zIndex          : 1,
                    
                    
                    
                    // layouts:
                    display         : 'flex',    // use block flexbox, so it takes the entire parent's width
                    flexDirection   : 'column',  // the flex direction to vert
                    justifyContent  : 'center',  // center items vertically
                    alignItems      : 'stretch', // stretch items horizontally
                    flexWrap        : 'nowrap',  // no wrapping
                    
                    
                    
                    // spacings:
                    gap           : spacers.default,
                    
                 // padding       : paddingVars.padding,
                    paddingInline : paddingVars.paddingInline,
                    paddingBlock  : paddingVars.paddingBlock,
                    
                    
                    
                    // children:
                    ...children(uploadImageUploadProgressElm, {
                        // customize:
                        ...usesCssProps(usesPrefixedProps(uploadImages, 'uploadProgress')), // apply config's cssProps starting with uploadProgress***
                    }),
                    ...children(uploadImageUploadErrorElm, {
                        // layouts:
                        display     : 'grid',
                        
                        
                        
                        // sizes:
                        justifySelf : 'center', // center the self horizontally
                        alignSelf   : 'center', // center the self vertically
                        
                        
                        
                        // spacings:
                        gap : spacers.sm,
                        
                        
                        
                        // customize:
                        ...usesCssProps(usesPrefixedProps(uploadImages, 'uploadError')), // apply config's cssProps starting with uploadError***
                    }),
                }),
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(uploadImages, 'media')), // apply config's cssProps starting with media***
            }),
            
            ...children(uploadImageActionGroupElm, {
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
        ...resizableRule(),
    });
};

export default () => style({
    // layouts:
    ...usesUploadImageLayout(),
    
    // variants:
    ...usesUploadImageVariants(),
});
