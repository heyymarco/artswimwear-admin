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
    
    
    
    // an accessibility management system:
    AccessibilityProvider,
    
    
    
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
    IndicatorProps,
    
    
    
    // simple-components:
    Form,
    Check,
}                           from '@reusable-ui/components'  // a set of official Reusable-UI components

// heymarco components:
import {
    NameEditor,
}                           from '@heymarco/name-editor'
import {
    TextEditorProps,
    TextEditor,
}                           from '@heymarco/text-editor'

// internals components:
import type {
    // types:
    EditorChangeEventHandler,
    
    
    
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'



// styles:
export const useOrderOnTheWayEditorStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'j4503d5vfx' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// utilities:
const emptyOrderOnTheWayValue : Required<OrderOnTheWayValue> = {
    shippingCarrier       : null,
    shippingNumber        : null,
    sendConfirmationEmail : true,
};
Object.freeze(emptyOrderOnTheWayValue);



// react components:
export type OrderOnTheWayValue = {
    shippingCarrier        : string|null
    shippingNumber         : string|null
    sendConfirmationEmail ?: boolean
}
export interface OrderOnTheWayEditorProps
    extends
        // bases:
        Pick<EditorProps<HTMLElement, OrderOnTheWayValue>,
            // values:
            |'defaultValue' // supported
            |'value'        // supported
            |'onChange'     // supported
        >,
        Omit<IndicatorProps<HTMLFormElement>,
            // refs:
            |'elmRef'       // overriden
            
            
            
            // values:
            |'defaultValue' // taken over by EditorProps
            |'value'        // taken over by EditorProps
            |'onChange'     // taken over by EditorProps
            
            
            
            // children:
            |'children'     // not supported
        >
{
    // refs:
    elmRef               ?: TextEditorProps['elmRef']
    
    
    
    // accessibilities:
    shippingCarrierLabel ?: string
    shippingNumberLabel  ?: string
}
const OrderOnTheWayEditor = (props: OrderOnTheWayEditorProps): JSX.Element|null => {
    // styles:
    const styleSheet = useOrderOnTheWayEditorStyleSheet();
    
    
    
    // rest props:
    const {
        // refs:
        elmRef,
        
        
        
        // accessibilities:
        shippingCarrierLabel = 'Ship By (if any)',
        shippingNumberLabel  = 'Shipping Tracking Number (if any)',
        
        
        
        // values:
        defaultValue : defaultUncontrollableValue = emptyOrderOnTheWayValue,
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
    } = useControllableAndUncontrollable<OrderOnTheWayValue>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onControllableValueChange,
    });
    
    const {
        shippingCarrier,
        shippingNumber,
        sendConfirmationEmail,
    } = value;
    
    
    
    // utilities:
    const setValue = useEvent((newValue: Partial<OrderOnTheWayValue>) => {
        const combinedValue : OrderOnTheWayValue = {
            ...value,
            ...newValue,
        };
        
        
        
        // update:
        triggerValueChange(combinedValue, { triggerAt: 'immediately' });
    });
    
    
    
    // handlers:
    const handleShippingCarrierChange   = useEvent<EditorChangeEventHandler<string|null>>((newShippingCarrier) => {
        setValue({
            shippingCarrier       : newShippingCarrier,
        });
    });
    const handleShippingNumberChange    = useEvent<EditorChangeEventHandler<string|null>>((newShippingNumber) => {
        setValue({
            shippingNumber        : newShippingNumber,
        });
    });
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
            <AccessibilityProvider
                // accessibilities:
                enabled         = {enabled        }
                inheritEnabled  = {inheritEnabled }
                
                active          = {active         }
                inheritActive   = {inheritActive  }
                
                readOnly        = {readOnly       }
                inheritReadOnly = {inheritReadOnly}
            >
                <NameEditor
                    // classes:
                    className='shippingCarrier'
                    
                    
                    
                    // accessibilities:
                    aria-label={shippingCarrierLabel}
                    
                    
                    
                    // values:
                    value={shippingCarrier || ''}
                    onChange={handleShippingCarrierChange}
                    
                    
                    
                    // validations:
                    required={false}
                    
                    
                    
                    // formats:
                    placeholder={shippingCarrierLabel}
                />
                <TextEditor
                    // refs:
                    elmRef={elmRef}
                    
                    
                    
                    // classes:
                    className='shippingNumber'
                    
                    
                    
                    // accessibilities:
                    aria-label={shippingNumberLabel}
                    
                    
                    
                    // values:
                    value={shippingNumber || ''}
                    onChange={handleShippingNumberChange}
                    
                    
                    
                    // validations:
                    required={false}
                    
                    
                    
                    // formats:
                    placeholder={shippingNumberLabel}
                />
                
                <Check
                    // values:
                    active={sendConfirmationEmail}
                    onActiveChange={handleConfirmationEmailChange}
                    
                    
                    
                    // validations:
                    enableValidation={false}
                >
                    Send confirmation email to customer
                </Check>
            </AccessibilityProvider>
        </Form>
    );
};
export {
    OrderOnTheWayEditor,
    OrderOnTheWayEditor as default,
}
