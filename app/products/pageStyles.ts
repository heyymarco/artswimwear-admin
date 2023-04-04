// cssfn:
import {
    scopeOf,
}                           from '@cssfn/core'          // writes css in javascript



// styles:
export default () => [
    scopeOf('toolbox', {
    }, { specificityWeight: 2 }),
    scopeOf('products', {
    }, { specificityWeight: 2 }),
];
