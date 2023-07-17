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
const usePrintDialogLayout = () => {
    return style({
        // positions:
        position : 'fixed', // global <PrintDialog>: directly inside `body > portal` => fixed position
        inset        : 0,   // span the <PrintDialog> to the edges of <container>
        zIndex       : globalStacks.modalBackdrop,
        
        
        
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
    scope('printDialog', {
        ...usePrintDialogLayout(),
    }, { specificityWeight: 2 }),
    scope('closeButton', {
        ...useCloseButtonLayout(),
    }, { specificityWeight: 2 }),
    scope('visuallyHidden', {
        ...usesVisuallyHiddenLayout(),
    }),
];
