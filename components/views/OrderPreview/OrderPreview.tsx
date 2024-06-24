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

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

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

// internal components:
import {
    ModelPreviewProps,
}                           from '@/components/explorers/PagedModelExplorer'
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    NameEditor,
}                           from '@/components/editors/NameEditor'
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
    orderStatusTheme,
    OrderStatusBadge,
}                           from '@/components/OrderStatusBadge'

// models:
import type {
    OrderDetail,
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



// defaults:
const imageSize = 128;  // 128px



// styles:
const useOrderPreviewStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./OrderPreviewStyles')
, { specificityWeight: 2, id: 'jb9q1hvpin' });
import './OrderPreviewStyles';



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
        orderStatus,
        
        customer,
        guest,
        
        items,
        
        payment : {
            type : paymentType,
        },
        
        paymentConfirmation,
    } = model;
    const {
        name  : customerName,
        email : customerEmail,
    } = customer ?? guest ?? {};
    
    
    
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
            <p className='fullEditor'>
                <EditButton icon='table_view' className='fullEditor' buttonStyle='regular' onClick={() => setEditMode('full')}>
                    View Details
                </EditButton>
            </p>
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
                    editorComponent={<NameEditor />}
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
                    editorComponent={<EmailEditor />}
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
