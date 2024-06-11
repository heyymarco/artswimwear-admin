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
    Icon,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    OrderableListItemDragStartEvent,
    OrderableListItem,
}                           from '@heymarco/orderable-list'

// internal components:
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    Grip,
}                           from '@/components/Grip'
import {
    ModelPreviewProps,
}                           from '@/components/explorers/PagedModelExplorer'
import {
    // types:
    type ComplexEditModelDialogResult,
    type UpdatedHandler,
    type DeleteHandler,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    EditCoverageCountryDialog,
}                           from '@/components/dialogs/EditCoverageCountryDialog'
import {
    // utilities:
    privilegeShippingUpdateFullAccess,
    
    
    
    // states:
    useShippingState,
}                           from '@/components/editors/CoverageCountryEditor/states/shippingState'

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
        id : coverageCountryId,
        country,
    } = model;
    
    
    
    // accessibilities:
    const propEnabled          = usePropEnabled(props);
    const propReadOnly         = usePropReadOnly(props);
    const isDisabledOrReadOnly = (!propEnabled || propReadOnly);
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // states:
    // workaround for penetrating <ShippingStateProvider> to showDialog():
    const {
        // privileges:
        privilegeAdd,
        privilegeUpdate : privilegeUpdateRaw,
        privilegeDelete : privilegeDeleteRaw,
        
        ...restShippingState
    } = useShippingState();
    
    const whenDraft = (coverageCountryId[0] === ' '); // any id(s) starting with a space => draft id
    /*
        when edit_mode (update):
            * the editing  capability follows the `privilegeProductUpdate`
            * the deleting capability follows the `privilegeProductDelete`
        
        when create_mode (add):
            * ALWAYS be ABLE to edit   the CoverageZone of Shipping (because the data is *not_yet_exsist* on the database)
            * ALWAYS be ABLE to delete the CoverageZone of Shipping (because the data is *not_yet_exsist* on the database)
    */
    const privilegeUpdate = whenDraft ? privilegeShippingUpdateFullAccess : privilegeUpdateRaw;
    const privilegeDelete = whenDraft ?               true                : privilegeDeleteRaw;
    
    
    
    // handlers:
    const handleEditButtonClick = useEvent<React.MouseEventHandler<HTMLButtonElement>>(async () => {
        const updatedCoverageCountryModel = await showDialog<ComplexEditModelDialogResult<CoverageCountry & { id: string }>>(
            <EditCoverageCountryDialog
                // data:
                model={model} // modify current model
                
                
                
                // workaround for penetrating <ShippingStateProvider> to showDialog():
                {...restShippingState}
                
                
                
                // privileges:
                privilegeAdd    = {privilegeAdd   }
                privilegeUpdate = {privilegeUpdate}
                privilegeDelete = {privilegeDelete}
            />
        );
        switch (updatedCoverageCountryModel) {
            case undefined: // dialog canceled
                break;
            
            case false:     // dialog deleted
                await onDeleted?.(model);
                break;
            
            default:        // dialog updated
                await onUpdated?.(updatedCoverageCountryModel);
        } // switch
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
            
            <EditButton
                iconComponent={<Icon icon='edit' />}
                onClick={handleEditButtonClick}
            />
        </OrderableListItem>
    );
};
export {
    CoverageCountryPreview,
    CoverageCountryPreview as default,
}
