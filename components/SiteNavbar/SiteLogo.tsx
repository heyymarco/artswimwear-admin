'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // simple-components:
    Icon,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components
import {
    // simple-components:
    Link,
}                           from '@reusable-ui/next-compat-link'



export const SiteLogo = (): JSX.Element|null => {
    // jsx:
    return (
        <Link href='/'>
            <Icon icon='artswimwear' size='xl' />
        </Link>
    );
};