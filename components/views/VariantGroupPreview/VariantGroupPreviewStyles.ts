// cssfn:
import {
    // writes css in javascript:
    children,
    style,
}                           from '@cssfn/core'          // writes css in javascript



// styles:
const usesVariantGroupPreviewLayout = () => { // the <ListItem> of variantGroup list
    return style({
        // layouts:
        display       : 'grid',
        gridTemplate  : [[
            '"name grip edit"',
            '/',
            '1fr auto auto',
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
            gridArea    : 'grip',
            
            
            
            // accessibilities:
            cursor      : 'move',
        }),
        ...children('.edit', {
            // positions:
            gridArea : 'edit',
        }),
    });
};

export default style({
    // layouts:
    ...usesVariantGroupPreviewLayout(),
});
