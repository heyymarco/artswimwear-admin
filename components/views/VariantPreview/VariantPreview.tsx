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
const useVariantPreviewStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./VariantPreviewStyles')
, { specificityWeight: 2, id: 'bfyf914v0j' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './VariantPreviewStyles';



// handlers:
const handleOrderStart = (event: OrderableListItemDragStartEvent<HTMLElement>): void => {
    if (!(event.target as HTMLElement)?.classList?.contains?.('grip')) event.response = false;
};



// react components:
export interface VariantPreviewProps
    extends
        // bases:
        ModelPreviewProps<ProductVariantDetail>
{
    // handlers:
    onUpdated     ?: UpdatedHandler<ProductVariantDetail>
    onDeleted     ?: DeleteHandler<ProductVariantDetail>
}
const VariantPreview = (props: VariantPreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = useVariantPreviewStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
        
        
        
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
    
    
    
    // states:
    // workaround for penetrating <VariantStateProvider> to showDialog():
    const {
        // privileges:
        privilegeAdd,
        privilegeUpdate,
        privilegeDelete,
    ...restVariantState} = useVariantState();
    
    
    
    // handlers:
    const whenDraft = (id[0] === ' '); // any id(s) starting with a space => draft id
    const handleEditButtonClick = useEvent<React.MouseEventHandler<HTMLElement>>(async () => {
        const updatedVariantModel = await showDialog<ComplexEditModelDialogResult<ProductVariantDetail>>(
            <EditProductVariantDialog
                // data:
                model={model} // modify current model
                
                
                
                // workaround for penetrating <VariantStateProvider> to showDialog():
                {...restVariantState}
                
                
                
                // privileges:
                privilegeAdd    = {                                               privilegeAdd   }
                /*
                    when edit_mode (update):
                        * the editing  capability follows the `privilegeProductUpdate`
                        * the deleting capability follows the `privilegeProductDelete`
                    
                    when create_mode (add):
                        * ALWAYS be ABLE to edit   the VariantGroup and the Variant (because the data is *not_yet_exsist* on the database)
                        * ALWAYS be ABLE to delete the VariantGroup and the Variant (because the data is *not_yet_exsist* on the database)
                */
                privilegeUpdate = {whenDraft ? privilegeVariantUpdateFullAccess : privilegeUpdate}
                privilegeDelete = {whenDraft ?               true               : privilegeDelete}
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
            
            <EditButton
                iconComponent={<Icon icon='edit' />}
                onClick={handleEditButtonClick}
            />
        </OrderableListItem>
    );
};
export {
    VariantPreview,
    VariantPreview as default,
}
