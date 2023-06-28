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
    // elements:
    imageElm,
    actionsContainerElm,
    actionsPanelElm,
    actionDeleteElm,
    contentElm,
    uploadingImageElm,
    uploadingImagePreviewElm,
    uploadImageElm,
    uploadImageInputFileElm,
}                           from './elements'
import {
    // configs:
    galleryEditors,
    cssGalleryEditorConfig,
}                           from './config'



// styles:
export const onGalleryEditorStylesChange = watchChanges(onContentStylesChange, cssGalleryEditorConfig.onChange);

export const usesGalleryEditorLayout = () => {
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
            ...children([imageElm, uploadingImageElm, uploadImageElm], {
                // sizes:
                inlineSize : 'unset', // we need to manage the <img>'s width
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(galleryEditors, 'item')), // apply config's cssProps starting with item***
            }),
            ...children(imageElm, {
                // accessibilities:
                cursor     : 'move',
                
                
                
                // rules:
                ...rule(actionsContainerElm, {
                    // layouts:
                    display        : 'inline-flex', // make an inline element like <img>
                    flexDirection  : 'column',      // we'll manipulate the <img> height
                    justifyContent : 'center',
                    alignItems     : 'center',
                    
                    
                    
                    // sizes:
                    // width          : 'fit-content', // follows the <img> width
                    width          : '100%',
                    
                    
                    
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
                    }),
                    
                    
                    
                    // customize:
                    ...usesCssProps(usesPrefixedProps(galleryEditors, 'actions')), // apply config's cssProps starting with actions***
                }),
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(galleryEditors, 'image')), // apply config's cssProps starting with image***
            }),
            ...children([uploadingImageElm, uploadImageElm], {
                // layouts:
                display        : 'flex',    // use block flexbox, so it takes the entire parent's width
                flexDirection  : 'column',  // items are stacked vertically
                justifyContent : 'center',  // center item vertically
                alignItems     : 'center',  // center item horizontally
                flexWrap       : 'nowrap',  // prevents the items to wrap to the next column
                
                
                
                // spacings:
                gap            : spacers.default,
                
                
                
                // children:
                ...children('*', {
                    // spacings:
                    margin     : 0,
                }),
            }),
            ...children(uploadingImageElm, {
                // children:
                ...children(uploadingImagePreviewElm, {
                    // positions:
                    position : 'absolute',
                    inset    : 0,
                    margin   : 'auto',
                    zIndex   : -9,
                    
                    
                    
                    // customize:
                    ...usesCssProps(usesPrefixedProps(galleryEditors, 'preview')), // apply config's cssProps starting with preview***
                }),
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(galleryEditors, 'uploading')), // apply config's cssProps starting with uploading***
            }),
            ...children(uploadImageElm, {
                // children:
                ...children(uploadImageInputFileElm, {
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
    return style({
        // children:
        ...children(imageElm, {
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
        }),
        ...children(uploadImageElm, {
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
