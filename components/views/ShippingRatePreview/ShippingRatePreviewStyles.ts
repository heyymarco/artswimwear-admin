// cssfn:
import {
    children,
    style,
}                           from '@cssfn/core'          // writes css in javascript

// reusable-ui core:
import {
    spacers,
}                           from '@reusable-ui/core'    // a set of reusable-ui packages which are responsible for building any component



// styles:
const usesShippingRatePreviewLayout = () => { // the <ListItem> of shipping list
    return style({
        // layouts:
        display            : 'grid',
        alignContent       : 'start',
        gridTemplate       : [[
            '"startingWeight rate"', 'auto',
            '/',
            '1fr 1fr'
        ]],
        
        
        
        // spacings:
        gapInline          : spacers.md,
        
        
        
        // children:
        ...children('.startingWeight', { gridArea: 'startingWeight' }),
        ...children('.rate'          , { gridArea: 'rate'           }),
    });
};

export default style({
    // layouts:
    ...usesShippingRatePreviewLayout(),
});
