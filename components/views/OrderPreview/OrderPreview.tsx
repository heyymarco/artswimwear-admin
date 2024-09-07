'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
}                           from 'react'

// // next-js:
// import type {
//     Metadata,
// }                           from 'next'

// // next-auth:
// import {
//     useSession,
// }                           from 'next-auth/react'

// styles:
import {
    useOrderPreviewStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    Content,
    
    
    
    // layout-components:
    ListItem,
    
    
    
    // status-components:
    Badge,
    
    
    
    // dialog-components:
    ModalExpandedChangeEvent,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'
import {
    EmailEditor,
}                           from '@heymarco/email-editor'
import {
    NameEditor,
}                           from '@heymarco/name-editor'

// internal components:
import {
    ModelPreviewProps,
}                           from '@/components/explorers/PaginationExplorer'
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    CompoundWithBadge,
}                           from '@/components/CompoundWithBadge'
import {
    MiniCarousel,
}                           from '@/components/MiniCarousel'
import {
    CollapsibleSuspense,
}                           from '@/components/CollapsibleSuspense'
import {
    SimpleEditCustomerDialog,
}                           from '@/components/dialogs/SimpleEditCustomerDialog'
import {
    EditOrderDialog,
}                           from '@/components/dialogs/EditOrderDialog'
import {
    OrderStatusBadge,
}                           from '@/components/OrderStatusBadge'
import {
    CurrencyDisplay,
}                           from '@/components/CurrencyDisplay'

// models:
import {
    type OrderDetail,
    
    
    
    orderStatusTheme,
    isKnownPaymentBrand,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetProductList,
}                           from '@/store/features/api/apiSlice';

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'
import {
    // utilities:
    getTotalQuantity,
}                           from './utilities'

// configs:
import {
    checkoutConfigShared,
}                           from '@/checkout.config.shared'



// defaults:
const imageSize = 128;  // 128px



