'use client'

import { default as React } from 'react'
import { dynamicStyleSheets } from '@cssfn/cssfn-react'

import { Section, Main } from '@heymarco/section'

import type { Metadata } from 'next'

import { Image } from '@heymarco/image'
import { ButtonIcon, List, ListItem, ListItemProps, NavNextItem, NavPrevItem, Pagination, PaginationProps, Basic, CardBody, Carousel, Navscroll, Badge, CarouselProps, ButtonProps, NavscrollProps, ImperativeScroll, BadgeProps, GenericProps, Generic } from '@reusable-ui/components';
import { OrderDetail, ProductPreview, useGetOrderPage, useGetProductList } from '@/store/features/api/apiSlice';
import { useRef, useState } from 'react';
import { LoadingBar } from '@heymarco/loading-bar'
import { formatCurrency, getCurrencySign } from '@/libs/formatters';
import { useEvent, useIsRtl, useMergeRefs } from '@reusable-ui/core';
import { ModalStatus } from '../../components/ModalStatus'

import { PAGE_ORDERS_TITLE, PAGE_ORDERS_DESCRIPTION } from '@/website.config'
import { COMMERCE_CURRENCY_FRACTION_MAX } from '@/commerce.config'
import { EditButton } from '@/components/EditButton'
import { TextEditor } from '@/components/editors/TextEditor'
import { CurrencyEditor } from '@/components/editors/CurrencyEditor'
import { StockEditor } from '@/components/editors/StockEditor'
import { VisibilityEditor } from '@/components/editors/VisibilityEditor'
import { SimpleEditCustomerDialog } from '@/components/dialogs/SimpleEditCustomerDialog'
import { FullEditDialog } from './FullEditDialog'
import type { OrderSchema } from '@/models/Order'
import { countryList } from '@/libs/countryList'
import { SimpleEditAddressDialog } from '@/components/dialogs/SimpleEditAddressDialog'
import { AddressEditor } from '@/components/editors/AddressEditor'
import { resolveMediaUrl } from '@/libs/mediaStorage.client'
import type { EntityState } from '@reduxjs/toolkit'



// defaults:
const imageSize = 128;  // 128px



// styles:
const usePageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./pageStyles')
, { id: 'orders-nxhip40jm2' });



// utilities:
const getTotalQuantity = (items: OrderSchema['items']): number => {
    return items.reduce((counter, item) => {
        return counter + item.quantity;
    }, 0);
};



const MiniCarousel = (props: CarouselProps) => {
    // cultures:
    const [isRtl, setCarouselElmRef] = useIsRtl();
    
    
    
    // children:
    const childrenArray = React.Children.toArray(props.children)
    
    
    
    // rest props:
    const {
        // refs:
        elmRef,
        scrollRef,
        
        
        
        // components:
        prevButtonComponent = (<ButtonIcon iconPosition='start' icon={isRtl ? 'navright' : 'navleft' } size='xs' /> as React.ReactComponentElement<any, ButtonProps>),
        nextButtonComponent = (<ButtonIcon iconPosition='end'   icon={isRtl ? 'navleft'  : 'navright'} size='xs' /> as React.ReactComponentElement<any, ButtonProps>),
        navscrollComponent  = (<Navscroll<Element>
            // variants:
            size='sm'
            
            
            
            // components:
            navComponent={
                <Pagination
                    itemsLimit={3}
                    prevItems={
                        <NavPrevItem
                            onClick={() => scrollRefInternal.current?.scrollPrev()}
                        />
                    }
                    nextItems={
                        <NavNextItem
                            onClick={() => scrollRefInternal.current?.scrollNext()}
                        />
                    }
                />
            }
        >
            {childrenArray.map((child, index: number) =>
                <ListItem
                    // identifiers:
                    key={index}
                    
                    
                    
                    // semantics:
                    tag='button'
                    
                    
                    
                    // variants:
                    size='sm'
                >
                    {index + 1}
                </ListItem>
            )}
        </Navscroll> as React.ReactComponentElement<any, NavscrollProps<Element>>),
    ...restCarouselProps} = props;
    
    
    
    // refs:
    const mergedCarouselRef = useMergeRefs<HTMLElement>(
        // preserves the original `elmRef`:
        elmRef,
        
        
        
        setCarouselElmRef,
    );
    
    const scrollRefInternal = useRef<(HTMLElement & ImperativeScroll)|null>(null);
    const mergedScrollRef = useMergeRefs<HTMLElement>(
        // preserves the original `scrollRef`:
        scrollRef,
        
        
        
        scrollRefInternal,
    );
    
    
    
    // jsx:
    return (
        <Carousel
            // other props:
            {...restCarouselProps}
            
            
            
            // refs:
            elmRef={mergedCarouselRef}
            scrollRef={mergedScrollRef}
            
            
            
            // components:
            prevButtonComponent={prevButtonComponent}
            nextButtonComponent={nextButtonComponent}
            navscrollComponent ={navscrollComponent }
        >
            {...childrenArray}
        </Carousel>
    )
};



