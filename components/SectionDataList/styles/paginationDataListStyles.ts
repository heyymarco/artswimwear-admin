// cssfn:
import {
    style,
}                           from '@cssfn/core'          // writes css in javascript



// styles:
export const usesPaginationDataListLayout = () => {
    return style({
        // sizes:
        blockSize: '100%',
    });
};

export default () => style({
    // layouts:
    ...usesPaginationDataListLayout(),
});
