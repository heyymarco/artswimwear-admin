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
    useMergeRefs,
    
    
    
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
    Basic,
    IndicatorProps,
    
    
    
    // simple-components:
    Form,
    Check,
    
    
    
    // notification-components:
    Tooltip,
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
import {
    SelectCurrencyEditor,
}                           from '@/components/editors/SelectCurrencyEditor'

// internals:
import {
    convertSystemCurrencyIfRequired,
    revertSystemCurrencyIfRequired,
}                           from '@/libs/currencyExchanges'

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
    cost                  : null,
    sendConfirmationEmail : true,
};
Object.freeze(emptyOrderOnTheWayValue);



// react components:
export type OrderOnTheWayValue = {
    carrier                : string|null
    number                 : string|null
    cost                   : number|null
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
    
    
    
    // data:
    currencyOptions      ?: string[]
    currency             ?: string
    onCurrencyChange     ?: EditorChangeEventHandler<string>
    
    currencyRate         ?: number
    
    
    
    // accessibilities:
    estimatedCost        ?: number
    costMinThreshold     ?: number
    costMaxThreshold     ?: number
    
    shippingCarrierLabel ?: string
    shippingNumberLabel  ?: string
    shippingCostLabel    ?: string
}
const OrderOnTheWayEditor = (props: OrderOnTheWayEditorProps): JSX.Element|null => {
    // styles:
    const styleSheet = useOrderOnTheWayEditorStyleSheet();
    
    
    
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
        estimatedCost,
        costMinThreshold,
        costMaxThreshold,
        
        shippingCarrierLabel = 'Ship By (if any)',
        shippingNumberLabel  = 'Shipping Tracking Number (if any)',
        shippingCostLabel    = 'Shipping cost (if any)',
        
        
        
        // values:
        defaultValue : defaultUncontrollableValue = emptyOrderOnTheWayValue,
        value        : controllableValue,
        onChange     : onControllableValueChange,
        
        
        
        // other props:
        ...restIndicatorProps
    } = props;
    
    const {
        // accessibilities:
        enabled,         // take
        inheritEnabled,  // take
        
        active,          // take
        inheritActive,   // take
        
        readOnly,        // take
        inheritReadOnly, // take
        
        
        
        // other props:
        ...restFormProps
    } = restIndicatorProps;
    
    const isForeignCurrency = !!currencyOptions && !!currency && (currencyOptions?.length > 1);
    const customerCurrency  = currencyOptions?.[0] ?? undefined;
    
    
    
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
    
    const [carrierWarning, setCarrierWarning ] = useState<React.ReactNode>(null);
    const [carrierFocused, setCarrierFocused] = useState<boolean>(false);
    
    const [numberWarning , setNumberWarning ] = useState<React.ReactNode>(null);
    const [numberFocused , setNumberFocused ] = useState<boolean>(false);
    
    const [costWarning   , setCostWarning   ] = useState<React.ReactNode>(null);
    const [costFocused   , setCostFocused   ] = useState<boolean>(false);
    
    const {
        carrier,
        number,
        cost,
        
        sendConfirmationEmail,
    } = value;
    
    const [editedCost, setEditedCost] = useState(() => convertSystemCurrencyIfRequired(cost, currencyRate));
    
    // auto convert the `cost` if the `currencyRate` changed:
    const prevCurrencyRateRef = useRef(currencyRate);
    useEffect(() => {
        // conditions:
        if (prevCurrencyRateRef.current === currencyRate) return; // still the same rate, nothing to convert
        prevCurrencyRateRef.current = currencyRate;
        
        
        
        // actions:
        setEditedCost(convertSystemCurrencyIfRequired(cost, currencyRate));
    }, [currencyRate, cost]);
    
    
    
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
    const handleShippingCostChange      = useEvent<EditorChangeEventHandler<number|null>>((newShippingCost) => {
        setEditedCost(newShippingCost);
        setValue({
            cost                  : revertSystemCurrencyIfRequired(newShippingCost, currencyRate, customerCurrency),
        });
    });
    const handleNotificationEmailChange = useEvent<EventHandler<ActiveChangeEvent>>(({active: newNotification}) => {
        setValue({
            sendConfirmationEmail : newNotification,
        });
    });
    
    const handleCarrierFocus            = useEvent((): void => {
        setCarrierFocused(true);
    });
    const handleCarrierBlur             = useEvent((): void => {
        setCarrierFocused(false);
    });
    const handleCarrierKeyDown          = useEvent<React.KeyboardEventHandler<Element>>((event) => {
        // conditions:
        /* note: the `code` may `undefined` on autoComplete */
        const keyCode = (event.code as string|undefined)?.toLowerCase();
        if (!keyCode) return; // ignores [unidentified] key
        if ((keyCode !== 'escape')) return; // only interested to [esc] key
        
        
        
        handleCarrierBlur();
    });
    
    const handleNumberFocus             = useEvent((): void => {
        setNumberFocused(true);
    });
    const handleNumberBlur              = useEvent((): void => {
        setNumberFocused(false);
    });
    const handleNumberKeyDown           = useEvent<React.KeyboardEventHandler<Element>>((event) => {
        // conditions:
        /* note: the `code` may `undefined` on autoComplete */
        const keyCode = (event.code as string|undefined)?.toLowerCase();
        if (!keyCode) return; // ignores [unidentified] key
        if ((keyCode !== 'escape')) return; // only interested to [esc] key
        
        
        
        handleNumberBlur();
    });
    
    const handleCostFocus               = useEvent((): void => {
        setCostFocused(true);
    });
    const handleCostBlur                = useEvent((): void => {
        setCostFocused(false);
    });
    const handleCostKeyDown             = useEvent<React.KeyboardEventHandler<Element>>((event) => {
        // conditions:
        /* note: the `code` may `undefined` on autoComplete */
        const keyCode = (event.code as string|undefined)?.toLowerCase();
        if (!keyCode) return; // ignores [unidentified] key
        if ((keyCode !== 'escape')) return; // only interested to [esc] key
        
        
        
        handleCostBlur();
    });
    
    
    
    // effects:
    
    // warns if the entered cost is much different than the estimated cost:
    useEffect(() => {
        // setups:
        const cancelWarning = setTimeout(() => {
            let costWarning : React.ReactNode = null;
            
            if ((cost !== null) && (estimatedCost !== undefined)) {
                const convertedCost          = convertSystemCurrencyIfRequired(cost         , currencyRate);
                const convertedEstimatedCost = convertSystemCurrencyIfRequired(estimatedCost, currencyRate);
                if (convertedCost < convertedEstimatedCost) {
                    if ((costMinThreshold !== undefined) && (((convertedEstimatedCost - convertedCost) * 100 / convertedCost) > costMinThreshold)) {
                        costWarning = <div>
                            <p>
                                The entered cost is <strong>much smaller</strong> than the estimated cost.
                            </p>
                            <p>
                                Are you sure?
                            </p>
                        </div>;
                    } // if
                }
                else if (convertedCost > convertedEstimatedCost) {
                    if ((costMaxThreshold !== undefined) && (((convertedCost - convertedEstimatedCost) * 100 / convertedCost) > costMaxThreshold)) {
                        costWarning = <div>
                            <p>
                                The entered cost is <strong>much greater</strong> than the estimated cost.
                            </p>
                            <p>
                                Are you sure?
                            </p>
                        </div>;
                    } // if
                } // if
            } // if
            
            setCostWarning(costWarning);
        }, 500);
        
        
        
        // cleanups:
        return () => {
            clearTimeout(cancelWarning);
        };
    }, [cost, estimatedCost]);
    
    // warns if the entered shipping carrier is changed from the old one:
    
    
    useEffect(() => {
        // setups:
        const normalizedInitialValueCarrier     = initialValue.carrier?.trim() || null; // normalize to null if empty_string or only_spaces
        const normalizedCombinedNewValueCarrier = value?.carrier?.trim()       || null; // normalize to null if empty_string or only_spaces
        const cancelWarning = setTimeout(() => {
            const isCarrierChanged = (
                !normalizedInitialValueCarrier // default to send_notification if the shipping tracking CARRIER is NOT YET provided
                ||
                (normalizedInitialValueCarrier !== normalizedCombinedNewValueCarrier) // default to send_notification if the shipping tracking CARRIER is CHANGED
            );
            setCarrierWarning(
                !isCarrierChanged
                ? null
                : <div>
                    <p>
                        The entered <strong>shipping carrier is changed</strong> from <em>{initialValue.carrier?.trim()}</em> to <em>{value?.carrier?.trim()}</em>.
                    </p>
                    <p>
                        The changes will be informed to the customer (if the checkbox below is checked).
                    </p>
                </div>
            );
        }, 500);
        
        
        
        // cleanups:
        return () => {
            clearTimeout(cancelWarning);
        };
    }, [initialValue.carrier, value?.carrier]);
    
    useEffect(() => {
        // setups:
        const normalizedInitialValueNumber      = initialValue.number?.trim()  || null; // normalize to null if empty_string or only_spaces
        const normalizedCombinedNewValueNumber  = value?.number?.trim()        || null; // normalize to null if empty_string or only_spaces
        const cancelWarning = setTimeout(() => {
            const isNumberChanged = (
                !normalizedInitialValueNumber  // default to send_notification if the shipping tracking NUMBER is NOT YET provided
                ||
                (normalizedInitialValueNumber  !== normalizedCombinedNewValueNumber ) // default to send_notification if the shipping tracking NUMBER is CHANGED
            );
            setNumberWarning(
                !isNumberChanged
                ? null
                : <div>
                    <p>
                        The entered <strong>shipping tracking number is changed</strong> from <em>{initialValue.number?.trim()}</em> to <em>{value?.number?.trim()}</em>.
                    </p>
                    <p>
                        The changes will be informed to the customer (if the checkbox below is checked).
                    </p>
                </div>
            );
        }, 500);
        
        
        
        // cleanups:
        return () => {
            clearTimeout(cancelWarning);
        };
    }, [initialValue.number, value?.number]);
    
    
    
    // refs:
    const carrierInputRef      = useRef<HTMLInputElement|null>(null);
    const numberInputRef       = useRef<HTMLInputElement|null>(null);
    const costInputRef         = useRef<HTMLInputElement|null>(null);
    
    const mergedNumberInputRef = useMergeRefs(
        // preserves the original `elmRef` from `props`:
        elmRef,
        
        
        
        numberInputRef,
    );
    
    
    
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
                    // refs:
                    elmRef={carrierInputRef}
                    
                    
                    
                    // variants:
                    theme={!!carrierWarning ? 'warning' : 'primary'}
                    
                    
                    
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
                    
                    
                    
                    // handlers:
                    onFocus={handleCarrierFocus}
                    onBlur={handleCarrierBlur}
                    onKeyDown={handleCarrierKeyDown}
                />
                <Tooltip
                    // variants:
                    theme='warning'
                    
                    
                    
                    // states:
                    expanded={carrierFocused && !!carrierWarning}
                    
                    
                    
                    // floatable:
                    floatingOn={carrierInputRef}
                    floatingPlacement='top'
                >
                    {carrierWarning}
                </Tooltip>
                
                <TextEditor
                    // refs:
                    elmRef={mergedNumberInputRef}
                    
                    
                    
                    // variants:
                    theme={!!numberWarning ? 'warning' : undefined}
                    
                    
                    
                    // accessibilities:
                    aria-label={shippingNumberLabel}
                    
                    
                    
                    // values:
                    value={number || ''}
                    onChange={handleShippingNumberChange}
                    
                    
                    
                    // validations:
                    required={false}
                    
                    
                    
                    // formats:
                    placeholder={shippingNumberLabel}
                    
                    
                    
                    // handlers:
                    onFocus={handleNumberFocus}
                    onBlur={handleNumberBlur}
                    onKeyDown={handleNumberKeyDown}
                />
                <Tooltip
                    // variants:
                    theme='warning'
                    
                    
                    
                    // states:
                    expanded={numberFocused && !!numberWarning}
                    
                    
                    
                    // floatable:
                    floatingOn={numberInputRef}
                    floatingPlacement='top'
                >
                    {numberWarning}
                </Tooltip>
                
                <hr />
                
                {isForeignCurrency && <SelectCurrencyEditor
                    // variants:
                    theme='primary'
                    
                    
                    
                    // values:
                    valueOptions={currencyOptions}
                    value={currency}
                    onChange={onCurrencyChange}
                />}
                
                {(estimatedCost !== undefined) && <Basic
                    // variants:
                    theme='success'
                    mild={true}
                >
                    <p>
                        Estimated cost: <strong>
                            <CurrencyDisplay currency={currency} currencyRate={currencyRate} amount={estimatedCost} />
                        </strong>
                    </p>
                </Basic>}
                
                <PriceEditor
                    // refs:
                    elmRef={costInputRef}
                    
                    
                    
                    // appearances:
                    currency={currency}
                    
                    
                    
                    // accessibilities:
                    aria-label={shippingCostLabel}
                    
                    
                    
                    // variants:
                    theme={!!costWarning ? 'warning' : undefined}
                    
                    
                    
                    // values:
                    value={editedCost}
                    onChange={handleShippingCostChange}
                    
                    
                    
                    // validations:
                    required={true}
                    
                    
                    
                    // formats:
                    placeholder={shippingCostLabel}
                    
                    
                    
                    // handlers:
                    onFocus={handleCostFocus}
                    onBlur={handleCostBlur}
                    onKeyDown={handleCostKeyDown}
                />
                <Tooltip
                    // variants:
                    theme='warning'
                    
                    
                    
                    // states:
                    expanded={costFocused && !!costWarning}
                    
                    
                    
                    // floatable:
                    floatingOn={costInputRef}
                    floatingPlacement='bottom'
                >
                    {costWarning}
                </Tooltip>
                
                <hr />
                
                <Check
                    // values:
                    active={sendConfirmationEmail}
                    onActiveChange={handleNotificationEmailChange}
                    
                    
                    
                    // validations:
                    enableValidation={false}
                >
                    Send <em>shipping tracking number</em> to customer
                </Check>
            </AccessibilityProvider>
        </Form>
    );
};
export {
    OrderOnTheWayEditor,
    OrderOnTheWayEditor as default,
}
