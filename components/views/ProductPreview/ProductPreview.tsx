'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// styles:
import {
    useProductPreviewStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Basic,
    
    
    
    // base-content-components:
    Content,
    
    
    
    // simple-components:
    Icon,
    
    
    
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
import {
    NameEditor,
}                           from '@heymarco/name-editor'

// internal components:
import {
    CurrencyDisplay,
}                           from '@/components/CurrencyDisplay'
import {
    ModelPreviewProps,
}                           from '@/components/explorers/PaginationList'
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    PriceEditor,
}                           from '@/components/editors/PriceEditor'
import {
    StockListEditor,
}                           from '@/components/editors/StockListEditor'
import {
    VisibilityEditor,
}                           from '@/components/editors/VisibilityEditor'
import {
    StockPreview,
}                           from '@/components/views/StockPreview'
import {
    CompoundWithBadge,
}                           from '@/components/CompoundWithBadge'
import {
    MiniCarousel,
}                           from '@/components/MiniCarousel'
import {
    VariantIndicator,
}                           from '@/components/VariantIndicator'
import {
    DummyDialog,
}                           from '@/components/dialogs/DummyDialog'
import {
    SimpleEditModelDialog,
}                           from '@/components/dialogs/SimpleEditModelDialog'
import {
    SimpleEditStockListDialog,
}                           from '@/components/dialogs/SimpleEditStockListDialog'
import {
    EditProductDialog,
}                           from '@/components/dialogs/EditProductDialog'

