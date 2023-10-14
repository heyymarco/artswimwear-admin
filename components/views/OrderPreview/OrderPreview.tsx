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

// internal components:
import {
    ModelPreviewProps,
}                           from '@/components/SectionModelEditor'
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    NameEditor,
}                           from '@/components/editors/NameEditor'
import {
    EmailEditor,
}                           from '@/components/editors/EmailEditor'
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

// stores:
import {
    // types:
    OrderDetail,
    
    
    
    // hooks:
    useGetProductList,
}                           from '@/store/features/api/apiSlice';

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



// defaults:
const imageSize = 128;  // 128px



// utilities:
const getTotalQuantity = (items: OrderDetail['items']): number => {
    return items.reduce((counter, item) => {
        return counter + item.quantity;
    }, 0);
};



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
    
    
    
    // states:
    type EditMode = keyof NonNullable<OrderDetail['customer']>|'full'
    const [editMode, setEditMode] = useState<EditMode|null>(null);
    
    
    
    // stores:
    const {
        data      : productList,
        isLoading : isProductLoadingAndNoData,
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
            
            
            
            // classes:
            className={styleSheet.main}
        >
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
            {/* edit dialog: */}
            <CollapsibleSuspense>
                <SimpleEditCustomerDialog
                    // data:
                    model={model}
                    edit='nickName'
                    
                    
                    
                    // states:
                    expanded={editMode === 'nickName'}
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
                    expanded={(editMode === 'full')}
                    onExpandedChange={handleExpandedChange}
                />
            </CollapsibleSuspense>
        </ListItem>
    );
};
export {
    OrderPreview,
    OrderPreview as default,
}