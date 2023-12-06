// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useEffect,
    useRef,
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
    Basic,
    IndicatorProps,
    
    
    
    // simple-components:
    Icon,
    Label,
    EditableButton,
    ButtonIcon,
    Form,
    Check,
    
    
    
    // layout-components:
    ListItem,
    
    
    
    // notification-components:
    Tooltip,
    
    
    
    // menu-components:
    DropdownListButtonProps,
    DropdownListButton,
    
    
    
    // composite-components:
    Group,
}                           from '@reusable-ui/components'  // a set of official Reusable-UI components

// internals components:
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
    PaymentType,
    Payment,
}                           from '@prisma/client'

// internals:
import {
    formatCurrency,
}                           from '@/libs/formatters'



// styles:
export const usePaymentEditorStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'wj6yag159e' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// utilities:
const emptyPaymentValue : Required<PaymentValue> = {
    type                  : 'MANUAL_PAID',
    brand                 : '',
    identifier            : '',
    
    amount                : null,
    fee                   : null,
    sendConfirmationEmail : true,
    
    billingAddress        : null,
};
Object.freeze(emptyPaymentValue);



// react components:
export type PaymentValue =
    Omit<Payment, 'id'|'amount'|'fee'>
    & {
        amount                 : number|null
        fee                    : number|null
        sendConfirmationEmail ?: boolean
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
    elmRef             ?: DropdownListButtonProps['elmRef']
    
    
    
    // accessibilities:
    expectedAmount     ?: number
    amountMinThreshold ?: number
    amountMaxThreshold ?: number
    
    confirmedAmount    ?: number
    confirmedCurrency  ?: string
    
    amountLabel        ?: string
    feeLabel           ?: string
}
const PaymentEditor = (props: PaymentEditorProps): JSX.Element|null => {
    // styles:
    const styleSheet = usePaymentEditorStyleSheet();
    
    
    
    // rest props:
    const {
        // refs:
        elmRef,
        
        
        
        // accessibilities:
        expectedAmount,
        amountMinThreshold,
        amountMaxThreshold,
        
        confirmedAmount,
        confirmedCurrency,
        
        amountLabel = 'Received Amount',
        feeLabel    = 'Fee (if any)',
        
        
        
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
    
    const [amountWarning, setAmountWarning] = useState<React.ReactNode>(null);
    const [amountFocused, setAmountFocused] = useState<boolean>(false);
    
    
    
    /*
     * value state is based on [controllable value] (if set) and fallback to [uncontrollable value]
     */
    const valueFn : PaymentValue = (value !== undefined) ? value /*controllable*/ : valueDn /*uncontrollable*/;
    const {
        brand,
        amount,
        fee,
        sendConfirmationEmail,
    } = valueFn;
    // const [isInitiallyUnpaid                              ] = useState<boolean    >(valueFn.type === 'MANUAL');
    // const [brand                , setBrand                ] = useState<string|null>((isInitiallyUnpaid ? null : valueFn.brand ) || null   ); // normalize to null if empty_string
    // const [amount               , setAmount               ] = useState<number|null>((isInitiallyUnpaid ? null : valueFn.amount)           ); // perserve zero
    // const [fee                  , setFee                  ] = useState<number|null>((isInitiallyUnpaid ? null : valueFn.fee   ) || null   ); // normalize to null if zero
    // const [sendConfirmationEmail, setSendConfirmationEmail] = useState<boolean    >(isInitiallyUnpaid); // default to checked if was unpaid, otherwise default to unchecked
    
    
    
    // handlers:
    const handleProviderChange          = useEvent((newBrand: string) => {
        const newValue : PaymentValue = {
            ...valueFn,
            type                  : 'MANUAL_PAID',
            
            brand                 : newBrand,
        };
        setValueDn(newValue);
        triggerValueChange(newValue);
    });
    const handleAmountChange            = useEvent<EditorChangeEventHandler<number|null>>((newAmount) => {
        const newValue : PaymentValue = {
            ...valueFn,
            type                  : 'MANUAL_PAID',
            
            amount                : newAmount,
        };
        setValueDn(newValue);
        triggerValueChange(newValue);
    });
    const handleFeeChange               = useEvent<EditorChangeEventHandler<number|null>>((newFee) => {
        const newValue : PaymentValue = {
            ...valueFn,
            type                  : 'MANUAL_PAID',
            
            fee                   : newFee,
        };
        setValueDn(newValue);
        triggerValueChange(newValue);
    });
    const handleConfirmationEmailChange = useEvent<EventHandler<ActiveChangeEvent>>(({active: newConfirmation}) => {
        const newValue : PaymentValue = {
            ...valueFn,
            type                  : 'MANUAL_PAID',
            
            sendConfirmationEmail : newConfirmation,
        };
        setValueDn(newValue);
        triggerValueChange(newValue);
    });
    
    const handleAmountFocus             = useEvent<React.FocusEventHandler<Element>>((event) => {
        setAmountFocused(true);
    });
    const handleAmountBlur              = useEvent<React.FocusEventHandler<Element>>((event) => {
        setAmountFocused(false);
    });
    
    
    
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
    
    
    
    // dom effects:
    useEffect(() => {
        // setups:
        const cancelWarning = setTimeout(() => {
            let amountWarning : React.ReactNode = null;
            
            if ((amount !== null) && (expectedAmount !== undefined)) {
                if (amount < expectedAmount) {
                    if ((amountMinThreshold !== undefined) && (((expectedAmount - amount) * 100 / amount) > amountMinThreshold)) {
                        amountWarning = <>
                            The entered amount is <strong>much smaller</strong> than the expected amount. Are you sure?
                        </>;
                    } // if
                }
                else if (amount > expectedAmount) {
                    if ((amountMaxThreshold !== undefined) && (((amount - expectedAmount) * 100 / amount) > amountMaxThreshold)) {
                        amountWarning = <>
                            The entered amount is <strong>much greater</strong> than the expected amount. Are you sure?
                        </>;
                    } // if
                } // if
            } // if
            
            setAmountWarning(amountWarning);
        }, 500);
        
        
        
        // cleanups:
        return () => {
            clearTimeout(cancelWarning);
        };
    }, [amount, expectedAmount]);
    
    
    
    // refs:
    const amountInputRef = useRef<HTMLInputElement|null>(null);
    
    
    
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
                {(expectedAmount !== undefined) && <Basic
                    // variants:
                    theme='success'
                    mild={true}
                >
                    <p>
                        Expected amount: <strong>{formatCurrency(expectedAmount)}</strong>.
                    </p>
                </Basic>}
                
                {(confirmedAmount !== undefined) && <Basic
                    // variants:
                    theme='warning'
                    mild={true}
                >
                    <p>
                        Confirmed amount: <strong>{formatCurrency(confirmedAmount, confirmedCurrency)}</strong>.
                    </p>
                </Basic>}
                
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
                        // refs:
                        elmRef={elmRef}
                        
                        
                        
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
                            >
                                {brand || 'Payment Type'}
                            </EditableButton>
                        }
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
                    // refs:
                    elmRef={amountInputRef}
                    
                    
                    
                    // classes:
                    className='amount'
                    
                    
                    
                    // accessibilities:
                    aria-label={amountLabel}
                    
                    
                    
                    // variants:
                    theme={!!amountWarning ? 'warning' : undefined}
                    
                    
                    
                    // values:
                    value={amount}
                    onChange={handleAmountChange}
                    
                    
                    
                    // validations:
                    required={true}
                    
                    
                    
                    // formats:
                    placeholder={amountLabel}
                    
                    
                    
                    // handlers:
                    onFocus={handleAmountFocus}
                    onBlur={handleAmountBlur}
                />
                <Tooltip
                    // variants:
                    theme='warning'
                    
                    
                    
                    // states:
                    expanded={amountFocused && !!amountWarning}
                    
                    
                    
                    // floatable:
                    floatingOn={amountInputRef}
                    floatingPlacement='bottom'
                >
                    {amountWarning}
                </Tooltip>
                
                <PriceEditor
                    // classes:
                    className='fee'
                    
                    
                    
                    // accessibilities:
                    aria-label={feeLabel}
                    
                    
                    
                    // values:
                    value={fee}
                    onChange={handleFeeChange}
                    
                    
                    
                    // validations:
                    required={false}
                    
                    
                    
                    // formats:
                    placeholder={feeLabel}
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
    PaymentEditor,
    PaymentEditor as default,
}
