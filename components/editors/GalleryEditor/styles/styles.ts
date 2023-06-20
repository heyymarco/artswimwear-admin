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
    // configs:
    gedits,
    cssGeditConfig,
}                           from './config'



// elements:
const imageElm          = '.image';
const uploadingImageElm = '.uploadingImage';
const uploadImageElm    = '.uploadImage';



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
            ...children([imageElm, uploadingImageElm, uploadImageElm], {
                // sizes:
                inlineSize : 'unset', // we need to manage the <img>'s width
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(gedits, 'item')), // apply config's cssProps starting with item***
            }),
            ...children(imageElm, {
                // accessibilities:
                cursor     : 'move',
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(gedits, 'image')), // apply config's cssProps starting with image***
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
                // customize:
                ...usesCssProps(usesPrefixedProps(gedits, 'uploading')), // apply config's cssProps starting with uploading***
            }),
            ...children(uploadImageElm, {
                // customize:
                ...usesCssProps(usesPrefixedProps(gedits, 'upload')), // apply config's cssProps starting with upload***
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

export const usesGalleryEditorStates = () => {
    return style({
        // children:
        ...children(imageElm, {
            // states:
            ...states([
                rule('.dragged', {
                    // animations:
                    anim : gedits.animDragged,
                }),
                rule('.dropped', {
                    // animations:
                    anim : gedits.animDropped,
                }),
                rule('.dropTarget', {
                    // animations:
                    anim : gedits.animDropTarget,
                }),
                rule('.shiftedUp', {
                    // animations:
                    anim : gedits.animShiftedUp,
                }),
                rule('.shiftedDown', {
                    // animations:
                    anim : gedits.animShiftedDown,
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
