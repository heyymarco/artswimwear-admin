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
import {
    RadioDecorator,
}                           from '@/components/RadioDecorator'
import type {
    // types:
    ComplexEditModelDialogResult,
    DeleteHandler,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    EditProductVariantGroupDialog,
}                           from '@/components/dialogs/EditProductVariantGroupDialog'

// stores:
import type {
    // types:
    ProductVariantGroupDetail,
}                           from '@/store/features/api/apiSlice'



// styles:
const useVariantGroupPreviewStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./VariantGroupPreviewStyles')
, { specificityWeight: 2, id: 'r52809dkaf' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './VariantGroupPreviewStyles';



// react components:
export interface VariantGroupPreviewProps extends Omit<ModelPreviewProps<ProductVariantGroupDetail>, 'onChange'> {
    // data:
    productId  : string
    
    
    
    // handlers:
    onDeleted ?: DeleteHandler<ProductVariantGroupDetail>
}
const VariantGroupPreview = (props: VariantGroupPreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = useVariantGroupPreviewStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
        productId,
        
        
        
        // accessibilities:
        readOnly = false, // TODO: unordrable if readonly
        
        
        
        // handlers:
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
        const updatedVariantGroupModel = await showDialog<ComplexEditModelDialogResult<ProductVariantGroupDetail>>(
            <EditProductVariantGroupDialog
                // data:
                model={model} // modify current model
                productId={productId}
            />
        );
        if (updatedVariantGroupModel === false) {
            await onDeleted?.(model);
        } // if
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
        >
            TODO: {'<Grip>'}
            <p className='name'>{!!id ? name : <span className='noValue'>No Access</span>}</p>
            {!!id && <EditButton
                iconComponent={<Icon icon='edit' />}
                onClick={handleEditButtonClick}
            />}
        </OrderableListItem>
    );
};
export {
    VariantGroupPreview,
    VariantGroupPreview as default,
}
