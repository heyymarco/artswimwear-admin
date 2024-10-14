// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook



// styles:
import './styles';
export const useStockPreviewStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./styles')
, { specificityWeight: 2, id: 'a6iitzq7zg' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names