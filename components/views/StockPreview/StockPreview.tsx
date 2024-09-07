'use client'

// react:
import {
    // react:
    default as React,
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
    // base-components:
    Basic,
    
    
    
    // layout-components:
    ListItem,
    
    
    
    // composite-components:
    Group,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import type {
    EditorChangeEventHandler
}                           from '@/components/editors/Editor'
import {
    StockEditor,
}                           from '@/components/editors/StockEditor'
import type {
    // react components:
    ModelPreviewProps,
}                           from '@/components/explorers/PaginationExplorer'
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



// styles:
const useStockPreviewStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./StockPreviewStyles')
, { specificityWeight: 2, id: 'a6iitzq7zg' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './StockPreviewStyles';



// react components:
export interface StockPreviewProps
    extends
        // bases:
        ModelPreviewProps<StockDetail>
{
    // models:
    variants  ?: VariantDetail[]
    
    
    
    // handlers:
    onUpdated ?: UpdatedHandler<StockDetail>
}
const StockPreview = (props: StockPreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = useStockPreviewStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
        variants,
        
        
        
        // handlers:
        onUpdated,
    ...restListItemProps} = props;
    const {
        id,
        variantIds,
        value
    } = model;
    
    
    
    // handlers:
    const handleChange = useEvent<EditorChangeEventHandler<number|null>>((value) => {
        onUpdated?.({
            ...model,
            value : value,
        });
    });
    
    
    
    // jsx:
    return (
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // classes:
            className={styleSheet.main}
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
    StockPreview,
    StockPreview as default,
}
