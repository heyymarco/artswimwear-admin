'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
}                           from 'react'

// next-js:
import type {
    Metadata,
}                           from 'next'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    Content,
    
    
    
    // layout-components:
    ListItem,
    
    
    
    // status-components:
    Badge,
    
    
    
    // utility-components:
    ModalStatus,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Main,
}                           from '@heymarco/section'
import {
    Image,
}                           from '@heymarco/image'

// internal components:
import {
    PageLoading,
}                           from '@/components/PageLoading'
import {
    PageError,
}                           from '@/components/PageError'
import {
    ModelPreviewProps,
    SectionModelEditor,
}                           from '@/components/SectionModelEditor'
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    TextEditor,
}                           from '@/components/editors/TextEditor'
import {
    CompoundWithBadge,
}                           from '@/components/CompoundWithBadge'
import {
    MiniCarousel,
}                           from '@/components/MiniCarousel'
import {
    SimpleEditCustomerDialog,
}                           from '@/components/dialogs/SimpleEditCustomerDialog'

// private components:
import {
    EditOrderDialog,
}                           from './EditOrderDialog'

// stores:
import {
    // types:
    OrderDetail,
    
    
    
    // hooks:
    useGetOrderPage,
    useGetProductList,
}                           from '@/store/features/api/apiSlice';

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'

// configs:
import {
    PAGE_ORDER_TITLE,
    PAGE_ORDER_DESCRIPTION,
}                           from '@/website.config' // TODO: will be used soon



// defaults:
const imageSize = 128;  // 128px



// utilities:
const getTotalQuantity = (items: OrderDetail['items']): number => {
    return items.reduce((counter, item) => {
        return counter + item.quantity;
    }, 0);
};



// styles:
const usePageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./pageStyles')
, { id: 'nxhip40jm2' });



// react components:

/* <OrderPreview> */
interface OrderPreviewProps extends ModelPreviewProps<OrderDetail> {}
const OrderPreview = (props: OrderPreviewProps): JSX.Element|null => {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    const {
        model,
    ...restListItemProps} = props;
    const {
        orderId,
        
        customer : customerDetail,
        items,
    } = model;
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
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // refs:
            elmRef={listItemRef}
            
            
            
            // classes:
            className={styles.orderItem}
        >
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
                
                {/* carousel + total quantity */}
                <CompoundWithBadge
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
                    elementComponent={
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
                                    /* image + quantity */
                                    <CompoundWithBadge
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
                                        elementComponent={
                                            <Image
                                                className='prodImg'
                                                
                                                alt={`image #${index + 1} of ${product?.name ?? 'unknown product'}`}
                                                src={resolveMediaUrl(product?.image)}
                                                sizes={`${imageSize}px`}
                                                
                                                priority={true}
                                            />
                                        }
                                    />
                                );
                            })}
                        </MiniCarousel>
                    }
                />
                <p className='fullEditor'>
                    <EditButton icon='table_view' buttonStyle='regular' onClick={() => setEditMode('full')}>
                        View Details
                    </EditButton>
                </p>
            </div>
            {/* edit dialog: */}
            <ModalStatus theme='primary' viewport={listItemRef} backdropStyle='static' onExpandedChange={({expanded}) => !expanded && setEditMode(null)}>
                {!!editMode && (editMode !== 'full') && <>
                    {(editMode === 'nickName'       ) && <SimpleEditCustomerDialog model={model} edit={editMode} onClose={handleEditDialogClose} editorComponent={<TextEditor type='text'  required minLength={2} maxLength={30} autoCapitalize='words' />} />}
                    {(editMode === 'email'          ) && <SimpleEditCustomerDialog model={model} edit={editMode} onClose={handleEditDialogClose} editorComponent={<TextEditor type='email' required minLength={5} maxLength={50} />} />}
                </>}
            </ModalStatus>
            <ModalStatus theme='primary' modalCardStyle='scrollable' backdropStyle='static' onExpandedChange={({expanded}) => !expanded && setEditMode(null)}>
                {(editMode === 'full') && <EditOrderDialog order={model} onClose={handleEditDialogClose} />}
            </ModalStatus>
        </ListItem>
    );
}

/* <OrderPage> */
export default function OrderPage(): JSX.Element|null {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    // stores:
    const [page   , setPage   ] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);
    const dataSource            = useGetOrderPage({ page, perPage });
    const {data, isLoading: isLoadingAndNoData, isError, refetch } = dataSource;
    const isErrorAndNoData = isError && !data;
    
    
    
    // jsx:
    if (isLoadingAndNoData) return <PageLoading />;
    if (isErrorAndNoData  ) return <PageError onRetry={refetch} />;
    return (
        <Main className={styles.page}>
            <SectionModelEditor<OrderDetail>
                // data:
                page={page}
                perPage={perPage}
                setPage={setPage}
                setPerPage={setPerPage}
                dataSource={dataSource}
                
                
                
                // components:
                modelPreviewComponent={
                    <OrderPreview model={undefined as any} />
                }
            />
        </Main>
    )
}



// export const metadata : Metadata = {
//     title       : PAGE_ORDER_TITLE,
//     description : PAGE_ORDER_DESCRIPTION,
// };
