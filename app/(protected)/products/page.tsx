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
    ProductPageContent,
}                           from './page-content'



// configs:
import {
    PAGE_PRODUCT_TITLE,
    PAGE_PRODUCT_DESCRIPTION,
}                           from '@/website.config'



export const metadata: Metadata = {
    title       : PAGE_PRODUCT_TITLE,
    description : PAGE_PRODUCT_DESCRIPTION,
}



// react components:
export default function ProductPage(): JSX.Element|null {
    // jsx:
    return (
        <ProductPageContent />
    );
}
