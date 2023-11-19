'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
    useEffect,
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
    Icon,
    ButtonIcon,
    
    
    
    // layout-components:
    List,
    
    
    
    // status-components:
    Badge,
    Busy,
    
    
    
    // menu-components:
    Collapse,
    
    
    
    // dialog-components:
    ModalExpandedChangeEvent,
    
    
    
    // composite-components:
    Group,
    TabPanel,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'
import {
    Section,
}                           from '@heymarco/section'

// internal components:
import {
    CompoundWithBadge,
}                           from '@/components/CompoundWithBadge'
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
    PaymentEditor,
}                           from '@/components/editors/PaymentEditor'
import {
    WysiwygEditorState,
    WysiwygViewer,
}                           from '@/components/editors/WysiwygEditor'
import {
    CollapsibleSuspense,
}                           from '@/components/CollapsibleSuspense'
import {
    SimpleEditAddressDialog,
}                           from '@/components/dialogs/SimpleEditAddressDialog'
import {
    SimpleEditPaymentDialog,
}                           from '@/components/dialogs/SimpleEditPaymentDialog'
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
    formatCurrency,
}                           from '@/libs/formatters'
import {
    countryList,
}                           from '@/libs/countryList'

// configs:
import {
    PAGE_ORDER_TAB_ORDER_N_SHIPPING,
    PAGE_ORDER_TAB_PAYMENT,
}                           from '@/website.config'



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
    type EditMode = 'shippingAddress'|'trouble'|'payment'|'printOrder'
    const [editMode, setEditMode] = useState<EditMode|null>(null);
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
    } = model ?? { payment: {} };
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
    
    const shippingProvider = shippingList?.entities?.[shippingProviderId ?? ''];
    
    const totalProductPrices  = items?.reduce((accum, item) => {
        const productUnitPrice = productList?.entities?.[`${item.productId}` || '']?.price;
        if (!productUnitPrice) return accum;
        return accum + (productUnitPrice * item.quantity);
    }, 0) ?? 0;
    
    const paymentTypeUppercased = paymentType?.toUpperCase();
    const isPaid                = !!paymentTypeUppercased && (paymentTypeUppercased !== 'MANUAL');
    const isManualPaid          = (paymentTypeUppercased === 'MANUAL_PAID');
    
    
    
    // handlers:
    const handleExpandedChange      = useEvent<EventHandler<ModalExpandedChangeEvent>>(({expanded}): void => {
        // conditions:
        if (expanded) return; // ignore if expanded
        
        
        
        // actions:
        setEditMode(null);
    });
    
    const handleEditShippingAddress = useEvent(() => {
        setEditMode('shippingAddress');
    });
    
    const handlePrint               = useEvent(() => {
        setEditMode('printOrder');
    });
    const handleChangeOrderStatus   = useEvent(async (newOrderStatus: OrderStatus) => {
        // conditions:
        if (!model) return; // the model is not exist => nothing to update
        
        
        
        // actions:
        await updateOrder({
            id          : model.id,
            orderStatus : newOrderStatus,
        }).unwrap();
    });
    
    const handleEditTrouble         = useEvent(() => {
        setEditMode('trouble');
    });
    
    const handleConfirmPayment      = useEvent(() => {
        setEditMode('payment');
    });
    const handleEditPayment         = useEvent(() => {
        setEditMode('payment');
    });
    
    const handleExpandedEnd         = useEvent(() => {
        setShouldTriggerAutoFocus(true);
    });
    
    
    
    // refs:
    const autoFocusButtonRef = useRef<HTMLButtonElement|null>(null);
    
    
    
    // dom effects:
    useEffect(() => {
        // conditions:
        if (!shouldTriggerAutoFocus) return;
        if (typeof(autoFocusOn) !== 'string') return;
        
        
        
        // setups:
        let cancelAutoFocus = setTimeout(() => {
            autoFocusButtonRef.current?.scrollIntoView({
                behavior : 'smooth',
            });
            cancelAutoFocus = setTimeout(() => {
                autoFocusButtonRef.current?.focus({
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
                    <List className={styleSheet.viewCart} listStyle={['flush', 'numbered']}>
                        {items?.map(({price: unitPrice, quantity, productId}, itemIndex) =>
                            <ViewCartItem
                                // identifiers:
                                key={productId || itemIndex}
                                
                                
                                
                                // data:
                                unitPrice={unitPrice}
                                quantity={quantity}
                                
                                
                                
                                // relation data:
                                productId={productId}
                                productList={productList}
                            />
                        )}
                    </List>
                    <hr />
                    <p className='currencyBlock'>
                        Subtotal <span className='currency'>
                            {formatCurrency(totalProductPrices)}
                        </span>
                    </p>
                    {!!shippingAddressDetail && <p className='currencyBlock'>
                        Shipping <span className='currency'>
                            {formatCurrency(totalShippingCosts)}
                        </span>
                    </p>}
                    <hr />
                    <p className='currencyBlock totalCost'>
                        Total <span className='currency'>
                            {formatCurrency(totalProductPrices + (totalShippingCosts ?? 0))}
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
        <>
            <ComplexEditModelDialog<OrderDetail>
                // other props:
                {...restComplexEditModelDialogProps}
                
                
                
                // data:
                modelName='Order'
                modelEntryName={`#ORDER-${model?.orderId}`}
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
                    <Section theme='primary' className={styleSheet.actionSection}>
                        <OrderStatusProgress
                            // data:
                            model={model}
                            
                            
                            
                            // classes:
                            className={styleSheet.progressBadge}
                        />
                        <Collapse
                            // states:
                            expanded={(orderStatus === 'IN_TROUBLE')}
                        >
                            <Group
                                // variants:
                                orientation='block'
                            >
                                <Basic
                                    // classes:
                                    className={styleSheet.troubleHeader}
                                >
                                    Trouble Note
                                </Basic>
                                <Content
                                    // classes:
                                    className={styleSheet.troubleBody}
                                >
                                    <WysiwygViewer
                                        // variants:
                                        nude={true}
                                        
                                        
                                        
                                        // classes:
                                        className={styleSheet.troubleContent}
                                        
                                        
                                        
                                        // values:
                                        value={(orderTrouble ?? undefined) as unknown as WysiwygEditorState|undefined}
                                    />
                                    <EditButton className={styleSheet.editTrouble} onClick={handleEditTrouble} />
                                </Content>
                            </Group>
                        </Collapse>
                        <OrderStatusButton
                            // refs:
                            elmRef={(autoFocusOn === 'OrderStatusButton') ? autoFocusButtonRef : undefined}
                            
                            
                            
                            // data:
                            model={model}
                            
                            
                            
                            // variants:
                            theme='primary'
                            
                            
                            
                            // states:
                            assertiveFocusable={shouldTriggerAutoFocus && (autoFocusOn === 'OrderStatusButton')}
                            
                            
                            
                            // handlers:
                            onPrint={handlePrint}
                            onChange={handleChangeOrderStatus}
                        />
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
                        <table>
                            <tbody>
                                <tr>
                                    <th>
                                        Method
                                    </th>
                                    <td>
                                        <span>
                                            {paymentTypeUppercased}
                                        </span>
                                    </td>
                                </tr>
                                {isPaid && <>
                                    <tr>
                                        <th>
                                            {isManualPaid ? 'Type' : 'Provider'}
                                        </th>
                                        <td>
                                            {
                                                !!paymentBrand
                                                ? (isManualPaid ? paymentBrand : <Image className='paymentProvider' alt={paymentBrand} src={`/brands/${paymentBrand}.svg`} width={42} height={26} />)
                                                : '-'
                                            }
                                            <span className='paymentIdentifier'>
                                                {!!paymentIdentifier && <>&nbsp;({paymentIdentifier})</>}
                                            </span>
                                            {isManualPaid && !!role?.order_upmp && <EditButton onClick={handleEditPayment} />}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            Amount
                                        </th>
                                        <td className='currencyData'>
                                            <strong>
                                                {formatCurrency(paymentAmount)}
                                            </strong>
                                            {isManualPaid && !!role?.order_upmp && <EditButton onClick={handleEditPayment} />}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            Fee
                                        </th>
                                        <td className='currencyData'>
                                            <span>
                                                {formatCurrency(paymentFee)}
                                            </span>
                                            {isManualPaid && !!role?.order_upmp && <EditButton onClick={handleEditPayment} />}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            Net
                                        </th>
                                        <td className='currencyData'>
                                            <strong>
                                                {formatCurrency((paymentAmount !== undefined) ? (paymentAmount - (paymentFee ?? 0)) : undefined)}
                                            </strong>
                                            {isManualPaid && !!role?.order_upmp && <EditButton className='hidden' />}
                                        </td>
                                    </tr>
                                </>}
                            </tbody>
                        </table>
                        {!isPaid && !!role?.order_upmu && <ButtonIcon
                            // refs:
                            elmRef={(autoFocusOn === 'ConfirmPaymentButton') ? autoFocusButtonRef : undefined}
                            
                            
                            
                            // appearances:
                            icon='payment'
                            
                            
                            
                            // variants:
                            size='lg'
                            gradient={true}
                            
                            
                            
                            // states:
                            assertiveFocusable={shouldTriggerAutoFocus && (autoFocusOn === 'ConfirmPaymentButton')}
                            
                            
                            
                            // handlers:
                            onClick={handleConfirmPayment}
                        >
                            Confirm Payment
                        </ButtonIcon>}
                    </Section>
                </TabPanel>
            </ComplexEditModelDialog>
            
            {/* edit dialog: */}
            <CollapsibleSuspense>
                <SimpleEditAddressDialog
                    // data:
                    model={model!}
                    edit='shippingAddress'
                    
                    
                    
                    // states:
                    expanded={editMode === 'shippingAddress'}
                    onExpandedChange={handleExpandedChange}
                    
                    
                    
                    // components:
                    editorComponent={
                        <AddressEditor
                            countryList={countryList}
                        />
                    }
                />
                <SimpleEditPaymentDialog
                    // data:
                    model={model!}
                    edit='payment'
                    
                    
                    
                    // states:
                    expanded={editMode === 'payment'}
                    onExpandedChange={handleExpandedChange}
                    
                    
                    
                    // components:
                    editorComponent={
                        <PaymentEditor
                            // accessibilities:
                            expectedAmount={
                                totalProductPrices + (totalShippingCosts ?? 0)
                            }
                            amountMinThreshold={20 /* percent */}
                            amountMaxThreshold={20 /* percent */}
                        />
                    }
                />
                <PrintDialog
                    // variants:
                    theme='primary'
                    
                    
                    
                    // classes:
                    className={styleSheet.orderShippingTab}
                    
                    
                    
                    // states:
                    expanded={editMode === 'printOrder'}
                    onExpandedChange={handleExpandedChange}
                >
                    <OrderAndShipping
                        // appearances:
                        printMode={true}
                    />
                </PrintDialog>
            </CollapsibleSuspense>
        </>
    );
};
export {
    EditOrderDialog,
    EditOrderDialog as default,
}
