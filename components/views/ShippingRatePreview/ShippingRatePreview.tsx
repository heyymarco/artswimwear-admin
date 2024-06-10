'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// react-redux:
import type {
    MutationDefinition,
    BaseQueryFn,
}                           from '@reduxjs/toolkit/dist/query'
import type {
    MutationTrigger,
}                           from '@reduxjs/toolkit/dist/query/react/buildHooks'

// // next-js:
// import type {
//     Metadata,
// }                           from 'next'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // layout-components:
    ListItem,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    ModelPreviewProps,
}                           from '@/components/explorers/PagedModelExplorer'
import type {
    // types:
    ComplexEditModelDialogResult,
    UpdatedHandler,
    DeleteHandler,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    ShippingWeightEditor,
}                           from '@/components/editors/ShippingWeightEditor'
import {
    PriceEditor,
}                           from '@/components/editors/PriceEditor'
import {
    DummyDialog,
}                           from '@/components/dialogs/DummyDialog'
import {
    UpdateModelApi,
    SimpleEditModelDialog,
}                           from '@/components/dialogs/SimpleEditModelDialog'

// models:
import {
    type ShippingRate,
}                           from '@/models'

// internals:
import type {
    Model,
    MutationArgs,
}                           from '@/libs/types'



// styles:
const usePageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./ShippingRatePreviewStyles')
, { specificityWeight: 2, id: 'vpjp5di20y' });
import './ShippingRatePreviewStyles';



// react components:
export interface ShippingRatePreviewProps extends ModelPreviewProps<ShippingRate & { id: string }> {
    // handlers:
    onUpdated     ?: UpdatedHandler<ShippingRate & { id: string }>
    onDeleted     ?: DeleteHandler<ShippingRate & { id: string }>
}
const ShippingRatePreview = (props: ShippingRatePreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = usePageStyleSheet();
    
    
    
    // rest props:
    const {
        model,
        
        
        
        // handlers:
        onUpdated,
        onDeleted,
    ...restListItemProps} = props;
    const {
        id,
        startingWeight,
        rate,
    } = model;
    
    
    
    // sessions:
    const { data: session } = useSession();
    const role = session?.role;
 // const privilegeAdd         = !!role?.shipping_c;
    const privilegeUpdatePrice = !!role?.shipping_up;
    
    
    
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
                aria-label='Starting Weight'
                min={0}
                max={999}
                
                
                
                // validations:
                required={true}
                
                
                
                // values:
                value={startingWeight}
                onChange={(newValue) => onUpdated?.({ id: id, startingWeight: newValue ?? 0 })}
            />
            
            <PriceEditor
                // classes:
                className='rate'
                
                
                
                // accessibilities:
                aria-label='Starting Weight'
                min={0}
                
                
                
                // validations:
                required={true}
                
                
                
                // values:
                value={rate}
                onChange={(newValue) => onUpdated?.({ id: id, rate: newValue ?? 0 })}
            />
            
            
            {/* <p className='startingWeight'>
                Starting Weight: <strong className='value'>{startingWeight}</strong>
                {privilegeUpdatePrice  && <EditButton onClick={() => handleEdit('startingWeight')} />}
            </p> */}
            {/* <p className='rate'>
                {rate}
                {privilegeUpdatePrice && <EditButton onClick={() => handleEdit('rate')} />}
            </p> */}
        </ListItem>
    );
};
export {
    ShippingRatePreview,
    ShippingRatePreview as default,
}
