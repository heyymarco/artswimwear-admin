'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// reusable-ui components:
import {
    // base-components:
    Basic,
    
    
    
    // simple-components:
    Icon,
    
    
    
    // composite-components:
    NavItem,
    NavProps,
    Nav,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



// styles:
export const useProfileMenuStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/profileMenustyles')
, { id: 'esb08l22qo' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



export const ProfileMenu = (props: NavProps): JSX.Element|null => {
    // styles:
    const styleSheet = useProfileMenuStyleSheet();
    
    
    
    // sessions:
    const { data: session, status: sessionStatus } = useSession();
    
    
    
    // jsx:
    const {
        image,
        name,
    } = session?.user ?? {};
    return (
        <Nav
            // other props:
            {...props}
            
            
            
            // semantics:
            tag='ul'
            role=''
            
            
            
            // classes:
            className={styleSheet.main}
        >
            <NavItem className='menu'>
                {(sessionStatus === 'authenticated') && <>
                    { !image && <Icon icon='person' size='xl' />}
                    {!!image && <Basic className='photo' style={{ background: `no-repeat center/cover url("${resolveMediaUrl(image)}")` }} />}
                    
                    {!!image && <span>
                        {name?.split?.(' ')?.[0]}
                    </span>}
                </>}
            </NavItem>
        </Nav>
    );
};
