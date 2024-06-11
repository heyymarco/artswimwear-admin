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
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    OrderableListItemDragStartEvent,
    OrderableListItem,
}                           from '@heymarco/orderable-list'

// internal components:
import {
    Grip,
}                           from '@/components/Grip'
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

// models:
import {
    type CoverageCountry,
}                           from '@/models'



// styles:
const usePageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./CoverageCountryPreviewStyles')
, { specificityWeight: 2, id: 'uf3vqkp1o4' });
import './CoverageCountryPreviewStyles';



// handlers:
const handleOrderStart = (event: OrderableListItemDragStartEvent<HTMLElement>): void => {
    if (!(event.target as HTMLElement)?.classList?.contains?.('grip')) event.response = false;
};



// react components:
export interface CoverageCountryPreviewProps extends ModelPreviewProps<CoverageCountry & { id: string }> {
    // values:
    coverageCountries  : (CoverageCountry & { id: string })[]
    
    
    
    // handlers:
    onUpdated         ?: UpdatedHandler<CoverageCountry & { id: string }>
    onDeleted         ?: DeleteHandler<CoverageCountry & { id: string }>
}
const CoverageCountryPreview = (props: CoverageCountryPreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = usePageStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
        
        
        
        // values:
        coverageCountries,
        
        
        
        // handlers:
        onUpdated,
        onDeleted,
    ...restOrderableListItemProps} = props;
    const {
        id,
        country,
    } = model;
    
    
    
    // accessibilities:
    const propEnabled          = usePropEnabled(props);
    const propReadOnly         = usePropReadOnly(props);
    const isDisabledOrReadOnly = (!propEnabled || propReadOnly);
    
    
    
    // handlers:
    const handleCountryChange = useEvent<EditorChangeEventHandler<string|null>>((newValue) => {
        // conditions:
        if (!onUpdated) return;
        
        
        
        // actions:
        model.country = newValue ?? '';
        onUpdated(model);
    });
    const handleDelete        = useEvent(() => {
        onDeleted?.(model);
    });
    
    
    
    // jsx:
    return (
        <OrderableListItem
            // other props:
            {...restOrderableListItemProps}
            
            
            
            // classes:
            className={styleSheet.main}
            
            
            
            // handlers:
            onOrderStart={handleOrderStart}
        >
            {country}
            
            <Grip className='grip' enabled={!isDisabledOrReadOnly} />
            
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
        </OrderableListItem>
    );
};
export {
    CoverageCountryPreview,
    CoverageCountryPreview as default,
}
