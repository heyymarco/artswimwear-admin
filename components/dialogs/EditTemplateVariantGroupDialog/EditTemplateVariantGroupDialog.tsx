'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// internal components:
import type {
    // types:
    UpdateDraftHandler,
    
    DeleteHandler,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    // react components:
    EditProductVariantGroupDialogProps,
    EditProductVariantGroupDialog,
}                           from '@/components/dialogs/EditProductVariantGroupDialog'

// stores:
import {
    // types:
    ProductVariantGroupDetail,
    
    
    
    // hooks:
    useUpdateTemplateVariantGroup,
    useDeleteTemplateVariantGroup,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface EditTemplateVariantGroupDialogProps
    extends
        // bases:
        Omit<EditProductVariantGroupDialogProps,
            // images:
            |'registerAddedImage'   // not supported
            |'registerDeletedImage' // not supported
        >
{
}
const EditTemplateVariantGroupDialog = (props: EditTemplateVariantGroupDialogProps): JSX.Element|null => {
    // rest props:
    const {
        // data:
        model = null,
        
        
        
        // states:
        defaultExpandedTabIndex = 0,
    ...restEditProductVariantGroupDialogProps} = props;
    
    
    
    // stores:
    const [updateTemplateVariantGroup, {isLoading : isLoadingUpdate}] = useUpdateTemplateVariantGroup();
    const [deleteTemplateVariantGroup, {isLoading : isLoadingDelete}] = useDeleteTemplateVariantGroup();
    
    
    
    // handlers:
    const handleUpdate               = useEvent<UpdateDraftHandler<ProductVariantGroupDetail>>(async ({draftModel}) => {
        const {
            sort : _sort, // remove
            ...model
        } = draftModel;
        
        return await updateTemplateVariantGroup(model).unwrap();
    });
    
    const handleDelete               = useEvent<DeleteHandler<ProductVariantGroupDetail>>(async ({id}) => {
        await deleteTemplateVariantGroup({
            id : id,
        }).unwrap();
    });
    
    
    
    // jsx:
    return (
        <EditProductVariantGroupDialog
            // other props:
            {...restEditProductVariantGroupDialogProps}
            
            
            
            // data:
            modelName='Variant Group Template'
            model={model}
            
            
            
            // stores:
            isCommiting = {isLoadingUpdate}
            isDeleting  = {isLoadingDelete}
            
            
            
            // handlers:
            onUpdate={handleUpdate}
            // onAfterUpdate={handleAfterUpdate}
            
            onDelete={handleDelete}
            // onAfterDelete={undefined}
            
            // onConfirmDelete={handleConfirmDelete}
            // onConfirmUnsaved={handleConfirmUnsaved}
        />
    );
};
export {
    EditTemplateVariantGroupDialog,
    EditTemplateVariantGroupDialog as default,
}
