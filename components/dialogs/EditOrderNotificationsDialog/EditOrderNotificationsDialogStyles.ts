// cssfn:
import {
    // writes css in javascript:
    children,
    style,
    scope,
}                           from '@cssfn/core'          // writes css in javascript
import {
    // a spacer (gap) management system:
    spacers,
}                           from '@reusable-ui/core'    // a set of reusable-ui packages which are responsible for building any component



// styles:
export const usesNotificationsTabLayout = () => {
    return style({
        // layout:
        display: 'grid',
        
        
        
        // children:
        ...children('form', {
            // layouts:
            display      : 'grid',
            alignContent : 'start',
            
            
            
            // spacings:
            gap : spacers.sm,
        }),
    });
};

export default () => [
    scope('notificationsTab', {
        ...usesNotificationsTabLayout(),
    }),
];