// react components:
export interface OrderPreviewProps extends ModelPreviewProps<OrderDetail> {}
const OrderPreview = (props: OrderPreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = useOrderPreviewStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
    ...restListItemProps} = props;
    const {
        orderId,
        
        currency     : preferredCurrency,
        
        shippingCost : totalShippingCosts,
        
        orderStatus,
        
        payment,
        paymentConfirmation,
        
        items,
        
        customer,
        guest,
    } = model;
    const paymentType = payment?.type;
    const {
        name  : customerName,
        email : customerEmail,
    } = customer ?? guest ?? {};
    
    const currency            = preferredCurrency?.currency ?? checkoutConfigShared.intl.defaultCurrency;
    const currencyRate        = (!!preferredCurrency && (currency !== preferredCurrency.currency)) ? (1 / preferredCurrency.rate) : undefined;
    
    const totalProductPrice   = items?.reduce((accum, {price, quantity}) => {
        return accum + (price * quantity);
    }, 0) ?? 0;
    
    const isCanceled          = (orderStatus === 'CANCELED');
    const isExpired           = (orderStatus === 'EXPIRED');
    const isCanceledOrExpired = isCanceled || isExpired;
    const isPaid              = !isCanceledOrExpired && (!!payment && payment.type !== 'MANUAL');
    
    
    
    // states:
    type EditMode = keyof NonNullable<(OrderDetail['customer'] & OrderDetail['guest'])>|'full'|'full-status'|'full-payment'
    const [editMode, setEditMode] = useState<EditMode|null>(null);
    
    
    
    // TODO: add privilege for orders:
    // // sessions:
    // const { data: session } = useSession();
    // const role = session?.role;
 // // const privilegeAdd               = !!role?.admin_c;
    // const privilegeUpdateFoo         = !!role?.admin_uf;
    // const privilegeUpdateBoo         = !!role?.admin_ub;
    // const privilegeDelete            = !!role?.admin_d;
    // const privilegeWrite             = (
    //     /* privilegeAdd */ // except for add
    //     privilegeUpdateFoo
    //     || privilegeUpdateBoo
    //     || privilegeDelete
    // );
    
    
    
    // stores:
    const {
        data      : productList,
     // isLoading : isProductLoadingAndNoData,
    } = useGetProductList();
    
    
    
    // refs:
    const listItemRef = useRef<HTMLElement|null>(null);
    
    
    
    // handlers:
    const handleExpandedChange = useEvent<EventHandler<ModalExpandedChangeEvent>>(({expanded}): void => {
        // conditions:
        if (expanded) return; // ignore if expanded
        
        
        
        // actions:
        setEditMode(null);
    });
    
    
    
    // jsx:
    return (
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // refs:
            elmRef={listItemRef}
            
            
            
            // variants:
            theme={orderStatusTheme(orderStatus, paymentType, paymentConfirmation?.reportedAt, paymentConfirmation?.reviewedAt)}
            
            
            
            // classes:
            className={styleSheet.main}
        >
            <h3 className='orderId'>
                #ORDER_{orderId}
                
                <OrderStatusBadge
                    // data:
                    orderStatus={orderStatus}
                    paymentType={paymentType}
                    
                    reportedAt={paymentConfirmation?.reportedAt}
                    reviewedAt={paymentConfirmation?.reviewedAt}
                    
                    
                    
                    // classes:
                    className='orderStatus'
                    
                    
                    
                    // handlers:
                    onClick={({isPaid}) => setEditMode(isPaid ? 'full-status' : 'full-payment')}
                />
            </h3>
            
            <p className='customer'>
                <span className='name'>
                    <strong>{customerName}</strong>
                    <EditButton onClick={() => setEditMode('name')} />
                </span>
                <span className='email'>
                    <em>{customerEmail}</em>
                    <EditButton onClick={() => setEditMode('email')} />
                </span>
            </p>
            
            <p className='payment'>
                <span>
                    Payment:
                </span>
                
                {!isPaid && <span className='noValue'>not paid</span>}
                
                {isPaid && <span className='paymentValue'>
                    <CurrencyDisplay currency={currency} currencyRate={currencyRate} amount={[totalProductPrice, totalShippingCosts]} />
                    
                    <span className='paymentMethod'>
                        {
                            (!!payment.brand && isKnownPaymentBrand(payment.brand))
                            ? <img
                                // appearances:
                                alt={payment.brand}
                                src={`/brands/${payment.brand.toLowerCase()}.svg`}
                                // width={42}
                                // height={26}
                                
                                
                                
                                // classes:
                                className='paymentProvider'
                            />
                            : (payment.brand || paymentType)
                        }
                        
                        {!!payment.identifier && <span className='paymentIdentifier txt-sec'>
                            ({payment.identifier})
                        </span>}
                    </span>
                </span>}
            </p>
            
            <p className='fullEditor'>
                <EditButton icon='table_view' className='fullEditor' buttonStyle='regular' onClick={() => setEditMode('full')}>
                    View Details
                </EditButton>
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
                        // classes:
                        className='images'
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
            {/* edit dialog: */}
            <CollapsibleSuspense>
                <SimpleEditCustomerDialog
                    // data:
                    model={model}
                    edit='name'
                    editGroup={customer ? 'customer' : 'guest'}
                    
                    
                    
                    // states:
                    expanded={editMode === 'name'}
                    onExpandedChange={handleExpandedChange}
                    
                    
                    
                    // global stackable:
                    viewport={listItemRef}
                    
                    
                    
                    // components:
                    editorComponent={<NameEditor
                        // validations:
                        required={true}
                    />}
                />
                <SimpleEditCustomerDialog
                    // data:
                    model={model}
                    edit='email'
                    editGroup={customer ? 'customer' : 'guest'}
                    
                    
                    
                    // states:
                    expanded={editMode === 'email'}
                    onExpandedChange={handleExpandedChange}
                    
                    
                    
                    // global stackable:
                    viewport={listItemRef}
                    
                    
                    
                    // components:
                    editorComponent={<EmailEditor
                        // validations:
                        required={true}
                    />}
                />
                
                <EditOrderDialog
                    // data:
                    model={model} // modify current model
                    
                    
                    
                    // states:
                    expanded={editMode?.startsWith('full')}
                    onExpandedChange={handleExpandedChange}
                    
                    
                    
                    // auto focusable:
                    autoFocusOn={(() => {
                        switch (editMode) {
                            case 'full-status'  : return 'OrderStatusButton';
                            case 'full-payment' : return 'ConfirmPaymentButton';
                            default             : return undefined;
                        } // switch
                    })()}
                />
            </CollapsibleSuspense>
        </ListItem>
    );
};
export {
    OrderPreview,
    OrderPreview as default,
}
