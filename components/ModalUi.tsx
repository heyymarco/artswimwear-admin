// react:
import {
    // react:
    default as React,
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
    if (hasUi) React.Children.only(lastExistingModalUiComponent);
    
    
    
    // jsx:
    return (
        <Modal
            // other props:
            {...restModalProps}
            
            
            
            // states:
            expanded={props.expanded ?? hasUi}
        >
            {/* <Ui> */}
            {(lastExistingModalUiComponent as (ModalUiComponent|undefined)) ?? <React.Fragment />}
        </Modal>
    );
}
export {
    ModalUi,
    ModalUi as default,
}
