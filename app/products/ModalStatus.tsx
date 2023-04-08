// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

import {
    ModalCardProps,
    ModalCard,
}                           from '@reusable-ui/components'              // a set of official Reusable-UI components



export interface ModalStatusProps
    extends
        Omit<ModalCardProps,
            // states:
            |'expanded' // replaced with auto expanded `children` as *status*
        >
{
}
const ModalStatus = (props: ModalStatusProps): JSX.Element|null => {
    // rest props:
    const {
        // children:
        children,
    ...restModalProps} = props;
    
    
    
    // states:
    const lastChildrenRef = useRef<React.ReactNode>(children);
    const hasChildren     : boolean = (!!children || (children === 0)) && (children !== true); // ignores undefined|null|true|false|emptyString
    if (hasChildren) lastChildrenRef.current = children;
    
    
    
    // jsx:
    return (
        <ModalCard
            // other props:
            {...restModalProps}
            
            
            
            // states:
            expanded={hasChildren}
        >
            {lastChildrenRef.current}
        </ModalCard>
    );
}
export {
    ModalStatus,
    ModalStatus as default,
}
