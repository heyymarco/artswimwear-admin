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
    
    
    
    // an accessibility management system:
    AccessibilityProvider,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    IndicatorProps,
    
    
    
    // simple-components:
    Icon,
    Label,
    EditableButton,
    ButtonIcon,
    Form,
    
    
    
    // layout-components:
    ListItem,
    
    
    
    // menu-components:
    DropdownListButton,
    
    
    
    // composite-components:
    Group,
}                           from '@reusable-ui/components'  // a set of official Reusable-UI components

// internals:
import type {
    // types:
    EditorChangeEventHandler,
    
    
    
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    PriceEditor,
}                           from '@/components/editors/PriceEditor'

// models:
import type {
    Payment,
}                           from '@prisma/client'



// styles:
export const usePaymentEditorStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'wj6yag159e' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// utilities:
const emptyPaymentValue : PaymentValue = {
    type           : 'MANUAL_PAID',
    brand          : '',
    identifier     : '',
    
    amount         : null,
    fee            : null,
    
    billingAddress : null,
};
Object.freeze(emptyPaymentValue);



// react components:
export type PaymentValue =
    Omit<Payment, 'id'|'amount'|'fee'>
    & {
        amount : number|null
        fee    : number|null
    }
export interface PaymentEditorProps
    extends
        // bases:
        Pick<EditorProps<HTMLElement, PaymentValue>,
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
const PaymentEditor = (props: PaymentEditorProps): JSX.Element|null => {
    // styles:
    const styleSheet = usePaymentEditorStyleSheet();
    
    
    
    // rest props:
    const {
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
    const [valueDn, setValueDn] = useState<PaymentValue>(((value !== undefined) ? value : defaultValue) ?? emptyPaymentValue);
    
    
    
    /*
     * value state is based on [controllable value] (if set) and fallback to [uncontrollable value]
     */
    const valueFn : PaymentValue = (value !== undefined) ? value /*controllable*/ : valueDn /*uncontrollable*/;
    const brand  = valueFn.brand;
    const amount = valueFn.amount || null;
    const fee    = valueFn.fee    || null;
    
    
    
    // events:
    /*
          controllable : setValue(new) => update state(old => old) => trigger Event(new)
        uncontrollable : setValue(new) => update state(old => new) => trigger Event(new)
    */
    const triggerValueChange = useEvent<EditorChangeEventHandler<PaymentValue>>((value) => {
        if (onChange) {
            // fire `onChange` react event:
            onChange(value);
        };
    });
    
    
    
    // callbacks:
    const setValue = useEvent<React.Dispatch<React.SetStateAction<PaymentValue>>>((value) => {
        // conditions:
        const newValue = (typeof(value) === 'function') ? value(valueFn) : value;
        if (newValue === valueFn) return; // still the same => nothing to update
        
        
        
        // update:
        setValueDn(newValue);
        triggerValueChange(newValue);
    }); // a stable callback, the `setValue` guaranteed to never change
    
    
    
    // handlers:
    const handleProviderChange = useEvent((value: string) => {
        setValue((current) => ({ ...current, type: emptyPaymentValue.type, brand  : value }));
    });
    const handleAmountChange   = useEvent<EditorChangeEventHandler<number|null>>((value) => {
        setValue((current) => ({ ...current, type: emptyPaymentValue.type, amount : value }));
    });
    const handleFeeChange      = useEvent<EditorChangeEventHandler<number|null>>((value) => {
        setValue((current) => ({ ...current, type: emptyPaymentValue.type, fee    : value }));
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
                <Group className='provider'>
                    <Label theme='secondary' mild={false} className='solid'>
                        <Icon
                            // appearances:
                            icon='flag'
                            
                            
                            
                            // variants:
                            theme='primary'
                            mild={true}
                        />
                    </Label>
                    <DropdownListButton
                        // variants:
                        theme='primary'
                        mild={true}
                        
                        
                        
                        // accessibilities:
                        aria-label='Payment Type'
                        
                        
                        
                        // components:
                        buttonComponent={
                            <EditableButton
                                // accessibilities:
                                assertiveFocusable={true}
                                
                                
                                
                                // validations:
                                isValid={!!brand}
                                
                                
                                
                                // components:
                                buttonComponent={
                                    <ButtonIcon
                                        // appearances:
                                        icon='dropdown'
                                        iconPosition='end'
                                    />
                                }
                            />
                        }
                        
                        
                        
                        // children:
                        buttonChildren={brand || 'Payment Type'}
                    >
                        {['BANK_TRANSFER', 'CHECK', 'OTHER'].map((provider, index) =>
                            <ListItem
                                // identifiers:
                                key={index}
                                
                                
                                
                                // accessibilities:
                                active={brand === provider}
                                
                                
                                
                                // handlers:
                                onClick={() => handleProviderChange(provider)}
                            >
                                {provider}
                            </ListItem>
                        )}
                    </DropdownListButton>
                </Group>
                
                <PriceEditor
                    // classes:
                    className='amount'
                    
                    
                    
                    // accessibilities:
                    aria-label='Amount'
                    
                    
                    
                    // values:
                    value={amount}
                    onChange={handleAmountChange}
                    
                    
                    
                    // validations:
                    required={true}
                    
                    
                    
                    // formats:
                    placeholder='Amount'
                />
                
                <PriceEditor
                    // classes:
                    className='fee'
                    
                    
                    
                    // accessibilities:
                    aria-label='Fee'
                    
                    
                    
                    // values:
                    value={fee}
                    onChange={handleFeeChange}
                    
                    
                    
                    // validations:
                    required={false}
                    
                    
                    
                    // formats:
                    placeholder='Fee (if any)'
                />
            </AccessibilityProvider>
        </Form>
    );
};
export {
    PaymentEditor,
    PaymentEditor as default,
}
