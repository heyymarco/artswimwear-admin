// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

// cssfn:
import {
    startsCapitalized,
}                           from '@cssfn/core'                      // writes css in javascript

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeClasses,
    
    
    
    // an accessibility management system:
    usePropEnabled,
    usePropReadOnly,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// heymarco:
import {
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'

// reusable-ui components:
import {
    // base-components:
    type EditableControlProps,
    EditableControl,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    OrderableListItemProps,
    OrderableListItem,
    
    OrderableList,
}                           from '@heymarco/orderable-list'

// internal components:
import type {
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import type {
    // types:
    UpdatedHandler,
    DeleteHandler,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    type EditCoverageZoneDialogProps,
    EditCoverageZoneDialog,
}                           from '@/components/dialogs/EditCoverageZoneDialog'
import {
    CreateHandler,
    ModelCreateOuter,
    ModelEmpty,
}                           from '@/components/explorers/PagedModelExplorer'
import {
    CoverageZonePreview,
}                           from '@/components/views/CoverageZonePreview'
import {
    // utilities:
    privilegeShippingUpdateFullAccess,
    
    
    
    // states:
    useShippingState,
    
    
    
    // react components:
    ShippingStateProvider,
}                           from '@/components/editors/CoverageZoneEditor/states/shippingState'

// models:
import {
    // types:
    type CoverageZoneWithId,
    type CoverageSubzone,
}                           from '@/models'

// styles:
import {
    useCoverageZoneEditorStyleSheet,
}                           from './styles/loader'



// react components:
export interface SubzoneCoverageZoneEditor {
    // components:
    subzoneNamePlural      : string
    subzoneEditorComponent : React.ReactElement<CoverageZoneEditorProps<CoverageZoneWithId<CoverageSubzone>, CoverageSubzone>>
}
export interface SubzoneCoverageZoneEditorProps {
    // components:
    subzoneCoverageZoneEditor ?: SubzoneCoverageZoneEditor
}
export interface CoverageZoneEditorProps<TCoverageZoneWithId extends CoverageZoneWithId<TCoverageSubzone>, TCoverageSubzone extends CoverageSubzone, TElement extends Element = HTMLElement>
    extends
        // bases:
        Pick<EditorProps<TElement, TCoverageZoneWithId[]>,
            // values:
            |'defaultValue' // not supported, controllable only
            |'value'
            |'onChange'
        >,
        Omit<EditableControlProps<TElement>,
            // values:
            |'defaultValue' // already taken over
            |'value'        // already taken over
            |'onChange'     // already taken over
            
            
            
            // children:
            |'children'     // already taken over
        >,
        
        // components:
        SubzoneCoverageZoneEditorProps,
        Pick<EditCoverageZoneDialogProps<TCoverageZoneWithId, TCoverageSubzone>,
            |'zoneNameEditor'
        >
{
    // data:
    modelName      : string
    parentModelId ?: string
}
const CoverageZoneEditor = <TCoverageZoneWithId extends CoverageZoneWithId<TCoverageSubzone>, TCoverageSubzone extends CoverageSubzone, TElement extends Element = HTMLElement>(props: CoverageZoneEditorProps<TCoverageZoneWithId, TCoverageSubzone, TElement>): JSX.Element|null => {
    // rest props:
    const {
        // data:
        modelName,
        parentModelId = '',
        
        
        
        // values:
        defaultValue  : defaultUncontrollableValue = [],
        value         : controllableValue,
        onChange      : onControllableValueChange,
        
        
        
        // components:
        subzoneCoverageZoneEditor,
        zoneNameEditor,
        
        
        
        // other props:
        ...restCoverageZoneEditorProps
    } = props;
    
    
    
    // styles:
    const styleSheet = useCoverageZoneEditorStyleSheet();
    
    
    
    // states:
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<TCoverageZoneWithId[]>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onControllableValueChange,
    });
    
    const isValueValid = useMemo((): boolean => {
        const uniqueNames = new Set(
            value
            .map(({name}) => name)
        );
        return (value.length === uniqueNames.size);
    }, [value]);
    
    
    
    // classes:
    const mergedClasses = useMergeClasses(
        // preserves the original `classes` from `props`:
        props.classes,
        
        
        
        // classes:
        styleSheet.main,
    );
    
    
    
    // accessibilities:
    const propEnabled          = usePropEnabled(props);
    const propReadOnly         = usePropReadOnly(props);
    const isDisabledOrReadOnly = (!propEnabled || propReadOnly);
    
    
    
    // states:
    // workaround for penetrating <ShippingStateProvider> to showDialog():
    const {
        // privileges:
        privilegeAdd,
        privilegeUpdate : privilegeUpdateRaw,
        privilegeDelete : privilegeDeleteRaw,
        
        ...restShippingState
    } = useShippingState();
    
    const whenDraft = (parentModelId[0] === ' '); // any id(s) starting with a space => draft id
    /*
        when edit_mode (update):
            * the editing  capability follows the `privilegeProductUpdate`
            * the deleting capability follows the `privilegeProductDelete`
        
        when create_mode (add):
            * ALWAYS be ABLE to edit   the TCoverageZoneWithId of Shipping (because the data is *not_yet_exsist* on the database)
            * ALWAYS be ABLE to delete the TCoverageZoneWithId of Shipping (because the data is *not_yet_exsist* on the database)
    */
    const privilegeUpdate = whenDraft ? privilegeShippingUpdateFullAccess : privilegeUpdateRaw;
    const privilegeDelete = whenDraft ?               true                : privilegeDeleteRaw;
    
    
    
    // handlers:
    const handleChildrenChange = useEvent((newChildren: React.ReactComponentElement<any, OrderableListItemProps<HTMLElement, unknown>>[]) => {
        const restChildren = newChildren.slice(0); // copy
        restChildren.splice(-1, 1); // remove the <ModelCreate> component
        triggerValueChange(
            restChildren
            .map((modelPreviewComponent) => {
                const model = (modelPreviewComponent.props as any).model as TCoverageZoneWithId;
                return model;
            })
        , { triggerAt: 'immediately' });
    });
    const handleModelCreated   = useEvent<CreateHandler<TCoverageZoneWithId>>((createdModel) => {
        const mutatedValue = value.slice(0); // copy
        mutatedValue.push(createdModel as TCoverageZoneWithId);
        triggerValueChange(mutatedValue, { triggerAt: 'immediately' });
    });
    const handleModelUpdated   = useEvent<UpdatedHandler<TCoverageZoneWithId>>((mutatedModel) => {
        const mutatedValue = value.slice(0); // copy
        const modelIndex = value.findIndex((model) => model.id === mutatedModel.id);
        if (modelIndex < 0) {
            mutatedValue.unshift(mutatedModel as TCoverageZoneWithId);
        }
        else {
            const currentModel         = mutatedValue[modelIndex];
            currentModel.name          = mutatedModel.name          ?? '';
            currentModel.estimate      = mutatedModel.estimate      || null;
            currentModel.shippingRates = mutatedModel.shippingRates ?? [];
            if (!!subzoneCoverageZoneEditor) {
                currentModel.useZones  = mutatedModel.useZones      ?? (true as any);
                currentModel.zones     = mutatedModel.zones         ?? ([]   as any);
            } // if
            
            mutatedValue[modelIndex] = currentModel;
        } // if
        triggerValueChange(mutatedValue, { triggerAt: 'immediately' });
    });
    const handleModelDeleted   = useEvent<DeleteHandler<TCoverageZoneWithId>>(({id}) => {
        const mutatedValue = value.slice(0); // copy
        const modelIndex = value.findIndex((model) => model.id === id);
        if (modelIndex < 0) return;
        mutatedValue.splice(modelIndex, 1);
        triggerValueChange(mutatedValue, { triggerAt: 'immediately' });
    });
    
    
    
    // default props:
    const {
        // accessibilities:
        'aria-label' : ariaLabel = 'Rate',
        
        
        
        // validations:
        isValid = isValueValid,
        
        
        
        // states:
        focused = false,
        arrived = false,
        
        
        
        // other props:
        ...restEditableControlProps
    } = restCoverageZoneEditorProps;
    
    
    
    // jsx:
    return (
        <EditableControl<TElement>
            // other props:
            {...restEditableControlProps}
            
            
            
            // classes:
            classes={mergedClasses}
            
            
            
            // accessibilities:
            aria-label={ariaLabel}
            
            
            
            // validations:
            isValid={isValid}
            
            
            
            // states:
            focused={focused}
            arrived={arrived}
        >
            <ShippingStateProvider
                // privileges:
                privilegeAdd    = {privilegeAdd   }
                privilegeUpdate = {privilegeUpdate}
                privilegeDelete = {privilegeDelete}
            >
                <OrderableList<HTMLElement, unknown>
                    // variants:
                    listStyle='flush'
                    
                    
                    
                    // values:
                    onChildrenChange={handleChildrenChange}
                >
                    {!value.length && <ModelEmpty />}
                    
                    {value.map((coverageZone) =>
                        /* <ModelPreview> */
                        <CoverageZonePreview<TCoverageZoneWithId, TCoverageSubzone>
                            // identifiers:
                            key={coverageZone.id}
                            
                            
                            
                            // data:
                            model={coverageZone}
                            modelName={modelName}
                            
                            
                            
                            // components:
                            subzoneCoverageZoneEditor={subzoneCoverageZoneEditor}
                            zoneNameEditor={zoneNameEditor}
                            
                            
                            
                            // handlers:
                            onUpdated={handleModelUpdated}
                            onDeleted={handleModelDeleted}
                        />
                    )}
                    
                    {/* <ModelCreate> */}
                    <ModelCreateOuter<TCoverageZoneWithId>
                        // classes:
                        className='solid'
                        
                        
                        
                        // accessibilities:
                        createItemText={`Add New ${startsCapitalized(modelName)}`}
                        
                        
                        
                        // components:
                        modelCreateComponent={
                            isDisabledOrReadOnly
                            ? false
                            : <EditCoverageZoneDialog<TCoverageZoneWithId, TCoverageSubzone>
                                // data:
                                model={null} // create a new model
                                modelName={modelName}
                                
                                
                                
                                // workaround for penetrating <ShippingStateProvider> to showDialog():
                                {...restShippingState}
                                
                                
                                
                                // privileges:
                                privilegeAdd    = {privilegeAdd   }
                                privilegeUpdate = {privilegeUpdate}
                                privilegeDelete = {privilegeDelete}
                                
                                
                                
                                // components:
                                subzoneCoverageZoneEditor={subzoneCoverageZoneEditor}
                                zoneNameEditor={zoneNameEditor}
                            />
                        }
                        listItemComponent={
                            <OrderableListItem
                                orderable={false}
                            />
                        }
                        
                        
                        
                        // handlers:
                        onCreated={handleModelCreated}
                    />
                </OrderableList>
            </ShippingStateProvider>
        </EditableControl>
    );
};
export {
    CoverageZoneEditor,
    CoverageZoneEditor as default,
}
