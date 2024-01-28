// cssfn:
import {
    // writes css in javascript:
    style,
    children,
}                           from '@cssfn/core'                      // writes css in javascript



// styles:
export const usesDragOverlayLayout = () => {
    return style({
        // positions:
        position : 'fixed',
        zIndex   : 999999, // TODO: update with global-stackable
        
        
        
        // layouts:
        display  : 'grid',
        
        
        
        // accessibilities:
        pointerEvents : 'none', // ghost mode
        
        
        
        // children:
        overflow: 'visible',
        ...children('*', {
            // positions:
            position : 'relative',
            left     : '-50%', // center horizontally
            top      : '-50%', // center vertically
            
            
            
            // accessibilities:
            pointerEvents : 'initial', // undo ghost mode, so we can set the cursor (if any)
        }),
    });
};

export default () => style({
    // layouts:
    ...usesDragOverlayLayout(),
});
