'use client'

import React from 'react'
import {default as Link} from 'next/link'
import { usePathname } from 'next/navigation'



type LinkProps = Parameters<typeof Link>[0]
export interface ClientLinkProps
    extends
        LinkProps
{
}
export const ClientLink = React.forwardRef<HTMLAnchorElement, ClientLinkProps>((props, ref) => {
    const pathName = usePathname(); // just to force to re-render when the url changed
    console.log('<ClientLink> pathName: ', pathName, props.children);
    
    
    // jsx:
    return (
        <Link {...props} ref={ref} />
    );
})
