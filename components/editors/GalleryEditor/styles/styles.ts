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
    galleryEditorMediaGroupElm,
    galleryEditorImageElm,
    galleryEditorBusyElm,
    
    galleryEditorUploadGroupElm,
    galleryEditorUploadTitleElm,
    
    galleryEditorUploadingGroupElm,
    galleryEditorDeletingImageTitleElm,
    galleryEditorUploadingTitleElm,
    galleryEditorUploadingErrorTitleElm,
    galleryEditorPreviewImageElm,
    galleryEditorUploadProgressElm,
    galleryEditorUploadErrorElm,
    
    galleryEditorActionGroupElm,
    galleryEditorSelectButtonElm,
    galleryEditorDeleteButtonElm,
    galleryEditorRetryButtonElm,
    galleryEditorCancelButtonElm,
    
    galleryEditorInputFileElm,
}                           from './elements'
import {
    // configs:
    galleryEditors,
    cssGalleryEditorConfig,
}                           from './config'



// styles:
export const onGalleryEditorStylesChange = watchChanges(cssGalleryEditorConfig.onChange);

export const usesGalleryEditorLayout = () => {
    // dependencies:
    
    // capabilities:
    const {groupableRule, groupableVars} = usesGroupable({
        orientationInlineSelector : null, // never, calculate the inner border radius manually
        orientationBlockSelector  : null, // never, calculate the inner border radius manually
        itemsSelector             : null, // never, calculate the inner border radius manually
    });
    
    // features:
    const {animationRule, animationVars} = usesAnimation(galleryEditors as any);
    const {paddingRule  , paddingVars  } = usesPadding(usesPrefixedProps(galleryEditors, 'item'));
    
    
    
    // spacings:
    const positivePaddingInline = groupableVars.paddingInline;
    const positivePaddingBlock  = groupableVars.paddingBlock;
    const negativePaddingInline = `calc(0px - ${positivePaddingInline})`;
    const negativePaddingBlock  = `calc(0px - ${positivePaddingBlock })`;
    
    
    
    return style({
        // layouts:
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
            ...children([galleryEditorMediaGroupElm, galleryEditorUploadingGroupElm, galleryEditorUploadGroupElm], {
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
                    // overflow          : 'hidden', // clip the children at the rounded corners
                    
                    
                    
                    // children:
                    ...children([galleryEditorImageElm, galleryEditorPreviewImageElm, galleryEditorActionGroupElm], {
                        // borders:
                        // clone <Item>'s border radius:
                        borderStartStartRadius : `calc(${groupableVars.borderStartStartRadius} - ${groupableVars.borderWidth} - min(${groupableVars.borderWidth}, 0.5px))`,
                        borderStartEndRadius   : `calc(${groupableVars.borderStartEndRadius}   - ${groupableVars.borderWidth} - min(${groupableVars.borderWidth}, 0.5px))`,
                        borderEndStartRadius   : `calc(${groupableVars.borderEndStartRadius}   - ${groupableVars.borderWidth} - min(${groupableVars.borderWidth}, 0.5px))`,
                        borderEndEndRadius     : `calc(${groupableVars.borderEndEndRadius}     - ${groupableVars.borderWidth} - min(${groupableVars.borderWidth}, 0.5px))`,
                        
                        
                        
                        // spacings:
                        marginInline  : negativePaddingInline, // cancel out parent's padding with negative margin
                        marginBlock   : negativePaddingBlock,  // cancel out parent's padding with negative margin
                    }),
                    ...children([galleryEditorImageElm, galleryEditorPreviewImageElm], {
                        // positions:
                        justifySelf    : 'stretch', // stretch the self horizontally
                        alignSelf      : 'stretch', // stretch the self vertically
                        // justifySelf    : 'center', // center the self horizontally
                        // alignSelf      : 'center', // center the self vertically
                        
                        
                        
                        // sizes:
                        minInlineSize  : 0,         // starts growing from 0px up to "image" gridArea
                        minBlockSize   : 0,         // starts growing from 0px up to "image" gridArea
                        // maxInlineSize  : '100%', // do not overflow the <parent>
                        // maxBlockSize   : '100%', // do not overflow the <parent>
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
                        paddingInline   : positivePaddingInline, // restore parent's padding with positive margin
                        paddingBlock    : positivePaddingBlock,  // restore parent's padding with positive margin
                        gap             : spacers.default,
                        
                        
                        
                        // children:
                        ...descendants([galleryEditorDeletingImageTitleElm, galleryEditorUploadTitleElm, galleryEditorUploadingTitleElm, galleryEditorUploadingErrorTitleElm, 'p'], {
                            margin    : 0,        // no margin for <p>, <h1>...<h6>
                            textAlign : 'center', // center text for <p>, <h1>...<h6>
                        }),
                        ...descendants([galleryEditorDeletingImageTitleElm, galleryEditorUploadTitleElm, galleryEditorUploadingTitleElm, galleryEditorUploadingErrorTitleElm], {
                            fontSize : typos.fontSizeMd,
                            
                            
                            
                            // customize:
                            ...usesCssProps(usesPrefixedProps(galleryEditors, 'title')), // apply config's cssProps starting with title***
                        }),
                        
                        // <ElementWithActions>'s children:
                        ...children(galleryEditorBusyElm, {
                            // positions:
                            alignSelf   : 'center', // center the self horizontally
                            
                            
                            
                            // typos:
                            fontSize    : '3rem',
                            
                            
                            
                            // customize:
                            ...usesCssProps(usesPrefixedProps(galleryEditors, 'busy')), // apply config's cssProps starting with busy***
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
                            // positions:
                            alignSelf   : 'center', // center the self horizontally
                            
                            
                            
                            // layouts:
                            display     : 'grid',
                            
                            
                            
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
                        
                        
                        
                        // customize:
                        ...usesCssProps(usesPrefixedProps(galleryEditors, 'action')), // apply config's cssProps starting with action***
                    }),
                    
                    
                    
                    // customize:
                    ...usesCssProps(usesPrefixedProps(galleryEditors, 'item')), // apply config's cssProps starting with item***
                    
                    
                    
                    // spacings:
                    /* important to be placed after "customize" */
                 // padding       : paddingVars.padding,
                    paddingInline : paddingVars.paddingInline,
                    paddingBlock  : paddingVars.paddingBlock,
                }),
                
                
                
                // features:
                ...paddingRule(), // must be placed at the last
            }),
            ...children([galleryEditorMediaGroupElm, galleryEditorUploadingGroupElm], {
                // children:
                ...children(galleryEditorActionGroupElm, {
                    // sizes:
                    contain  : 'size', // follows <Image>'s size, including fractional size, so the aspect ratio preserved accurately
                }),
            }),
            ...children(galleryEditorMediaGroupElm, {
                // layouts:
                display      : 'grid',
                gridTemplate : [[
                    '"delete edit ..." auto',
                    '"...... .... ..." 1fr',
                    '/',
                    ' auto   auto  1fr'
                ]],
                
                
                
                // accessibilities:
                cursor       : 'move',
                
                
                
                // children:
                ...children([galleryEditorImageElm, galleryEditorActionGroupElm], {
                    // positions:
                    gridArea : '1/1/-1/-1',
                }),
                ...children(galleryEditorImageElm, {
                    // layouts:
                    ...style({
                        // customize:
                        ...usesCssProps(usesPrefixedProps(galleryEditors, 'image')), // apply config's cssProps starting with image***
                        
                        
                        
                        // animations:
                        filter : animationVars.filter,
                        anim   : animationVars.anim,
                    }),
                    
                    
                    
                    // features:
                    ...animationRule(), // must be placed at the last
                }),
                ...children(galleryEditorDeleteButtonElm, {
                    // positions:
                    gridArea : 'delete',
                    
                    
                    
                    // customize:
                    ...usesCssProps(usesPrefixedProps(galleryEditors, 'deleteButton')), // apply config's cssProps starting with deleteButton***
                }),
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(galleryEditors, 'media')), // apply config's cssProps starting with media***
            }),
            ...children(galleryEditorUploadingGroupElm, {
                // children:
                ...children(galleryEditorPreviewImageElm, {
                    // positions:
                    gridArea : 'media',
                    
                    
                    
                    // customize:
                    ...usesCssProps(usesPrefixedProps(galleryEditors, 'previewImage')), // apply config's cssProps starting with previewImage***
                }),
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(galleryEditors, 'uploading')), // apply config's cssProps starting with uploading***
            }),
            ...children(galleryEditorUploadGroupElm, {
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
        ...resizableRule(),
    });
};

export const usesGalleryEditorStates = () => {
    // dependencies:
    
    // states:
    const {disableableRule} = usesDisableable(galleryEditors);
    
    
    
    return style({
        // children:
        ...children(galleryEditorMediaGroupElm, {
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
            
            
            
            // children:
            ...children(galleryEditorImageElm, {
                // states:
                ...disableableRule(),
            }),
        }),
        ...children(galleryEditorUploadGroupElm, {
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
