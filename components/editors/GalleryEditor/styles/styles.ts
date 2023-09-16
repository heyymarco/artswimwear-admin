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
    
    
    
    // animation stuff of UI:
    usesAnimation,
    
    
    
    // groups a list of UIs into a single UI:
    usesGroupable,
    
    
    
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
    galleryEditorImageElm,
    actionsContainerElm,
    actionsPanelElm,
    actionDeleteElm,
    contentElm,
    uploadingPanelElm,
    galleryEditorPreviewImageElm,
    uploadPanelElm,
    galleryEditorInputFileElm,
    galleryEditorUploadProgressElm,
    galleryEditorUploadErrorElm,
    galleryEditorRetryButtonElm,
    galleryEditorCancelButtonElm,
    galleryEditorActionGroupElm,
    galleryEditorSelectButtonElm,
    uploadImageTitleElm,
    uploadingImageTitleElm,
    uploadingImageErrorTitleElm,
}                           from './elements'
import {
    // configs:
    galleryEditors,
    cssGalleryEditorConfig,
}                           from './config'



// styles:
export const onGalleryEditorStylesChange = watchChanges(onContentStylesChange, cssGalleryEditorConfig.onChange);

export const usesGalleryEditorLayout = () => {
    // dependencies:
    
    // capabilities:
    const {groupableRule, groupableVars} = usesGroupable({
        orientationInlineSelector : null, // never
        orientationBlockSelector  : '&',  // always
        itemsSelector             : [galleryEditorPreviewImageElm, galleryEditorActionGroupElm],
    });
    
    // features:
    const {animationRule , animationVars } = usesAnimation(galleryEditors as any);
    
    
    
    // spacings:
    const positivePaddingInline = groupableVars.paddingInline;
    const positivePaddingBlock  = groupableVars.paddingBlock;
    const negativePaddingInline = `calc(0px - ${positivePaddingInline})`;
    const negativePaddingBlock  = `calc(0px - ${positivePaddingBlock })`;
    
    
    
    return style({
        // layouts:
        ...usesContentLayout(),
        ...style({
            // layouts:
            display             : 'grid',        // use css block grid for layouting, the core of our GalleryEditor layout
            gridAutoFlow        : 'row',         // items direction is to inline & wrap's direction is to block
            gridAutoRows        : galleryEditors.itemRaiseRowHeight,
            gridTemplateColumns : `repeat(auto-fill, minmax(${galleryEditors.itemMinColumnWidth}, 1fr))`,
            gridTemplateRows    : '1fr',         // consistent height for each item
            
            // item default sizes:
            justifyItems        : 'stretch',     // each item fills the entire Gallery's column width
            alignItems          : 'stretch',     // consistent height for each item
            
            
            
            // children:
            ...children([galleryEditorImageElm, uploadingPanelElm, uploadPanelElm], {
                // customize:
                ...usesCssProps(usesPrefixedProps(galleryEditors, 'item')), // apply config's cssProps starting with item***
            }),
            ...children([uploadingPanelElm, uploadPanelElm], {
                // capabilities:
                ...groupableRule(), // make a nicely rounded corners
                
                
                
                // layouts:
                ...style({
                    // layouts:
                    display        : 'grid',
                    gridTemplate   : [[
                        '"media" auto',
                        '/',
                        'auto'
                    ]],
                    
                    
                    
                    // borders:
                    overflow          : 'hidden', // clip the children at the rounded corners
                    
                    
                    
                    // children:
                    ...children([galleryEditorPreviewImageElm, galleryEditorActionGroupElm], {
                        // spacings:
                        marginInline  : negativePaddingInline, // cancel out parent's padding with negative margin
                        marginBlock   : negativePaddingBlock,  // cancel out parent's padding with negative margin
                    }),
                    ...children(galleryEditorActionGroupElm, {
                        // spacings:
                        paddingInline : positivePaddingInline, // restore parent's padding with positive margin
                        paddingBlock  : positivePaddingBlock,  // restore parent's padding with positive margin
                    }),
                    ...children(galleryEditorActionGroupElm, {
                        // positions:
                        gridArea        : 'media',
                        zIndex          : 1,
                        
                        
                        
                        // layouts:
                        display         : 'flex',    // use block flexbox, so it takes the entire parent's width
                        flexDirection   : 'column',  // the flex direction to vert
                        justifyContent  : 'center',  // center items vertically
                        alignItems      : 'stretch', // stretch items horizontally
                        flexWrap        : 'nowrap',  // no wrapping
                        
                        
                        
                        // spacings:
                        gap : spacers.default,
                        
                        
                        
                        // children:
                        ...descendants([uploadImageTitleElm, uploadingImageTitleElm, uploadingImageErrorTitleElm, 'p'], {
                            margin    : 0,        // no margin for <p>, <h1>...<h6>
                            textAlign : 'center', // center text for <p>, <h1>...<h6>
                        }),
                        ...descendants([uploadImageTitleElm, uploadingImageTitleElm, uploadingImageErrorTitleElm], {
                            fontSize : typos.fontSizeMd,
                            
                            
                            
                            // customize:
                            ...usesCssProps(usesPrefixedProps(galleryEditors, 'title')), // apply config's cssProps starting with title***
                        }),
                        
                        // <UploadImage>'s children:
                        ...children(galleryEditorSelectButtonElm, {
                            // customize:
                            ...usesCssProps(usesPrefixedProps(galleryEditors, 'selectButton')), // apply config's cssProps starting with selectButton***
                        }),
                        
                        // <UploadingImage>'s children:
                        ...children(galleryEditorUploadProgressElm, {
                            // customize:
                            ...usesCssProps(usesPrefixedProps(galleryEditors, 'uploadProgress')), // apply config's cssProps starting with uploadProgress***
                        }),
                        ...children(galleryEditorUploadErrorElm, {
                            // layouts:
                            display     : 'grid',
                            
                            
                            
                            // sizes:
                            justifySelf : 'center', // center the self horizontally
                            alignSelf   : 'center', // center the self vertically
                            
                            
                            
                            // spacings:
                            gap : spacers.sm,
                            
                            
                            
                            // customize:
                            ...usesCssProps(usesPrefixedProps(galleryEditors, 'uploadError')), // apply config's cssProps starting with uploadError***
                        }),
                        ...children(galleryEditorRetryButtonElm, {
                            // customize:
                            ...usesCssProps(usesPrefixedProps(galleryEditors, 'retryButton')), // apply config's cssProps starting with retryButton***
                        }),
                        ...children(galleryEditorCancelButtonElm, {
                            // customize:
                            ...usesCssProps(usesPrefixedProps(galleryEditors, 'cancelButton')), // apply config's cssProps starting with cancelButton***
                        }),
                    }),
                }),
            }),
            ...children(galleryEditorImageElm, {
                // accessibilities:
                cursor     : 'move',
                
                
                
                // rules:
                ...rule(actionsContainerElm, {
                    // layouts:
                    ...style({
                        // layouts:
                        display        : 'inline-flex', // make an inline element like <img>
                        flexDirection  : 'column',      // we'll manipulate the <img> height
                        justifyContent : 'center',
                        alignItems     : 'center',
                        
                        
                        
                        // sizes:
                        // width          : 'fit-content', // follows the <img> width
                        width          : '100%',
                        
                        
                        
                        // animations:
                        filter         : animationVars.filter,
                        anim           : animationVars.anim,
                        
                        
                        
                        // children:
                        ...children(actionsPanelElm, {
                            // layouts:
                            display: 'grid',
                            gridTemplate : [[
                                '"delete edit ..." auto',
                                '"...... .... ..." 1fr',
                                '/',
                                ' auto   auto  1fr'
                            ]],
                            justifyItems : 'center',
                            alignItems   : 'center',
                            
                            
                            
                            // sizes:
                            // maxWidth     : '100%',
                            // maxHeight    : '100%',
                            width        : '100%', // fill the entire <parent>
                            height       : '100%', // fill the entire <parent>
                            
                            
                            
                            // children:
                            ...children(contentElm, {
                                // positions:
                                gridArea  : '1/1/-1/-1',
                                
                                
                                
                                // sizes:
                                maxWidth  : '100%',
                                maxHeight : '100%',
                            }),
                            ...children(actionDeleteElm, {
                                // positions:
                                gridArea  : 'delete',
                            }),
                            
                            
                            
                            // customize:
                            ...usesCssProps(usesPrefixedProps(galleryEditors, 'panel')), // apply config's cssProps starting with panel***
                        }),
                        
                        
                        
                        // customize:
                        ...usesCssProps(usesPrefixedProps(galleryEditors, 'action')), // apply config's cssProps starting with action***
                    }),
                    
                    
                    
                    // features:
                    ...animationRule(),  // must be placed at the last
                }),
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(galleryEditors, 'image')), // apply config's cssProps starting with image***
            }),
            ...children(uploadingPanelElm, {
                // children:
                ...children(galleryEditorPreviewImageElm, {
                    // positions:
                    gridArea       : 'media',
                    
                    
                    
                    // sizes:
                    justifySelf    : 'stretch', // stretch the self horizontally
                    alignSelf      : 'stretch', // stretch the self vertically
                    minInlineSize  : 0,
                    minBlockSize   : 0,
                    
                    
                    
                    // customize:
                    ...usesCssProps(usesPrefixedProps(galleryEditors, 'previewImage')), // apply config's cssProps starting with previewImage***
                }),
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(galleryEditors, 'uploading')), // apply config's cssProps starting with uploading***
            }),
            ...children(uploadPanelElm, {
                ...children(galleryEditorInputFileElm, {
                    // layouts:
                    display: 'none',
                }),
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(galleryEditors, 'upload')), // apply config's cssProps starting with upload***
            }),
            
            
            
            // customize:
            ...usesCssProps(galleryEditors), // apply config's cssProps
        }),
    });
};

