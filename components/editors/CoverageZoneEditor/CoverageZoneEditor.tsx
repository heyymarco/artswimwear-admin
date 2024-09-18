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
import {
    type TextDropdownEditorProps,
}                           from '@heymarco/text-dropdown-editor'

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
    type CreateHandler,
}                           from '@/components/explorers/Pagination'
import {
    ModelCreateOuter,
    ModelEmpty,
}                           from '@/components/explorers/PaginationList'
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
    type CoverageZoneDetail,
    type CoverageSubzoneDetail,
}                           from '@/models'

// styles:
import {
    useCoverageZoneEditorStyleSheet,
}                           from './styles/loader'



// react components:
export interface SubzoneCoverageZoneEditorProps {
    // components:
    subzoneEditor ?: React.ReactElement<CoverageZoneEditorProps<CoverageZoneDetail<CoverageSubzoneDetail>, CoverageSubzoneDetail>>
}
export interface CoverageZoneEditorProps<TCoverageZoneDetail extends CoverageZoneDetail<TCoverageSubzoneDetail>, TCoverageSubzoneDetail extends CoverageSubzoneDetail, TElement extends Element = HTMLElement>
    extends
        // bases:
        Pick<EditorProps<TElement, TCoverageZoneDetail[]>,
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
        Pick<EditCoverageZoneDialogProps<TCoverageZoneDetail, TCoverageSubzoneDetail>,
            |'zoneNameEditor'
            |'zoneNameOverride'
        >
{
    // data:
    modelName        : string
    modelNamePlural  : string
    parentModelId   ?: string
}
const CoverageZoneEditor = <TCoverageZoneDetail extends CoverageZoneDetail<TCoverageSubzoneDetail>, TCoverageSubzoneDetail extends CoverageSubzoneDetail, TElement extends Element = HTMLElement>(props: CoverageZoneEditorProps<TCoverageZoneDetail, TCoverageSubzoneDetail, TElement>): JSX.Element|null => {
    // rest props:
    const {
        // data:
        modelName,
        modelNamePlural,
        parentModelId = '',
        
        
        
        // values:
        defaultValue  : defaultUncontrollableValue = [],
        value         : controllableValue,
        onChange      : onControllableValueChange,
        
        
        
        // components:
        zoneNameEditor,
        zoneNameOverride,
        subzoneEditor,
        
        
        
        // other props:
        ...restCoverageZoneEditorProps
    } = props;
    
    
    
    // styles:
    const styleSheet = useCoverageZoneEditorStyleSheet();
    
    
    
    // states:
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<TCoverageZoneDetail[]>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onControllableValueChange,
    });
    
    const isValueValid = useMemo((): boolean => {
        const uniqueNames = new Set(
            value
            .map(({name}) => name.trim().toLowerCase())
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
            * ALWAYS be ABLE to edit   the TCoverageZoneDetail of Shipping (because the data is *not_yet_exsist* on the database)
            * ALWAYS be ABLE to delete the TCoverageZoneDetail of Shipping (because the data is *not_yet_exsist* on the database)
    */
    const privilegeUpdate = whenDraft ? privilegeShippingUpdateFullAccess : privilegeUpdateRaw;
    const privilegeDelete = whenDraft ?               true                : privilegeDeleteRaw;
    
    
    
    // handlers:
    const handleChildrenChange = useEvent((newChildren: React.ReactComponentElement<any, OrderableListItemProps<HTMLElement, unknown>>[]) => {
        const restChildren = newChildren.slice(0); // copy
        restChildren.splice(-1, 1); // remove the <ModelCreate> component
        triggerValueChange(
            restChildren
            .map((modelPreviewComponent, index) => {
                const model = (modelPreviewComponent.props as any).model as TCoverageZoneDetail;
                return {
                    ...model,
                    sort: index,
                } satisfies TCoverageZoneDetail;
            })
        , { triggerAt: 'immediately' });
    });
    const handleModelCreated   = useEvent<CreateHandler<TCoverageZoneDetail>>((createdModel) => {
        const mutatedValue = value.slice(0); // copy
        mutatedValue.push(createdModel as TCoverageZoneDetail);
        for (let index = 0; index < mutatedValue.length; index++) {
            mutatedValue[index] = {
                ...mutatedValue[index],
                sort: index,
            };
        } // for
        triggerValueChange(mutatedValue, { triggerAt: 'immediately' });
    });
    const handleModelUpdated   = useEvent<UpdatedHandler<TCoverageZoneDetail>>((mutatedModel) => {
        const mutatedValue = value.slice(0); // copy
        const modelIndex = value.findIndex((model) => model.id === mutatedModel.id);
        if (modelIndex < 0) {
            mutatedValue.unshift(mutatedModel as TCoverageZoneDetail);
        }
        else {
            const currentModel         = mutatedValue[modelIndex];
            currentModel.name          = mutatedModel.name          ?? '';
            currentModel.eta           = mutatedModel.eta           || null;
            currentModel.rates         = mutatedModel.rates         ?? [];
            if (!!subzoneEditor) {
                currentModel.useZones  = mutatedModel.useZones      ?? (true as any);
                currentModel.zones     = mutatedModel.zones         ?? ([]   as any);
            }
            else {
                currentModel.updatedAt = new Date();
            } // if
            
            mutatedValue[modelIndex]  = currentModel;
        } // if
        triggerValueChange(mutatedValue, { triggerAt: 'immediately' });
    });
    const handleModelDeleted   = useEvent<DeleteHandler<TCoverageZoneDetail>>(({id}) => {
        const mutatedValue = value.slice(0); // copy
        const modelIndex = value.findIndex((model) => model.id === id);
        if (modelIndex < 0) return;
        mutatedValue.splice(modelIndex, 1);
        for (let index = 0; index < mutatedValue.length; index++) {
            mutatedValue[index] = {
                ...mutatedValue[index],
                sort: index,
            };
        } // for
        triggerValueChange(mutatedValue, { triggerAt: 'immediately' });
    });
    
    
    
    // default props:
    const {
        // accessibilities:
        'aria-label' : ariaLabel = startsCapitalized(modelNamePlural),
        
        
        
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
                        <CoverageZonePreview<TCoverageZoneDetail, TCoverageSubzoneDetail>
                            // identifiers:
                            key={coverageZone.id}
                            
                            
                            
                            // data:
                            model={coverageZone}
                            modelName={modelName}
                            
                            
                            
                            // variants:
                            outlined={isValueValid ? undefined : (value.some(({id, name}) => (name.trim().toLowerCase() === coverageZone.name.trim().toLowerCase()) && (id !== coverageZone.id)) ? true : undefined)}
                            
                            
                            
                            // components:
                            zoneNameEditor={zoneNameEditor}
                            zoneNameOverride={zoneNameOverride}
                            subzoneEditor={subzoneEditor}
                            
                            
                            
                            // handlers:
                            onModelUpdate={handleModelUpdated}
                            onModelDelete={handleModelDeleted}
                        />
                    )}
                    
                    {/* <ModelCreate> */}
                    <ModelCreateOuter<TCoverageZoneDetail>
                        // classes:
                        className='solid'
                        
                        
                        
                        // accessibilities:
                        createItemText={`Add New ${startsCapitalized(modelName)}`}
                        
                        
                        
                        // components:
                        modelCreateComponent={
                            isDisabledOrReadOnly
                            ? false
                            : <EditCoverageZoneDialog<TCoverageZoneDetail, TCoverageSubzoneDetail>
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
                                zoneNameEditor={
                                    (!!zoneNameEditor && !!zoneNameEditor.props.valueOptions)
                                    ? React.cloneElement<TextDropdownEditorProps>(zoneNameEditor,
                                        // props:
                                        {
                                            // values:
                                            excludedValueOptions : value.map(({name}) => name),
                                        },
                                    )
                                    : zoneNameEditor
                                }
                                zoneNameOverride={zoneNameOverride}
                                subzoneEditor={subzoneEditor}
                            />
                        }
                        listItemComponent={
                            <OrderableListItem
                                orderable={false}
                            />
                        }
                        
                        
                        
                        // handlers:
                        onModelCreate={handleModelCreated}
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
