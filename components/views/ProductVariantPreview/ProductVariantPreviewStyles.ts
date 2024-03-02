// cssfn:
import {
    // writes css in javascript:
    children,
    style,
}                           from '@cssfn/core'          // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
const usesProductVariantPreviewLayout = () => { // the <ListItem> of variant list
    return style({
        // layouts:
        display       : 'grid',
        gridTemplate  : [[
            '"name visibility grip edit"',
            '/',
            '1fr min-content min-content min-content',
        ]],
        
        
        
        // spacings:
        gap           : '1rem',
        paddingInline : '1rem',
        paddingBlock  : '0.5rem',
        
        
        
        // children:
        ...children('.name', {
            // positions:
            gridArea : 'name',
            
            
            
            // spacings:
            margin: 0,
        }),
        ...children('.visibility', {
            // spacings:
            padding       : spacers.xs,
            
            
            
            // typos:
            lineHeight    : 1,
        }),
        ...children('.grip', {
            // positions:
            gridArea : 'grip',
        }),
        ...children('.edit', {
            // positions:
            gridArea : 'edit',
        }),
    });
};

export default style({
    // layouts:
    ...usesProductVariantPreviewLayout(),
});
