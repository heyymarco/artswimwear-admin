'use client'

import { useEvent } from '@reusable-ui/core'

import { UpdateModelEventHandler, SimpleEditDialogProps, SimpleEditDialog } from '@/components/dialogs/SimpleEditDialog'
import { ProductDetail, useUpdateProduct } from '@/store/features/api/apiSlice'



// react components:
export interface SimpleEditProductDialogProps<TValue extends any>
    extends
        Omit<SimpleEditDialogProps<TValue, ProductDetail, keyof ProductDetail>,
            // states:
            |'isLoading'
            
            
            
            // handlers:
            |'onUpdateModel'
        >
{
}
export const SimpleEditProductDialog = <TValue extends any>(props: SimpleEditProductDialogProps<TValue>) => {
    // stores:
    const [updateProduct, {isLoading}] = useUpdateProduct();
    
    
    
    // handlers:
    const handleUpdateModel = useEvent<UpdateModelEventHandler<TValue, ProductDetail, keyof ProductDetail>>(async (value, edit, model) => {
        await updateProduct({
            _id    : model._id,
            
            [edit] : value,
        }).unwrap();
    });
    
    
    
    // jsx:
    return (
        <SimpleEditDialog<TValue, ProductDetail, keyof ProductDetail>
            // other props:
            {...props}
            
            
            
            // states:
            isLoading={isLoading}
            
            
            
            // handlers:
            onUpdateModel={handleUpdateModel}
        />
    );
};