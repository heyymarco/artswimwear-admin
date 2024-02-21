'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    Icon,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    OrderableListItemDragStartEvent,
    OrderableListItem,
}                           from '@heymarco/orderable-list'

// internal components:
import {
    EditButton,
}                           from '@/components/EditButton'
import type {
    // react components:
    ModelPreviewProps,
}                           from '@/components/explorers/PagedModelExplorer'
import type {
    // types:
    ComplexEditModelDialogResult,
    UpdatedHandler,
    DeleteHandler,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    EditProductVariantDialog,
}                           from '@/components/dialogs/EditProductVariantDialog'

// stores:
import type {
    // types:
    ProductVariantDetail,
}                           from '@/store/features/api/apiSlice'



// styles:
const useVariantPreviewStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./VariantPreviewStyles')
, { specificityWeight: 2, id: 'bfyf914v0j' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './VariantPreviewStyles';



// handlers:
const handleOrderStart = (event: OrderableListItemDragStartEvent<HTMLElement>): void => {
    if (!(event.target as HTMLElement)?.classList?.contains?.('grip')) event.response = false;
};



// react components:
export interface VariantPreviewProps extends Omit<ModelPreviewProps<ProductVariantDetail>, 'onChange'> {
    // data:
    productId        : string
    
    
    
    // privileges:
    privilegeUpdate ?: boolean
    
    
    
    // handlers:
    onUpdated       ?: UpdatedHandler<ProductVariantDetail>
    onDeleted       ?: DeleteHandler<ProductVariantDetail>
}
const VariantPreview = (props: VariantPreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = useVariantPreviewStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
        productId,
        
        
        
        // privileges:
        privilegeUpdate = false,
        
        
        
        // accessibilities:
        readOnly = false, // TODO: unordrable if readonly
        
        
        
        // handlers:
        onUpdated,
        onDeleted,
    ...restListItemProps} = props;
    const {
        id,
        name,
    } = model;
    
    
    
    // refs:
    const listItemRef = useRef<HTMLElement|null>(null);
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleEditButtonClick = useEvent<React.MouseEventHandler<HTMLElement>>(async () => {
        const updatedVariantModel = await showDialog<ComplexEditModelDialogResult<ProductVariantDetail>>(
            <EditProductVariantDialog
                // data:
                model={model} // modify current model
                productId={productId}
            />
        );
        switch (updatedVariantModel) {
            case undefined: // dialog canceled
                break;
            
            case false:     // dialog deleted
                await onDeleted?.(model);
                break;
            
            default:        // dialog updated
                await onUpdated?.(updatedVariantModel);
        } // switch
    });
    
    
    
    // jsx:
    return (
        <OrderableListItem
            // other props:
            {...restListItemProps}
            
            
            
            // refs:
            elmRef={listItemRef}
            
            
            
            // classes:
            className={styleSheet.main}
            
            
            
            // handlers:
            onOrderStart={handleOrderStart}
        >
            <p className='name'>{name}</p>
            
            <span className='grip'>TODO: {'<Grip>'}</span>
            
            {privilegeUpdate && <EditButton
                iconComponent={<Icon icon='edit' />}
                onClick={handleEditButtonClick}
            />}
        </OrderableListItem>
    );
};
export {
    VariantPreview,
    VariantPreview as default,
}