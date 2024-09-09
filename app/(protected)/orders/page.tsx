// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-js:
import {
    type Metadata,
}                           from 'next'

// private components:
import {
    OrderPageContent,
}                           from './page-content'

// configs:
import {
    PAGE_ORDER_TITLE,
    PAGE_ORDER_DESCRIPTION,
}                           from '@/website.config'



export const metadata: Metadata = {
    title       : PAGE_ORDER_TITLE,
    description : PAGE_ORDER_DESCRIPTION,
}



// react components:
export default function OrderPage(): JSX.Element|null {
    // jsx:
    return (
        <OrderPageContent />
    );
}
