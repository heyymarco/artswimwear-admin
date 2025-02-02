'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    useShippingRatePreviewStyleSheet,
}                           from './styles/loader'

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

// heymarco components:
import {
    type EditorChangeEventHandler,
}                           from '@heymarco/editor'

// internal components:
import {
    ModelPreviewProps,
}                           from '@/components/explorers/PaginationList'
import {
    ShippingWeightEditor,
}                           from '@/components/editors/ShippingWeightEditor'
import {
    PriceEditor,
}                           from '@/components/editors/PriceEditor'

// models:
import {
    type ModelCreatedOrUpdatedEventHandler,
    type ModelDeletedEventHandler,
    
    type ShippingRateWithId,
}                           from '@/models'



// react components:
export interface ShippingRatePreviewProps extends ModelPreviewProps<ShippingRateWithId> {
    // values:
    rates           : ShippingRateWithId[]
    
    
    
    // handlers:
    onModelUpdated ?: ModelCreatedOrUpdatedEventHandler<ShippingRateWithId, React.ChangeEvent<HTMLInputElement>>
    onModelDeleted ?: ModelDeletedEventHandler<ShippingRateWithId>
}
const ShippingRatePreview = (props: ShippingRatePreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = useShippingRatePreviewStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
        
        
        
        // values:
        rates,
        
        
        
        // handlers:
        onModelUpdated,
        onModelDeleted,
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
    const handleStartingWeightChange = useEvent<EditorChangeEventHandler<number|null, React.ChangeEvent<HTMLInputElement>>>((newValue, event) => {
        // conditions:
        if (!onModelUpdated) return;
        
        let newStart = newValue ?? 0;
        if (rates.some(({id: otherId, start: otherStart}) => (otherId !== id) && (otherStart === newStart))) { // a duplicate found
            // try to de-duplicate:
            newStart += (newStart >= start) ? 0.01 : -0.01; // jump more
            if (rates.some(({id: otherId, start: otherStart}) => (otherId !== id) && (otherStart === newStart))) return; // failed to recover
        } // if
        
        
        
        // actions:
        model.start = newStart; // update the model
        onModelUpdated({ model, event: event });
    });
    const handleRateChange           = useEvent<EditorChangeEventHandler<number|null, React.ChangeEvent<HTMLInputElement>>>((newValue, event) => {
        // conditions:
        if (!onModelUpdated) return;
        
        
        
        // actions:
        model.rate = newValue ?? 0; // update the model
        onModelUpdated({ model, event });
    });
    const handleDelete               = useEvent((event) => {
        // actions:
        // actually nothing has deleted here, just inform as deleted:
        onModelDeleted?.({ model, event });
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
