// cssfn:
import {
    // writes css in javascript:
    children,
    style,
}                           from '@cssfn/core'          // writes css in javascript



// styles:
const usesRolePreviewLayout = () => { // the <ListItem> of role list
    return style({
        // layouts:
        display       : 'grid',
        gridTemplate  : [[
            '"decorator name edit"',
            '/',
            'auto 1fr auto',
        ]],
        
        
        
        // spacings:
        gap           : '1rem',
        paddingInline : '1rem',
        paddingBlock  : '0.5rem',
        
        
        
        // children:
        ...children('.decorator', {
            // positions:
            gridArea    : 'decorator',
        }),
        ...children('.name', {
            // positions:
            gridArea : 'name',
            
            
            
            // spacings:
            margin: 0,
            
            
            
            // children:
            ...children('.noValue', {
                // appearances:
                opacity    : 0.5,
                
                
                
                // typos:
                fontStyle  : 'italic',
            }),
        }),
        ...children('.edit', {
            // positions:
            gridArea : 'edit',
        }),
    });
};

export default style({
    // layouts:
    ...usesRolePreviewLayout(),
});
