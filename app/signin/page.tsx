'use client'

import { SignIn } from '@heymarco/next-auth'

import { credentialsConfig } from '@/credentials.config'
import { loginProviders } from './loginProviders'
import { Main, Section } from '@heymarco/section'



export default function SignInPage() {
    return (
        <Main>
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
