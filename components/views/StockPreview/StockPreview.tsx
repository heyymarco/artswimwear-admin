'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    useStockPreviewStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
    
    
    
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Basic,
    
    
    
    // layout-components:
    type ListItemProps,
    ListItem,
    
    
    
    // composite-components:
    Group,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    type EditorChangeEventHandler,
}                           from '@heymarco/editor'

// internal components:
import {
    StockEditor,
}                           from '@/components/editors/StockEditor'
import type {
    // react components:
    ModelPreviewProps,
}                           from '@/components/explorers/PaginationList'
import type {
    // types:
    UpdatedHandler,
}                           from '@/components/dialogs/ComplexEditModelDialog'

// models:
import {
    // types:
    type VariantDetail,
    type StockDetail,
}                           from '@/models'



// react components:
export interface StockPreviewProps
    extends
        // bases:
        ModelPreviewProps<StockDetail>
{
    // models:
    variants  ?: VariantDetail[]
    
    
    
    // handlers:
    onUpdated ?: EditorChangeEventHandler<StockDetail, React.ChangeEvent<HTMLInputElement>>
}
const StockPreview = (props: StockPreviewProps): JSX.Element|null => {
    // styles:
    const styles = useStockPreviewStyleSheet();
    
    
    
    // props:
    const {
        // data:
        model,
        variants,
        
        
        
        // handlers:
        onUpdated,
        
        
        
        // other props:
        ...restListItemProps
    } = props;
    
    const {
        id,
        variantIds,
        value
    } = model;
    
    
    
    // handlers:
    const handleChange = useEvent<EditorChangeEventHandler<number|null, React.ChangeEvent<HTMLInputElement>>>((value, event) => {
        onUpdated?.({
            ...model,
            value : value,
        }, event);
    });
    
    
    
    // jsx:
    return (
        <ListItem
            // other props:
            {...restListItemProps satisfies NoForeignProps<typeof restListItemProps, ListItemProps>}
            
            
            
            // classes:
            className={styles.main}
        >
            {!!variantIds.length && <Group orientation='block' className='variants' theme='primaryAlt'>
                {
                    variantIds.map((variantId) =>
                        <Basic key={variantId} className='variant' size='sm'>
                            {variants?.find(({id}) => (id === variantId))?.name}
                        </Basic>
                    )
                }
            </Group>}
            
            <StockEditor
                // variants:
                size='sm'
                theme='primaryAlt'
                
                
                
                // classes:
                className='stock'
                
                
                
                // values:
                value={value}
                onChange={handleChange}
            />
        </ListItem>
    );
};
export {
    StockPreview,            // named export for readibility
    StockPreview as default, // default export to support React.lazy
}
