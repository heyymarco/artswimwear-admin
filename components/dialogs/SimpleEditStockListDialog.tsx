'use client'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// internal components:
import {
    // types:
    TransformValueHandler,
    UpdateModelApi,
    
    
    
    // react components:
    ImplementedSimpleEditModelDialogProps,
    SimpleEditModelDialog,
}                           from '@/components/dialogs/SimpleEditModelDialog'

// stores:
import {
    // types:
    ProductDetail,
    
    
    
    // hooks:
    useUpdateProduct,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface SimpleEditStockListDialogProps
    extends
        // bases:
        ImplementedSimpleEditModelDialogProps<ProductDetail, 'stocks'>
{
}
export const SimpleEditStockListDialog = (props: SimpleEditStockListDialogProps) => {
    // handlers:
    interface StockListModel {
        id     : ProductDetail['id']
        stocks : (number|null)[]
    }
    const handleTransformValue = useEvent<TransformValueHandler<StockListModel>>((value, edit, model) => {
        const stocks = value as unknown as ProductDetail['stocks'];
        
        return {
            id     : model.id,
            
            [edit] : stocks.map(({value}) => value),
        };
    });
    
    
    
    // jsx:
    return (
        <SimpleEditModelDialog<StockListModel>
            // other props:
            {...props as unknown as ImplementedSimpleEditModelDialogProps<StockListModel>}
            
            
            
            // data:
            transformValue={handleTransformValue}
            
            
            
            // stores:
            updateModelApi={useUpdateProduct as () => UpdateModelApi<StockListModel>}
        />
    );
};