export const usesGalleryEditorVariants = () => {
    // dependencies:
    
    // variants:
    const {resizableRule} = usesResizable(galleryEditors);
    
    
    
    return style({
        // variants:
        ...usesContentVariants(),
        ...resizableRule(),
    });
};

export const usesGalleryEditorStates = () => {
    // dependencies:
    
    // states:
    const {disableableRule} = usesDisableable(galleryEditors);
    
    
    
    return style({
        // children:
        ...children(galleryEditorImageElm, {
            // states:
            ...states([
                rule('.dragged', {
                    // animations:
                    anim : galleryEditors.animDragged,
                }),
                rule('.dropped', {
                    // animations:
                    anim : galleryEditors.animDropped,
                }),
                rule('.dropTarget', {
                    // animations:
                    anim : galleryEditors.animDropTarget,
                }),
                rule('.shiftedUp', {
                    // animations:
                    anim : galleryEditors.animShiftedUp,
                }),
                rule('.shiftedDown', {
                    // animations:
                    anim : galleryEditors.animShiftedDown,
                }),
            ]),
            
            
            
            // rules:
            ...rule(actionsContainerElm, {
                // states:
                ...disableableRule(),
            }),
        }),
        ...children(uploadPanelElm, {
            // states:
            ...states([
                rule('.dropTarget', {
                    // animations:
                    anim : galleryEditors.uploadAnimDropTarget,
                }),
            ]),
        }),
    });
};

export default () => style({
    // layouts:
    ...usesGalleryEditorLayout(),
    
    // variants:
    ...usesGalleryEditorVariants(),
    
    // states:
    ...usesGalleryEditorStates(),
});
