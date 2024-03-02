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
    
    UpdateDraftHandler,
    
    DeleteHandler,
    
    
    
    // react components:
    ComplexEditModelDialogProps,
    ImplementedComplexEditModelDialogProps,
    ComplexEditModelDialog,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    // react components:
    EditProductVariantGroupDialogProps,
    EditProductVariantGroupDialog,
}                           from '@/components/dialogs/EditProductVariantGroupDialog'

// internals:
import type {
    PartialModel,
}                           from '@/libs/types'

// stores:
import {
    // types:
    ProductVariantGroupDetail,
    TemplateVariantGroupDetail,
    
    
    
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
        
        
        
        // incompatibles:
        popupComponent,
        modalComponent,
        
        
        
        // handlers:
        onExpandedChange,
    ...restEditProductVariantGroupDialogProps} = props;
    
    const model : ProductVariantGroupDetail|null = !templateVariantGroupDetail ? null : ((): ProductVariantGroupDetail => {
        const {
            templateVariants : productVariants,
            ...restProductVariantGroupDetail
        } = templateVariantGroupDetail;
        
        return {
            ...restProductVariantGroupDetail,
            sort : 0,
            productVariants,
        };
    })();
    
    
    
    // stores:
    const [updateTemplateVariantGroup, {isLoading : isLoadingUpdate}] = useUpdateTemplateVariantGroup();
    const [deleteTemplateVariantGroup, {isLoading : isLoadingDelete}] = useDeleteTemplateVariantGroup();
    
    
    
    // handlers:
    const handleUpdate         = useEvent<UpdateDraftHandler<ProductVariantGroupDetail>>(async ({draftModel: productVariantGroupDetail}) => {
        const {
            id,
            sort : _sort, // remove
            // @ts-ignore
            templateVariants : templateVariantsExist,
            productVariants  : templateVariants = templateVariantsExist,
            ...restProductVariantGroupDetail
        } = productVariantGroupDetail;
        
        const templateVariantGroupDetail : TemplateVariantGroupDetail = {
            ...restProductVariantGroupDetail,
            id : (!id || (id[0] === ' ')) ? '' : id,
            templateVariants,
        };
        
        return await updateTemplateVariantGroup(templateVariantGroupDetail).unwrap();
    });
    
    const handleDelete         = useEvent<DeleteHandler<ProductVariantGroupDetail>>(async ({id}) => {
        await deleteTemplateVariantGroup({
            id : id,
        }).unwrap();
    });
    const handleExpandedChange = useEvent<EventHandler<ComplexEditModelDialogExpandedChangeEvent<ProductVariantGroupDetail>>>((event) => {
        const data = event.data;
        if (!data) {
            onExpandedChange?.({...event, data});
            return;
        } // if
        
        
        
        if (onExpandedChange) {
            const {
                sort : _sort, // remove
                // @ts-ignore
                templateVariants : templateVariantsExist,
                productVariants  : templateVariants = templateVariantsExist,
                ...restProductVariantGroupDetail
            } = data;
            
            const templateVariantGroupDetail : PartialModel<TemplateVariantGroupDetail> = {
                ...restProductVariantGroupDetail,
                templateVariants,
            };
            onExpandedChange({...event, data: templateVariantGroupDetail});
        } // if
    });
    
    
    
    // jsx:
    return (
        <EditProductVariantGroupDialog
            // other props:
            {...restEditProductVariantGroupDialogProps}
            
            
            
            // data:
            modelName='Variant Group Template'
            model={model}
            
            
            
            // images:
            registerAddedImage  =  {undefined} // not supported
            registerDeletedImage = {undefined} // not supported
            
            
            
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
            
            onExpandedChange={handleExpandedChange}
        />
    );
};
export {
    EditTemplateVariantGroupDialog,
    EditTemplateVariantGroupDialog as default,
}
