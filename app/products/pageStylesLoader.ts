'use client'

import { dynamicStyleSheets } from '@cssfn/cssfn-react'



// styles:
export const usePageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./pageStyles')
, { id: 'products-pcyfaeow8d' });