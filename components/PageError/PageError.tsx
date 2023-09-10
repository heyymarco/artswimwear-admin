'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
    
    
    
    CardBody,
    
    
    
    // dialog-components:
    ModalCard,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Main,
    GenericSection,
}                           from '@heymarco/section'



// styles:
export const usePageErrorStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'ph6g9f9c57' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



export interface PageErrorProps {
    // handlers:
    onRetry ?: () => void
}
export const PageError = (props: PageErrorProps) => {
    // rest props:
    const {
        // handlers:
        onRetry,
    } = props;
    
    
    
    // styles:
    const styleSheet = usePageErrorStyleSheet();
    
    
    
    // refs:
    const sectionRef = useRef<HTMLElement|null>(null);
    
    
    
    // jsx:
    return (
        <Main key='main-error' className={styleSheet.main}>
            <GenericSection key='section-error' className='fill-self' elmRef={sectionRef}>
                <ModalCard theme='danger' expanded={true} viewport={sectionRef} backdropStyle='static'>
                    <CardBody className={styleSheet.modalError}>
                        <h3>
                            Oops, an error occured!
                        </h3>
                        <p>
                            We were unable to retrieve data from the server.
                        </p>
                        {!!onRetry && <ButtonIcon icon='refresh' theme='success' onClick={onRetry}>
                            Retry
                        </ButtonIcon>}
                    </CardBody>
                </ModalCard>
            </GenericSection>
        </Main>
    );
}
