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
    
    
    
    // a capability of UI to stack on top-most of another UI(s) regardless of DOM's stacking context:
    globalStacks,
}                           from '@reusable-ui/core'    // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // styles:
    usesVisuallyHiddenLayout,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// styles:
const usePrintOrderDialogLayout = () => {
    return style({
        // positions:
        position : 'fixed', // global <PrintOrderDialog>: directly inside `body > portal` => fixed position
        inset        : 0,   // span the <PrintOrderDialog> to the edges of <container>
        zIndex       : globalStacks.modalBackdrop,
        
        
        
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
