'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-js:
import {
    useRouter,
    usePathname,
}                           from 'next/navigation'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internal components:
import {
    PageLoading,
}                           from '@/components/PageLoading'

// configs:
import {
    authConfigClient,
}                           from '@/auth.config.client'



export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // configs:
    const {
        signIn : {
            path : signInPath,
        }
    } = authConfigClient;
    
    
    
    // sessions:
    const { status: sessionStatus } = useSession();
    
    
    
    // effects:
    const router                 = useRouter();
    const mayInterceptedPathname = usePathname();
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (sessionStatus !== 'unauthenticated') return; // ignore if still loading or has authenticated
        
        
        
        // actions:
        router.replace(`${signInPath}?callbackUrl=${encodeURIComponent(mayInterceptedPathname)}`);
    }, [sessionStatus]);
    
    
    
    // jsx:
    if (sessionStatus !== 'authenticated') return <PageLoading />;
    return (
        <>
            {children}
        </>
    );
}
