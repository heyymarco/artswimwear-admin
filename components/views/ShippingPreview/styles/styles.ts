// cssfn:
import {
    children,
    descendants,
    style,
}                           from '@cssfn/core'          // writes css in javascript
import { spacers, typos, usesBorder, usesPadding } from '@reusable-ui/core';
import { basics } from '@reusable-ui/components';



// styles:
const usesShippingPreviewLayout = () => { // the <ListItem> of shipping list
    // dependencies:
    
    // features:
    const {borderRule , borderVars } = usesBorder({ borderWidth: '0px' });
    const {paddingRule, paddingVars} = usesPadding({
        paddingInline : '1rem',
        paddingBlock  : '1rem',
    });
    
    
    
    return style({
        // layouts:
        ...style({
            // layouts:
            display: 'grid',
            gridTemplate: [[
                '"name      "', 'auto',
                '".........."', spacers.sm,
                '"visibility"', 'auto',
                '".........."', spacers.md, // the minimum space between visibility and fullEditor
                '".........."', 'auto',     // the extra rest space (if any) between visibility and fullEditor
                '"fullEditor"', 'auto',
                '/',
                `1fr`,
            ]],
            
            
            
            // borders:
            // follows <parent>'s borderRadius
            border                   : borderVars.border,
         // borderRadius             : borderVars.borderRadius,
            borderStartStartRadius   : borderVars.borderStartStartRadius,
            borderStartEndRadius     : borderVars.borderStartEndRadius,
            borderEndStartRadius     : borderVars.borderEndStartRadius,
            borderEndEndRadius       : borderVars.borderEndEndRadius,
            [borderVars.borderWidth] : '0px', // only setup borderRadius, no borderStroke
            
            
            
            // spacings:
         // padding       : paddingVars.padding,
            paddingInline : paddingVars.paddingInline,
            paddingBlock  : paddingVars.paddingBlock,
            
            
            
            // children:
            ...descendants(['.name', 'p'], {
                margin: 0,
            }),
            ...descendants('.value', {
                fontWeight: typos.fontWeightSemibold,
            }),
            ...descendants('.noValue', {
                // appearances:
                opacity    : 0.5,
                
                
                
                // typos:
                fontSize   : basics.fontSizeSm,
                fontStyle  : 'italic',
            }),
            ...descendants('.edit', {
                marginInlineStart: '0.25em',
            }),
            ...children('.name', {
                gridArea: 'name',
                fontSize: typos.fontSizeXl,
            }),
            ...children('.visibility', {
                gridArea: 'visibility',
            }),
            ...children('.fullEditor', {
                gridArea: 'fullEditor',
            }),
            ...descendants('[role="dialog"]', {
                // remove the padding of <Dialog>'s backdrop:
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
            }),
        }),
        
        
        
        // features:
        ...borderRule(),  // must be placed at the last
        ...paddingRule(), // must be placed at the last
    });
};

export default style({
    // layouts:
    ...usesShippingPreviewLayout(),
});