interface WithBadgeProps<TElement extends Element = HTMLElement>
{
    // components:
    wrapperComponent ?: React.ReactComponentElement<any, GenericProps<TElement>>
    badgeComponent    : React.ReactComponentElement<any, BadgeProps<Element>>
    children          : React.ReactComponentElement<any, GenericProps<Element>>
}
const WithBadge = <TElement extends Element = HTMLElement>(props: WithBadgeProps<TElement>) => {
    // rest props:
    const {
        // components:
        wrapperComponent = (<Generic<TElement> /> as React.ReactComponentElement<any, GenericProps<TElement>>),
        badgeComponent,
        children : component,
    ...restGenericProps} = props;
    
    
    
    // refs:
    const componentRefInternal = useRef<Element|null>(null);
    const mergedComponentRef = useMergeRefs<Element>(
        // preserves the original `elmRef` from `component`:
        component.props.elmRef,
        
        
        
        componentRefInternal,
    );
    
    
    
    // jsx:
    return React.cloneElement<GenericProps<TElement>>(wrapperComponent,
        // props:
        {
            // other props:
            ...restGenericProps,
            ...wrapperComponent.props, // overwrites restGenericProps (if any conflics)
        },
        
        
        
        // children:
        /* <Component> */
        React.cloneElement<GenericProps<Element>>(component,
            // props:
            {
                // refs:
                elmRef : mergedComponentRef,
            },
        ),
        /* <Badge> */
        React.cloneElement<BadgeProps<Element>>(badgeComponent,
            // props:
            {
                floatingOn : badgeComponent.props.floatingOn ?? componentRefInternal,
            },
        ),
    );
};



