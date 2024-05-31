// cssfn:
import {
    // writes css in javascript:
    rule,
    style,
    scope,
}                           from '@cssfn/core'          // writes css in javascript

// reusable-ui core:
import {
    // border (stroke) stuff of UI:
    usesBorder,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // styles:
    usesVisuallyHiddenLayout,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// styles:
const useDocumentLayout = () => {
    return style({
        // backgrounds:
        ...rule('@media print', {
            backg      : 'white',    // use white paper on out of printable area
            overflow   : 'hidden',   // fix Chrome's empty pages
        }),
    });
};
const useBackdropLayout = () => {
    return style({
        // positions:
        position       : 'fixed',    // avoid document's scrolling effect
        ...rule('@media print', {
            position   : 'relative', // relative position on paper, keeps the default on screen
        }),
        
        
        
        // layouts:
        display        : 'grid',     // use css grid for layouting
        gridTemplate   : [[
            '"content" 100%',
            '/',
            '100%'
        ]],
        
        
        
        // sizes:
        minBlockSize   : 'unset',    // overwrite of `minBlockSize: 100svh`
    });
};
const usePopupLayout    = () => {
    return style({
        // sizes:
        inlineSize     : '100%',
        maxBlockSize   : '100%',
    });
};
const useCardLayout     = () => {
    // dependencies:
    
    // features:
    const {borderVars} = usesBorder();
    
    
    
    return style({
        // sizes:
        inlineSize     : '100%',
        
        
        
        // scrolls:
        ...rule('@media not print', {
            overflow   : 'auto',     // enable scrolling on screen, disabled on paper
        }),
        
        
        
        // borders:
        [borderVars.borderWidth           ] : '0px',
        [borderVars.borderStartStartRadius] : '0px',
        [borderVars.borderStartEndRadius  ] : '0px',
        [borderVars.borderEndStartRadius  ] : '0px',
        [borderVars.borderEndEndRadius    ] : '0px',
    });
};

const usePrintCaptionLayout = () => {
    return style({
        // layouts:
        ...rule('@media print', {
            display    : 'none',     // hide the <CardHeader> & <CardFooter> if [print mode]
        }),
    });
};
const usePrintDialogLayout  = () => {
    return style({
        // layouts:
        display        : 'flex',
        flexDirection  : 'column',
        justifyContent : 'start',    // if items are not growable, the excess space (if any) placed at the end, and if no sufficient space available => the first item should be visible first
        alignItems     : 'stretch',  // items width are 100% of the parent (for variant `.block`) or height (for variant `.inline`)
        flexWrap       : 'nowrap',   // no wrapping
        
        
        
        // backgrounds:
        backg          : 'white',    // use white paper on printable area
        
        
        
        // borders:
        borderWidth    : '0px',
        borderRadius   : 0,
    });
};

export default () => [
    scope('document', {
        ...useDocumentLayout(),
    }, { specificityWeight: 2 }), // overcome the specificity of `:root`
    scope('backdrop', {
        ...useBackdropLayout(),
    }, { specificityWeight: 2 }),
    scope('popup', {
        ...usePopupLayout(),
    }, { specificityWeight: 4 }),
    scope('card', {
        ...useCardLayout(),
    }, { specificityWeight: 3 }),
    
    scope('body', {
        ...usesVisuallyHiddenLayout(),
    }),
    
    scope('printCaption', {
        ...usePrintCaptionLayout(),
    }, { specificityWeight: 4 }),
    scope('printDialog', {
        ...usePrintDialogLayout(),
    }, { specificityWeight: 2 }),
];
