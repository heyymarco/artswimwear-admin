// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-js:
import type {
    Metadata,
}                           from 'next'

// private components:
import {
    ShippingPageContent,
}                           from './page-content'



// configs:
import {
    PAGE_SHIPPING_TITLE,
    PAGE_SHIPPING_DESCRIPTION,
}                           from '@/website.config' // TODO: will be used soon



export const metadata: Metadata = {
    title       : PAGE_SHIPPING_TITLE,
    description : PAGE_SHIPPING_DESCRIPTION,
}



// react components:
export default function ShippingPage(): JSX.Element|null {
    // jsx:
    return (
        <ShippingPageContent />
    );
}
