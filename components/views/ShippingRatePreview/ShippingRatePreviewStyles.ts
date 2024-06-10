// cssfn:
import {
    children,
    descendants,
    style,
}                           from '@cssfn/core'          // writes css in javascript
import { spacers, typos, usesBorder, usesPadding } from '@reusable-ui/core';
import { basics } from '@reusable-ui/components';



// styles:
const usesShippingRatePreviewLayout = () => { // the <ListItem> of shipping list
    // dependencies:
    
    
    
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
        gapInline          : spacers.sm,
        gapBlock           : spacers.sm,
        
        
        
        // children:
        ...children('.startingWeight', { gridArea: 'startingWeight' }),
        ...children('.rate'          , { gridArea: 'rate'           }),
    });
};

export default style({
    // layouts:
    ...usesShippingRatePreviewLayout(),
});