// models:
import {
    // types:
    type ProductDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useUpdateProduct,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



// defaults:
const minImageWidth = 155;  // 155px === (200px + (2* paddingBlock)) * aspectRatio === (200px + (2* 16px)) * 2/3



// react components:
interface ProductPreviewProps extends ModelPreviewProps<ProductDetail> {}
const ProductPreview = (props: ProductPreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = useProductPreviewStyleSheet();
    
    
    
    // rest props:
    const {
        model,
    ...restListItemProps} = props;
    const {
        visibility,
        name,
        images,
        price,
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
    type EditMode = Exclude<keyof ProductDetail, 'id'>|'variants'|'images'|'full'
    const handleEdit = useEvent((editMode: EditMode): void => {
        // just for cosmetic backdrop:
        const dummyPromise = (
            ['stocks', 'variants', 'images', 'full'].includes(editMode)
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
                case 'name'       : return (
                    <SimpleEditModelDialog<ProductDetail>
                        // data:
                        model={model}
                        edit='name'
                        
                        
                        
                        // stores:
                        useUpdateModel={useUpdateProduct as any}
                        
                        
                        
                        // global stackable:
                        viewport={listItemRef}
                        
                        
                        
                        // components:
                        editorComponent={<NameEditor
                            // validations:
                            required={true}
                        />}
                    />
                );
                case 'price'      : return (
                    <SimpleEditModelDialog<ProductDetail>
                        // data:
                        model={model}
                        edit='price'
                        
                        
                        
                        // stores:
                        useUpdateModel={useUpdateProduct as any}
                        
                        
                        
                        // global stackable:
                        viewport={listItemRef}
                        
                        
                        
                        // components:
                        editorComponent={<PriceEditor />}
                    />
                );
                case 'stocks'     : return (
                    <SimpleEditStockListDialog
                        // data:
                        model={model}
                        edit='stocks'
                        
                        
                        
                        // components:
                        editorComponent={
                            <StockListEditor
                                // models:
                                variantGroups={model.variantGroups}
                                
                                
                                
                                // components:
                                modelPreviewComponent={
                                    <StockPreview
                                        // data:
                                        model={undefined as any}
                                    />
                                }
                            />
                        }
                    />
                );
                case 'visibility' : return (
                    <SimpleEditModelDialog<ProductDetail>
                        // data:
                        model={model}
                        edit='visibility'
                        
                        
                        
                        // stores:
                        useUpdateModel={useUpdateProduct as any}
                        
                        
                        
                        // global stackable:
                        viewport={listItemRef}
                        
                        
                        
                        // components:
                        editorComponent={<VisibilityEditor theme='primaryAlt' />}
                    />
                );
                case 'variants'   :
                case 'images'     :
                case 'full'       : return (
                    <EditProductDialog
                        // data:
                        model={model} // modify current model
                        
                        
                        
                        // states:
                        defaultExpandedTabIndex={(() => {
                            switch (editMode) {
                                case 'variants' : return 1;
                                case 'images'   : return 3;
                                default         : return undefined;
                            } // switch
                        })()}
                    />
                );
                default           : throw new Error('app error');
            } // switch
        })());
        
        if (dummyPromise) {
            dialogPromise.collapseStartEvent().then(() => dummyPromise.closeDialog(undefined));
        } // if
    });
    
    
    
    // jsx:
    return (
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // refs:
            elmRef={listItemRef}
            
            
            
            // variants:
            theme={(visibility !== 'PUBLISHED') ? 'secondary' : undefined}
            
            
            
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
                        
                        
                        
                        // classes:
                        className='floatingEdit'
                        
                        
                        
                        // floatable:
                        floatingPlacement='left-start'
                        floatingShift={0}
                        floatingOffset={0}
                    >
                        <EditButton className='edit overlay' onClick={() => handleEdit('images')} />
                    </Badge>
                    : null
                }
                elementComponent={
                    <Basic
                        // variants:
                        mild={true}
                        
                        
                        
                        // classes:
                        className='preview'
                    >
                        {
                            !images.length
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
                                theme='danger'
                                
                                
                                
                                // classes:
                                className='image'
                            >
                                {images.map((image, index) =>
                                    <Image
                                        // identifiers:
                                        key={index}
                                        
                                        
                                        
                                        className='prodImg'
                                        
                                        alt={name ?? ''}
                                        src={resolveMediaUrl(image)}
                                        sizes={`${minImageWidth}px`}
                                    />
                                )}
                            </MiniCarousel>
                        }
                    </Basic>
                }
            />
            
            <h3 className='name'>
                {name}
                {privilegeUpdateDescription && <EditButton onClick={() => handleEdit('name')} />}
            </h3>
            <p className='variants'>
                {!model.variantGroups.flatMap(() => ({})).length && <span className='noValue'>No Variant</span>}
                {model.variantGroups.map(({variants}, groupIndex) =>
                    variants.map((variant, variantIndex) =>
                        <VariantIndicator key={`${groupIndex}/${variantIndex}`} model={variant} />
                    )
                )}
                {
                    (
                        privilegeUpdateDescription
                        ||
                        privilegeUpdateImages
                        ||
                        privilegeUpdatePrice
                        ||
                        privilegeUpdateStock
                        ||
                        privilegeUpdateVisibility
                    )
                    &&
                    <EditButton onClick={() => handleEdit('variants')} />
                }
            </p>
            <p className='price'>
                <strong className='value'>
                    <CurrencyDisplay amount={price} />
                </strong>
                {privilegeUpdatePrice       && <EditButton onClick={() => handleEdit('price')} />}
            </p>
            <p className='stocks'>
                {(stocks.length >= 2) ? 'Stocks' : 'Stock' }: <strong className='value'>{stocks.map(({value}) => (value === null) ? '∞' : value).join(', ')}</strong>
                {privilegeUpdateStock       && <EditButton onClick={() => handleEdit('stocks')} />}
            </p>
            <p className='visibility'>
                Visibility: <strong className='value'>{visibility}</strong>
                {privilegeUpdateVisibility  && <EditButton onClick={() => handleEdit('visibility')} />}
            </p>
            <p className='fullEditor'>
                {privilegeWrite             && <EditButton icon='list' title='View the order details' className='fullEditor' buttonStyle='regular' onClick={() => handleEdit('full')}>
                    View Details
                </EditButton>}
            </p>
        </ListItem>
    );
};
export {
    ProductPreview,
    ProductPreview as default,
}
