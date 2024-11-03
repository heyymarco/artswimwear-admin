'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// reusable-ui components:
import {
    // simple-components:
    HamburgerMenuButton,
    
    
    
    // menu-components:
    Collapse,
    
    
    
    // composite-components:
    NavItem,
    Nav,
    useNavbarState,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components
import {
    // simple-components:
    Link,
}                           from '@reusable-ui/next-compat-link'

// internal components:
import {
    SiteLogo,
}                           from './SiteLogo'
import {
    SignInMenu,
}                           from './SignInMenu'



const SiteNavbarMenu = () => {
    // states:
    const {
        // variants:
        basicVariantProps,
        
        
        
        // states:
        navbarExpanded,
        listExpanded,
        
        
        
        // handlers:
        handleClickToToggleList,
    } = useNavbarState();
    
    
    
    // sessions:
    const { data: session, status: sessionStatus } = useSession();
    const isFullySignedIn  = (sessionStatus === 'authenticated') && !!session;
    const role = session?.role;
    
    
    
    // jsx:
    return (
        <>
            <SiteLogo />
            
            {!navbarExpanded && <HamburgerMenuButton
                // variants:
                {...basicVariantProps}
                
                
                
                // classes:
                className='toggler'
                
                
                
                // states:
                active={listExpanded}
                
                
                
                // handlers:
                onClick={handleClickToToggleList}
            />}
            
            <Collapse
                // classes:
                mainClass={navbarExpanded ? '' : undefined}
                className='list'
                
                
                
                // states:
                expanded={listExpanded}
            >
                <Nav
                    // semantics:
                    tag='ul'
                    role=''
                    
                    
                    
                    // variants:
                    {...basicVariantProps}
                    gradient={navbarExpanded ? 'inherit' : false}
                    listStyle='flat'
                    orientation={navbarExpanded ? 'inline' : 'block'}
                >
                    {isFullySignedIn && <NavItem><Link href='/'>Dashboard</Link></NavItem>}
                    {isFullySignedIn && !!role?.product_r  && <NavItem><Link href='/products' >Products</Link></NavItem>}
                    {isFullySignedIn && !!role?.order_r    && <NavItem><Link href='/orders'   >Orders</Link></NavItem>}
                    {isFullySignedIn && !!role?.shipping_r && <NavItem><Link href='/shippings'>Shippings</Link></NavItem>}
                    {isFullySignedIn && !!role?.admin_r    && <NavItem><Link href='/admins'   >Admins</Link></NavItem>}
                    
                    <SignInMenu />
                </Nav>
            </Collapse>
        </>
    );
};
export {
    SiteNavbarMenu,
    SiteNavbarMenu as default,
}
