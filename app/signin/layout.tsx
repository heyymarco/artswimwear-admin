// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    SigninTabStateProvider,
}                           from '@/components/SignIn'



// react components:
export default function SignInLayout({
    children,
    signin_tab,
}: {
    children   : React.ReactNode
    signin_tab : React.ReactNode
}): JSX.Element|null {
    // jsx:
    return (
        <SigninTabStateProvider>
            {children}
            {signin_tab}
        </SigninTabStateProvider>
    );
}