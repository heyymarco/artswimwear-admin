// cssfn:
import {
    // writes css in javascript:
    rule,
    children,
    style,
}                           from '@cssfn/core'          // writes css in javascript



// styles:
const usesStockPreviewLayout = () => { // the <ListItem> of variantGroup list
    return style({
        // layouts:
        display       : 'grid',
        gridTemplate  : [[
            '"variants stock"',
            '/',
            '1fr 1fr',
        ]],
        ...rule(':not(:has(>.variants))', {
            gridTemplate : [[
                '"... stock ..."',
                '/',
                '0.5fr 1fr 0.5fr',
            ]],
        }),
        
        
        
        // spacings:
        gap           : '1rem',
        paddingInline : '1rem',
        paddingBlock  : '0.5rem',
        
        
        
        // children:
        ...children('.variants', {
            // positions:
            gridArea : 'variants',
            
            
            
            // children:
            ...children('*', {
                ...children('.variant', {
                    // layout:
                    display: 'grid',
                    justifyContent: 'center',
                    alignContent  : 'center',
                }),
            }),
        }),
        ...children('.stock', {
            // positions:
            gridArea : 'stock',
        }),
    });
};

export default style({
    // layouts:
    ...usesStockPreviewLayout(),
});
