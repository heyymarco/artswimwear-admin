// cssfn:
import {
    // writes css in javascript:
    children,
    style,
    scope,
}                           from '@cssfn/core'          // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a typography management system:
    typos,
}                           from '@reusable-ui/core'    // a set of reusable-ui packages which are responsible for building any component



// styles:
const usesBuyShippingLabelDialogLayout = () => {
    return style({
    });
};

export default () => [
    scope('createModel', {
        ...usesBuyShippingLabelDialogLayout(),
    }),
];
