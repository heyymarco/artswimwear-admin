'use client'

import { Styles } from '@cssfn/cssfn-react'
import { useServerInsertedHTML } from 'next/navigation'



export const StylesSSR = () => {
    useServerInsertedHTML(() => <Styles key='123abc' />);
    return <></>;
}
