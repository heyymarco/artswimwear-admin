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
import {
    // hooks:
    useLastExistingChildren,
}                           from '@/hooks/lastExistingChildren'



export type ModalUiComponentProps = GenericProps<Element>|React.HTMLAttributes<HTMLElement>|React.SVGAttributes<SVGElement>
export type ModalUiComponent      = React.ReactElement<ModalUiComponentProps>
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
    children         ?: ModalUiComponent | undefined|null|boolean
}
const ModalUi = (props: ModalUiProps): JSX.Element|null => {
    // rest props:
    const {
        // components:
        children : modalUiComponent,
    ...restModalProps} = props;
    
    
    
    // states:
    const [hasUi, lastExistingModalUiComponent] = useLastExistingChildren(modalUiComponent);
    
    
    
    // verifies:
    if (hasUi) React.Children.only(lastExistingModalUiComponent?.[0]);
    
    
    
    // jsx:
    return (
        <Modal
            // other props:
            {...restModalProps}
            
            
            
            // states:
            expanded={hasUi}
        >
            {/* <Ui> */}
            {(lastExistingModalUiComponent?.[0] as (ModalUiComponent|undefined)) ?? <React.Fragment />}
        </Modal>
    );
}
export {
    ModalUi,
    ModalUi as default,
}
