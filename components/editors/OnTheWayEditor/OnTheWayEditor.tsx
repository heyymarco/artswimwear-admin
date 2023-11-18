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

// reusable-ui components:
import {
    // base-components:
    IndicatorProps,
    
    
    
    // simple-components:
    Form,
    Check,
}                           from '@reusable-ui/components'  // a set of official Reusable-UI components

// internals components:
import type {
    // types:
    EditorChangeEventHandler,
    
    
    
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    TextEditor,
}                           from '@/components/editors/TextEditor'



// styles:
export const useOnTheWayEditorStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'j4503d5vfx' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// utilities:
const emptyOnTheWayValue : OnTheWayValue = {
    shippingNumber        : null,
    sendConfirmationEmail : true,
};
Object.freeze(emptyOnTheWayValue);



// react components:
export type OnTheWayValue = {
    shippingNumber         : string|null
    sendConfirmationEmail ?: boolean
}
export interface OnTheWayEditorProps
    extends
        // bases:
        Pick<EditorProps<HTMLElement, OnTheWayValue>,
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
    // accessibilities:
    shippingNumberLabel ?: string
}
const OnTheWayEditor = (props: OnTheWayEditorProps): JSX.Element|null => {
    // styles:
    const styleSheet = useOnTheWayEditorStyleSheet();
    
    
    
    // rest props:
    const {
        // accessibilities:
        shippingNumberLabel = 'Shipping Tracking Number (if any)',
        
        
        
        // values:
        defaultValue,
        value,
        onChange,
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
    const [valueDn, setValueDn] = useState<OnTheWayValue>(((value !== undefined) ? value : defaultValue) ?? emptyOnTheWayValue);
    
    
    
    /*
     * value state is based on [controllable value] (if set) and fallback to [uncontrollable value]
     */
    const valueFn : OnTheWayValue = (value !== undefined) ? value /*controllable*/ : valueDn /*uncontrollable*/;
    const shippingNumber         = valueFn.shippingNumber || null;
    const sendConfirmationEmail  = valueFn.sendConfirmationEmail ?? emptyOnTheWayValue.sendConfirmationEmail ?? true;
    
    
    
    // events:
    /*
          controllable : setValue(new) => update state(old => old) => trigger Event(new)
        uncontrollable : setValue(new) => update state(old => new) => trigger Event(new)
    */
    const triggerValueChange = useEvent<EditorChangeEventHandler<OnTheWayValue>>((value) => {
        if (onChange) {
            // fire `onChange` react event:
            onChange(value);
        };
    });
    
    
    
    // callbacks:
    const setValue = useEvent<React.Dispatch<React.SetStateAction<OnTheWayValue>>>((value) => {
        // conditions:
        const newValue = (typeof(value) === 'function') ? value(valueFn) : value;
        if (newValue === valueFn) return; // still the same => nothing to update
        
        
        
        // update:
        setValueDn(newValue);
        triggerValueChange(newValue);
    }); // a stable callback, the `setValue` guaranteed to never change
    
    
    
    // handlers:
    const handleShippingNumberChange    = useEvent<EditorChangeEventHandler<string|null>>((value) => {
        setValue((current) => ({ ...current, shippingNumber        : value  }));
    });
    const handleConfirmationEmailChange = useEvent<EventHandler<ActiveChangeEvent>>(({active}) => {
        setValue((current) => ({ ...current, sendConfirmationEmail : active }));
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
                <TextEditor
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
    OnTheWayEditor,
    OnTheWayEditor as default,
}
