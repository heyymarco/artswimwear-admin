// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook



// styles:
export const useProfilePageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles')
, { id: 'pmmu5ep2va' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
