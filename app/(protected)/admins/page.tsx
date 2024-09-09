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
    AdminPageContent,
}                           from './page-content'



// configs:
import {
    PAGE_ADMIN_TITLE,
    PAGE_ADMIN_DESCRIPTION,
}                           from '@/website.config' // TODO: will be used soon



export const metadata: Metadata = {
    title       : PAGE_ADMIN_TITLE,
    description : PAGE_ADMIN_DESCRIPTION,
}



// react components:
export default function AdminPage(): JSX.Element|null {
    // jsx:
    return (
        <AdminPageContent />
    );
}
