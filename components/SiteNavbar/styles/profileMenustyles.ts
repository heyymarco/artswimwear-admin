// cssfn:
import {
    // writes css in javascript:
    children,
    style,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui components:
import {
    basics,
    icons,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components



// styles:
const usesProfileMenuLayout = () => {
    return style({
        // positions:
        justifySelf    : 'stretch',
        alignSelf      : 'stretch',
        
        
        
        // children:
        ...children('*>.menu', {
            // layouts:
            display        : 'flex',   // use block flexbox, so it takes the entire parent's width
            flexDirection  : 'row',    // the flex direction to horz
            justifyContent : 'center', // center items horizontally
            alignItems     : 'center', // center items vertically
            flexWrap       : 'nowrap', // no wrapping
            
            
            
            
            // spacings:
            marginInline : 'unset',
            marginBlock  : [[
                'calc(0px - ', basics.paddingBlock, ')',
            ]],
            gap          : '0.5em',
            
            
            
            // children:
            ...children('.photo', {
                // sizes:
                boxSizing           : 'border-box',
                inlineSize          : icons.sizeXl,
                blockSize           : icons.sizeXl,
                objectFit           : 'fill',
                
                
                
                // backgrounds:
                backgroundBlendMode : 'normal',
                
                
                
                // borders:
                borderRadius        : '50%',
            }),
        }),
    });
};

export default style({
    // layouts:
    ...usesProfileMenuLayout(),
});