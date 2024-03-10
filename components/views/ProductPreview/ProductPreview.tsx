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

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

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
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'

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
    PriceEditor,
}                           from '@/components/editors/PriceEditor'
import {
    StockEditor,
}                           from '@/components/editors/StockEditor'
import {
    VisibilityEditor,
}                           from '@/components/editors/VisibilityEditor'
import {
    CompoundWithBadge,
}                           from '@/components/CompoundWithBadge'
import {
    MiniCarousel,
}                           from '@/components/MiniCarousel'
import {
    SimpleEditModelDialog,
}                           from '@/components/dialogs/SimpleEditModelDialog'
import {
    EditProductDialog,
}                           from '@/components/dialogs/EditProductDialog'

// stores:
import {
    // types:
    ProductDetail,
    
    
    
    // hooks:
    useUpdateProduct,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    formatCurrency,
}                           from '@/libs/formatters'
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



// defaults:
const imageSize = 128;  // 128px



// styles:
const usePageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./ProductPreviewStyles')
, { specificityWeight: 2, id: 'u76xb8csqd' });
import './ProductPreviewStyles';



// react components:
interface ProductPreviewProps extends ModelPreviewProps<ProductDetail> {}
const ProductPreview = (props: ProductPreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = usePageStyleSheet();
    
    
    
    // rest props:
    const {
        model,
    ...restListItemProps} = props;
    const {
        visibility,
        name,
        images,
        price,
        stock,
        stocks,
    } = model;
    
    
    
    // sessions:
    const { data: session } = useSession();
    const role = session?.role;
 // const privilegeAdd               = !!role?.product_c;
    const privilegeUpdateDescription = !!role?.product_ud;
    const privilegeUpdateImages      = !!role?.product_ui;
    const privilegeUpdatePrice       = !!role?.product_up;
    const privilegeUpdateStock       = !!role?.product_us;
    const privilegeUpdateVisibility  = !!role?.product_uv;
    const privilegeDelete            = !!role?.product_d;
    const privilegeWrite             = (
        /* privilegeAdd */ // except for add
        privilegeUpdateDescription
        || privilegeUpdateImages
        || privilegeUpdatePrice
        || privilegeUpdateStock
        || privilegeUpdateVisibility
        || privilegeDelete
    );
    
    
    
    // refs:
    const listItemRef = useRef<HTMLElement|null>(null);
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    type EditMode = Exclude<keyof ProductDetail, 'id'>|'images'|'full'
    const handleEdit = useEvent((editMode: EditMode): void => {
        showDialog((() => {
            switch (editMode) {
                case 'name': return (
                    <SimpleEditModelDialog<ProductDetail>
                        // data:
                        model={model}
                        edit='name'
                        
                        
                        
                        // stores:
                        updateModelApi={useUpdateProduct as any}
                        
                        
                        
                        // global stackable:
                        viewport={listItemRef}
                        
                        
                        
                        // components:
                        editorComponent={<NameEditor />}
                    />
                );
                case 'price': return (
                    <SimpleEditModelDialog<ProductDetail>
                        // data:
                        model={model}
                        edit='price'
                        
                        
                        
                        // stores:
                        updateModelApi={useUpdateProduct as any}
                        
                        
                        
                        // global stackable:
                        viewport={listItemRef}
                        
                        
                        
                        // components:
                        editorComponent={<PriceEditor />}
                    />
                );
                case 'stock': return (
                    <SimpleEditModelDialog<ProductDetail>
                        // data:
                        model={model}
                        edit='stock'
                        
                        
                        
                        // stores:
                        updateModelApi={useUpdateProduct as any}
                        
                        
                        
                        // global stackable:
                        viewport={listItemRef}
                        
                        
                        
                        // components:
                        editorComponent={<StockEditor theme='primaryAlt' />}
                    />
                );
                case 'visibility': return (
                    <SimpleEditModelDialog<ProductDetail>
                        // data:
                        model={model}
                        edit='visibility'
                        
                        
                        
                        // stores:
                        updateModelApi={useUpdateProduct as any}
                        
                        
                        
                        // global stackable:
                        viewport={listItemRef}
                        
                        
                        
                        // components:
                        editorComponent={<VisibilityEditor theme='primaryAlt' />}
                    />
                );
                case 'images':
                case 'full'  : return (
                    <EditProductDialog
                        // data:
                        model={model} // modify current model
                        
                        
                        
                        // states:
                        defaultExpandedTabIndex={(editMode === 'images') ? 1 : undefined}
                    />
                );
                default: throw new Error('app error');
            } // switch
        })());
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
            {/* carousel + edit button */}
            <CompoundWithBadge
                // components:
                wrapperComponent={<React.Fragment />}
                badgeComponent={
                    privilegeUpdateImages
                    ? <Badge
                        // variants:
                        nude={true}
                        
                        
                        
                        // floatable:
                        floatingPlacement='left-start'
                        floatingShift={10}
                        floatingOffset={-30}
                    >
                        <EditButton className='edit overlay' onClick={() => handleEdit('images')} />
                    </Badge>
                    : null
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
                        {images.map((image, index) =>
                            <Image
                                // identifiers:
                                key={index}
                                
                                
                                
                                className='prodImg'
                                
                                alt={name ?? ''}
                                src={resolveMediaUrl(image)}
                                sizes={`${imageSize}px`}
                            />
                        )}
                    </MiniCarousel>
                }
            />
            
            <h3 className='name'>
                {name}
                {privilegeUpdateDescription && <EditButton onClick={() => handleEdit('name')} />}
            </h3>
            <p className='price'>
                <strong className='value'>{formatCurrency(price)}</strong>
                {privilegeUpdatePrice       && <EditButton onClick={() => handleEdit('price')} />}
            </p>
            <p className='stocks'>
                {(stocks.length >= 2) ? 'Stocks' : 'Stock' }: <strong className='value'>{stocks.map(({value}) => (value === null) ? '∞' : value).join(', ')}</strong>
                {privilegeUpdateStock       && <EditButton onClick={() => handleEdit('stock')} />}
            </p>
            <p className='visibility'>
                Visibility: <strong className='value'>{visibility}</strong>
                {privilegeUpdateVisibility  && <EditButton onClick={() => handleEdit('visibility')} />}
            </p>
            <p className='fullEditor'>
                {privilegeWrite             && <EditButton buttonStyle='regular' onClick={() => handleEdit('full')}>
                    Open Full Editor
                </EditButton>}
            </p>
        </ListItem>
    );
};
export {
    ProductPreview,
    ProductPreview as default,
}
