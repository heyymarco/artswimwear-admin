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

// heymarco components:
import {
    Main,
    Section,
}                           from '@heymarco/section'
import {
    SignIn,
}                           from '@heymarco/next-auth'

// configs:
import {
    authConfigClient,
}                           from '@/auth.config.client'
import {
    credentialsConfigClient,
}                           from '@/credentials.config.client'

// internals:
import {
    loginProviders,
}                           from './loginProviders'



// styles:
const useSignInPageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles')
, { id: 't7wb7p3mdj' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



export default function SignInPage() {
    // styles:
    const styleSheet = useSignInPageStyleSheet();
    
    
    
    return (
        <Main className={styleSheet.main}>
            <Section className='fill-self'>
                <SignIn
                    // variants:
                    theme='primary'
                    
                    
                    
                    // auths:
                    authConfigClient={authConfigClient}
                    credentialsConfigClient={credentialsConfigClient}
                    providers={loginProviders}
                    
                    
                    
                    // pages:
                    defaultCallbackUrl='/orders'
                    
                    
                    
                    // components:
                    gotoHomeButtonComponent={null}
                />
            </Section>
        </Main>
    );
}
