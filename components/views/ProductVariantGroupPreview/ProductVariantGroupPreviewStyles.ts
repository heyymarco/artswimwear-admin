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

// reusable-ui components:
import {
    // base-components:
    basics,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components



// styles:
const usesProductVariantGroupPreviewLayout = () => { // the <ListItem> of variantGroup list
    return style({
        // layouts:
        display       : 'grid',
        gridTemplate  : [[
            '"name preview grip edit"',
            '/',
            'max-content 1fr min-content min-content',
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
        ...children('.preview', {
            // positions:
            gridArea : 'preview',
            
            
            
            // layouts:
            display        : 'grid',
            justifyContent : 'end',
            
            
            
            // spacings:
            margin: 0,
            
            
            
            // children:
            ...children('.values', {
                // layouts:
                display        : 'flex',
                flexWrap       : 'wrap',
                justifyContent : 'end',
                
                
                
                // scrolls:
                overflow : 'hidden',
                
                
                
                // spacings:
                gap      : spacers.xs,
            }),
            ...children('.noValue', {
                // appearances:
                opacity    : 0.5,
                
                
                
                // typos:
                fontSize   : basics.fontSizeSm,
                fontStyle  : 'italic',
            }),
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
    ...usesProductVariantGroupPreviewLayout(),
});
