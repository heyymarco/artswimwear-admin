// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook



// styles:
import './styles';
export const useTemplateVariantGroupPreviewStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./styles')
, { specificityWeight: 2, id: 'bt1unv97as' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
