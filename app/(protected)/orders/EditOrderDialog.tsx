'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useEffect,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMountedFlag,
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
    CloseButton,
    
    
    
    // layout-components:
    ListItem,
    List,
    CardHeader,
    CardFooter,
    
    
    
    // status-components:
    Badge,
    Busy,
    
    
    
    // composite-components:
    TabPanel,
    Tab,
    
    
    
    // utility-components:
    ModalStatus,
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
    EditButton,
}                           from '@/components/EditButton'
import {
    CompoundWithBadge,
}                           from '@/components/CompoundWithBadge'
import {
    AddressEditor,
}                           from '@/components/editors/AddressEditor'
import {
    PaymentEditor,
}                           from '@/components/editors/PaymentEditor'
import {
    SimpleEditAddressDialog,
}                           from '@/components/dialogs/SimpleEditAddressDialog'
import {
    SimpleEditPaymentDialog,
}                           from '@/components/dialogs/SimpleEditPaymentDialog'

// private components:
import {
    PrintDialog,
}                           from './PrintDialog'

// stores:
import {
    // types:
    OrderDetail,
    
    
    
    // hooks:
    useGetProductList,
    useGetShippingList,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    formatCurrency,
}                           from '@/libs/formatters'
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'
import {
    countryList,
}                           from '@/libs/countryList'

// configs:
import {
    PAGE_ORDER_TAB_ORDER_N_SHIPPING,
    PAGE_ORDER_TAB_PAYMENT,
}                           from '@/website.config'



// defaults:
const imageSize = 48;  // 48px



