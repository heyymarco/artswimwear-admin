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
    MainProps,
    Main,
    GenericSection,
}                           from '@heymarco/section'



// styles:
export const usePageLoadingStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'aj8573q2a4', specificityWeight: 2 }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



export interface PageLoadingProps extends MainProps {}
export const PageLoading = (props: PageLoadingProps): JSX.Element|null => {
    // styles:
    const styleSheet = usePageLoadingStyleSheet();
    
    
    
    // jsx:
    return (
        <Main
            // other props:
            {...props}
            
            
            
            // identifiers:
            key='main-loading'
            
            
            
            // variants:
            theme={props.theme ?? 'primary'}
            
            
            
            // classes:
            className={styleSheet.main}
        >
            <GenericSection
                // identifiers:
                key='section-loading'
                
                
                
                // classes:
                className='fill-self'
            >
                <Busy
                    // identifiers:
                    key='busy-loading'
                    
                    
                    
                    // variants:
                    size='lg'
                />
            </GenericSection>
        </Main>
    );
}
