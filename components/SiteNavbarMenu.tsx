'use client'

import { Busy, Collapse, HamburgerMenuButton, Icon, Nav, NavbarParams, NavItem } from '@reusable-ui/components'
import Link from '@reusable-ui/next-compat-link';
import { signIn, signOut, useSession } from 'next-auth/react'



const SiteLogo = () => {
    return (
        <Link href='/'>
            <Icon icon='artswimwear' size='xl' />
        </Link>
    );
}

const SiteNavbarMenu = ({
        basicVariantProps,
        navbarExpanded,
        listExpanded,
        handleClickToToggleList,
    } : NavbarParams) => {
    const { data: session, status } = useSession();
    
    
    
    // jsx:
    console.log({status})
    return (
        <>
            <SiteLogo />
            
            {!navbarExpanded && <HamburgerMenuButton {...basicVariantProps} className='toggler' active={listExpanded} onClick={handleClickToToggleList} />}
            
            <Collapse className='list' mainClass={navbarExpanded ? '' : undefined} expanded={listExpanded}>
                <Nav tag='ul' role='' {...basicVariantProps} orientation={navbarExpanded ? 'inline' : 'block'} listStyle='flat' gradient={navbarExpanded ? 'inherit' : false}>
                    <NavItem><Link href='/'>Home</Link></NavItem>
                    <NavItem><Link href='/products'>Products</Link></NavItem>
                    <NavItem><Link href='/orders'>Orders</Link></NavItem>
                    {(status === 'loading') && <NavItem>
                        <Busy theme='secondary' size='lg' />
                    </NavItem>}
                    {(status === 'unauthenticated' && <NavItem>
                        <Link href='/signin'>Sign In</Link>
                    </NavItem>)}
                    {(status === 'authenticated' && <NavItem onClick={() => signOut()}>
                        Sign Out
                    </NavItem>)}
                </Nav>
            </Collapse>
        </>
    );
};
export {
    SiteNavbarMenu,
    SiteNavbarMenu as default,
}