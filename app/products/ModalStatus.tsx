// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

import {
    GenericProps,
    
    
    
    Content,
    
    
    
    ModalProps,
    Modal,
}                           from '@reusable-ui/components'              // a set of official Reusable-UI components



export interface ModalStatusProps
    extends
        Omit<ModalProps,
            // states:
            |'expanded' // replaced with auto expanded `children` as *status*
            
            
            
            // children:
            |'children' // replaced with auto expanded `children` as *status*
        >
{
    // components:
    contentComponent ?: React.ReactComponentElement<any, GenericProps<Element>>
    
    
    
    // children:
    children         ?: React.ReactNode
}
const ModalStatus = (props: ModalStatusProps): JSX.Element|null => {
    // rest props:
    const {
        // components:
        contentComponent = (<Content /> as React.ReactComponentElement<any, GenericProps<Element>>),
        
        
        
        // children:
        children : status,
    ...restModalProps} = props;
    
    
    
    // states:
    const lastStatusRef = useRef<React.ReactNode>(status);
    const hasStatus     : boolean = (!!status || (status === 0)) && (status !== true); // ignores undefined|null|true|false|emptyString
    if (hasStatus) lastStatusRef.current = status;
    
    
    
    // jsx:
    return (
        <Modal
            // other props:
            {...restModalProps}
            
            
            
            // states:
            expanded={hasStatus}
        >
            {/* <Content> */}
            {React.cloneElement<GenericProps<Element>>(contentComponent,
                // props:
                {
                    // semantics:
                    tag : contentComponent.props.tag ?? 'article',
                },
                
                
                
                // children:
                lastStatusRef.current,
            )}
        </Modal>
    );
}
export {
    ModalStatus,
    ModalStatus as default,
}
