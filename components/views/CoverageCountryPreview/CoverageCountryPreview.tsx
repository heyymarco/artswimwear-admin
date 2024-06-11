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

// models:
import {
    type CoverageCountry,
}                           from '@/models'



// styles:
const usePageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./CoverageCountryPreviewStyles')
, { specificityWeight: 2, id: 'uf3vqkp1o4' });
import './CoverageCountryPreviewStyles';



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
    ...restListItemProps} = props;
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
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // classes:
            className={styleSheet.main}
        >
            {country}
            
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
    CoverageCountryPreview,
    CoverageCountryPreview as default,
}
