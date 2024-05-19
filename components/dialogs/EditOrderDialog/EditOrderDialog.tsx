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
    
    
    
    // status-components:
    Badge,
    Busy,
    
    
    
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
    Image,
}                           from '@heymarco/image'
import {
    Section,
}                           from '@heymarco/section'
import {
    DataTableHeader,
    DataTableBody,
    DataTableItem,
    DataTable,
}                           from '@heymarco/data-table'

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
    ViewCartItem,
}                           from './ViewCartItem'

// stores:
import {
    // types:
    OrderDetail,
    
    
    
    // hooks:
    useUpdateOrder,
    useGetProductList,
    useGetShippingList,
}                           from '@/store/features/api/apiSlice'

// models:
import type {
    OrderStatus,
}                           from '@prisma/client'

// internals:
import {
    useEditOrderDialogStyleSheet,
}                           from './styles/loader'
import {
    countryList,
}                           from '@/libs/countryList'

// configs:
import {
    PAGE_ORDER_TAB_ORDER_N_SHIPPING,
    PAGE_ORDER_TAB_PAYMENT,
}                           from '@/website.config'
import {
    commerceConfig,
}                           from '@/commerce.config'
import styles from '@/components/Grip/styles/styles'



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
        model = null,
        
        
        
        // auto focusable:
        autoFocusOn,
        
        
        
        // states:
        defaultExpandedTabIndex = (autoFocusOn === 'ConfirmPaymentButton') ? 1 : undefined,
    ...restComplexEditModelDialogProps} = props;
    
    
    
    // states:
    const [shouldTriggerAutoFocus, setShouldTriggerAutoFocus] = useState<boolean>(false);
    
    
    
    // sessions:
    const { data: session } = useSession();
    const role = session?.role;
    
    
    
    // stores:
    const [updateOrder,       {isLoading: isUpdatingOrder                             }] = useUpdateOrder();
    const {data: shippingList, isLoading: isLoadingShipping, isError: isErrorShipping }  = useGetShippingList();
    const {data: productList , isLoading: isLoadingProduct , isError: isErrorProduct  }  = useGetProductList();
    const {
        orderStatus,
        orderTrouble,
        
        preferredCurrency,
        
        items,
        
        shippingAddress    : shippingAddressDetail,
        shippingProviderId : shippingProviderId,
        shippingCost       : totalShippingCosts,
        
        payment            : {
            type           : paymentType,
            brand          : paymentBrand,
            identifier     : paymentIdentifier,
            
            amount         : paymentAmount,
            fee            : paymentFee,
        },
        
        paymentConfirmation,
        shippingTracking,
    } = model ?? { payment: {} };
    
    const [currency, setCurrency] = useState<string>(preferredCurrency?.currency ?? commerceConfig.defaultCurrency);
    const currencyRate = (!!preferredCurrency && (currency !== preferredCurrency.currency)) ? (1 / preferredCurrency.rate) : undefined;
    const currencyOptions = useMemo<string[]>(() => {
        if (!preferredCurrency?.currency) return [commerceConfig.defaultCurrency];
        return Array.from(
            new Set<string>(
                [
                    preferredCurrency?.currency,
                    commerceConfig.defaultCurrency
                ]
            )
        );
    }, [preferredCurrency?.currency]);
    const isForeignCurrency = (currencyOptions.length > 1);
    
    const {
        firstName      : shippingFirstName,
        lastName       : shippingLastName,
        phone          : shippingPhone,
        address        : shippingAddress,
        city           : shippingCity,
        zone           : shippingZone,
        zip            : shippingZip,
        country        : shippingCountry,
    } = shippingAddressDetail ?? {};
    
    const [preferredTimezone, setPreferredTimezone] = useState<number>(() => paymentConfirmation?.preferredTimezone ?? (0 - (new Date()).getTimezoneOffset()));
    
    const shippingProvider       = shippingList?.entities?.[shippingProviderId ?? ''];
    
    const totalProductPrice      = items?.reduce((accum, {price, quantity}) => {
        return accum + (price * quantity);
    }, 0) ?? 0;
    
    const isPaid                 = (paymentType !== 'MANUAL');
    const isManualPaid           = (paymentType === 'MANUAL_PAID');
    const hasPaymentConfirmation = !!paymentConfirmation?.reportedAt;
    const isPaymentRejected      = hasPaymentConfirmation && !!paymentConfirmation.rejectionReason;
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleEditShippingAddress  = useEvent(() => {
        showDialog(
            <SimpleEditAddressDialog
                // data:
                model={model!}
                edit='shippingAddress'
                
                
                
                // components:
                editorComponent={
                    <AddressEditor
                        countryList={countryList}
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
        // conditions:
        if (!model) return; // the model is not exist => nothing to update
        
        
        
        // actions:
        await updateOrder({
            id          : model.id,
            orderStatus : newOrderStatus,
        }).unwrap();
    });
    
    const handleEditShippingTracking = useEvent(() => {
        showDialog(
            <SimpleEditOrderOnTheWayDialog
                // data:
                model={model!}
                edit='shippingTracking'
                
                
                
                // components:
                editorComponent={
                    <OrderOnTheWayEditor />
                }
            />
        );
    });
    
    const handleOrderCompleted       = useEvent(() => {
        showDialog(
            <SimpleEditOrderCompletedDialog
                // data:
                model={model!}
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
                model={model!}
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
                model={model!}
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
        showDialog(
            <SimpleEditPaymentDialog
                // data:
                model={model!}
                edit='payment'
                
                
                
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
        );
    });
    
    const handleCancelOrder          = useEvent(() => {
        showDialog(
            <SimpleEditOrderCanceledDialog
                // data:
                model={model!}
                edit='cancelationReason'
                
                
                
                // components:
                editorComponent={
                    <OrderCanceledEditor />
                }
            />
        );
    });
    
    const handleExpandedEnd          = useEvent(() => {
        setShouldTriggerAutoFocus(true);
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
                <Section title='Order List' theme={!printMode ? (isPaid ? 'primary' : 'danger') : 'light'} className={styleSheet.orderShippingSection}>
                    <Basic tag='strong' theme={!printMode ? (isPaid ? 'success' : 'danger') : undefined} className={styleSheet.badge}>{
                        isPaid
                        ? 'PAID'
                        : 'UNPAID'
                    }</Basic>
                    {!printMode && isForeignCurrency && <SelectCurrencyEditor
                        // variants:
                        theme={isPaid ? 'success' : 'danger'}
                        
                        
                        
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
                                productList={productList}
                            />
                        )}
                    </List>
                    <hr />
                    <p className='currencyBlock'>
                        Subtotal <span className='currency'>
                            <CurrencyDisplay currency={currency} currencyRate={currencyRate} amount={totalProductPrice} />
                        </span>
                    </p>
                    {!!shippingAddressDetail && <p className='currencyBlock'>
                        Shipping <span className='currency'>
                            <CurrencyDisplay currency={currency} currencyRate={currencyRate} amount={totalShippingCosts} />
                        </span>
                    </p>}
                    <hr />
                    <p className='currencyBlock totalCost'>
                        Total <span className='currency'>
                            <CurrencyDisplay currency={currency} currencyRate={currencyRate} amount={[totalProductPrice, totalShippingCosts]} />
                        </span>
                    </p>
                </Section>
                
                {!!shippingAddressDetail && <>
                    {printMode && <Content theme='danger' outlined={true} nude={true} className={styleSheet.printSpacer}>
                        <Icon className='scissors' icon='content_cut' />
                        <hr className='line' />
                    </Content>}
                    
                    <Section title='Deliver To' theme={!printMode ? 'secondary' : 'light'} className={styleSheet.orderDeliverySection}>
                        <Basic tag='strong' className={styleSheet.badge}>{
                            isLoadingShipping
                            ? <Busy />
                            : isErrorShipping
                                ? 'Error getting shipping data'
                                : (shippingProvider?.name ?? 'DELETED SHIPPING PROVIDER')
                        }</Basic>
                        <div className={styleSheet.shippingAddress}>
                            {!printMode && !!role?.order_usa && <EditButton className={styleSheet.editShippingAddress} onClick={handleEditShippingAddress} />}
                            <p>
                                <strong>{shippingFirstName} {shippingLastName}</strong>
                            </p>
                            <p>
                                {shippingAddress}
                                <br />
                                {`${shippingCity}, ${shippingZone} (${shippingZip}), ${countryList?.entities?.[shippingCountry ?? '']?.name}`}
                            </p>
                            <p>
                                Phone: {shippingPhone}
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
    return (
        <ComplexEditModelDialog<OrderDetail>
            // other props:
            {...restComplexEditModelDialogProps}
            
            
            
            // data:
            modelName='Order'
            modelEntryName={`#ORDER_${model?.orderId}`}
            model={model}
            
            
            
            // stores:
            isCommiting = {isUpdatingOrder}
            
            
            
            // states:
            defaultExpandedTabIndex={defaultExpandedTabIndex}
            
            
            
            // auto focusable:
            autoFocusOn={(typeof(autoFocusOn) === 'string') ? undefined : autoFocusOn}
            
            
            
            // handlers:
            onExpandEnd={handleExpandedEnd}
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
                                className={styleSheet.noteBody}
                            >
                                {!shippingTracking?.shippingCarrier && !shippingTracking?.shippingNumber && <span
                                    // classes:
                                    className={`${styleSheet.noteEmpty} txt-sec`}
                                >
                                    -- no shipping tracking number --
                                </span>}
                                <span
                                    // classes:
                                    className={styleSheet.noteContentCenter}
                                >
                                    {!!shippingTracking?.shippingCarrier && <>
                                        ({shippingTracking.shippingCarrier})&nbsp;
                                    </>}
                                    {shippingTracking?.shippingNumber}
                                </span>
                                {!!role?.order_us && <EditButton className={styleSheet.editTrouble} onClick={handleEditShippingTracking} />}
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
                                className={styleSheet.noteBody}
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
                        theme='primary'
                        
                        
                        
                        // states:
                        assertiveFocusable={shouldTriggerAutoFocus && (autoFocusOn === 'OrderStatusButton')}
                        
                        
                        
                        // handlers:
                        onPrint={handlePrint}
                        
                        onChangeOnTheWay={handleEditShippingTracking}
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
                                    isManualPaid && !!role?.order_upmp && <EditButton onClick={handleEditPayment} />
                                }
                            >
                                {
                                    !!paymentBrand
                                    ? (isManualPaid ? paymentBrand : <Image className='paymentProvider' alt={paymentBrand} src={`/brands/${paymentBrand}.svg`} width={42} height={26} />)
                                    : '-'
                                }
                                <span className='paymentIdentifier'>
                                    {!!paymentIdentifier && <>&nbsp;({paymentIdentifier})</>}
                                </span>
                            </DataTableItem>
                            <DataTableItem
                                // accessibilities:
                                label='Amount'
                                
                                
                                
                                // components:
                                tableDataComponent={<Generic className={`${styleSheet.tableDataAmount} currencyData`} />}
                                
                                
                                
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
                                tableDataComponent={<Generic className={`${styleSheet.tableDataComposite} currencyData`} />}
                                
                                
                                
                                // children:
                                actionChildren={
                                    isManualPaid && !!role?.order_upmp && <EditButton onClick={handleEditPayment} />
                                }
                            >
                                <span>
                                    <CurrencyDisplay currency={currency} currencyRate={currencyRate} amount={paymentFee} />
                                </span>
                            </DataTableItem>
                            <DataTableItem
                                // accessibilities:
                                label='Net'
                                
                                
                                
                                // components:
                                tableDataComponent={<Generic className={`${styleSheet.tableDataComposite} currencyData`} />}
                                
                                
                                
                                // children:
                                actionChildren={
                                    <></>
                                }
                            >
                                <strong>
                                    <CurrencyDisplay currency={currency} currencyRate={currencyRate} amount={(paymentAmount !== undefined) ? (paymentAmount - (paymentFee ?? 0)) : undefined} />
                                </strong>
                            </DataTableItem>
                        </DataTableBody>
                    </DataTable>}
                    
                    {!isPaid && !!role?.order_upmu && <>
                        {!hasPaymentConfirmation && <Alert
                            // variants:
                            theme='warning'
                            
                            
                            
                            // classes:
                            className={styleSheet.paymentConfirmationAlert}
                            
                            
                            
                            // states:
                            expanded={true}
                            
                            
                            
                            // components:
                            controlComponent={<React.Fragment />}
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
                                controlComponent={<React.Fragment />}
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
                                controlComponent={<React.Fragment />}
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
                                                <input type='datetime-local' className={styleSheet.outputDate} readOnly={true} value={(new Date(new Date(paymentConfirmation.reviewedAt).valueOf() + (preferredTimezone * 60 * 1000))).toISOString().slice(0, 16)} />
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
                                        {!!paymentConfirmation.reportedAt && <input type='datetime-local' className={styleSheet.outputDate} readOnly={true} value={(new Date(new Date(paymentConfirmation.reportedAt).valueOf() + (preferredTimezone * 60 * 1000))).toISOString().slice(0, 16)} />}
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
                                        {!!paymentConfirmation.paymentDate && <input type='datetime-local' className={styleSheet.outputDate} readOnly={true} value={(new Date(new Date(paymentConfirmation.paymentDate).valueOf() + (preferredTimezone * 60 * 1000))).toISOString().slice(0, 16)} />}
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
                        </div>
                    </>}
                </Section>
            </TabPanel>
        </ComplexEditModelDialog>
    );
};
export {
    EditOrderDialog,
    EditOrderDialog as default,
}
