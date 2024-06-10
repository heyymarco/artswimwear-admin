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
}                           from '@/components/explorers/PagedModelExplorer'
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
    type ShippingRate,
}                           from '@/models'



// styles:
const usePageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./ShippingRatePreviewStyles')
, { specificityWeight: 2, id: 'vpjp5di20y' });
import './ShippingRatePreviewStyles';



// react components:
export interface ShippingRatePreviewProps extends ModelPreviewProps<ShippingRate & { id: string }> {
    // values:
    shippingRates  : ShippingRate[]
    
    
    
    // handlers:
    onUpdated     ?: UpdatedHandler<ShippingRate & { id: string }>
    onDeleted     ?: DeleteHandler<ShippingRate & { id: string }>
}
const ShippingRatePreview = (props: ShippingRatePreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = usePageStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
        
        
        
        // values:
        shippingRates,
        
        
        
        // handlers:
        onUpdated,
        onDeleted,
    ...restListItemProps} = props;
    const {
        startingWeight,
        rate,
    } = model;
    
    
    
    const otherStartingWeights = shippingRates.map(({startingWeight}) => startingWeight);
    
    
    
    // accessibilities:
    const propEnabled          = usePropEnabled(props);
    const propReadOnly         = usePropReadOnly(props);
    const isDisabledOrReadOnly = (!propEnabled || propReadOnly);
    
    
    
    // handlers:
    const handleStartingWeightChange = useEvent<EditorChangeEventHandler<number | null>>((newValue) => {
        // conditions:
        if (!onUpdated) return;
        
        let newStartingWeight = newValue ?? 0;
        if (otherStartingWeights.includes(newStartingWeight)) { // a duplicate found
            // try to de-duplicate:
            newStartingWeight += (newStartingWeight >= startingWeight) ? 0.01 : -0.01; // jump more
            if (otherStartingWeights.includes(newStartingWeight)) return; // failed to recover
        } // if
        
        
        
        // actions:
        model.startingWeight = newStartingWeight;
        onUpdated(model);
    });
    const handleRateChange           = useEvent<EditorChangeEventHandler<number | null>>((newValue) => {
        // conditions:
        if (!onUpdated) return;
        
        
        
        // actions:
        model.rate = newValue ?? 0;
        onUpdated(model);
    });
    const handleDelete               = useEvent(() => {
        onDeleted?.(model);
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
                className='startingWeight'
                
                
                
                // accessibilities:
                readOnly={isDisabledOrReadOnly}
                aria-label='Starting Weight'
                min={0}
                max={1000}
                
                
                
                // validations:
                required={true}
                isValid={
                    (startingWeight >= 0)
                    &&
                    (startingWeight <= 1000)
                    &&
                    (((startingWeight % 0.01) < 0.0000001) || ((0.01 - (startingWeight % 0.01)) < 0.0000001))
                    &&
                    (otherStartingWeights.filter((otherStartingWeight) => (otherStartingWeight === startingWeight)).length === 1)
                }
                
                
                
                // values:
                value={startingWeight}
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
