// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
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
    TextDropdownEditor,
}                           from '@heymarco/text-dropdown-editor'
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

// models:
import {
    shippingCarrierList,
}                           from '@/models'



// styles:
export const useOrderOnTheWayEditorStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'j4503d5vfx' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// utilities:
const emptyOrderOnTheWayValue : Required<OrderOnTheWayValue> = {
    carrier               : null,
    number                : null,
    sendConfirmationEmail : true,
};
Object.freeze(emptyOrderOnTheWayValue);



// react components:
export type OrderOnTheWayValue = {
    carrier                : string|null
    number                 : string|null
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
    
    const [initialValue] = useState<OrderOnTheWayValue>(value);
    
    const {
        carrier,
        number,
        sendConfirmationEmail,
    } = value;
    
    
    
    // utilities:
    const setValue = useEvent((newValue: Partial<OrderOnTheWayValue>) => {
        const combinedNewValue : OrderOnTheWayValue = {
            ...value,
            ...newValue,
        };
        
        const normalizedInitialValueCarrier     = initialValue.carrier?.trim()     || null; // normalize to null if empty_string or only_spaces
        const normalizedInitialValueNumber      = initialValue.number?.trim()      || null; // normalize to null if empty_string or only_spaces
        const normalizedCombinedNewValueCarrier = combinedNewValue.carrier?.trim() || null; // normalize to null if empty_string or only_spaces
        const normalizedCombinedNewValueNumber  = combinedNewValue.number?.trim()  || null; // normalize to null if empty_string or only_spaces
        const {
            sendConfirmationEmail = (
                !normalizedInitialValueCarrier // default to send_notification if the shipping tracking CARRIER is NOT YET provided
                ||
                !normalizedInitialValueNumber  // default to send_notification if the shipping tracking NUMBER is NOT YET provided
                ||
                (normalizedInitialValueCarrier !== normalizedCombinedNewValueCarrier) // default to send_notification if the shipping tracking CARRIER is CHANGED
                ||
                (normalizedInitialValueNumber  !== normalizedCombinedNewValueNumber ) // default to send_notification if the shipping tracking NUMBER is CHANGED
            ),
        } = newValue;
        
        const finalValue = {
            ...combinedNewValue,
            sendConfirmationEmail,
        };
        
        
        
        // update:
        triggerValueChange(finalValue, { triggerAt: 'immediately' });
    });
    
    
    
    // handlers:
    const handleShippingCarrierChange   = useEvent<EditorChangeEventHandler<string|null>>((newShippingCarrier) => {
        setValue({
            carrier               : newShippingCarrier,
        });
    });
    const handleShippingNumberChange    = useEvent<EditorChangeEventHandler<string|null>>((newShippingNumber) => {
        setValue({
            number                : newShippingNumber,
        });
    });
    const handleNotificationEmailChange = useEvent<EventHandler<ActiveChangeEvent>>(({active: newNotification}) => {
        setValue({
            sendConfirmationEmail : newNotification,
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
                <TextDropdownEditor
                    // variants:
                    theme='primary'
                    
                    
                    
                    // accessibilities:
                    aria-label={shippingCarrierLabel}
                    
                    
                    
                    // values:
                    valueOptions={shippingCarrierList}
                    freeTextInput={true}
                    value={carrier || ''}
                    onChange={handleShippingCarrierChange}
                    
                    
                    
                    // validations:
                    required={false}
                    
                    
                    
                    // formats:
                    placeholder={shippingCarrierLabel}
                />
                <TextEditor
                    // refs:
                    elmRef={elmRef}
                    
                    
                    
                    // accessibilities:
                    aria-label={shippingNumberLabel}
                    
                    
                    
                    // values:
                    value={number || ''}
                    onChange={handleShippingNumberChange}
                    
                    
                    
                    // validations:
                    required={false}
                    
                    
                    
                    // formats:
                    placeholder={shippingNumberLabel}
                />
                
                <Check
                    // values:
                    active={sendConfirmationEmail}
                    onActiveChange={handleNotificationEmailChange}
                    
                    
                    
                    // validations:
                    enableValidation={false}
                >
                    Send notification email to customer
                </Check>
            </AccessibilityProvider>
        </Form>
    );
};
export {
    OrderOnTheWayEditor,
    OrderOnTheWayEditor as default,
}
