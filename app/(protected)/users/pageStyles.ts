// cssfn:
import {
    style,
}                           from '@cssfn/core'          // writes css in javascript



// styles:
const usesPageLayout = () => {
    return style({
        // layouts:
        display       : 'flex',
        flexDirection : 'column',
    });
};

export default style({
    // layouts:
    ...usesPageLayout(),
});