interface OrderItemProps extends ListItemProps {
    order: OrderDetail
}
const OrderItem = (props: OrderItemProps) => {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    const {
        order,
    ...restListItem} = props;
    const {
        _id,
        orderId = _id,
        
        customer : {
            nickName : customerNickName,
            email    : customerEmail,
        },
        items,
    } = order;
    
    
    
    // stores:
    const {data: productList, isLoading: isLoadingProduct, isError: isErrorProduct } = useGetProductList();
    
    
    
    // states:
    type EditMode = keyof OrderDetail['customer']|'shippingAddress'|'full'
    const [editMode, setEditMode] = useState<EditMode|null>(null);
    
    
    
    // refs:
    const listItemRef = useRef<HTMLElement|null>(null);
    
    
    
    // handlers:
    const handleEditDialogClose = useEvent((): void => {
        setEditMode(null);
    });
    
    
    
    // jsx:
    return (
        <ListItem {...restListItem} elmRef={listItemRef} className={styles.orderItem}>
            <div className={styles.orderItemLayout}>
                <h3 className='orderId'>
                    #ORDER-{orderId}
                </h3>
                <p className='customer'>
                    <span className='name'>
                        <strong>{customerNickName}</strong>
                        <EditButton onClick={() => setEditMode('nickName')} />
                    </span>
                    <span className='email'>
                        <em>{customerEmail}</em>
                        <EditButton onClick={() => setEditMode('email')} />
                    </span>
                </p>
                <WithBadge
                    // components:
                    wrapperComponent={<React.Fragment />}
                    badgeComponent={
                        <Badge
                            // variants:
                            floatingPlacement='left-start'
                            floatingShift={10}
                            floatingOffset={-40}
                        >
                            {getTotalQuantity(items)} Item(s)
                        </Badge>
                    }
                >
                    <MiniCarousel
                        // variants:
                        theme='danger'
                        
                        
                        
                        // classes:
                        className='items'
                    >
                        {items.map(({quantity, product: productId}, index: number) => {
                            const product = productList?.entities?.[`${productId}`];
                            const image   = product?.image;
                            
                            
                            
                            // jsx:
                            return (
                                <WithBadge
                                    // components:
                                    badgeComponent={
                                        <Badge
                                            // variants:
                                            floatingPlacement='right-start'
                                            floatingShift={10}
                                            floatingOffset={-40}
                                        >
                                            {quantity}x
                                        </Badge>
                                    }
                                >
                                    <Image
                                        key={index}
                                        
                                        alt={`image #${index + 1} of ${product?.name ?? 'unknown product'}`}
                                        src={resolveMediaUrl(image)}
                                        sizes={`${imageSize}px`}
                                        
                                        priority={true}
                                    />
                                </WithBadge>
                            );
                        })}
                    </MiniCarousel>
                </WithBadge>
                <p className='fullEditor'>
                    <EditButton icon='table_view' buttonStyle='regular' onClick={() => setEditMode('full')}>
                        View Details
                    </EditButton>
                </p>
            </div>
            <ModalStatus theme='primary' viewport={listItemRef} backdropStyle='static' onExpandedChange={({expanded}) => !expanded && setEditMode(null)}>
                {!!editMode && (editMode !== 'full') && <>
                    {(editMode === 'nickName'       ) && <SimpleEditCustomerDialog model={order} edit={editMode} onClose={handleEditDialogClose} editorComponent={<TextEditor type='text'  required minLength={2} maxLength={30} autoCapitalize='words' />} />}
                    {(editMode === 'email'          ) && <SimpleEditCustomerDialog model={order} edit={editMode} onClose={handleEditDialogClose} editorComponent={<TextEditor type='email' required minLength={5} maxLength={50} />} />}
                </>}
            </ModalStatus>
            <ModalStatus theme='primary' modalCardStyle='scrollable' backdropStyle='static' onExpandedChange={({expanded}) => !expanded && setEditMode(null)}>
                {!!editMode && ((editMode === 'full') || (editMode === 'shippingAddress')) && <>
                    {(editMode === 'shippingAddress') && <SimpleEditAddressDialog model={order} edit={editMode} onClose={handleEditDialogClose} editorComponent={<AddressEditor countryList={countryList} />} />}
                    {(editMode === 'full'           ) && <FullEditDialog order={order} onClose={handleEditDialogClose} />}
                </>}
            </ModalStatus>
        </ListItem>
    );
}
export default function Orders() {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    // stores:
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(5);
    const {data: orders, isLoading, isFetching, isError, refetch } = useGetOrderPage({ page, perPage });
    const isErrorNoData  = isError && !orders;
    const pages = Math.ceil((orders?.total ?? 0) / perPage);
    
    
    
    // refs:
    const [orderListRef, setOrderListRef] = useState<HTMLElement|null>(null);
    
    
    
    // jsx:
    const OrderPagination = (props: PaginationProps) => (
        <Pagination
            {...props}
            theme={props.theme ?? 'primary'}
            size={props.size ?? 'sm'}
            itemsLimit={props.itemsLimit ?? 20}
            
            prevItems={
                <NavPrevItem
                    onClick={() => setPage(1)}
                />
            }
            nextItems={
                <NavNextItem
                    onClick={() => setPage(pages)}
                />
            }
        >
            {(isLoading || isErrorNoData) && <ListItem nude={true}><LoadingBar className={styles.paginationLoading}
                nude={true}
                running={isLoading}
                theme={isErrorNoData ? 'danger' : undefined}
            /></ListItem>}
            
            {[...Array(pages)].map((_, index) =>
                <ListItem
                    key={index}
                    
                    active={(index + 1) === page}
                    onClick={() => setPage(index + 1)}
                >
                    {index + 1}
                </ListItem>
            )}
        </Pagination>
    );
    return (
        <Main className={styles.page}>
            <Section className={`fill-self ${styles.orders}`}>
                <OrderPagination className={styles.paginTop} />
                <Basic<HTMLElement> className={styles.orderList} theme='primary' mild={true} elmRef={setOrderListRef}>
                    <ModalStatus className={styles.orderFetching} viewport={orderListRef}>
                        {(isFetching || isError) && <CardBody>
                            {isFetching && <>
                                <p>Retrieving data from the server. Please wait...</p>
                                <LoadingBar className='loadingBar' />
                            </>}
                            
                            {isError && <>
                                <h3>Oops, an error occured!</h3>
                                <p>We were unable to retrieve data from the server.</p>
                                <ButtonIcon icon='refresh' onClick={refetch}>
                                    Retry
                                </ButtonIcon>
                            </>}
                        </CardBody>}
                    </ModalStatus>
                    
                    {!!orders && <List listStyle='flush' className={styles.orderListInner}>
                        {Object.values(orders?.entities).filter((order): order is Exclude<typeof order, undefined> => !!order).map((order, index) =>
                            <OrderItem key={order._id ?? (`${page}-${index}`)} order={order} />
                        )}
                    </List>}
                </Basic>
                <OrderPagination className={styles.paginBtm} />
            </Section>
        </Main>
    )
}



// export const metadata : Metadata = {
//     title       : PAGE_ORDERS_TITLE,
//     description : PAGE_ORDERS_DESCRIPTION,
// };
