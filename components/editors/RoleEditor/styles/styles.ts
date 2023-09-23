// cssfn:
import {
    // writes css in javascript:
    rule,
    children,
    scope,
    style,
    
    
    
    // reads/writes css variables configuration:
    usesCssProps,
    
    
    
    // writes complex stylesheets in simpler way:
    watchChanges,
}                           from '@cssfn/core'                  // writes css in javascript



// styles:

export const usesDataListInnerLayout = () => {
    return style({
        // layouts:
        display       : 'flex',
        flexDirection : 'row',
        alignItems    : 'center',
        
        
        
        // spacings:
        gap           : '1rem',
        paddingInline : '1rem',
        paddingBlock  : '0.5rem',
        
        
        
        // children:
        ...children('.decorator', {
            flex : [[0, 0, 'auto']], // ungrowable, unshrinkable, initial from it's width
        }),
        ...children('.noValue', {
            // appearances:
            opacity    : 0.5,
            
            
            
            // typos:
            fontStyle  : 'italic',
        }),
    });
};

const usesCreateDataLayout = () => { // the <ListItem> of data add_new
    return style({
        // layouts:
        display: 'flex',
        flexDirection: 'column',
    });
};

export default () => [
    scope('listDataInner', {
        // layouts:
        ...usesDataListInnerLayout(),
    }, { specificityWeight: 2 }),
    scope('createData', { // the <ListItem> of data add_new
        ...usesCreateDataLayout(),
    }),
];
