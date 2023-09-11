// cssfn:
import {
    style,
}                           from '@cssfn/core'          // writes css in javascript



// styles:
const usesModalDataEmptyLayout = () => {
    return style({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    });
};

export default style({
    // layouts:
    ...usesModalDataEmptyLayout(),
});