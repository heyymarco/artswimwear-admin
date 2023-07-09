'use client'

import { default as React } from 'react'
import { dynamicStyleSheets } from '@cssfn/cssfn-react'

import { Section, Main } from '@heymarco/section'

import type { Metadata } from 'next'

import { Image } from '@heymarco/image'
import { ButtonIcon, List, ListItem, ListItemProps, NavNextItem, NavPrevItem, Pagination, PaginationProps, Basic, CardBody } from '@reusable-ui/components';
import { OrderDetail, useGetOrderList } from '@/store/features/api/apiSlice';
import { useRef, useState } from 'react';
import { LoadingBar } from '@heymarco/loading-bar'
import { formatCurrency, getCurrencySign } from '@/libs/formatters';
import { useEvent } from '@reusable-ui/core';
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
import { resolveMediaUrl } from '@/libs/mediaStorage.client'
import type { OrderSchema } from '@/models/Order'
import defaultCountries from '@/libs/defaultCountries'
import { createEntityAdapter } from '@reduxjs/toolkit'



// defaults:
const imageSize = 96;  // 96px



// styles:
const usePageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./pageStyles')
, { id: 'orders-nxhip40jm2' });



// utilities:
export const getTotalQuantity = (items: OrderSchema['items']): number => {
    return items.reduce((counter, item) => {
        return counter + item.quantity;
    }, 0);
};

export interface CountryEntry {
    code : string
    name : string
}
const countryListAdapter = createEntityAdapter<CountryEntry>({
    selectId : (countryEntry) => countryEntry.code,
});
const countryList = countryListAdapter.addMany(countryListAdapter.getInitialState(), defaultCountries);



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
        customer : {
            nickName : customerNickName,
            email    : customerEmail,
        },
        items,
        shippingAddress : {
            address : shippingAddress,
            city    : shippingCity,
            zone    : shippingZone,
            zip     : shippingZip,  
            country : shippingCountry,
        },
        // visibility,
        // name,
        // images,
        // stock,
    } = order;
    
    
    
    // states:
    type EditMode = keyof OrderDetail['customer']|'full'
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
                    #ORDER-{_id}
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
                <p className='shipping'>
                    {`${shippingAddress}, ${shippingCity}, ${shippingZone} (${shippingZip}), ${countryList?.entities?.[shippingCountry ?? '']?.name}`}
                    <EditButton onClick={() => setEditMode('full')} />
                </p>
                <p className='items'>
                    <strong className='value'>{getTotalQuantity(items)}</strong> items: ...
                    <EditButton onClick={() => setEditMode('full')} />
                </p>
                <p className='fullEditor'>
                    <EditButton buttonStyle='regular' onClick={() => setEditMode('full')}>
                        Open full editor
                    </EditButton>
                </p>
            </div>
            <ModalStatus theme='primary' viewport={listItemRef} backdropStyle='static' onExpandedChange={({expanded}) => !expanded && setEditMode(null)}>
                {!!editMode && (editMode !== 'full') && <>
                    {(editMode === 'nickName') && <SimpleEditCustomerDialog model={order} edit={editMode} onClose={handleEditDialogClose} editorComponent={<TextEditor type='text'  required minLength={2} maxLength={30} autoCapitalize='words' />} />}
                    {(editMode === 'email'   ) && <SimpleEditCustomerDialog model={order} edit={editMode} onClose={handleEditDialogClose} editorComponent={<TextEditor type='email' required minLength={5} maxLength={50} />} />}
                    {/* {(editMode === 'shipping') && <SimpleEditCustomerDialog model={order} edit={editMode} onClose={handleEditDialogClose} editorComponent={<VisibilityEditor theme='secondary' />} />} */}
                </>}
            </ModalStatus>
            <ModalStatus theme='primary' modalCardStyle='scrollable' backdropStyle='static' onExpandedChange={({expanded}) => !expanded && setEditMode(null)}>
                {!!editMode && (editMode === 'full') && <FullEditDialog order={order} onClose={handleEditDialogClose} />}
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
    const {data: orders, isLoading, isFetching, isError, refetch } = useGetOrderList({ page, perPage });
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
