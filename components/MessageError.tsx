// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components



// react components:
export interface MessageErrorProps {
    // refs:
    buttonRetryRef ?: React.Ref<HTMLButtonElement> // setter ref
    
    
    
    // handlers:
    onRetry        ?: () => void
}
export const MessageError = ({ buttonRetryRef, onRetry }: MessageErrorProps): JSX.Element|null => {
    // jsx:
    return (
        <>
            <h3>
                Oops, an error occured!
            </h3>
            <p>
                We were unable to retrieve data from the server.
            </p>
            {!!onRetry && <ButtonIcon elmRef={buttonRetryRef} icon='refresh' theme='success' onClick={onRetry}>
                Retry
            </ButtonIcon>}
        </>
    );
}