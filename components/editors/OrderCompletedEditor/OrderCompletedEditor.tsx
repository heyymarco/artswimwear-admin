// react:
import {
    // react:
    default as React,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
    
    
    
    // a capability of UI to be highlighted/selected/activated:
    ActiveChangeEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// heymarco:
import {
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'

// reusable-ui components:
import {
    // base-components:
    Basic,
    IndicatorProps,
    
    
    
    // simple-components:
    Form,
    Check,
}                           from '@reusable-ui/components'  // a set of official Reusable-UI components

// internals components:
import type {
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'



// styles:
export const useOrderCompletedEditorStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'dhi7btl8c0' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// utilities:
const emptyOrderCompletedValue : Required<OrderCompletedValue> = {
    sendConfirmationEmail : true,
};
Object.freeze(emptyOrderCompletedValue);



// react components:
export type OrderCompletedValue = {
    sendConfirmationEmail ?: boolean
}
export interface OrderCompletedEditorProps
    extends
        // bases:
        Pick<EditorProps<HTMLElement, OrderCompletedValue>,
            // values:
            |'defaultValue' // supported
            |'value'        // supported
            |'onChange'     // supported
        >,
        Omit<IndicatorProps<HTMLFormElement>,
            // values:
            |'defaultValue' // taken over by EditorProps
            |'value'        // taken over by EditorProps
            |'onChange'     // taken over by EditorProps
            
            
            
            // children:
            |'children'     // not supported
        >
{
}
const OrderCompletedEditor = (props: OrderCompletedEditorProps): JSX.Element|null => {
    // styles:
    const styleSheet = useOrderCompletedEditorStyleSheet();
    
    
    
    // rest props:
    const {
        // values:
        defaultValue : defaultUncontrollableValue = emptyOrderCompletedValue,
        value        : controllableValue,
        onChange     : onControllableValueChange,
    ...restIndicatorProps} = props;
    
    const {
        // accessibilities:
        enabled,         // take
        inheritEnabled,  // take
        
        active,          // take
        inheritActive,   // take
        
        readOnly,        // take
        inheritReadOnly, // take
    ...restFormProps} = restIndicatorProps;
    
    
    
    // states:
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<OrderCompletedValue>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onControllableValueChange,
    });
    
    const {
        sendConfirmationEmail,
    } = value;
    
    
    
    // utilities:
    const setValue = useEvent((newValue: Partial<OrderCompletedValue>) => {
        const combinedNewValue : OrderCompletedValue = {
            ...value,
            ...newValue,
        };
        
        
        
        // update:
        triggerValueChange(combinedNewValue, { triggerAt: 'immediately' });
    });
    
    
    
    // handlers:
    const handleConfirmationEmailChange = useEvent<EventHandler<ActiveChangeEvent>>(({active: newConfirmation}) => {
        setValue({
            sendConfirmationEmail : newConfirmation,
        });
    });
    
    
    
    // jsx:
    return (
        <Form
            // other props:
            {...restFormProps}
            
            
            
            // variants:
            nude={props.nude ?? true}
            
            
            
            // classes:
            mainClass={props.mainClass ?? styleSheet.main}
        >
            <Basic
                // variants:
                theme='success'
                mild={true}
            >
                Mark this order as <strong>completed</strong>.
            </Basic>
            
            <Check
                // values:
                active={sendConfirmationEmail}
                onActiveChange={handleConfirmationEmailChange}
                
                
                
                // validations:
                enableValidation={false}
            >
                Send confirmation email to customer
            </Check>
        </Form>
    );
};
export {
    OrderCompletedEditor,
    OrderCompletedEditor as default,
}
