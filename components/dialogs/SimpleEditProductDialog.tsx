'use client'

import { useEvent } from '@reusable-ui/core'

import { InitialValueEventHandler, UpdateModelEventHandler, SimpleEditDialogProps, SimpleEditDialog } from '@/components/dialogs/SimpleEditDialog'
import { ProductDetail, useUpdateProduct } from '@/store/features/api/apiSlice'



// react components:
export interface SimpleEditProductDialogProps<TValue extends any>
    extends
        Omit<SimpleEditDialogProps<TValue, ProductDetail, keyof ProductDetail>,
            // states:
            |'isLoading'
            
            
            
            // data:
            |'initialValue'
            
            
            
            // handlers:
            |'onUpdateModel'
        >
{
}
export const SimpleEditProductDialog = <TValue extends any>(props: SimpleEditProductDialogProps<TValue>) => {
    // stores:
    const [updateProduct, {isLoading}] = useUpdateProduct();
    
    
    
    // handlers:
    const handleInitialValue = useEvent<InitialValueEventHandler<TValue, ProductDetail, keyof ProductDetail>>((edit, model) => {
        return model[edit] as TValue;
    });
    const handleUpdateModel  = useEvent<UpdateModelEventHandler<TValue, ProductDetail, keyof ProductDetail>>(async (value, edit, model) => {
        await updateProduct({
            id     : model.id,
            
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
            
            
            
            // data:
            initialValue={handleInitialValue}
            
            
            
            // handlers:
            onUpdateModel={handleUpdateModel}
        />
    );
};