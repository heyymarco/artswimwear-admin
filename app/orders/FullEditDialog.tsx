'use client'

import { default as React } from 'react'
import { dynamicStyleSheets } from '@cssfn/cssfn-react'

import { ButtonIcon, Generic, Content, CardBody, CardHeader, CardFooter, Button, CloseButton, List, Carousel, Masonry, masonries, Busy, ListItem, Badge, Basic } from '@reusable-ui/components';
import { OrderDetail, ShippingPreview, useUpdateOrder, useGetShippingList, useGetProductList } from '@/store/features/api/apiSlice';
import { useEffect, useRef, useState } from 'react';
import { formatCurrency, getCurrencySign } from '@/libs/formatters';
import { AccessibilityProvider, ValidationProvider, useEvent } from '@reusable-ui/core';
import { ModalStatus } from '../../components/ModalStatus'

import { STORE_WEBSITE_URL, PAGE_ORDERS_TAB_ORDERS_N_SHIPPING, PAGE_ORDERS_TAB_PAYMENT } from '@/website.config'
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



// defaults:
const imageSize = 48;  // 48px



// styles:
const useFullEditDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./FullEditDialogStyles')
, { id: 'wz8sbhtojl' }); // need 3 degrees to overwrite `.cardClass.body`



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
        _id,
        orderId = _id,
        
        items,
        
        shippingAddress: {
            firstName    : shippingFirstName,
            lastName     : shippingLastName,
            phone        : shippingPhone,
            address      : shippingAddress,
            city         : shippingCity,
            zone         : shippingZone,
            zip          : shippingZip,
            country      : shippingCountry,
        },
        shippingProvider : shippingProviderId,
        shippingCost     : totalShippingCosts,
        paymentMethod    : {
            type         : paymentType,
            brand        : paymentBrand,
            identifier   : paymentIdentifier,
        },
    } = order;
    
    const shippingProvider = shippingList?.entities?.[shippingProviderId ?? ''];
    
    const totalProductPrices  = items.reduce((accum, item) => {
        const productUnitPrice = productList?.entities?.[`${item.product}` || '']?.price;
        if (!productUnitPrice) return accum;
        return accum + (productUnitPrice * item.quantity);
    }, 0);
    
    
    
    // refs:
    const firstEditorRef     = useRef<HTMLInputElement|null>(null); // TODO: finish this
    const editorContainerRef = useRef<HTMLElement|null>(null); // TODO: finish this
    
    
    
    // dialogs:
    const [errorMessage   , setErrorMessage   ] = useState<React.ReactNode>(undefined);
    
    
    
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
        let cancelTimeout = setTimeout(() => {
            cancelTimeout = setTimeout(() => {
                cancelTimeout = setTimeout(() => {
                    setShowBadge(true);
                }, 0);
            }, 0);
        }, 0);
        
        
        
        // cleanups:
        return () => {
            clearTimeout(cancelTimeout);
        }
    }, []);
    
    
    
    // jsx:
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
                bodyComponent={<Content className={styles.tabBody} />}
                
                
                
                // handlers:
                onKeyDown={handleKeyDown}
            >
                <TabPanel label={PAGE_ORDERS_TAB_ORDERS_N_SHIPPING} panelComponent={<Generic className={styles.orderShippingTab} />}>
                    <Section title='Order List' className={styles.orderShippingSection}>
                        <List className={styles.orderList} listStyle={['flat', 'numbered']}>
                            {items.map(({quantity, price: unitPrice, product: productId}, index) => {
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
                                {formatCurrency(totalProductPrices + totalShippingCosts)}
                            </span>
                        </p>
                    </Section>
                    <Section title='Deliver To' theme='secondary' className={styles.orderDeliverySection}>
                        <Basic tag='strong' className='shippingProvider'>{
                            isLoadingShipping
                            ? <Busy />
                            : isErrorShipping
                                ? 'Error getting shipping data'
                                : (shippingProvider?.name ?? 'DELETED SHIPPING PROVIDER')
                        }</Basic>
                        <strong>{shippingFirstName} {shippingLastName}</strong>
                        <p>
                            {shippingAddress}
                            <br />
                            {`${shippingCity}, ${shippingZone} (${shippingZip}), ${countryList?.entities?.[shippingCountry ?? '']?.name}`}
                        </p>
                        <p>
                            Phone: {shippingPhone}
                        </p>
                    </Section>
                </TabPanel>
                <TabPanel label={PAGE_ORDERS_TAB_PAYMENT} panelComponent={<Generic className={styles.paymentTab} />}>
                    <Section>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        Method
                                    </td>
                                    <td>
                                        <span>
                                            {paymentType?.toUpperCase() ?? paymentType}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Provider
                                    </td>
                                    <td>
                                        <span>
                                            {!!paymentBrand ? <Image alt={paymentBrand} src={`/brands/${paymentBrand}.svg`} width={42} height={26} /> : '-'}
                                        </span>
                                        <span>
                                            {!!paymentIdentifier && <>&nbsp;({paymentIdentifier})</>}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Amount
                                    </td>
                                    <td>
                                        <strong>
                                            {formatCurrency(123)}
                                        </strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Fee
                                    </td>
                                    <td>
                                        <span>
                                            {formatCurrency(123)}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Net
                                    </td>
                                    <td>
                                        <strong>
                                            {formatCurrency(123)}
                                        </strong>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Section>
                </TabPanel>
            </Tab>
            <CardFooter onKeyDown={handleKeyDown}>
                <ButtonIcon className='btnClose' icon='close_fullscreen' theme='secondary' onClick={handleClosing}>Close</ButtonIcon>
            </CardFooter>
            <ModalStatus
                theme='danger'
                backdropStyle='static'
            >
                {!!errorMessage && <>
                    <CardHeader>
                        Error Saving Data
                        <CloseButton onClick={() => setErrorMessage(undefined)} />
                    </CardHeader>
                    <CardBody>
                        {errorMessage}
                    </CardBody>
                    <CardFooter>
                        <Button onClick={() => setErrorMessage(undefined)}>
                            Okay
                        </Button>
                    </CardFooter>
                </>}
            </ModalStatus>
        </>
    );
}
