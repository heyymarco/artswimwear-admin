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

// reusable-ui components:
import {
    Busy,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Main,
    GenericSection,
}                           from '@heymarco/section'



// styles:
export const usePageLoadingStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'aj8573q2a4', specificityWeight: 2 }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



export const PageLoading = (): JSX.Element|null => {
    // styles:
    const styleSheet = usePageLoadingStyleSheet();
    
    
    
    // jsx:
    return (
        <Main key='main-loading' className={styleSheet.main}>
            <GenericSection key='section-loading' className='fill-self'>
                <Busy key='busy-loading' size='lg' />
            </GenericSection>
        </Main>
    );
}
