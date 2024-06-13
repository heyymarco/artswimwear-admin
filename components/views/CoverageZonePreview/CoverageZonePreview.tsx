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
    EditCoverageZoneDialog,
}                           from '@/components/dialogs/EditCoverageZoneDialog'
import {
    // utilities:
    privilegeShippingUpdateFullAccess,
    
    
    
    // states:
    useShippingState,
}                           from '@/components/editors/CoverageZoneEditor/states/shippingState'

// models:
import {
    type CoverageZone,
    type CoverageSubzone,
}                           from '@/models'



// styles:
const usePageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./CoverageZonePreviewStyles')
, { specificityWeight: 2, id: 'uf3vqkp1o4' });
import './CoverageZonePreviewStyles';



// handlers:
const handleOrderStart = (event: OrderableListItemDragStartEvent<HTMLElement>): void => {
    if (!(event.target as HTMLElement)?.classList?.contains?.('grip')) event.response = false;
};



// react components:
export interface CoverageZonePreviewProps<TCoverageZone extends CoverageZone<TCoverageSubzone>, TCoverageSubzone extends CoverageSubzone>
    extends
        // bases:
        ModelPreviewProps<TCoverageZone & { id: string }>
{
    // data:
    modelName          : string
    hasSubzones        : boolean
    subzoneNamePlural  : string
    
    
    
    // handlers:
    onUpdated         ?: UpdatedHandler<TCoverageZone & { id: string }>
    onDeleted         ?: DeleteHandler<TCoverageZone & { id: string }>
}
const CoverageZonePreview = <TCoverageZone extends CoverageZone<TCoverageSubzone>, TCoverageSubzone extends CoverageSubzone>(props: CoverageZonePreviewProps<TCoverageZone, TCoverageSubzone>): JSX.Element|null => {
    // styles:
    const styleSheet = usePageStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
        modelName,
        hasSubzones,
        subzoneNamePlural,
        
        
        
        // handlers:
        onUpdated,
        onDeleted,
        
        
        
        // other props:
        ...restOrderableListItemProps
    } = props;
    const {
        id : coverageZoneId,
        name,
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
    
    const whenDraft = (coverageZoneId[0] === ' '); // any id(s) starting with a space => draft id
    /*
        when edit_mode (update):
            * the editing  capability follows the `privilegeProductUpdate`
            * the deleting capability follows the `privilegeProductDelete`
        
        when create_mode (add):
            * ALWAYS be ABLE to edit   the TCoverageZone of Shipping (because the data is *not_yet_exsist* on the database)
            * ALWAYS be ABLE to delete the TCoverageZone of Shipping (because the data is *not_yet_exsist* on the database)
    */
    const privilegeUpdate = whenDraft ? privilegeShippingUpdateFullAccess : privilegeUpdateRaw;
    const privilegeDelete = whenDraft ?               true                : privilegeDeleteRaw;
    
    
    
    // handlers:
    const handleEditButtonClick = useEvent<React.MouseEventHandler<HTMLButtonElement>>(async () => {
        const updatedCoverageZoneModel = await showDialog<ComplexEditModelDialogResult<TCoverageZone & { id: string }>>(
            <EditCoverageZoneDialog<TCoverageZone, TCoverageSubzone>
                // data:
                model={model} // modify current model
                modelName={modelName}
                hasSubzones={hasSubzones}
                subzoneNamePlural={subzoneNamePlural}
                
                
                
                // workaround for penetrating <ShippingStateProvider> to showDialog():
                {...restShippingState}
                
                
                
                // privileges:
                privilegeAdd    = {privilegeAdd   }
                privilegeUpdate = {privilegeUpdate}
                privilegeDelete = {privilegeDelete}
            />
        );
        switch (updatedCoverageZoneModel) {
            case undefined: // dialog canceled
                break;
            
            case false:     // dialog deleted
                await onDeleted?.(model);
                break;
            
            default:        // dialog updated
                await onUpdated?.(updatedCoverageZoneModel);
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
            {name}
            
            <Grip className='grip' enabled={!isDisabledOrReadOnly} />
            
            <EditButton
                iconComponent={<Icon icon='edit' />}
                onClick={handleEditButtonClick}
            />
        </OrderableListItem>
    );
};
export {
    CoverageZonePreview,
    CoverageZonePreview as default,
}
