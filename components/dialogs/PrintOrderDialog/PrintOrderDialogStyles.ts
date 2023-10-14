// cssfn:
import {
    // writes css in javascript:
    rule,
    style,
    scope,
}                           from '@cssfn/core'          // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
}                           from '@reusable-ui/core'    // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // styles:
    usesVisuallyHiddenLayout,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// styles:
const useBackdropLayout = () => {
    return style({
        // layouts:
        display      : 'grid', // use css grid for layouting
        gridTemplate : [[
            '"content" 100%',
            '/',
            '100%'
        ]],
    });
};
const usePopupLayout = () => {
    return style({
        // sizes:
        inlineSize   : '100%',
        maxBlockSize : '100%',
        
        
        
        // scrolls:
        overflow     : 'auto',
    });
};
const useCardLayout = () => {
    return style({
        // sizes:
        inlineSize : '100%',
        
        
        
        // borders:
        borderWidth : '0px',
    });
};

const usePrintOrderDialogLayout = () => {
    return style({
        // layouts:
        display        : 'flex',
        flexDirection  : 'column',
        justifyContent : 'start',   // if items are not growable, the excess space (if any) placed at the end, and if no sufficient space available => the first item should be visible first
        alignItems     : 'stretch', // items width are 100% of the parent (for variant `.block`) or height (for variant `.inline`)
        flexWrap       : 'nowrap',  // no wrapping
        
        
        
        // scrolls:
        ...rule('@media not print', {
            overflow : 'auto',
        }),
        
        
        
        // backgrounds:
        backg        : 'white',
        
        
        
        // borders:
        border       : 'none',
        borderRadius : 0,
    });
};
const useCloseButtonLayout = () => {
    return style({
        // layouts:
        ...rule('@media print', {
            display: 'none', // hide the <Button> if [print mode]
        }),
        
        
        
        // spacings:
        margin : spacers.default,
    });
};

export default () => [
    scope('backdrop', {
        ...useBackdropLayout(),
    }, { specificityWeight: 2 }),
    scope('popup', {
        ...usePopupLayout(),
    }, { specificityWeight: 4 }),
    scope('card', {
        ...useCardLayout(),
    }, { specificityWeight: 3 }),
    
    scope('printOrderDialog', {
        ...usePrintOrderDialogLayout(),
    }, { specificityWeight: 2 }),
    scope('closeButton', {
        ...useCloseButtonLayout(),
    }, { specificityWeight: 2 }),
    scope('visuallyHidden', {
        ...usesVisuallyHiddenLayout(),
    }),
];
