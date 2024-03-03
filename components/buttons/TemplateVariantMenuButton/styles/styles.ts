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
const usesCreateModelLayout = () => { // the <ListItem> of model add_new
    return style({
        // layouts:
        display: 'grid',
        
        
        
        // children:
        ...children('p', {
            // spacings:
            margin    : 0,
            
            
            
            // typos:
            textAlign : 'center',
        }),
    });
};
const usesLoadingModelLayout = () => { // the <ListItem> of model loading
    return style({
        // layouts:
        display: 'grid',
        
        
        
        // spacings:
        gap: spacers.xs,
        
        
        
        // children:
        ...children('p', {
            // spacings:
            margin    : 0,
            
            
            
            // typos:
            fontSize  : typos.fontSizeSm,
            textAlign : 'center',
        }),
        ...children('[role="status"]', {
            // sizes:
            minInlineSize : 'unset',
        }),
    });
};
const usesErrorModelLayout = () => { // the <ListItem> of model loading
    return style({
        // layouts:
        display: 'grid',
        
        
        
        // spacings:
        gap: spacers.xs,
        
        
        
        // children:
        ...children(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'], {
            // spacings:
            margin    : 0,
            
            
            
            // typos:
            textAlign : 'center',
        }),
        ...children(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], {
            // typos:
            fontSize  : typos.fontSizeMd,
        }),
        ...children('p', {
            // typos:
            fontSize  : typos.fontSizeSm,
        }),
    });
};

export default () => [
    scope('createModel', { // the <ListItem> of model add_new
        ...usesCreateModelLayout(),
    }),
    scope('loadingModel', { // the <ListItem> of model loading
        ...usesLoadingModelLayout(),
    }),
    scope('errorModel', { // the <ListItem> of model error
        ...usesErrorModelLayout(),
    }),
];
