'use client'

import { SignIn } from '@heymarco/next-auth'

import { credentialsConfig } from '@/credentials.config'
import { loginProviders } from './loginProviders'
import { Main, Section } from '@heymarco/section'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook



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
                    theme='primary'
                    credentialsConfig={credentialsConfig}
                    providers={loginProviders}
                    signUpEnable={false}
                    gotoHomeButtonComponent={null}
                    defaultCallbackUrl='/'
                />
            </Section>
        </Main>
    );
}
