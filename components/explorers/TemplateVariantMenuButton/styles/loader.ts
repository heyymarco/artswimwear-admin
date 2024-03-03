// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'           // writes css in react hook



// styles:
import './styles';
export const useTemplateVariantMenuButtonStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./styles')
, { id: 'zgk1no8o72' });
