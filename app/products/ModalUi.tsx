// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

import {
    GenericProps,
    
    
    
    ModalProps,
    Modal,
}                           from '@reusable-ui/components'              // a set of official Reusable-UI components



export interface ModalUiProps
    extends
        Omit<ModalProps,
            // states:
            |'expanded' // replaced with auto expanded `children` as *UI*
            
            
            
            // children:
            |'children' // replaced with auto expanded `children` as *UI*
        >
{
    // components:
    children         ?: React.ReactElement<GenericProps<Element>|React.HTMLAttributes<HTMLElement>|React.SVGAttributes<SVGElement>> | undefined|null|boolean
}
const ModalUi = (props: ModalUiProps): JSX.Element|null => {
    // rest props:
    const {
        // components:
        children : uiComponent,
    ...restModalProps} = props;
    
    
    
    // states:
    const lastUiRef = useRef<React.ReactElement<GenericProps<Element>|React.HTMLAttributes<HTMLElement>|React.SVGAttributes<SVGElement>> | undefined|null|boolean>(uiComponent);
    const hasUi     : boolean = !!uiComponent && (uiComponent !== true); // ignores undefined|null|true|false|emptyString
    if (hasUi) {
        lastUiRef.current = React.cloneElement<GenericProps<Element>|React.HTMLAttributes<HTMLElement>|React.SVGAttributes<SVGElement>>(uiComponent as any,
            // props:
            {
                key : Date.now(), // helps React that the last UI was replaced with another UI
            },
        );
    } // if
    
    
    
    // jsx:
    return (
        <Modal
            // other props:
            {...restModalProps}
            
            
            
            // states:
            expanded={hasUi}
        >
            {/* <Ui> */}
            {(!!lastUiRef.current && (lastUiRef.current !== true)) ? lastUiRef.current : <React.Fragment />}
        </Modal>
    );
}
export {
    ModalUi,
    ModalUi as default,
}
