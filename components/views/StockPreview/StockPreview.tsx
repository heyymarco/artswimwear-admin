'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
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
    Indicator,
    
    
    
    // simple-components:
    Icon,
    
    
    
    // layout-components:
    ListItem,
    List,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    EditButton,
}                           from '@/components/EditButton'
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
import {
    SimpleEditModelDialog,
}                           from '@/components/dialogs/SimpleEditModelDialog'

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
    
    
    
    // refs:
    const listItemRef = useRef<HTMLElement|null>(null);
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleEditButtonClick = useEvent<React.MouseEventHandler<HTMLButtonElement>>(async (event) => {
        const updatedVariantGroupModel = await showDialog<ComplexEditModelDialogResult<StockDetail>>(
            <SimpleEditModelDialog<StockDetail>
                // data:
                model={model}
                edit='value'
                
                
                
                // global stackable:
                viewport={listItemRef}
                
                
                
                // components:
                editorComponent={<StockEditor theme='primaryAlt' />}
            />
        );
        switch (updatedVariantGroupModel) {
            case undefined: // dialog canceled
                break;
            
            case false:     // dialog deleted
                break;
            
            default:        // dialog updated
                await onUpdated?.(updatedVariantGroupModel);
        } // switch
    });
    
    
    
    // jsx:
    return (
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // refs:
            elmRef={listItemRef}
            
            
            
            // classes:
            className={styleSheet.main}
        >
            <div className='variants'>
                {
                    !productVariantIds.length
                    ? <span className='noValue'>No Variant</span>
                    : <span className='values'>
                        {productVariantIds.map((productVariantId) =>
                            <Indicator key={id} tag='span' className='value' size='sm' active>
                                {productVariants?.find(({id}) => (id === productVariantId))?.name}
                            </Indicator>
                        )}
                    </span>
                }
            </div>
            
            <span className='stock'>
                {value}
            </span>
            
            <EditButton
                iconComponent={<Icon icon='edit' />}
                onClick={handleEditButtonClick}
            />
        </ListItem>
    );
};
export {
    StockPreview,
    StockPreview as default,
}
