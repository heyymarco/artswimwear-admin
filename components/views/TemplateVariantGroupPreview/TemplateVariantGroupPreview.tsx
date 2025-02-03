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
    useTemplateVariantGroupPreviewStyleSheet,
}                           from './styles/loader'

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
import {
    VariantIndicator,
}                           from '@/components/VariantIndicator'
import type {
    // react components:
    ModelPreviewProps,
}                           from '@/components/explorers/PaginationList'
import type {
    // types:
    ComplexEditModelDialogResult,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    EditTemplateVariantGroupDialogProps,
    EditTemplateVariantGroupDialog,
}                           from '@/components/dialogs/EditTemplateVariantGroupDialog'
import {
    // utilities:
    privilegeVariantUpdateFullAccess,
    
    
    
    // states:
    useVariantState,
}                           from '@/components/editors/VariantEditor/states/variantState'

// models:
import {
    // types:
    type ModelCreatedOrUpdatedEventHandler,
    type ModelDeletedEventHandler,
    
    type TemplateVariantGroupDetail,
}                           from '@/models'



// handlers:
const handleOrderStart = (event: OrderableListItemDragStartEvent<HTMLElement>): void => {
    if (!(event.target as HTMLElement)?.classList?.contains?.('grip')) event.response = false;
};



// react components:
export interface TemplateVariantGroupPreviewProps
    extends
        // bases:
        Omit<ModelPreviewProps<TemplateVariantGroupDetail>,
            // behaviors:
            |'draggable'
        >
{
    // handlers:
    onModelUpdated ?: ModelCreatedOrUpdatedEventHandler<TemplateVariantGroupDetail>
    onModelDeleted ?: ModelDeletedEventHandler<TemplateVariantGroupDetail>
    onModelEdit    ?: React.MouseEventHandler<HTMLButtonElement>
}
const TemplateVariantGroupPreview = (props: TemplateVariantGroupPreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = useTemplateVariantGroupPreviewStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
        
        
        
        // handlers:
        onModelUpdated,
        onModelDeleted,
        onModelEdit,
    ...restListItemProps} = props;
    const {
        id,
        name,
        variants,
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
        onModelEdit?.(event);
        
        
        
        const updatedVariantGroupModel = await showDialog<ComplexEditModelDialogResult<TemplateVariantGroupDetail>>(
            <EditTemplateVariantGroupDialog
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
        switch (updatedVariantGroupModel) {
            case undefined: // dialog canceled
                break;
            
            case false:     // dialog deleted
                await onModelDeleted?.({ draft: model, event });
                break;
            
            default:        // dialog updated
                await onModelUpdated?.({ model: updatedVariantGroupModel, event });
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
            
            <p className='preview'>
                {
                    !variants.length
                    ? <span className='noValue'>No Variant</span>
                    : <span className='values'>
                        {variants.map((variant, variantIndex) =>
                            <VariantIndicator key={variantIndex} model={variant} />
                        )}
                    </span>
                }
            </p>
            
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
    TemplateVariantGroupPreview,
    TemplateVariantGroupPreview as default,
}