// styles:
const useEditOrderDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./EditOrderDialogStyles')
, { id: 'wz8sbhtojl' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names`



// react components:
export interface EditOrderDialogProps {
    // data:
    order            : OrderDetail
    
    
    
    // handlers:
    onClose          : () => void
}
export const EditOrderDialog = (props: EditOrderDialogProps): JSX.Element|null => {
    // styles:
    const styles = useEditOrderDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        order,
        
        
        
        // handlers:
        onClose,
    } = props;
    
    
    
    // stores:
    const {data: shippingList, isLoading: isLoadingShipping, isError: isErrorShipping } = useGetShippingList();
    const {data: productList, isLoading: isLoadingProduct, isError: isErrorProduct } = useGetProductList();
    const {
        orderId,
        
        items,
        
        shippingAddress    : shippingAddressDetail,
        shippingProviderId : shippingProviderId,
        shippingCost       : totalShippingCosts,
        paymentMethod      : {
            type           : paymentType,
            brand          : paymentBrand,
            identifier     : paymentIdentifier,
            
            amount         : paymentAmount,
            fee            : paymentFee,
        },
    } = order;
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
    
    const totalProductPrices  = items.reduce((accum, item) => {
        const productUnitPrice = productList?.entities?.[`${item.productId}` || '']?.price;
        if (!productUnitPrice) return accum;
        return accum + (productUnitPrice * item.quantity);
    }, 0);
    
    const paymentTypeUppercased = paymentType.toUpperCase();
    const isPaid                = (paymentTypeUppercased !== 'MANUAL');
    const isManualPaid          = (paymentTypeUppercased === 'MANUAL_PAID')
    
    
    
    // states:
    type EditMode = 'shippingAddress'|'paymentMethod'
    const [editMode, setEditMode] = useState<EditMode|null>(null);
    
    
    
    // dialogs:
    const [showPrintDialog, setShowPrintDialog] = useState<boolean>(false);
    
    
    
    // handlers:
    const handleClosing = useEvent(() => {
        onClose();
    });
    const handleKeyDown : React.KeyboardEventHandler<HTMLElement> = useEvent((event) => {
        switch (event.key) {
            // case 'Enter':
            //     event.preventDefault();
            //     handleSave();
            //     break;
            
            case 'Escape':
                event.preventDefault();
                // handleClosing();
                break;
        } // switch
    });
    const handleEditDialogClose = useEvent((): void => {
        setEditMode(null);
    });
    const handlePrint = useEvent(() => {
        setShowPrintDialog(true);
        handleMarkAsProcessing();
    });
    const handlePrintDone = useEvent(() => {
        setShowPrintDialog(false);
    });
    const handleMarkAsProcessing = useEvent(() => {
        // TODO
    });
    const handleMarkAsUnprocessed = useEvent(() => {
        // TODO
    });
    
    
    
    // a fix for <Badge>'s position:
    const [showBadge, setShowBadge] = useState<boolean>(false);
    useEffect(() => {
        // setups:
        const cancelTimeout = setTimeout(() => {
            setShowBadge(true);
        }, 250);
        
        
        
        // cleanups:
        return () => {
            clearTimeout(cancelTimeout);
        }
    }, []);
    
    
    
    // jsx:
    const OrderAndShipping = ({printMode = false}): JSX.Element|null => {
        // jsx:
        return (
            <>
                <Section title='Order List' theme={!printMode ? 'primary' : 'light'} className={styles.orderShippingSection}>
                    <Basic tag='strong' theme={!printMode ? (isPaid ? 'success' : 'danger') : undefined} className={styles.badge}>{
                        isPaid
                        ? 'PAID'
                        : 'UNPAID'
                    }</Basic>
                    <List className={styles.orderList} listStyle={['flat', 'numbered']}>
                        {items.map(({quantity, price: unitPrice, productId}, index) => {
                            const product = productList?.entities?.[`${productId}`];
                            
                            
                            
                            // jsx:
                            return (
                                <ListItem key={`${productId}`} className={styles.productItem}>
                                    <h3 className='title h6'>{
                                        isLoadingProduct
                                        ? <Busy />
                                        : isErrorProduct
                                            ? 'Error getting product data'
                                            : (product?.name ?? 'DELETED PRODUCT')
                                    }</h3>
                                    
                                    {/* image + quantity */}
                                    <CompoundWithBadge
                                        // components:
                                        wrapperComponent={<React.Fragment />}
                                        badgeComponent={
                                            <Badge
                                                // variants:
                                                theme='danger'
                                                
                                                
                                                
                                                // states:
                                                expanded={showBadge}
                                                
                                                
                                                
                                                // floatable:
                                                floatingPlacement='right-start'
                                                floatingShift={-3}
                                                floatingOffset={-20}
                                            >
                                                {quantity}x
                                            </Badge>
                                        }
                                        elementComponent={
                                            <Image
                                                className='image'
                                                
                                                alt={`image #${index + 1} of ${product?.name ?? 'unknown product'}`}
                                                src={resolveMediaUrl(product?.image)}
                                                sizes={`${imageSize}px`}
                                                
                                                priority={true}
                                            />
                                        }
                                    />
                                    <p className='unitPrice'>
                                        @ <span className='currency secondary'>{formatCurrency(unitPrice)}</span>
                                    </p>
                                    <p className='subPrice currencyBlock'>
                                        <span className='currency'>{formatCurrency(quantity * unitPrice)}</span>
                                    </p>
                                </ListItem>
                            );
                        })}
                    </List>
                    <hr />
                    <p className='currencyBlock'>
                        Subtotal products: <span className='currency'>
                            {formatCurrency(totalProductPrices)}
                        </span>
                    </p>
                    <p className='currencyBlock'>
                        Shipping: <span className='currency'>
                            {formatCurrency(totalShippingCosts)}
                        </span>
                    </p>
                    <hr />
                    <p className='currencyBlock totalCost'>
                        Total: <span className='currency'>
                            {formatCurrency(totalProductPrices + (totalShippingCosts ?? 0))}
                        </span>
                    </p>
                </Section>
                {printMode && <Content theme='danger' outlined={true} nude={true} className={styles.printSpacer}>
                    <Icon className='scissors' icon='content_cut' />
                    <hr className='line' />
                </Content>}
                <Section title='Deliver To' theme={!printMode ? 'secondary' : 'light'} className={styles.orderDeliverySection}>
                    <Basic tag='strong' className={styles.badge}>{
                        isLoadingShipping
                        ? <Busy />
                        : isErrorShipping
                            ? 'Error getting shipping data'
                            : (shippingProvider?.name ?? 'DELETED SHIPPING PROVIDER')
                    }</Basic>
                    <div className={styles.shippingAddress}>
                        {!printMode && <EditButton className={styles.editShippingAddress} onClick={() => setEditMode('shippingAddress')} />}
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
                {printMode && <Content theme='danger' outlined={true} nude={true} className={styles.printSpacer}>
                    <Icon className='scissors' icon='content_cut' />
                    <hr className='line' />
                </Content>}
            </>
        );
    };
    return (
        <>
            <CardHeader
                // handlers:
                onKeyDown={handleKeyDown}
            >
                #ORDER-{orderId}
                <CloseButton onClick={handleClosing} />
            </CardHeader>
            <Tab
                // variants:
                mild='inherit'
                
                
                
                // classes:
                className={styles.cardBody}
                
                
                
                // components:
                listComponent={<List className={styles.tabList} />}
                bodyComponent={<Content className={`${styles.tabBody} ${styles.typos}`} />}
                
                
                
                // handlers:
                onKeyDown={handleKeyDown}
            >
                <TabPanel label={PAGE_ORDER_TAB_ORDER_N_SHIPPING} panelComponent={<Generic className={styles.orderShippingTab} />}>
                    <OrderAndShipping />
                    <Section theme='primary' className={styles.actionSection}>
                        <ButtonIcon className='btnPrint' icon='print' theme='primary' onClick={handlePrint}>
                            Print and Mark as Processing
                        </ButtonIcon>
                        <ButtonIcon className='btnPrint' icon='directions_run' theme='primary' onClick={handleMarkAsProcessing}>
                            Mark as Processing
                        </ButtonIcon>
                        <ButtonIcon className='btnPrint' icon='mark_email_unread' theme='secondary' onClick={handleMarkAsUnprocessed}>
                            Mark as Unprocessed
                        </ButtonIcon>
                    </Section>
                </TabPanel>
                <TabPanel label={PAGE_ORDER_TAB_PAYMENT} panelComponent={<Generic className={styles.paymentTab} />}>
                    <Section className={styles.paymentSection}>
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
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            Amount
                                        </th>
                                        <td>
                                            <strong>
                                                {formatCurrency(paymentAmount)}
                                            </strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            Fee
                                        </th>
                                        <td>
                                            <span>
                                                {formatCurrency(paymentFee)}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            Net
                                        </th>
                                        <td>
                                            <strong>
                                                {formatCurrency(paymentAmount - paymentFee)}
                                            </strong>
                                        </td>
                                    </tr>
                                </>}
                            </tbody>
                        </table>
                        {!isPaid && <ButtonIcon icon='payment' size='lg' gradient={true} onClick={() => setEditMode('paymentMethod')}>
                            Confirm Payment
                        </ButtonIcon>}
                    </Section>
                </TabPanel>
            </Tab>
            <CardFooter onKeyDown={handleKeyDown}>
                <ButtonIcon className='btnClose' icon='close' theme='primary' onClick={handleClosing}>Close</ButtonIcon>
            </CardFooter>
            {/* edit dialog: */}
            <ModalStatus theme='primary' modalCardStyle='scrollable' backdropStyle='static' onExpandedChange={({expanded}) => !expanded && setEditMode(null)}>
                {!!editMode && <>
                    {(editMode === 'shippingAddress') && <SimpleEditAddressDialog model={order} edit={editMode} onClose={handleEditDialogClose} editorComponent={<AddressEditor countryList={countryList} />} />}
                    {(editMode === 'paymentMethod'  ) && <SimpleEditPaymentDialog model={order} edit={editMode} onClose={handleEditDialogClose} editorComponent={<PaymentEditor />} />}
                </>}
            </ModalStatus>
            {showPrintDialog && <PrintDialog
                className={`${styles.orderShippingTab} ${styles.typos}`}
                onDone={handlePrintDone}
            >
                <OrderAndShipping printMode={true} />
            </PrintDialog>}
        </>
    );
}
