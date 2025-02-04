'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// styles:
import {
    useVariantPreviewStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Basic,
    
    
    
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
import {
    VisibilityBadge,
}                           from '@/components/VisibilityBadge'
import type {
    // react components:
    ModelPreviewProps,
}                           from '@/components/explorers/PaginationList'
import type {
    // types:
    ComplexEditModelDialogResult,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    EditVariantDialogProps,
    EditVariantDialog,
}                           from '@/components/dialogs/EditVariantDialog'
import {
    // utilities:
    privilegeVariantUpdateFullAccess,
    
    
    
    // states:
    useVariantState,
}                           from '@/components/editors/VariantEditor/states/variantState'

// models:
import {
    // types:
    type ModelCreateOrUpdateEventHandler,
    type ModelDeletedEventHandler,
    
    type VariantDetail,
}                           from '@/models'



// handlers:
const handleOrderStart = (event: OrderableListItemDragStartEvent<HTMLElement>): void => {
    if (!(event.target as HTMLElement)?.classList?.contains?.('grip')) event.response = false;
};



// react components:
export interface VariantPreviewProps
    extends
        // bases:
        Omit<ModelPreviewProps<VariantDetail>,
            // behaviors:
            |'draggable'
        >
{
    // handlers:
    onModelUpdate  ?: ModelCreateOrUpdateEventHandler<VariantDetail>
    onModelDeleted ?: ModelDeletedEventHandler<VariantDetail>
}
const VariantPreview = (props: VariantPreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = useVariantPreviewStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
        
        
        
        // handlers:
        onModelUpdate,
        onModelDeleted,
    ...restListItemProps} = props;
    const {
        id,
        visibility,
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
    const handleEditButtonClick = useEvent<React.MouseEventHandler<HTMLButtonElement>>(async (event) => {
        const updatedVariantModel = await showDialog<ComplexEditModelDialogResult<VariantDetail>>(
            <EditVariantDialog
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
                await onModelDeleted?.({ draft: model, event });
                break;
            
            default:        // dialog updated
                await onModelUpdate?.({ model: updatedVariantModel, event });
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
            <p className='name'>
                {name}
            </p>
            
            <VisibilityBadge visibility={visibility} className='visibility' />
            
            <Grip className='grip' enabled={!!privilegeUpdate?.description} />
            
            <EditButton
                // classes:
                className='edit'
                
                
                
                // components:
                iconComponent={<Icon icon='edit' />}
                
                
                
                // handlers:
                onClick={handleEditButtonClick}
            />
        </OrderableListItem>
    );
};
export {
    VariantPreview,
    VariantPreview as default,
}
