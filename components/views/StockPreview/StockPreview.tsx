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
}                           from '@/components/explorers/PagedModelExplorer'
import type {
    // types:
    ComplexEditModelDialogResult,
    UpdatedHandler,
}                           from '@/components/dialogs/ComplexEditModelDialog'

// stores:
import type {
    // types:
    ProductVariantDetail,
    StockDetail,
}                           from '@/store/features/api/apiSlice'



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
    productVariants ?: ProductVariantDetail[]
    
    
    
    // handlers:
    onUpdated       ?: UpdatedHandler<StockDetail>
}
const StockPreview = (props: StockPreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = useStockPreviewStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
        productVariants,
        
        
        
        // handlers:
        onUpdated,
    ...restListItemProps} = props;
    const {
        id,
        productVariantIds,
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
            {/* <p>
                {JSON.stringify(model)}
            </p> */}
            {!!productVariantIds.length && <Group orientation='block' className='variants' theme='primaryAlt'>
                {
                    productVariantIds.map((productVariantId) =>
                        <Basic key={productVariantId} className='variant' size='sm'>
                            {productVariants?.find(({id}) => (id === productVariantId))?.name}
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
