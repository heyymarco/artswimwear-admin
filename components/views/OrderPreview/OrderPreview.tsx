'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
}                           from 'react'

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
    // base-components:
    Basic,
    
    
    
    // simple-components:
    Icon,
    
    
    
    // layout-components:
    ListItem,
    
    
    
    // status-components:
    Badge,
    
    
    
    // dialog-components:
    ModalExpandedChangeEvent,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    EmailEditor,
}                           from '@heymarco/email-editor'
import {
    NameEditor,
}                           from '@heymarco/name-editor'

// internal components:
import {
    ModelPreviewProps,
}                           from '@/components/explorers/PaginationList'
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
    DummyDialog,
}                           from '@/components/dialogs/DummyDialog'
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
import {
    ProductImage,
}                           from '@/components/views/ProductImage'
import {
    PaymentMethodBrand,
}                           from '@/components/payments/PaymentMethodBrand'

// models:
import {
    type OrderDetail,
    
    
    
    orderStatusTheme,
}                           from '@/models'

// internals:
import {
    // utilities:
    getTotalQuantity,
}                           from './utilities'

// configs:
import {
    checkoutConfigShared,
}                           from '@/checkout.config.shared'



// defaults:
const minImageWidth = 155;  // 155px === (200px + (2* paddingBlock)) * aspectRatio === (200px + (2* 16px)) * 2/3



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
    
    
    
    // refs:
    const listItemRef = useRef<HTMLElement|null>(null);
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    type SpecialEditMode = 'full'|'full-status'|'full-payment'
    const [editMode, setEditMode] = useState<SpecialEditMode|null>(null);
    
    type EditMode = keyof NonNullable<(OrderDetail['customer'] & OrderDetail['guest'])>
    const handleEdit = useEvent((editMode: EditMode): void => {
        // just for cosmetic backdrop:
        const dummyPromise = (
            ['full', 'full-status', 'full-payment'].includes(editMode)
            ? showDialog(
                <DummyDialog
                    // global stackable:
                    viewport={listItemRef}
                />
            )
            : undefined
        );
        
        const dialogPromise = showDialog((() => {
            switch (editMode) {
                case 'name'  : return (
                    <SimpleEditCustomerDialog
                        // data:
                        model={model}
                        edit='name'
                        editGroup={customer ? 'customer' : 'guest'}
                        
                        
                        
                        // global stackable:
                        viewport={listItemRef}
                        
                        
                        
                        // components:
                        editorComponent={<NameEditor
                            // validations:
                            required={true}
                        />}
                    />
                );
                case 'email' : return (
                    <SimpleEditCustomerDialog
                        // data:
                        model={model}
                        edit='email'
                        editGroup={customer ? 'customer' : 'guest'}
                        
                        
                        
                        // global stackable:
                        viewport={listItemRef}
                        
                        
                        
                        // components:
                        editorComponent={<EmailEditor
                            // validations:
                            required={true}
                        />}
                    />
                );
                default      : throw new Error('app error');
            } // switch
        })());
        
        if (dummyPromise) {
            dialogPromise.collapseStartEvent().then(() => dummyPromise.closeDialog(undefined));
        } // if
    });
    
    const handleExpandedChange       = useEvent<EventHandler<ModalExpandedChangeEvent>>(({expanded}): void => {
        // conditions:
        if (expanded) return; // ignore if expanded
        
        
        
        // actions:
        setEditMode(null);
    });
    
    
    
    // jsx:
    return (<>
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
                    <EditButton onClick={() => handleEdit('name')} />
                </span>
                <span className='email'>
                    <em>{customerEmail}</em>
                    <EditButton onClick={() => handleEdit('email')} />
                </span>
            </p>
            
            <p className='payment'>
                <span>
                    Payment:
                </span>
                
                {!isPaid && <span className='noValue'>not yet paid</span>}
                
                {isPaid && <span className='paymentValue'>
                    <CurrencyDisplay currency={currency} currencyRate={currencyRate} amount={[totalProductPrice, totalShippingCosts]} />
                    
                    <span className='paymentMethod'>
                        <PaymentMethodBrand model={payment} />
                        
                        {!!payment.identifier && <span className='paymentIdentifier txt-sec'>
                            ({payment.identifier})
                        </span>}
                    </span>
                </span>}
            </p>
            
            <p className='fullEditor'>
                <EditButton icon='list' title='View the order details' className='fullEditor' buttonStyle='regular' onClick={() => setEditMode('full')}>
                    View Details
                </EditButton>
            </p>
            
            {/* carousel + total quantity */}
            <CompoundWithBadge
                // components:
                wrapperComponent={<React.Fragment />}
                badgeComponent={
                    <Badge
                        // classes:
                        className='floatingSumQuantity'
                        
                        
                        
                        // floatable:
                        floatingPlacement='left-start'
                        floatingShift={0}
                        floatingOffset={0}
                    >
                        {getTotalQuantity(items)} Item(s)
                    </Badge>
                }
                elementComponent={
                    <Basic
                        // variants:
                        mild={true}
                        
                        
                        
                        // classes:
                        className='preview'
                    >
                        {
                            !items.length
                            ? <Basic
                                // variants:
                                mild={true}
                                
                                
                                
                                // classes:
                                className='image noImage'
                            >
                                <Icon icon='image' size='xl' />
                            </Basic>
                            : <MiniCarousel
                                // variants:
                                theme='inherit'
                                
                                
                                
                                // classes:
                                className='image'
                            >
                                {items.map(({quantity, productId}, index: number) =>
                                    /* image + quantity */
                                    <CompoundWithBadge
                                        // identifiers:
                                        key={index}
                                        
                                        
                                        
                                        // components:
                                        wrapperComponent={<React.Fragment />}
                                        badgeComponent={
                                            <Badge
                                                // classes:
                                                className='floatingQuantity'
                                                
                                                
                                                
                                                // variants:
                                                floatingPlacement='right-start'
                                                floatingShift={0}
                                                floatingOffset={0}
                                            >
                                                {quantity}x
                                            </Badge>
                                        }
                                        elementComponent={
                                            <ProductImage
                                                // data:
                                                productId={productId}
                                                
                                                
                                                
                                                // appearances:
                                                sizes={`${minImageWidth}px`}
                                                
                                                
                                                
                                                // behaviors:
                                                priority={false}
                                                
                                                
                                                
                                                // classes:
                                                className='prodImg'
                                            />
                                        }
                                    />
                                )}
                            </MiniCarousel>
                        }
                    </Basic>
                }
            />
        </ListItem>
        <CollapsibleSuspense>
            {/* workaround for `updateOrder({ shippingAddress, orderStatus, payment, paymentConfirmation, orderTrouble })` issue, the dialog must be React's declarative way */}
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
    </>);
};
export {
    OrderPreview,
    OrderPreview as default,
}
