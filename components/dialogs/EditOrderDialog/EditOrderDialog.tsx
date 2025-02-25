'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
    useEffect,
    useMemo,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Generic,
    Basic,
    
    
    
    // base-content-components:
    Content,
    
    
    
    // simple-components:
    IconProps,
    Icon,
    ButtonIcon,
    
    
    
    // layout-components:
    List,
    
    
    
    // notification-components:
    Alert,
    
    
    
    // menu-components:
    Collapse,
    
    
    
    // dialog-components:
    ModalExpandedChangeEvent,
    
    
    
    // composite-components:
    Group,
    TabPanel,
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Section,
}                           from '@heymarco/section'
import {
    DataTableHeader,
    DataTableBody,
    DataTableItem,
    DataTable,
}                           from '@heymarco/data-table'
import {
    AlternateSeparator,
}                           from '@heymarco/alternate-separator'

// internal components:
import {
    CurrencyDisplay,
}                           from '@/components/CurrencyDisplay'
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    OrderStatusProgress,
}                           from '@/components/OrderStatusProgress'
import {
    OrderStatusButton,
}                           from '@/components/OrderStatusButton'
import {
    AddressEditor,
}                           from '@/components/editors/AddressEditor'
import {
    OrderOnTheWayEditor,
}                           from '@/components/editors/OrderOnTheWayEditor'
import {
    OrderCompletedEditor,
}                           from '@/components/editors/OrderCompletedEditor'
import {
    PaymentEditor,
}                           from '@/components/editors/PaymentEditor'
import {
    OrderCanceledEditor,
}                           from '@/components/editors/OrderCanceledEditor'
import {
    WysiwygEditorState,
    
    ToolbarPlugin,
    EditorPlugin,
    WysiwygEditor,
    
    WysiwygViewer,
}                           from '@/components/editors/WysiwygEditor'
import {
    TimezoneEditor,
}                           from '@/components/editors/TimezoneEditor'
import {
    SelectCurrencyEditor,
}                           from '@/components/editors/SelectCurrencyEditor'
import {
    CollapsibleSuspense,
}                           from '@/components/CollapsibleSuspense'
import {
    SimpleEditAddressDialog,
}                           from '@/components/dialogs/SimpleEditAddressDialog'
import {
    SimpleEditOrderOnTheWayDialog,
}                           from '@/components/dialogs/SimpleEditOrderOnTheWayDialog'
import {
    SimpleEditOrderCompletedDialog,
}                           from '@/components/dialogs/SimpleEditOrderCompletedDialog'
import {
    SimpleEditOrderTroubleDialog,
}                           from '@/components/dialogs/SimpleEditOrderTroubleDialog'
import {
    SimpleEditPaymentDialog,
}                           from '@/components/dialogs/SimpleEditPaymentDialog'
import {
    SimpleEditOrderCanceledDialog,
}                           from '@/components/dialogs/SimpleEditOrderCanceledDialog'
import {
    SimpleEditPaymentRejectedDialog,
}                           from '@/components/dialogs/SimpleEditPaymentRejectedDialog'
import {
    // react components:
    ImplementedComplexEditModelDialogProps,
    ComplexEditModelDialog,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    PrintDialog,
}                           from '@/components/dialogs/PrintDialog'
import {
    ViewShipmentDialog,
}                           from '@/components/dialogs/ViewShipmentDialog'
import {
    DateTimeDisplay,
}                           from '@/components/DateTimeDisplay'
import {
    PaymentMethodBrand,
}                           from '@/components/payments/PaymentMethodBrand'
import {
    PaymentMethodIdentifier,
}                           from '@/components/payments/PaymentMethodIdentifier'
import {
    ViewCartItem,
}                           from './ViewCartItem'
import {
    CountDown,
}                           from './CountDown'

// models:
import {
    type ModelRetryEventHandler,
    
    type OrderDetail,
}                           from '@/models'
import type {
    OrderStatus,
}                           from '@prisma/client'

// stores:
import {
    // hooks:
    useUpdateOrder,
    useGetShippingList,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    useEditOrderDialogStyleSheet,
}                           from './styles/loader'

// others:
import {
    Country,
}                           from 'country-state-city'

// configs:
import {
    PAGE_ORDER_TAB_ORDER_N_SHIPPING,
    PAGE_ORDER_TAB_PAYMENT,
}                           from '@/website.config'
import {
    checkoutConfigShared,
}                           from '@/checkout.config.shared'



