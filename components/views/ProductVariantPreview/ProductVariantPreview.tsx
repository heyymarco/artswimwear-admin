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
    // base-components:
    Indicator,
    
    
    
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
import {
    Grip,
}                           from '@/components/Grip'
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
    EditProductVariantDialogProps,
    EditProductVariantDialog,
}                           from '@/components/dialogs/EditProductVariantDialog'
import {
    // utilities:
    privilegeVariantUpdateFullAccess,
    
    
    
    // states:
    useVariantState,
}                           from '@/components/editors/VariantEditor/states/variantState'

// stores:
import type {
    // types:
    ProductVariantDetail,
}                           from '@/store/features/api/apiSlice'



// styles:
const useProductVariantPreviewStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./ProductVariantPreviewStyles')
, { specificityWeight: 2, id: 'ksusgysqhs' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './ProductVariantPreviewStyles';



// handlers:
const handleOrderStart = (event: OrderableListItemDragStartEvent<HTMLElement>): void => {
    if (!(event.target as HTMLElement)?.classList?.contains?.('grip')) event.response = false;
};



// react components:
export interface ProductVariantPreviewProps
    extends
        // bases:
        Omit<ModelPreviewProps<ProductVariantDetail>,
            // behaviors:
            |'draggable'
        >
{
    // handlers:
    onUpdated     ?: UpdatedHandler<ProductVariantDetail>
    onDeleted     ?: DeleteHandler<ProductVariantDetail>
}
const ProductVariantPreview = (props: ProductVariantPreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = useProductVariantPreviewStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
        
        
        
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
    
    
    
    // states:
    // workaround for penetrating <VariantStateProvider> to showDialog():
    const {
        // privileges:
        privilegeAdd,
        privilegeUpdate : privilegeUpdateRaw,
        privilegeDelete : privilegeDeleteRaw,
    ...restVariantState} = useVariantState();
    
    const whenDraft = (id[0] === ' '); // any id(s) starting with a space => draft id
    /*
        when edit_mode (update):
            * the editing  capability follows the `privilegeProductUpdate`
            * the deleting capability follows the `privilegeProductDelete`
        
        when create_mode (add):
            * ALWAYS be ABLE to edit   the VariantGroup and the Variant (because the data is *not_yet_exsist* on the database)
            * ALWAYS be ABLE to delete the VariantGroup and the Variant (because the data is *not_yet_exsist* on the database)
    */
    const privilegeUpdate = whenDraft ? privilegeVariantUpdateFullAccess : privilegeUpdateRaw;
    const privilegeDelete = whenDraft ?               true               : privilegeDeleteRaw;
    
    
    
    // handlers:
    const handleEditButtonClick = useEvent<React.MouseEventHandler<HTMLElement>>(async () => {
        const updatedVariantModel = await showDialog<ComplexEditModelDialogResult<ProductVariantDetail>>(
            <EditProductVariantDialog
                // data:
                model={model} // modify current model
                
                
                
                // workaround for penetrating <VariantStateProvider> to showDialog():
                {...restVariantState}
                
                
                
                // privileges:
                privilegeAdd    = {privilegeAdd   }
                privilegeUpdate = {privilegeUpdate}
                privilegeDelete = {privilegeDelete}
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
            
            
            
            // behaviors:
            draggable={!!privilegeUpdate?.description}
            
            
            
            // handlers:
            onOrderStart={handleOrderStart}
        >
            <p className='name'>{name}</p>
            
            {(model.visibility !== 'PUBLISHED') && <Indicator key={id} tag='span' className='visibility' size='sm' active enabled={false}>DRAFT</Indicator>}
            
            <Grip className='grip' enabled={!!privilegeUpdate?.description} />
            
            <EditButton
                iconComponent={<Icon icon='edit' />}
                onClick={handleEditButtonClick}
            />
        </OrderableListItem>
    );
};
export {
    ProductVariantPreview,
    ProductVariantPreview as default,
}
