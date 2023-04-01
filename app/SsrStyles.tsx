'use client'

import { Styles } from '@cssfn/cssfn-react'
import { useServerInsertedHTML } from 'next/navigation'



export const SsrStyles = () => {
    useServerInsertedHTML(() => <Styles />);
    return <></>;
}
