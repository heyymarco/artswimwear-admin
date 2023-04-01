// cssfn:
import {
    scopeOf,
}                           from '@cssfn/core'          // writes css in javascript



// styles:
export default () => [
    scopeOf('section1', {
        background: 'pink',
    }, { specificityWeight: 2 }),
];
