// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook



// styles:
import './styles';
export const useCategoryStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./styles')
, { specificityWeight: 2, id: 'aby18j3qj2' });
