// cssfn:
import {
    // writes css in javascript:
    children,
    style,
}                           from '@cssfn/core'          // writes css in javascript



// styles:
const usesVariantPreviewLayout = () => { // the <ListItem> of variant list
    return style({
        // layouts:
        display       : 'grid',
        gridTemplate  : [[
            '"name grip edit"',
            '/',
            '1fr min-content auto',
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
    ...usesVariantPreviewLayout(),
});
