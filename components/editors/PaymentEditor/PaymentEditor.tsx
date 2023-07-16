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
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    IndicatorProps,
    Indicator,
    
    
    
    // simple-components:
    Icon,
    Label,
    TextInput,
    TelInput,
    
    
    
    // layout-components:
    ListItem,
    
    
    
    // menu-components:
    DropdownListButton,
    
    
    
    // composite-components:
    Group,
}                           from '@reusable-ui/components'  // a set of official Reusable-UI components

// heymarco components:
import {
    // react components:
    EditableButton,
}                           from '@heymarco/editable-button'

// internals:
import type {
    // types:
    EditorChangeEventHandler,
    
    
    
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    CurrencyEditor,
}                           from '@/components/editors/CurrencyEditor'

// models:
import type {
    // types:
    PaymentMethodSchema,
}                           from '@/models/Order'

import { getCurrencySign } from '@/libs/formatters'
import { COMMERCE_CURRENCY_FRACTION_MAX } from '@/commerce.config'



// styles:
export const usePaymentEditorStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'wj6yag159e' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// utilities:
const emptyPaymentValue : PaymentValue = {
    type       : 'MANUAL_PAID',
    brand      : '',
    identifier : '',
    
    amount     : NaN,
    fee        : NaN,
};
Object.freeze(emptyPaymentValue);



// react components:
export type PaymentValue = Omit<PaymentMethodSchema, '_id'>
export interface PaymentEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Pick<EditorProps<TElement, PaymentValue>,
            // values:
            |'defaultValue' // supported
            |'value'        // supported
            |'onChange'     // supported
        >,
        Omit<IndicatorProps<TElement>,
            // values:
            |'defaultValue' // taken over by EditorProps
            |'value'        // taken over by EditorProps
            |'onChange'     // taken over by EditorProps
            
            
            
            // children:
            |'children'     // not supported
        >
{
    // refs:
    paymentRef ?: React.Ref<HTMLInputElement> // setter ref
}
const PaymentEditor = <TElement extends Element = HTMLElement>(props: PaymentEditorProps<TElement>): JSX.Element|null => {
    // styles:
    const styleSheet = usePaymentEditorStyleSheet();
    
    
    
    // rest props:
    const {
        // refs:
        paymentRef,
        
        
        
        // values:
        defaultValue,
        value,
        onChange,
    ...restIndicatorProps} = props;
    
    
    
    // states:
    const [valueDn, setValueDn] = useState<PaymentValue>(((value !== undefined) ? value : defaultValue) ?? emptyPaymentValue);
    
    
    
    /*
     * value state is based on [controllable value] (if set) and fallback to [uncontrollable value]
     */
    const valueFn : PaymentValue = (value !== undefined) ? value /*controllable*/ : valueDn /*uncontrollable*/;
    
    
    
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
        setValue((current) => ({ ...current, brand  : value }));
    });
    const handleAmountChange   = useEvent<EditorChangeEventHandler<number|null>>((value) => {
        setValue((current) => ({ ...current, amount : value ?? 0 }));
    });
    const handleFeeChange      = useEvent<EditorChangeEventHandler<number|null>>((value) => {
        setValue((current) => ({ ...current, fee    : value ?? 0 }));
    });
    
    
    
    // jsx:
    return (
        <Indicator<TElement>
            // other props:
            {...restIndicatorProps}
            
            
            
            // variants:
            nude={props.nude ?? true}
            
            
            
            // classes:
            mainClass={props.mainClass ?? styleSheet.main}
        >
            <Group className='provider'>
                <Label theme='secondary' mild={false} className='solid'>
                    <Icon icon='flag' theme='primary' mild={true} />
                </Label>
                <DropdownListButton
                    buttonChildren={valueFn.brand || 'Payment Type'}
                    buttonComponent={<EditableButton isValid={!!valueFn.brand} assertiveFocusable={true} />}
                    
                    theme='primary'
                    mild={true}
                    
                    aria-label='Payment Type'
                >
                    {['BANK_TRANSFER', 'CHECK', 'OTHER'].map((provider, index) =>
                        <ListItem
                            key={index}
                            
                            active={valueFn.brand === provider}
                            onClick={() => handleProviderChange(provider)}
                        >
                            {provider}
                        </ListItem>
                    )}
                </DropdownListButton>
            </Group>
            
            <CurrencyEditor
                className='amount'
                
                placeholder='Amount'
                
                value={valueFn.amount}
                onChange={handleAmountChange}
                currencySign={getCurrencySign()}
                currencyFraction={COMMERCE_CURRENCY_FRACTION_MAX}
                
                required={true}
            />
            
            <CurrencyEditor
                className='fee'
                
                placeholder='Fee (if any)'
                
                value={valueFn.fee}
                onChange={handleFeeChange}
                currencySign={getCurrencySign()}
                currencyFraction={COMMERCE_CURRENCY_FRACTION_MAX}
                
                required={false}
            />
        </Indicator>
    );
};
export {
    PaymentEditor,
    PaymentEditor as default,
}
