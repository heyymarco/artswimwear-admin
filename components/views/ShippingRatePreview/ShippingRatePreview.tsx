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
    
    
    
    // an accessibility management system:
    usePropEnabled,
    usePropReadOnly,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
    
    
    
    // layout-components:
    ListItem,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    ModelPreviewProps,
}                           from '@/components/explorers/PaginationList'
import type {
    // types:
    UpdatedHandler,
    DeleteHandler,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    type EditorChangeEventHandler,
}                           from '@/components/editors/Editor'
import {
    ShippingWeightEditor,
}                           from '@/components/editors/ShippingWeightEditor'
import {
    PriceEditor,
}                           from '@/components/editors/PriceEditor'

// models:
import {
    type ShippingRateWithId,
}                           from '@/models'



// styles:
const usePageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./ShippingRatePreviewStyles')
, { specificityWeight: 2, id: 'vpjp5di20y' });
import './ShippingRatePreviewStyles';



// react components:
export interface ShippingRatePreviewProps extends ModelPreviewProps<ShippingRateWithId> {
    // values:
    rates          : ShippingRateWithId[]
    
    
    
    // handlers:
    onModelUpdate ?: UpdatedHandler<ShippingRateWithId>
    onModelDelete ?: DeleteHandler<ShippingRateWithId>
}
const ShippingRatePreview = (props: ShippingRatePreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = usePageStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
        
        
        
        // values:
        rates,
        
        
        
        // handlers:
        onModelUpdate,
        onModelDelete,
    ...restListItemProps} = props;
    const {
        id,
        start,
        rate,
    } = model;
    
    
    
    // accessibilities:
    const propEnabled          = usePropEnabled(props);
    const propReadOnly         = usePropReadOnly(props);
    const isDisabledOrReadOnly = (!propEnabled || propReadOnly);
    
    
    
    // handlers:
    const handleStartingWeightChange = useEvent<EditorChangeEventHandler<number|null>>((newValue) => {
        // conditions:
        if (!onModelUpdate) return;
        
        let newStart = newValue ?? 0;
        if (rates.some(({id: otherId, start: otherStart}) => (otherId !== id) && (otherStart === newStart))) { // a duplicate found
            // try to de-duplicate:
            newStart += (newStart >= start) ? 0.01 : -0.01; // jump more
            if (rates.some(({id: otherId, start: otherStart}) => (otherId !== id) && (otherStart === newStart))) return; // failed to recover
        } // if
        
        
        
        // actions:
        model.start = newStart;
        onModelUpdate(model);
    });
    const handleRateChange           = useEvent<EditorChangeEventHandler<number|null>>((newValue) => {
        // conditions:
        if (!onModelUpdate) return;
        
        
        
        // actions:
        model.rate = newValue ?? 0;
        onModelUpdate(model);
    });
    const handleDelete               = useEvent(() => {
        onModelDelete?.(model);
    });
    
    
    
    // jsx:
    return (
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // classes:
            className={styleSheet.main}
        >
            <ShippingWeightEditor
                // classes:
                className='sWeight'
                
                
                
                // accessibilities:
                readOnly={isDisabledOrReadOnly}
                aria-label='Starting Weight'
                min={0}
                max={1000}
                
                
                
                // validations:
                required={true}
                isValid={
                    (start >= 0)
                    &&
                    (start <= 1000)
                    &&
                    (((start % 0.01) < 0.0000001) || ((0.01 - (start % 0.01)) < 0.0000001))
                    &&
                    !rates.some(({id: otherId, start: otherStart}) => (otherId !== id) && (otherStart === start))
                }
                
                
                
                // values:
                value={start}
                onChange={handleStartingWeightChange}
            />
            
            <PriceEditor
                // classes:
                className='rate'
                
                
                
                // accessibilities:
                readOnly={isDisabledOrReadOnly}
                aria-label='Rate'
                min={0}
                
                
                
                // validations:
                required={true}
                
                
                
                // values:
                value={rate}
                onChange={handleRateChange}
            />
            
            <ButtonIcon
                // appearances:
                icon='delete'
                
                
                
                // variants:
                buttonStyle='link'
                
                
                
                // classes:
                className='delete'
                
                
                
                // accessibilities:
                enabled={!isDisabledOrReadOnly}
                title='Delete'
                
                
                
                // handlers:
                onClick={handleDelete}
            />
        </ListItem>
    );
};
export {
    ShippingRatePreview,
    ShippingRatePreview as default,
}
