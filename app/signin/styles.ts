// cssfn:
import {
    // writes css in javascript:
    children,
    style,
}                           from '@cssfn/core'                  // writes css in javascript



// styles:
export const usesSignInPageLayout = () => {
    return style({
        ...children(['&', 'section'], {
            // layouts:
            display        : 'grid',
        }),
        ...children('section>article', {
            // layouts:
            display        : 'grid',
            justifyContent : 'stretch',
            alignContent   : 'center',
            
            
            
            // children:
            ...children('*>*', {
                position: 'relative',
                insetInlineStart : '50%',
                translate: '-50%',
            }),
        }),
    });
};

export default () => style({
    // layouts:
    ...usesSignInPageLayout(),
});
