// cssfn:
import {
    // writes css in javascript:
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
    // removes browser's default stylesheet:
    stripoutFocusableElement,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
    
    
    
    // size options of UI:
    usesResizable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // styles:
    onControlStylesChange,
    usesControlLayout,
    usesControlVariants,
    usesControlStates,
}                           from '@reusable-ui/control'         // a base component
import {
    // styles:
    onContentStylesChange,
    usesContentLayout,
    usesContentVariants,
    usesContentChildren,
}                           from '@reusable-ui/content'         // a base component

// internals:
import {
    // elements:
    editableElm,
    placeholderElm,
}                           from './elements'
import {
    // configs:
    wysiwygEditors,
    cssWysiwygEditorConfig,
}                           from './config'



// styles:
export const onCarouselStylesChange = watchChanges(onControlStylesChange, onContentStylesChange, cssWysiwygEditorConfig.onChange);



export const usesEditableLayout = () => {
    // dependencies:
    
    // features:
    const {borderRule, borderVars } = usesBorder({ borderWidth: '0px' });
    const {            paddingVars} = usesPadding();
    
    
    
    return style({
        // layouts:
        ...usesControlLayout(),
        ...usesContentLayout(),
        ...style({
            // layouts:
            display      : 'grid',    // use block grid, so it takes the entire parent's width
            
            // child default sizes:
            justifyItems : 'stretch', // <editable> & <placeholder> fills the entire area's width
            alignItems   : 'stretch', // <editable> & <placeholder> fills the entire area's height
            
            
            
            // children:
            ...children([editableElm, placeholderElm], {
                // positions:
                gridArea : '1/1/-1/-1', // fills the entire <parent>'s gridArea(s)
                
                
                
                // layouts:
                ...style({
                    // layouts:
                    display   : 'block', // fills the entire parent's width & provides normal writing experience
                    
                    
                    
                    // sizes:
                    flex      : [[1, 1, '100%']], // growable, shrinkable, initial 100% parent's width
                    alignSelf : 'stretch',        // follows parent's height
                    
                    
                    
                    // borders:
                    // follows <parent>'s borderRadius
                    border                   : borderVars.border,
                 // borderRadius             : borderVars.borderRadius,
                    borderStartStartRadius   : borderVars.borderStartStartRadius,
                    borderStartEndRadius     : borderVars.borderStartEndRadius,
                    borderEndStartRadius     : borderVars.borderEndStartRadius,
                    borderEndEndRadius       : borderVars.borderEndEndRadius,
                    [borderVars.borderWidth] : '0px', // only setup borderRadius, no borderStroke
                    
                    
                    
                    // spacings:
                    // cancel-out parent's padding with negative margin:
                    marginInline   : `calc(0px - ${paddingVars.paddingInline})`,
                    marginBlock    : `calc(0px - ${paddingVars.paddingBlock })`,
                    
                    // copy parent's paddings:
                    paddingInline  : paddingVars.paddingInline,
                    paddingBlock   : paddingVars.paddingBlock,
                }),
                
                
                
                // features:
                ...borderRule(), // must be placed at the last
            }),
            ...children(editableElm, {
                // resets:
                ...stripoutFocusableElement(), // clear browser's default styles
                
                
                
                // layouts:
                ...style({
                    // customize:
                    ...usesCssProps(wysiwygEditors), // apply config's cssProps
                }),
            }),
            ...children(placeholderElm, {
                // accessibilities:
                pointerEvents : 'none', // just an overlay element (ghost), no mouse interaction, clicking on it will focus on the <editable>
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(wysiwygEditors, 'placeholder')), // apply config's cssProps starting with placeholder***
            }),
        }),
    });
};

export const usesEditableVariants = () => {
    // dependencies:
    
    // variants:
    const {resizableRule} = usesResizable(wysiwygEditors);
    
    
    
    return style({
        // variants:
        ...usesControlVariants(),
        ...usesContentVariants(),
        ...resizableRule(),
    });
};

export const usesEditableStates = usesControlStates;

export const usesEditableChildren = () => {
    return style({
        // children:
        ...children(editableElm, {
            // children:
            ...usesContentChildren(),
        }),
    });
};

export default () => style({
    // layouts:
    ...usesEditableLayout(),
    
    // variants:
    ...usesEditableVariants(),
    
    // states:
    ...usesEditableStates(),
    
    // children:
    ...usesEditableChildren(),
});