// react components:
export interface EditOrderDialogProps
    extends
        // bases:
        Omit<ImplementedComplexEditModelDialogProps<OrderDetail>,
            // auto focusable:
            |'autoFocusOn'
        >
{
    autoFocusOn ?: ImplementedComplexEditModelDialogProps<OrderDetail>['autoFocusOn'] | 'OrderStatusButton' | 'ConfirmPaymentButton'
}
const EditOrderDialog = (props: EditOrderDialogProps): JSX.Element|null => {
    // styles:
    const styleSheet = useEditOrderDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model : modelRaw,
        
        
        
        // auto focusable:
        autoFocusOn,
        
        
        
        // states:
        defaultExpandedTabIndex = (autoFocusOn === 'ConfirmPaymentButton') ? 1 : undefined,
    ...restComplexEditModelDialogProps} = props;
    const model = modelRaw!;
    
    
    
    // states:
    const [shouldTriggerAutoFocus, setShouldTriggerAutoFocus] = useState<boolean>(false);
    
    
    
    // sessions:
    const { data: session } = useSession();
    const role = session?.role;
    
    
    
    // apis:
    const [updateOrder,       {isLoading: isUpdating                                                            }] = useUpdateOrder();
    const {data: shippingList, isLoading: isLoadingShipping, isError: isErrorShipping, refetch: refetchShipping }  = useGetShippingList();
    const {
        orderStatus,
        orderTrouble,
        cancelationReason,
        
        currency : preferredCurrency,
        
        items,
        
        customer,
        guest,
        
        shippingAddress    : shippingAddressDetail,
        shippingProviderId : shippingProviderId,
        shippingCost       : totalShippingCosts,
        
        payment,
        
        paymentConfirmation,
        shipment,
    } = model ?? {};
    const {
        type           : paymentType,
        brand          : paymentBrand,
        expiresAt      : paymentExpiresAt,
        
        amount         : paymentAmount,
        fee            : paymentFee,
    } = payment ?? {};
    
    const {
        preference : customerOrGuestPreference,
    } = customer ?? guest ?? {};
    const {
        timezone : customerOrGuestPreferredTimezone,
    } = customerOrGuestPreference ?? {};
    
    const [currency, setCurrency] = useState<string>(preferredCurrency?.currency ?? checkoutConfigShared.intl.defaultCurrency);
    const currencyRate = (!!preferredCurrency && (currency !== preferredCurrency.currency)) ? (1 / preferredCurrency.rate) : undefined;
    const currencyOptions = useMemo<string[]>(() => {
        if (!preferredCurrency?.currency) return [checkoutConfigShared.intl.defaultCurrency];
        return Array.from(
            new Set<string>(
                [
                    preferredCurrency?.currency,
                    checkoutConfigShared.intl.defaultCurrency
                ]
            )
        );
    }, [preferredCurrency?.currency]);
    const isForeignCurrency = (currencyOptions.length > 1);
    
    const [preferredTimezone, setPreferredTimezone] = useState<number>(() => customerOrGuestPreferredTimezone ?? checkoutConfigShared.intl.defaultTimezone);
    
    const shippingProvider       = !shippingProviderId ? undefined : shippingList?.entities?.[shippingProviderId];
    
    const totalProductPrice      = items?.reduce((accum, {price, quantity}) => {
        return accum + (price * quantity);
    }, 0) ?? 0;
    
    const isCanceled             = (orderStatus === 'CANCELED');
    const isExpired              = (orderStatus === 'EXPIRED');
    const isCanceledOrExpired    = isCanceled || isExpired;
    const isPaid                 = !isCanceledOrExpired && (paymentType !== 'MANUAL');
    const isManualPaid           = !isCanceledOrExpired && (paymentType === 'MANUAL_PAID') && !paymentBrand /* assumes 'MANUAL_PAID' with 'indomaret'|'alfamart' as auto_payment */;
    const hasPaymentConfirmation = !!paymentConfirmation?.reportedAt;
    const isPaymentRejected      = hasPaymentConfirmation && !!paymentConfirmation.rejectionReason;
    
    const isShippingCostDrifted  = (
        (totalShippingCosts !== null)
        &&
        (shipment?.cost !== undefined)
        &&
        (shipment.cost !== null)
        &&
        (shipment.cost !== totalShippingCosts)
    );
    
    
    
    // statuses:
    const isLoading = (
        // have any loading(s):
        
        (
            !!shippingAddressDetail // IGNORE shippingLoading if no shipping required
            &&
            isLoadingShipping
        )
        /* isOther1Loading */
        /* isOther2Loading */
        /* isOther3Loading */
    );
    const isError   = (
        !isLoading // while still LOADING => consider as NOT error
        &&
        (
            // have any error(s):
            
            (
                !!shippingAddressDetail // IGNORE shippingError if no shipping required
                &&
                isErrorShipping
            )
            /* isOther1Error */
            /* isOther2Error */
            /* isOther3Error */
        )
    );
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    type EditMode = Exclude<keyof OrderDetail, 'id'>
    const [editMode, setEditMode] = useState<EditMode|null>(null);
    
    
    
    // handlers:
    const handleEditShippingAddress  = useEvent(() => {
        showDialog(
            <SimpleEditAddressDialog
                // data:
                model={model}
                edit='shippingAddress'
                
                
                
                // components:
                editorComponent={
                    <AddressEditor
                        // accessibilities:
                        autoComplete={false}
                        
                        
                        
                        // types:
                        addressType='shipping'
                        
                        
                        
                        // components:
                        companyEditorComponent={null}
                    />
                }
            />
        );
    });
    
    const handlePrint                = useEvent(() => {
        showDialog(
            <PrintDialog
                // variants:
                theme='primary'
                
                
                
                // classes:
                className={styleSheet.orderShippingTab}
            >
                <OrderAndShipping
                    // appearances:
                    printMode={true}
                />
            </PrintDialog>
        );
    });
    const handleChangeOrderStatus    = useEvent(async (newOrderStatus: OrderStatus) => {
        // actions:
        await updateOrder({
            id          : model.id,
            orderStatus : newOrderStatus,
        }).unwrap();
    });
    const handleViewShipment         = useEvent(() => {
        showDialog(
            <ViewShipmentDialog
                // data:
                orderId={model.id}
            />
        );
    });
    
    const handleEditShipment         = useEvent(() => {
        setEditMode('shipment');
    });
    
    const handleOrderCompleted       = useEvent(() => {
        showDialog(
            <SimpleEditOrderCompletedDialog
                // data:
                model={model}
                edit='orderStatus'
                
                
                
                // components:
                editorComponent={
                    <OrderCompletedEditor />
                }
            />
        );
    });
    
    const handleEditTrouble          = useEvent(() => {
        showDialog(
            <SimpleEditOrderTroubleDialog
                // data:
                model={model}
                edit='orderTrouble'
                
                
                
                // components:
                editorComponent={
                    <WysiwygEditor>
                        <ToolbarPlugin className='solid' theme='primary' />
                        <EditorPlugin
                            // accessibilities:
                            placeholder='Type the trouble note here...'
                        />
                    </WysiwygEditor>
                }
            />
        );
    });
    
    const handleRejectPayment        = useEvent(() => {
        showDialog(
            <SimpleEditPaymentRejectedDialog
                // data:
                model={model}
                edit='paymentConfirmation'
                
                
                
                // components:
                editorComponent={
                    <WysiwygEditor
                        // validations:
                        required={true}
                    >
                        <ToolbarPlugin className='solid' theme='primary' />
                        <EditorPlugin
                            // accessibilities:
                            aria-label='Rejection Reason'
                            data-icon={'chat' as IconProps['icon']}
                            placeholder='Type the reason why the payment confirmation is rejected here...'
                        />
                    </WysiwygEditor>
                }
            />
        );
    });
    const handleEditPayment          = useEvent(() => {
        setEditMode('payment');
    });
    
    const handleCancelOrder          = useEvent(() => {
        showDialog(
            <SimpleEditOrderCanceledDialog
                // data:
                model={model}
                edit='cancelationReason'
                
                
                
                // components:
                editorComponent={
                    <OrderCanceledEditor />
                }
            />
        );
    });
    
    const handleExpandedChange       = useEvent<EventHandler<ModalExpandedChangeEvent>>(({expanded}): void => {
        // conditions:
        if (expanded) return; // ignore if expanded
        
        
        
        // actions:
        setEditMode(null);
    });
    const handleExpandedEnd          = useEvent(() => {
        setShouldTriggerAutoFocus(true);
    });
    
    const handleModelRetry           = useEvent<ModelRetryEventHandler<void>>((): void => {
        if (isErrorShipping && !isLoadingShipping) refetchShipping();
    });
    
    
    
    // refs:
    const autoFocusRef = useRef<HTMLElement|null>(null);
    
    
    
    // dom effects:
    useEffect(() => {
        // conditions:
        if (!shouldTriggerAutoFocus) return;
        if (typeof(autoFocusOn) !== 'string') return;
        const autoFocusElm = autoFocusRef.current;
        if (!autoFocusElm) return;
        
        
        
        // setups:
        let cancelAutoFocus = setTimeout(() => {
            autoFocusElm.scrollIntoView({
                behavior : 'smooth',
            });
            cancelAutoFocus = setTimeout(() => {
                autoFocusElm.focus({
                    preventScroll : true,
                });
                setShouldTriggerAutoFocus(false);
            }, 500);
        }, 100);
        
        
        
        // cleanups:
        return () => {
            clearTimeout(cancelAutoFocus);
        };
    }, [shouldTriggerAutoFocus, autoFocusOn]);
    
    
    
    // jsx:
    const OrderAndShipping = ({printMode = false}): JSX.Element|null => {
        // jsx:
        return (
            <>
                <Section
                    // accessibilities:
                    title='Order List'
                    
                    
                    
                    // variants:
                    theme={
                        printMode
                        ? 'light'           // a light theme for white_paper friendly prints
                        : (
                            isCanceledOrExpired
                            ? 'danger'      // a danger theme for CANCELED|EXPIRED orders
                            : (
                                isPaid
                                ? 'primary' // a default theme for   PAID orders
                                : 'danger'  // a danger  theme for UNPAID orders
                            )
                        )
                    }
                    
                    
                    
                    // classes:
                    className={styleSheet.orderShippingSection}
                >
                    <Basic
                        // semantics:
                        tag='strong'
                        
                        
                        
                        // variants:
                        theme={
                            printMode
                            ? 'inherit'         // an inherit theme for white_paper friendly prints
                            : (
                                isCanceledOrExpired
                                ? 'danger'      // a danger theme for CANCELED|EXPIRED orders
                                : (
                                    isPaid
                                    ? 'success' // a success theme for   PAID orders
                                    : 'danger'  // a danger  theme for UNPAID orders
                                )
                            )
                        }
                        
                        
                        
                        // classes:
                        className={styleSheet.badge}
                    >{
                        isCanceledOrExpired
                        ? (
                            isCanceled
                            ? 'ORDER CANCELED' // a  canceled_order label
                            : 'ORDER EXPIRED'  // an expired_order  label
                        )
                        : (
                            isPaid
                            ? 'PAID'           // a    paid_order label
                            : 'UNPAID'         // an unpaid_order label
                        )
                    }</Basic>
                    {!printMode && isForeignCurrency && <SelectCurrencyEditor
                        // variants:
                        theme={
                            isCanceledOrExpired
                            ? 'danger'      // a danger theme for CANCELED|EXPIRED orders
                            : (
                                isPaid
                                ? 'success' // a success theme for   PAID orders
                                : 'danger'  // a danger  theme for UNPAID orders
                            )
                        }
                        
                        
                        
                        // classes:
                        className={styleSheet.selectCurrencyBadge}
                        
                        
                        
                        // values:
                        valueOptions={currencyOptions}
                        value={currency}
                        onChange={setCurrency}
                    />}
                    <List className={styleSheet.viewCart} listStyle={['flush', 'numbered']}>
                        {items?.map(({price: unitPrice, quantity, productId, variantIds}, itemIndex) =>
                            <ViewCartItem
                                // identifiers:
                                key={`${productId}/${variantIds.join('/')}` || itemIndex}
                                
                                
                                
                                // data:
                                currency={currency}
                                currencyRate={currencyRate}
                                
                                unitPrice={unitPrice}
                                quantity={quantity}
                                
                                
                                
                                // relation data:
                                productId={productId}
                                variantIds={variantIds}
                            />
                        )}
                    </List>
                    <hr />
                    <p className='currencyBlock'>
                        Subtotal <span className='currency'>
                            <CurrencyDisplay currency={currency} currencyRate={currencyRate} amount={totalProductPrice} />
                        </span>
                    </p>
                    {!!shippingAddressDetail && <>
                        <p className='currencyBlock' role={(isShippingCostDrifted && !printMode) ? 'deletion' : undefined}>
                            Shipping{(isShippingCostDrifted && !printMode) ? <>&nbsp;<span>(estimated)</span></> : null} <span className='currency'>
                                <CurrencyDisplay currency={currency} currencyRate={currencyRate} amount={totalShippingCosts} />
                            </span>
                        </p>
                        {(isShippingCostDrifted && !printMode) && <p className='currencyBlock'>
                            Shipping&nbsp;<span className='txt-sec'>(actual)</span> <span className='currency'>
                                <CurrencyDisplay currency={currency} currencyRate={currencyRate} amount={shipment.cost} />
                            </span>
                        </p>}
                    </>}
                    <hr />
                    <p className='currencyBlock totalCost'>
                        Total <span className='currency'>
                            <CurrencyDisplay currency={currency} currencyRate={currencyRate} amount={[
                                totalProductPrice,
                                (
                                    (isShippingCostDrifted && !printMode)
                                    ? shipment.cost      // actual    shipping cost
                                    : totalShippingCosts // estimated shipping cost
                                ),
                            ]} />
                        </span>
                    </p>
                </Section>
                
                {!!shippingAddressDetail && <>
                    {printMode && <Content theme='danger' outlined={true} nude={true} className={styleSheet.printSpacer}>
                        <Icon className='scissors' icon='content_cut' />
                        <hr className='line' />
                    </Content>}
                    
                    <Section title='Deliver To' theme={printMode ? 'light' : 'secondary'} className={styleSheet.orderDeliverySection}>
                        <Basic tag='strong' className={`${styleSheet.badge} ${styleSheet.shippingBadge}`}>
                            {shippingProvider?.name ?? 'DELETED SHIPPING PROVIDER'}
                            
                            {!printMode && !!shipment?.number && <ButtonIcon
                                // appearances:
                                icon='my_location'
                                
                                
                                
                                // variants:
                                theme='primary'
                                buttonStyle='link'
                                
                                
                                
                                // classes:
                                className='btnPrint'
                                
                                
                                
                                // accessibilities:
                                title='View Shipping Tracking'
                                
                                
                                
                                // handlers:
                                onClick={handleViewShipment}
                            >Track</ButtonIcon>}
                        </Basic>
                        <div className={styleSheet.shippingAddress}>
                            {!printMode && !!role?.order_usa && <EditButton className={styleSheet.editShippingAddress} onClick={handleEditShippingAddress} />}
                            <p>
                                <strong>{shippingAddressDetail.firstName} {shippingAddressDetail.lastName}</strong>
                            </p>
                            <p>
                                {shippingAddressDetail.address}
                                <br />
                                {`${shippingAddressDetail.city}, ${shippingAddressDetail.state} (${shippingAddressDetail.zip}), ${Country.getCountryByCode(shippingAddressDetail.country)?.name ?? shippingAddressDetail.country}`}
                            </p>
                            <p>
                                Phone: {shippingAddressDetail.phone}
                            </p>
                        </div>
                    </Section>
                </>}
                
                {printMode && <Content theme='danger' outlined={true} nude={true} className={styleSheet.printSpacer}>
                    <Icon className='scissors' icon='content_cut' />
                    <hr className='line' />
                </Content>}
            </>
        );
    };
    return (<>
        <ComplexEditModelDialog<OrderDetail>
            // other props:
            {...restComplexEditModelDialogProps}
            
            
            
            // data:
            modelName='Order'
            modelEntryName={`#ORDER_${model?.orderId}`}
            model={model}
            
            
            
            // stores:
            isModelLoading = {isLoading}
            isModelError   = {isError}
            
            isCommiting    = {isUpdating}
            
            
            
            // states:
            defaultExpandedTabIndex={defaultExpandedTabIndex}
            
            
            
            // auto focusable:
            autoFocusOn={(typeof(autoFocusOn) === 'string') ? undefined : autoFocusOn}
            
            
            
            // handlers:
            onExpandEnd={handleExpandedEnd}
            
            onModelRetry={handleModelRetry}
        >
            <TabPanel label={PAGE_ORDER_TAB_ORDER_N_SHIPPING} panelComponent={<Generic className={styleSheet.orderShippingTab} />}>
                <OrderAndShipping />
                <Section
                    // refs:
                    elmRef={(!role?.order_us && (autoFocusOn === 'OrderStatusButton')) ? autoFocusRef : undefined}
                    
                    
                    
                    // variants:
                    theme='primary'
                    
                    
                    
                    // classes:
                    className={styleSheet.actionSection}
                >
                    <OrderStatusProgress
                        // data:
                        model={model}
                        
                        
                        
                        // classes:
                        className={styleSheet.progressBadge}
                    />
                    {/* TODO: show expired status */}
                    <Collapse
                        // states:
                        expanded={(orderStatus === 'ON_THE_WAY')}
                    >
                        <Group
                            // variants:
                            orientation='block'
                        >
                            <Basic
                                // classes:
                                className={styleSheet.noteHeader}
                            >
                                Shipping Tracking Number
                            </Basic>
                            <Content
                                // classes:
                                className={styleSheet.noteBodyFull}
                            >
                                {!shipment?.carrier && !shipment?.number && <span
                                    // classes:
                                    className={`${styleSheet.noteEmpty} txt-sec`}
                                >
                                    -- no shipping tracking number --
                                </span>}
                                <span
                                    // classes:
                                    className={styleSheet.noteContentCenter}
                                >
                                    {!!shipment?.carrier && <><span className='txt-sec'>
                                            ({shipment.carrier})
                                        </span>
                                        &nbsp;
                                    </>}
                                    {!!shipment?.number && <strong>
                                        {shipment.number}
                                    </strong>}
                                </span>
                                {!!role?.order_us && <EditButton className={styleSheet.editTrouble} onClick={handleEditShipment} />}
                            </Content>
                        </Group>
                    </Collapse>
                    <Collapse
                        // states:
                        expanded={(orderStatus === 'IN_TROUBLE')}
                    >
                        <Group
                            // variants:
                            theme='danger'
                            orientation='block'
                        >
                            <Basic
                                // classes:
                                className={styleSheet.noteHeader}
                            >
                                Trouble Note
                            </Basic>
                            <Content
                                // classes:
                                className={styleSheet.noteBodyFull}
                            >
                                {!orderTrouble && <span
                                    // classes:
                                    className={`${styleSheet.noteEmpty} txt-sec`}
                                >
                                    -- no trouble note --
                                </span>}
                                {!!orderTrouble && <WysiwygViewer
                                    // variants:
                                    nude={true}
                                    
                                    
                                    
                                    // values:
                                    value={(orderTrouble ?? null) as unknown as WysiwygEditorState|undefined}
                                />}
                                {!!role?.order_us && <EditButton className={styleSheet.editTrouble} onClick={handleEditTrouble} />}
                            </Content>
                        </Group>
                    </Collapse>
                    {!!role?.order_us && <OrderStatusButton
                        // refs:
                        elmRef={(autoFocusOn === 'OrderStatusButton') ? (autoFocusRef as React.MutableRefObject<HTMLButtonElement|null>) : undefined}
                        
                        
                        
                        // data:
                        model={model}
                        
                        
                        
                        // variants:
                        theme={isCanceledOrExpired ? 'danger' : 'primary'}
                        
                        
                        
                        // states:
                        assertiveFocusable={shouldTriggerAutoFocus && (autoFocusOn === 'OrderStatusButton')}
                        
                        
                        
                        // handlers:
                        onPrint={handlePrint}
                        
                        onChangeOnTheWay={handleEditShipment}
                        onChangeCompleted={handleOrderCompleted}
                        onChangeNext={handleChangeOrderStatus}
                    />}
                    <ButtonIcon
                        // variants:
                        theme='secondary'
                        
                        
                        
                        // classes:
                        className='btnPrint'
                        
                        
                        
                        // components:
                        iconComponent={<Icon icon='print' theme='primary' mild={true} />}
                        
                        
                        
                        // handlers:
                        onClick={handlePrint}
                    >
                        Print
                    </ButtonIcon>
                </Section>
            </TabPanel>
            <TabPanel label={PAGE_ORDER_TAB_PAYMENT}          panelComponent={<Generic className={styleSheet.paymentTab} />}>
                <Section className={styleSheet.paymentSection}>
                    {isCanceledOrExpired && <>
                        <Alert
                            // appearances:
                            icon={isCanceled ? 'cancel_presentation' : 'timer_off'}
                            
                            
                            
                            // variants:
                            theme='danger'
                            mild={false}
                            
                            
                            
                            // classes
                            className={styleSheet.paymentAlert}
                            
                            
                            
                            // states:
                            expanded={true}
                            
                            
                            
                            // components:
                            controlComponent={null}
                        >
                            {isCanceled && <>
                                <p>
                                    The order was canceled.
                                </p>
                            </>}
                            {isExpired && <>
                                <p>
                                    The order has expired.
                                </p>
                            </>}
                        </Alert>
                        <Group
                            // variants:
                            theme='danger'
                            orientation='block'
                            
                            
                            
                            // classes
                            className={styleSheet.paymentNote}
                        >
                            <Basic
                                // classes:
                                className={styleSheet.noteHeader}
                            >
                                {isCanceled && <>Cancelation Reason</>}
                                {isExpired  && <>Expired Date</>}
                            </Basic>
                            {isCanceled && <Content
                                // classes:
                                className={styleSheet.noteBodyFull}
                            >
                                {!cancelationReason && <span
                                    // classes:
                                    className={`${styleSheet.noteEmpty} txt-sec`}
                                >
                                    -- no cancelation reason --
                                </span>}
                                {!!cancelationReason && <WysiwygViewer
                                    // variants:
                                    nude={true}
                                    
                                    
                                    
                                    // values:
                                    value={(cancelationReason ?? null) as unknown as WysiwygEditorState|undefined}
                                />}
                            </Content>}
                            {isExpired && <Basic
                                // variants:
                                mild={true}
                                
                                
                                
                                // classes:
                                className={styleSheet.noteBodyExpired}
                            >
                                {!!paymentExpiresAt && <span className={styleSheet.dateTime}>
                                    <DateTimeDisplay dateTime={paymentExpiresAt} timezone={preferredTimezone} showTimezone={false} />
                                </span>}
                                
                                <TimezoneEditor
                                    // variants:
                                    theme='danger'
                                    
                                    
                                    
                                    // values:
                                    value={preferredTimezone}
                                    onChange={setPreferredTimezone}
                                />
                            </Basic>}
                        </Group>
                    </>}
                    
                    {!isCanceledOrExpired && <>
                        {/* paid => displays payment information */}
                        {isPaid && <DataTable className={styleSheet.dataTable} breakpoint='sm'>
                            <DataTableBody>
                                <DataTableItem
                                    // accessibilities:
                                    label='Method'
                                >
                                    <span>
                                        {paymentType}
                                    </span>
                                </DataTableItem>
                                <DataTableItem
                                    // accessibilities:
                                    label={isManualPaid ? 'Type' : 'Provider'}
                                    
                                    
                                    
                                    // components:
                                    tableDataComponent={<Generic className={styleSheet.tableDataComposite} />}
                                    
                                    
                                    
                                    // children:
                                    actionChildren={
                                        (isManualPaid && !!role?.order_upmp) && <EditButton onClick={handleEditPayment} />
                                    }
                                >
                                    <PaymentMethodBrand model={payment} />
                                    <PaymentMethodIdentifier model={payment} />
                                </DataTableItem>
                                <DataTableItem
                                    // accessibilities:
                                    label='Amount'
                                    
                                    
                                    
                                    // components:
                                    tableDataComponent={<Generic className={styleSheet.tableDataAmount} />}
                                    
                                    
                                    
                                    // children:
                                    actionChildren={
                                        isManualPaid && !!role?.order_upmp && <EditButton onClick={handleEditPayment} />
                                    }
                                >
                                    {isForeignCurrency && <SelectCurrencyEditor
                                        // variants:
                                        theme='primary'
                                        
                                        
                                        
                                        // classes:
                                        className={styleSheet.selectCurrencyDropdown}
                                        
                                        
                                        
                                        // values:
                                        valueOptions={currencyOptions}
                                        value={currency}
                                        onChange={setCurrency}
                                    />}
                                    <strong>
                                        <CurrencyDisplay currency={currency} currencyRate={currencyRate} amount={paymentAmount} />
                                    </strong>
                                </DataTableItem>
                                <DataTableItem
                                    // accessibilities:
                                    label='Fee'
                                    
                                    
                                    
                                    // components:
                                    tableDataComponent={<Generic className={styleSheet.tableDataAmount} />}
                                    
                                    
                                    
                                    // children:
                                    actionChildren={
                                        isManualPaid && !!role?.order_upmp && <EditButton onClick={handleEditPayment} />
                                    }
                                >
                                    <span>
                                        <CurrencyDisplay currency={currency} currencyRate={currencyRate} amount={paymentFee} />
                                    </span>
                                </DataTableItem>
                                {isShippingCostDrifted && <DataTableItem
                                    // accessibilities:
                                    label='Shipping Drift'
                                    
                                    
                                    
                                    // components:
                                    tableDataComponent={<Generic className={styleSheet.tableDataAmount} />}
                                    
                                    
                                    
                                    // children:
                                    actionChildren={
                                        isManualPaid && !!role?.order_upmp && <></>
                                    }
                                >
                                    <span>
                                        <CurrencyDisplay currency={currency} currencyRate={currencyRate} amount={(totalShippingCosts ?? 0) - (shipment?.cost ?? 0)} />
                                    </span>
                                </DataTableItem>}
                                <DataTableItem
                                    // accessibilities:
                                    label='Net'
                                    
                                    
                                    
                                    // components:
                                    tableDataComponent={<Generic className={styleSheet.tableDataAmount} />}
                                    
                                    
                                    
                                    // children:
                                    actionChildren={
                                        isManualPaid && !!role?.order_upmp && <></>
                                    }
                                >
                                    <strong>
                                        <CurrencyDisplay currency={currency} currencyRate={currencyRate} amount={(paymentAmount !== undefined) ? (paymentAmount - (paymentFee ?? 0) + ((totalShippingCosts ?? 0) - (shipment?.cost ?? 0))) : undefined} />
                                    </strong>
                                </DataTableItem>
                            </DataTableBody>
                        </DataTable>}
                        
                        {/* unpaid => shows alert, payment confirmation (if any), and action buttons */}
                        {!isPaid && !!role?.order_upmu && <>
                            {!hasPaymentConfirmation && <Alert
                                // variants:
                                theme='warning'
                                
                                
                                
                                // classes:
                                className={styleSheet.paymentConfirmationAlert}
                                
                                
                                
                                // states:
                                expanded={true}
                                
                                
                                
                                // components:
                                controlComponent={null}
                            >
                                <p>
                                    Attention: The buyer has <strong>not confirmed the payment</strong> yet.
                                </p>
                                <p>
                                    However, you can immediately approve the payment if you are sure that the buyer has completed the payment.
                                </p>
                            </Alert>}
                            
                            {hasPaymentConfirmation && <>
                                {!isPaymentRejected && <Alert
                                    // variants:
                                    theme='warning'
                                    
                                    
                                    
                                    // classes:
                                    className={styleSheet.paymentConfirmationAlert}
                                    
                                    
                                    
                                    // states:
                                    expanded={true}
                                    
                                    
                                    
                                    // components:
                                    controlComponent={null}
                                >
                                    <p>
                                        The buyer has <strong>confirmed the payment</strong>.
                                    </p>
                                    <p>
                                        Please <strong>review</strong> to take approval or rejection action.
                                    </p>
                                </Alert>}
                                
                                {isPaymentRejected && <Alert
                                    // variants:
                                    theme='warning'
                                    
                                    
                                    
                                    // classes:
                                    className={styleSheet.paymentConfirmationAlert}
                                    
                                    
                                    
                                    // states:
                                    expanded={true}
                                    
                                    
                                    
                                    // components:
                                    controlComponent={null}
                                >
                                    <p>
                                        You have <strong>rejected</strong> the buyer&apos;s payment confirmation.
                                    </p>
                                    <p>
                                        However you can still change it as <strong>approved</strong>.
                                    </p>
                                    
                                    <hr />
                                    
                                    <p>
                                        Rejection reason:
                                    </p>
                                    <WysiwygViewer
                                        // variants:
                                        nude={true}
                                        
                                        
                                        
                                        // values:
                                        value={(paymentConfirmation.rejectionReason ?? null) as WysiwygEditorState|null}
                                    />
                                </Alert>}
                                
                                <DataTable className={styleSheet.dataTable} breakpoint='sm'>
                                    <DataTableHeader tableTitleComponent={<Basic />}>
                                        Payment Confirmation
                                    </DataTableHeader>
                                    <DataTableBody>
                                        <DataTableItem
                                            // accessibilities:
                                            label='Reviewed At'
                                        >
                                            {
                                                paymentConfirmation.reviewedAt
                                                ? <>
                                                    <span className={styleSheet.dateTime}>
                                                        <DateTimeDisplay dateTime={paymentConfirmation.reviewedAt} timezone={preferredTimezone} showTimezone={false} />
                                                    </span>
                                                    
                                                    <TimezoneEditor
                                                        // variants:
                                                        theme='primary'
                                                        mild={true}
                                                        
                                                        
                                                        
                                                        // values:
                                                        value={preferredTimezone}
                                                        onChange={setPreferredTimezone}
                                                    />
                                                </>
                                                : <span className='txt-sec'>not yet reviewed</span>
                                            }
                                        </DataTableItem>
                                        <DataTableItem
                                            // accessibilities:
                                            label='Reported At'
                                        >
                                            {!!paymentConfirmation.reportedAt && <span className={styleSheet.dateTime}>
                                                <DateTimeDisplay dateTime={paymentConfirmation.reportedAt} timezone={preferredTimezone} showTimezone={false} />
                                            </span>}
                                            
                                            <TimezoneEditor
                                                // variants:
                                                theme='primary'
                                                mild={true}
                                                
                                                
                                                
                                                // values:
                                                value={preferredTimezone}
                                                onChange={setPreferredTimezone}
                                            />
                                        </DataTableItem>
                                        <DataTableItem
                                            // accessibilities:
                                            label='Amount'
                                            
                                            
                                            
                                            // components:
                                            tableDataComponent={<Generic className={styleSheet.tableDataAmount} />}
                                        >
                                            {isForeignCurrency && <SelectCurrencyEditor
                                                // variants:
                                                theme='primary'
                                                
                                                
                                                
                                                // classes:
                                                className={styleSheet.selectCurrencyDropdown}
                                                
                                                
                                                
                                                // values:
                                                valueOptions={currencyOptions}
                                                value={currency}
                                                onChange={setCurrency}
                                            />}
                                            <strong>
                                                <CurrencyDisplay currency={currency} currencyRate={currencyRate} amount={paymentConfirmation.amount} />
                                            </strong>
                                        </DataTableItem>
                                        <DataTableItem
                                            // accessibilities:
                                            label='Payer'
                                        >
                                            {paymentConfirmation.payerName}
                                        </DataTableItem>
                                        <DataTableItem
                                            // accessibilities:
                                            label='Payment Date'
                                        >
                                            {!!paymentConfirmation.paymentDate && <span className={styleSheet.dateTime}>
                                                <DateTimeDisplay dateTime={paymentConfirmation.paymentDate} timezone={preferredTimezone} showTimezone={false} />
                                            </span>}
                                            
                                            <TimezoneEditor
                                                // variants:
                                                theme='primary'
                                                mild={true}
                                                
                                                
                                                
                                                // values:
                                                value={preferredTimezone}
                                                onChange={setPreferredTimezone}
                                            />
                                        </DataTableItem>
                                        <DataTableItem
                                            // accessibilities:
                                            label='Originating Bank'
                                        >
                                            {paymentConfirmation.originatingBank}
                                        </DataTableItem>
                                        <DataTableItem
                                            // accessibilities:
                                            label='Destination Bank'
                                        >
                                            {paymentConfirmation.destinationBank}
                                        </DataTableItem>
                                    </DataTableBody>
                                </DataTable>
                            </>}
                            
                            <div className={styleSheet.paymentConfirmActions}>
                                <ButtonIcon
                                    // refs:
                                    elmRef={(autoFocusOn === 'ConfirmPaymentButton') ? (autoFocusRef as React.MutableRefObject<HTMLButtonElement|null>) : undefined}
                                    
                                    
                                    
                                    // appearances:
                                    icon='done'
                                    
                                    
                                    
                                    // variants:
                                    size='lg'
                                    theme='success'
                                    gradient={true}
                                    
                                    
                                    
                                    // states:
                                    assertiveFocusable={shouldTriggerAutoFocus && (autoFocusOn === 'ConfirmPaymentButton')}
                                    
                                    
                                    
                                    // handlers:
                                    onClick={handleEditPayment}
                                >
                                    Approve Payment
                                </ButtonIcon>
                                
                                {hasPaymentConfirmation && <ButtonIcon
                                    // appearances:
                                    icon='not_interested'
                                    
                                    
                                    
                                    // variants:
                                    size='lg'
                                    theme='danger'
                                    gradient={!isPaymentRejected} // no gradient if disabled
                                    
                                    
                                    
                                    // states:
                                    enabled={!isPaymentRejected}
                                    
                                    
                                    
                                    // handlers:
                                    onClick={handleRejectPayment}
                                >
                                    {isPaymentRejected ? 'Payment Rejected' : 'Reject Payment'}
                                </ButtonIcon>}
                                
                                <AlternateSeparator />
                                
                                <ButtonIcon
                                    // appearances:
                                    icon='delete_forever'
                                    
                                    
                                    
                                    // variants:
                                    size='sm'
                                    theme='danger'
                                    outlined={true}
                                    
                                    
                                    
                                    // handlers:
                                    onClick={handleCancelOrder}
                                >
                                    Cancel Order
                                </ButtonIcon>
                                
                                
                                
                                {!!paymentExpiresAt && <CountDown paymentExpiresAt={paymentExpiresAt} />}
                            </div>
                        </>}
                    </>}
                </Section>
            </TabPanel>
        </ComplexEditModelDialog>
        <CollapsibleSuspense>
            {/* workaround for `onCurrencyChange` issue, the dialog must be React's declarative way */}
            <SimpleEditPaymentDialog
                // data:
                model={model}
                edit='payment'
                
                
                
                // states:
                expanded={editMode === 'payment'}
                onExpandedChange={handleExpandedChange}
                
                
                
                // components:
                editorComponent={
                    <PaymentEditor
                        // data:
                        currencyOptions={currencyOptions}
                        currency={currency}
                        onCurrencyChange={setCurrency}
                        
                        currencyRate={currencyRate}
                        
                        
                        
                        // accessibilities:
                        expectedAmount={
                            totalProductPrice + (totalShippingCosts ?? 0)
                        }
                        amountMinThreshold={20 /* percent */}
                        amountMaxThreshold={20 /* percent */}
                        
                        confirmedAmount={paymentConfirmation?.amount ?? undefined}
                    />
                }
            />
            
            {/* workaround for `onCurrencyChange` issue, the dialog must be React's declarative way */}
            <SimpleEditOrderOnTheWayDialog
                // data:
                model={model}
                edit='shipment'
                defaultCarrier={shippingProvider?.name ?? undefined}
                
                
                
                // states:
                expanded={editMode === 'shipment'}
                onExpandedChange={handleExpandedChange}
                
                
                
                // components:
                editorComponent={
                    <OrderOnTheWayEditor
                        // data:
                        currencyOptions={currencyOptions}
                        currency={currency}
                        onCurrencyChange={setCurrency}
                        
                        currencyRate={currencyRate}
                        
                        
                        
                        // accessibilities:
                        estimatedCost={(totalShippingCosts === undefined) ? undefined : (totalShippingCosts ?? 0)}
                        costMinThreshold={20 /* percent */}
                        costMaxThreshold={20 /* percent */}
                    />
                }
            />
        </CollapsibleSuspense>
    </>);
};
export {
    EditOrderDialog,
    EditOrderDialog as default,
}
