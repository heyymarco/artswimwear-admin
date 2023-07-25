'use client'

import { default as React } from 'react'
import { dynamicStyleSheets } from '@cssfn/cssfn-react'

import { Section, Main } from '@heymarco/section'

import { Image } from '@heymarco/image'
import { ButtonIcon, List, ListItem, ListItemProps, NavNextItem, NavPrevItem, Pagination, PaginationProps, Basic, CardBody, Badge, Content } from '@reusable-ui/components';
import { OrderDetail, useGetOrderPage, useGetProductList } from '@/store/features/api/apiSlice';
import { useRef, useState } from 'react';
import { LoadingBar } from '@heymarco/loading-bar'
import { useEvent } from '@reusable-ui/core';
import { ModalStatus } from '../../components/ModalStatus'

import { EditButton } from '@/components/EditButton'
import { TextEditor } from '@/components/editors/TextEditor'
import { SimpleEditCustomerDialog } from '@/components/dialogs/SimpleEditCustomerDialog'
import { FullEditDialog } from './FullEditDialog'
import { resolveMediaUrl } from '@/libs/mediaStorage.client'
import { WithBadge } from '@/components/WithBadge'
import { MiniCarousel } from '@/components/MiniCarousel'



// defaults:
const imageSize = 128;  // 128px



// styles:
const usePageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./pageStyles')
, { id: 'orders-nxhip40jm2' });



// utilities:
const getTotalQuantity = (items: OrderDetail['items']): number => {
    return items.reduce((counter, item) => {
        return counter + item.quantity;
    }, 0);
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
        orderId,
        
        customer : customerDetail,
        items,
    } = order;
    const {
        nickName : customerNickName,
        email    : customerEmail,
    } = customerDetail ?? {};
    
    
    
    // stores:
    const {data: productList, isLoading: isLoadingProduct, isError: isErrorProduct } = useGetProductList();
    
    
    
    // states:
    type EditMode = keyof NonNullable<OrderDetail['customer']>|'full'
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
            <div className={styles.orderItemWrapper}>
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
                            // floatable:
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
                        className='images'
                        
                        
                        
                        // components:
                        basicComponent={<Content theme='primary' />}
                    >
                        {items.map(({quantity, productId}, index: number) => {
                            const product = productList?.entities?.[`${productId}`];
                            
                            
                            
                            // jsx:
                            return (
                                <WithBadge
                                    // identifiers:
                                    key={index}
                                    
                                    
                                    
                                    // components:
                                    wrapperComponent={<React.Fragment />}
                                    badgeComponent={
                                        <Badge
                                            // variants:
                                            theme='danger'
                                            
                                            
                                            
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
                                        alt={`image #${index + 1} of ${product?.name ?? 'unknown product'}`}
                                        src={resolveMediaUrl(product?.image)}
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
                {(editMode === 'full') && <FullEditDialog order={order} onClose={handleEditDialogClose} />}
            </ModalStatus>
        </ListItem>
    );
}
export default function Orders() {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    // stores:
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);
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
                            <OrderItem key={order.id ?? (`${page}-${index}`)} order={order} />
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
