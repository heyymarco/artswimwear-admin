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

// heymarco:
import {
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'

// heymarco components:
import {
    SelectDropdownEditor,
}                           from '@heymarco/select-dropdown-editor'

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
import {
    CurrencyDisplay,
}                           from '@/components/CurrencyDisplay'
import type {
    // types:
    EditorChangeEventHandler,
    
    
    
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    PriceEditor,
}                           from '@/components/editors/PriceEditor'

// internals:
import {
    convertSystemCurrencyIfRequired,
    revertSystemCurrencyIfRequired,
}                           from '@/libs/currencyExchanges'

// models:
import type {
    PaymentDetail,
}                           from '@/models'



// styles:
export const usePaymentEditorStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'wj6yag159e' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// utilities:
const emptyPaymentValue : Required<PaymentValue> = {
    type                  : 'MANUAL_PAID', // 'MANUAL' (unedited) => 'MANUAL_PAID' (edited)
    brand                 : '',            // 'BANK_TRANSFER'|'CHECK'|'OTHER'
 // identifier            : '',            // unused
 // expiresAt             : null,          // unused
    
    amount                : null,          // the transferred amount
    fee                   : null,          // the transferred fee
    
 // billingAddress        : null,          // unused
    
    sendConfirmationEmail : true,          // an additional option
};
Object.freeze(emptyPaymentValue);



// react components:
export type PaymentValue =
    Pick<PaymentDetail,
        // data:
        |'type'
        |'brand'
        
        // |'amount' // convert to nullable
        // |'fee'    // convert to nullable
    >
    & {
        // data:
        amount                 : number|null // converted to nullable
        fee                    : number|null // converted to nullable
        
        
        
        // options:
        sendConfirmationEmail ?: boolean     // an additional option
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
    // data:
    currencyOptions    ?: string[]
    currency           ?: string
    onCurrencyChange   ?: EditorChangeEventHandler<string>
    
    currencyRate       ?: number
    
    
    
    // refs:
    elmRef             ?: DropdownListButtonProps['elmRef']
    
    
    
    // accessibilities:
    expectedAmount     ?: number
    amountMinThreshold ?: number
    amountMaxThreshold ?: number
    
    confirmedAmount    ?: number
    
    amountLabel        ?: string
    feeLabel           ?: string
}
const PaymentEditor = (props: PaymentEditorProps): JSX.Element|null => {
    // styles:
    const styleSheet = usePaymentEditorStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        currencyOptions,
        currency,
        onCurrencyChange,
        
        currencyRate = 1,
        
        
        
        // refs:
        elmRef,
        
        
        
        // accessibilities:
        expectedAmount,
        amountMinThreshold,
        amountMaxThreshold,
        
        confirmedAmount,
        
        amountLabel = 'Received Amount',
        feeLabel    = 'Fee (if any)',
        
        
        
        // values:
        defaultValue : defaultUncontrollableValue = emptyPaymentValue,
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
    
    const isForeignCurrency = !!currencyOptions && !!currency && (currencyOptions?.length > 1);
    const customerCurrency  = currencyOptions?.[0] ?? undefined;
    
    
    
    // states:
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<PaymentValue>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onControllableValueChange,
    });
    
    const [amountWarning, setAmountWarning] = useState<React.ReactNode>(null);
    const [amountFocused, setAmountFocused] = useState<boolean>(false);
    
    
    
    const {
        brand,
        amount,
        fee,
        sendConfirmationEmail,
    } = value;
    
    
    
    const [editedAmount, setEditedAmount] = useState(() => convertSystemCurrencyIfRequired(amount, currencyRate));
    const [editedFee   , setEditedFee   ] = useState(() => convertSystemCurrencyIfRequired(fee, currencyRate));
    const prevCurrencyRateRef             = useRef(currencyRate);
    useEffect(() => {
        // conditions:
        if (prevCurrencyRateRef.current === currencyRate) return; // still the same rate, nothing to convert
        prevCurrencyRateRef.current = currencyRate;
        
        
        
        // actions:
        setEditedAmount(convertSystemCurrencyIfRequired(amount, currencyRate));
        setEditedFee(convertSystemCurrencyIfRequired(fee, currencyRate));
    }, [currencyRate]);
    
    
    
    // events:
    const setValue = useEvent((newValue: Partial<PaymentValue>) => {
        const combinedValue : PaymentValue = {
            ...value,
            ...newValue,
        };
        
        
        
        // update:
        triggerValueChange(combinedValue, { triggerAt: 'immediately' });
    });
    
    
    
    // handlers:
    const handleProviderChange          = useEvent((newBrand: string) => {
        setValue({
            brand                 : newBrand,
        });
    });
    const handleAmountChange            = useEvent<EditorChangeEventHandler<number|null>>((newEditedAmount) => {
        setEditedAmount(newEditedAmount);
        setValue({
            amount                : revertSystemCurrencyIfRequired(newEditedAmount, currencyRate, customerCurrency),
        });
    });
    const handleFeeChange               = useEvent<EditorChangeEventHandler<number|null>>((newEditedFee) => {
        setEditedFee(newEditedFee);
        setValue({
            fee                   : revertSystemCurrencyIfRequired(newEditedFee, currencyRate, customerCurrency),
        });
    });
    const handleConfirmationEmailChange = useEvent<EventHandler<ActiveChangeEvent>>(({active: newConfirmation}) => {
        setValue({
            sendConfirmationEmail : newConfirmation,
        });
    });
    
    const handleAmountFocus             = useEvent<React.FocusEventHandler<Element>>((event) => {
        setAmountFocused(true);
    });
    const handleAmountBlur              = useEvent<React.FocusEventHandler<Element>>((event) => {
        setAmountFocused(false);
    });
    
    
    
    // effects:
    
    // warns if the entered amount is much different than the expected amount:
    useEffect(() => {
        // setups:
        const cancelWarning = setTimeout(() => {
            let amountWarning : React.ReactNode = null;
            
            if ((amount !== null) && (expectedAmount !== undefined)) {
                const convertedAmount         = convertSystemCurrencyIfRequired(amount        , currencyRate);
                const convertedExpectedAmount = convertSystemCurrencyIfRequired(expectedAmount, currencyRate);
                if (convertedAmount < convertedExpectedAmount) {
                    if ((amountMinThreshold !== undefined) && (((convertedExpectedAmount - convertedAmount) * 100 / convertedAmount) > amountMinThreshold)) {
                        amountWarning = <>
                            The entered amount is <strong>much smaller</strong> than the expected amount. Are you sure?
                        </>;
                    } // if
                }
                else if (convertedAmount > convertedExpectedAmount) {
                    if ((amountMaxThreshold !== undefined) && (((convertedAmount - convertedExpectedAmount) * 100 / convertedAmount) > amountMaxThreshold)) {
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
                {isForeignCurrency && <SelectDropdownEditor
                    // variants:
                    theme='primary'
                    
                    
                    
                    // values:
                    valueOptions={currencyOptions}
                    value={currency}
                    onChange={onCurrencyChange}
                />}
                
                {(expectedAmount !== undefined) && <Basic
                    // variants:
                    theme='success'
                    mild={true}
                >
                    <p>
                        Expected amount: <strong>
                            <CurrencyDisplay currency={currency} currencyRate={currencyRate} amount={expectedAmount} />
                        </strong>
                    </p>
                </Basic>}
                
                {(confirmedAmount !== undefined) && <Basic
                    // variants:
                    theme='warning'
                    mild={true}
                >
                    <p>
                        Confirmed amount: <strong>
                            <CurrencyDisplay currency={currency} currencyRate={currencyRate} amount={confirmedAmount} />
                        </strong>
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
                        {['BANK_TRANSFER', 'CHECK', 'OTHER', /* TODO: config dependent brands */].map((provider, index) =>
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
                    
                    
                    
                    // appearances:
                    currency={currency}
                    
                    
                    
                    // accessibilities:
                    aria-label={amountLabel}
                    
                    
                    
                    // variants:
                    theme={!!amountWarning ? 'warning' : undefined}
                    
                    
                    
                    // values:
                    value={editedAmount}
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
                    
                    
                    
                    // appearances:
                    currency={currency}
                    
                    
                    
                    // accessibilities:
                    aria-label={feeLabel}
                    
                    
                    
                    // values:
                    value={editedFee}
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
