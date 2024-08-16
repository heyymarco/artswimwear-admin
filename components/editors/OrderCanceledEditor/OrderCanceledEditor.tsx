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

// internals components:
import type {
    // types:
    EditorChangeEventHandler,
    
    
    
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    WysiwygEditorState,
    
    ToolbarPlugin,
    EditorPlugin,
    WysiwygEditorProps,
    WysiwygEditor,
}                           from '@/components/editors/WysiwygEditor'



// styles:
export const useOrderCanceledEditorStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'wpsz91lv63' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// utilities:
const emptyOrderCanceledValue : Required<OrderCanceledValue> = {
    cancelationReason     : null,
    sendConfirmationEmail : true,
};
Object.freeze(emptyOrderCanceledValue);



// react components:
export type OrderCanceledValue = {
    cancelationReason      : WysiwygEditorState|null
    sendConfirmationEmail ?: boolean
}
export interface OrderCanceledEditorProps
    extends
        // bases:
        Pick<EditorProps<HTMLElement, OrderCanceledValue>,
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
    elmRef                  ?: WysiwygEditorProps['elmRef']
    
    
    
    // accessibilities:
    cancelationReasonLabel  ?: string
}
const OrderCanceledEditor = (props: OrderCanceledEditorProps): JSX.Element|null => {
    // styles:
    const styleSheet = useOrderCanceledEditorStyleSheet();
    
    
    
    // rest props:
    const {
        // refs:
        elmRef,
        
        
        
        // accessibilities:
        cancelationReasonLabel  = 'Cancelation Reason (if any)',
        
        
        
        // values:
        defaultValue : defaultUncontrollableValue = emptyOrderCanceledValue,
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
    } = useControllableAndUncontrollable<OrderCanceledValue>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onControllableValueChange,
    });
    
    const {
        cancelationReason,
        sendConfirmationEmail,
    } = value;
    
    
    
    // utilities:
    const setValue = useEvent((newValue: Partial<OrderCanceledValue>) => {
        const combinedNewValue : OrderCanceledValue = {
            ...value,
            ...newValue,
        };
        
        
        
        // update:
        triggerValueChange(combinedNewValue, { triggerAt: 'immediately' });
    });
    
    
    
    // handlers:
    const handleCancelationReasonChange = useEvent<EditorChangeEventHandler<WysiwygEditorState|null>>((newCancelationReason) => {
        setValue({
            cancelationReason     : newCancelationReason,
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
                <WysiwygEditor
                    // refs:
                    elmRef={elmRef}
                    
                    
                    
                    // classes:
                    className='cancelationReason'
                    
                    
                    
                    // accessibilities:
                    aria-label={cancelationReasonLabel}
                    
                    
                    
                    // values:
                    value={cancelationReason}
                    onChange={handleCancelationReasonChange}
                    
                    
                    
                    // validations:
                    required={false}
                >
                    <ToolbarPlugin className='solid' theme='primary' />
                    <EditorPlugin
                        // accessibilities:
                        placeholder={cancelationReasonLabel}
                    />
                </WysiwygEditor>
                
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
    OrderCanceledEditor,
    OrderCanceledEditor as default,
}
