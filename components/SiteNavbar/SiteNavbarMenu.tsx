'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useCallback,
    useInsertionEffect,
}                           from 'react'

// next-auth:
import {
    useSession,
    signOut,
}                           from 'next-auth/react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    ButtonProps,
    ToggleButton,
    ButtonIcon,
    HamburgerMenuButton,
    
    
    
    // status-components:
    Busy,
    
    
    
    // menu-components:
    Collapse,
    
    
    
    // composite-components:
    NavItem,
    Nav,
    navbars,
    NavbarParams,
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
    ProfileMenu,
}                           from './ProfileMenu'



const SiteNavbarMenu = ({
        basicVariantProps,
        navbarExpanded,
        listExpanded,
        handleClickToToggleList,
    } : NavbarParams) => {
    // states:
    const { data: session, status } = useSession();
    const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
    const isFullySignedIn  = !isSigningOut && (status === 'authenticated')   && !!session;
    const isFullySignedOut = !isSigningOut && (status === 'unauthenticated') &&  !session;
    const isBusy           =  isSigningOut || (status === 'loading');
    
    
    
    // handlers:
    const handleSignOut = useEvent((): void => {
        setIsSigningOut(true);
        signOut();
    });
    
    
    
    // dom effects:
    const hasUser = !!session?.user;
    useInsertionEffect(() => {
        navbars.listGridAreaCollapse = (!hasUser ? '2/1/2/3' : '2/1/2/4') as any;
    }, [hasUser]);
    
    
    
    // jsx:
    const MenuButton = useCallback((props: ButtonProps) => {
        return (
            !isBusy
            ? <HamburgerMenuButton                                       key='menuButton' {...props} />
            : <ToggleButton buttonComponent={<ButtonIcon icon='busy' />} key='menuButton' {...props} />
        );
    }, [isBusy]);
    return (
        <>
            <SiteLogo />
            
            {hasUser && <ProfileMenu {...basicVariantProps} listStyle='flat' gradient='inherit' />}
            
            {!navbarExpanded && <MenuButton {...basicVariantProps} className='toggler' active={listExpanded} onClick={handleClickToToggleList} />}
            
            <Collapse className='list' mainClass={navbarExpanded ? '' : undefined} expanded={listExpanded}>
                <Nav tag='ul' role='' {...basicVariantProps} listStyle='flat' gradient={navbarExpanded ? 'inherit' : false} orientation={navbarExpanded ? 'inline' : 'block'}>
                    {isFullySignedIn && <NavItem><Link href='/'>Dashboard</Link></NavItem>}
                    {isFullySignedIn && <NavItem><Link href='/products'>Products</Link></NavItem>}
                    {isFullySignedIn && <NavItem><Link href='/orders'>Orders</Link></NavItem>}
                    
                    {isBusy && <NavItem active={true}>
                        <Busy theme='secondary' size='lg' />
                        &nbsp;
                        {(isSigningOut || session) ? 'Signing out...' : 'Loading...'}
                    </NavItem>}
                    
                    {isFullySignedOut && <NavItem>
                        <Link href='/signin'>Sign In</Link>
                    </NavItem>}
                    
                    {isFullySignedIn  && <NavItem onClick={handleSignOut}>
                        Sign Out
                    </NavItem>}
                </Nav>
            </Collapse>
        </>
    );
};
export {
    SiteNavbarMenu,
    SiteNavbarMenu as default,
}
