'use client'

import { styleSheets } from '@cssfn/core'



// styles:
styleSheets(
    () => import(/* webpackPrefetch: true */ './layoutStyles')
, { id: 'layout-eh4gver0nl' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names

export const LayoutStylesLoader = () => null; // just a dummy_side_effect
