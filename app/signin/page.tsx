'use client'

import { SignIn } from '@heymarco/next-auth'
// import Image from 'next/image'
// import styles from './page.module.css'

import { Container } from '@reusable-ui/components'      // a set of official Reusable-UI components
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
                    signUpEnable={true}
                    defaultCallbackUrl='/'
                />
            </Section>
        </Main>
    );
}
