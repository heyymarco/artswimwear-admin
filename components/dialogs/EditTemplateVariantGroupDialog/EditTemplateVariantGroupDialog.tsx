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
    EventHandler,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// internal components:
import type {
    // types:
    VariantState,
}                           from '@/components/editors/VariantEditor'
import type {
    // types:
    ComplexEditModelDialogExpandedChangeEvent,
    
    
    
    // react components:
    ImplementedComplexEditModelDialogProps,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    // react components:
    EditVariantGroupDialogProps,
    EditVariantGroupDialog,
}                           from '@/components/dialogs/EditVariantGroupDialog'

// models:
import {
    // types:
    type PartialModel,
    
    type ModelUpsertingOfDraftEventHandler,
    type ModelDeletingEventHandler,
    
    type VariantGroupDetail,
    type TemplateVariantGroupDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useUpdateTemplateVariantGroup,
    useDeleteTemplateVariantGroup,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface EditTemplateVariantGroupDialogProps
    extends
        // bases:
        ImplementedComplexEditModelDialogProps<TemplateVariantGroupDetail>,
        Omit<VariantState,
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
        model : templateVariantGroupDetail = null,
        
        
        
        // states:
        defaultExpandedTabIndex = 0,
        
        
        
        // components:
        popupComponent,
        modalComponent,
        modalCardComponent,
        
        
        
        // handlers:
        onExpandedChange,
    ...restEditVariantGroupDialogProps} = props;
    
    const model : VariantGroupDetail|null = !templateVariantGroupDetail ? null : ((): VariantGroupDetail => {
        const {
            variants,
            ...restVariantGroupDetail
        } = templateVariantGroupDetail;
        
        return {
            ...restVariantGroupDetail,
            sort : 0,
            variants,
        };
    })();
    
    
    
    // stores:
    const [updateTemplateVariantGroup, {isLoading : isLoadingUpdate}] = useUpdateTemplateVariantGroup();
    const [deleteTemplateVariantGroup, {isLoading : isLoadingDelete}] = useDeleteTemplateVariantGroup();
    
    
    
    // handlers:
    const handleModelUpserting = useEvent<ModelUpsertingOfDraftEventHandler<VariantGroupDetail>>(async ({ draft: variantGroupDetail }) => {
        const {
            id,
            sort : _sort, // remove
            variants,
            ...restVariantGroupDetail
        } = variantGroupDetail;
        
        const templateVariantGroupDetail : TemplateVariantGroupDetail = {
            ...restVariantGroupDetail,
            id : (!id || (id[0] === ' ')) ? '' : id,
            variants,
        };
        
        return await updateTemplateVariantGroup(templateVariantGroupDetail).unwrap();
    });
    
    const handleDeleting       = useEvent<ModelDeletingEventHandler<VariantGroupDetail>>(async ({ draft: { id } }) => {
        await deleteTemplateVariantGroup({
            id : id,
        }).unwrap();
    });
    const handleExpandedChange = useEvent<EventHandler<ComplexEditModelDialogExpandedChangeEvent<VariantGroupDetail>>>((event) => {
        const data = event.data;
        if (!data) {
            onExpandedChange?.({...event, data});
            return;
        } // if
        
        
        
        if (onExpandedChange) {
            const {
                sort : _sort, // remove
                variants,
                ...restVariantGroupDetail
            } = data;
            
            const templateVariantGroupDetail : PartialModel<TemplateVariantGroupDetail> = {
                ...restVariantGroupDetail,
                variants,
            };
            onExpandedChange({...event, data: templateVariantGroupDetail});
        } // if
    });
    
    
    
    // jsx:
    return (
        <EditVariantGroupDialog
            // other props:
            {...restEditVariantGroupDialogProps}
            
            
            
            // data:
            modelName='Variant Group Template'
            model={model}
            
            
            
            // images:
            registerAddedImage  =  {undefined} // not supported
            registerDeletedImage = {undefined} // not supported
            
            
            
            // stores:
            isCommiting = {isLoadingUpdate}
            isDeleting  = {isLoadingDelete}
            
            
            
            // components:
            popupComponent={popupComponent as EditVariantGroupDialogProps['popupComponent']}
            modalComponent={modalComponent as EditVariantGroupDialogProps['modalComponent']}
            modalCardComponent={modalCardComponent as any}
            
            
            
            // handlers:
            onModelUpserting={handleModelUpserting}
            // onModelUpsert={handleModelUpsert}
            
            onDeleting={handleDeleting}
            // onDelete={undefined}
            
            // onConfirmDelete={handleConfirmDelete}
            // onConfirmUnsaved={handleConfirmUnsaved}
            
            onExpandedChange={handleExpandedChange}
        />
    );
};
export {
    EditTemplateVariantGroupDialog,
    EditTemplateVariantGroupDialog as default,
}
