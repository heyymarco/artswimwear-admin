'use client'

import { default as React } from 'react'
import { dynamicStyleSheets } from '@cssfn/cssfn-react'

import { ButtonIcon, Generic, Content, CardBody, CardHeader, CardFooter, Button, CloseButton, List, Carousel, Masonry, masonries, Busy, ListItem, Badge, Basic, Icon } from '@reusable-ui/components';
import { OrderDetail, ShippingPreview, useUpdateOrder, useGetShippingList, useGetProductList } from '@/store/features/api/apiSlice';
import { useEffect, useRef, useState } from 'react';
import { formatCurrency, getCurrencySign } from '@/libs/formatters';
import { AccessibilityProvider, ValidationProvider, useEvent } from '@reusable-ui/core';
import { ModalStatus } from '@heymarco/modal-status'

import { STORE_WEBSITE_URL, PAGE_ORDERS_TAB_ORDER_N_SHIPPING, PAGE_ORDERS_TAB_PAYMENT } from '@/website.config'
import { COMMERCE_CURRENCY_FRACTION_MAX } from '@/commerce.config'
import { TextEditor } from '@/components/editors/TextEditor'
import { PathEditor } from '@/components/editors/PathEditor'
import { CurrencyEditor } from '@/components/editors/CurrencyEditor'
import { ShippingWeightEditor } from '@/components/editors/ShippingWeightEditor'
import { StockEditor } from '@/components/editors/StockEditor'
import { GalleryEditor } from '@/components/editors/GalleryEditor/GalleryEditor'
import { Tab, TabPanel } from '@reusable-ui/components'
import { Image } from '@heymarco/image'
import axios from 'axios'
import { resolveMediaUrl } from '@/libs/mediaStorage.client'
import { WysiwygEditorState, WysiwygEditor, ToolbarPlugin, EditorPlugin } from '@/components/editors/WysiwygEditor';
import { countryList } from '@/libs/countryList'
import { WithBadge } from '@/components/WithBadge';
import { Section } from '@heymarco/section';
import { SimpleEditAddressDialog } from '@/components/dialogs/SimpleEditAddressDialog';
import { AddressEditor } from '@/components/editors/AddressEditor';
import { EditButton } from '@/components/EditButton';
import { SimpleEditPaymentDialog } from '@/components/dialogs/SimpleEditPaymentDialog';
import { PaymentEditor } from '@/components/editors/PaymentEditor';
import { PrintDialog } from './PrintDialog';



// defaults:
const imageSize = 48;  // 48px



// styles:
const useFullEditDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./FullEditDialogStyles')
, { id: 'wz8sbhtojl' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names`



// react components:
export interface FullEditDialogProps {
    // data:
    order            : OrderDetail
    
    
    
    // handlers:
    onClose          : () => void
}
export const FullEditDialog = (props: FullEditDialogProps) => {
    // styles:
    const styles = useFullEditDialogStyleSheet();
    
    
    
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
    
    
    
    // refs:
    const firstEditorRef     = useRef<HTMLInputElement|null>(null); // TODO: finish this
    const editorContainerRef = useRef<HTMLElement|null>(null); // TODO: finish this
    
    
    
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
    
    
    
    // dom effects:
    useEffect(() => {
        // setups:
        const cancelFocus = setTimeout(() => {
            // conditions:
            const firstEditorElm = firstEditorRef.current;
            if (!firstEditorElm) return;
            
            
            
            firstEditorElm.setSelectionRange(0, -1);
            firstEditorElm.focus({ preventScroll: true });
        }, 0);
        
        
        
        // cleanups:
        return () => {
            clearTimeout(cancelFocus);
        };
    }, []);
    
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
    interface OrderAndShippingProps {
        printMode ?: boolean
    }
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
                                    <WithBadge
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
                                    >
                                        <Image
                                            className='image'
                                            
                                            alt={`image #${index + 1} of ${product?.name ?? 'unknown product'}`}
                                            src={resolveMediaUrl(product?.image)}
                                            sizes={`${imageSize}px`}
                                            
                                            priority={true}
                                        />
                                    </WithBadge>
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
                <TabPanel label={PAGE_ORDERS_TAB_ORDER_N_SHIPPING} panelComponent={<Generic className={styles.orderShippingTab} />}>
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
                <TabPanel label={PAGE_ORDERS_TAB_PAYMENT} panelComponent={<Generic className={styles.paymentTab} />}>
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
