// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
    useState,
}                           from 'react'

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
    EditCoverageCountryDialog,
}                           from '@/components/dialogs/EditCoverageCountryDialog'
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
}                           from '@/components/editors/CoverageCountryEditor/states/shippingState'

// models:
import {
    // types:
    type CoverageCountry,
}                           from '@/models'

// others:
import {
    customAlphabet,
}                           from 'nanoid'

// styles:
import {
    useCoverageCountryEditorStyleSheet,
}                           from './styles/loader'



// react components:
export interface CoverageCountryEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Pick<EditorProps<TElement, CoverageCountry[]>,
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
        >
{
    // data:
    parentModelId : string
}
const CoverageCountryEditor = <TElement extends Element = HTMLElement>(props: CoverageCountryEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // data:
        parentModelId,
        
        
        
        // values:
        defaultValue : defaultUncontrollableValue = [],
        value        : controllableValue,
        onChange     : onControllableValueChange,
        
        
        
        // other props:
        ...restCoverageCountryEditorProps
    } = props;
    
    
    
    // styles:
    const styleSheet = useCoverageCountryEditorStyleSheet();
    
    
    
    // states:
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<CoverageCountry[]>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onControllableValueChange,
    });
    
    const [idMap] = useState<Map<CoverageCountry, string>>(() => new Map<CoverageCountry, string>());
    const mirrorValueWithId = useMemo((): (CoverageCountry & { id: string })[] => {
        const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);
        return (
            value
            .map((item) => {
                let id = idMap.get(item);
                if (id === undefined) {
                    id = nanoid();
                    idMap.set(item, id);
                    // console.log('auto generated id: ', item, id);
                } // if
                
                
                
                return {
                    ...item,
                    id : id,
                };
            })
        );
    }, [value]);
    
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
            * ALWAYS be ABLE to edit   the CoverageZone of Shipping (because the data is *not_yet_exsist* on the database)
            * ALWAYS be ABLE to delete the CoverageZone of Shipping (because the data is *not_yet_exsist* on the database)
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
                const model = (modelPreviewComponent.props as any).model as CoverageCountry & { id: string };
                return model;
            })
        , { triggerAt: 'immediately' });
    });
    const handleModelCreated   = useEvent<CreateHandler<CoverageCountry & { id: string }>>((createdModelWithId) => {
        const {
            id : _id, // remove
            ...createdModel
        } = createdModelWithId;
        
        const mutatedValue = value.slice(0); // copy
        mutatedValue.push(createdModel as CoverageCountry & { id: string });
        triggerValueChange(mutatedValue, { triggerAt: 'immediately' });
    });
    const handleModelUpdated   = useEvent<UpdatedHandler<CoverageCountry & { id: string }>>((updatedModelWithId) => {
        const {
            id : findId, // take
            ...mutatedModel
        } = updatedModelWithId;
        
        const mutatedValue = value.slice(0); // copy
        const modelIndex = mirrorValueWithId.findIndex((model) => model.id === findId);
        if (modelIndex < 0) {
            mutatedValue.unshift(mutatedModel as CoverageCountry & { id: string });
        }
        else {
            const currentModel         = mutatedValue[modelIndex];
            currentModel.name          = mutatedModel.name          ?? '';
            currentModel.estimate      = mutatedModel.estimate      || null;
            currentModel.shippingRates = mutatedModel.shippingRates ?? [];
            currentModel.useZones      = mutatedModel.useZones      ?? true;
            currentModel.zones         = mutatedModel.zones         ?? [];
            
            mutatedValue[modelIndex] = currentModel;
        } // if
        triggerValueChange(mutatedValue, { triggerAt: 'immediately' });
    });
    const handleModelDeleted   = useEvent<DeleteHandler<CoverageCountry & { id: string }>>(({id}) => {
        const mutatedValue = value.slice(0); // copy
        const modelIndex = mirrorValueWithId.findIndex((model) => model.id === id);
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
    } = restCoverageCountryEditorProps;
    
    
    
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
                    {!mirrorValueWithId.length && <ModelEmpty />}
                    
                    {mirrorValueWithId.map((coverageCountry) =>
                        /* <ModelPreview> */
                        <CoverageZonePreview
                            // identifiers:
                            key={coverageCountry.id}
                            
                            
                            
                            // data:
                            model={coverageCountry}
                            
                            
                            
                            // values:
                            coverageCountries={mirrorValueWithId}
                            
                            
                            
                            // handlers:
                            onUpdated={handleModelUpdated}
                            onDeleted={handleModelDeleted}
                        />
                    )}
                    
                    {/* <ModelCreate> */}
                    <ModelCreateOuter<CoverageCountry & { id: string }>
                        // classes:
                        className='solid'
                        
                        
                        
                        // accessibilities:
                        createItemText='Add New Country'
                        
                        
                        
                        // components:
                        modelCreateComponent={
                            isDisabledOrReadOnly
                            ? false
                            : <EditCoverageCountryDialog
                                // data:
                                model={null} // create a new model
                                
                                
                                
                                // workaround for penetrating <ShippingStateProvider> to showDialog():
                                {...restShippingState}
                                
                                
                                
                                // privileges:
                                privilegeAdd    = {privilegeAdd   }
                                privilegeUpdate = {privilegeUpdate}
                                privilegeDelete = {privilegeDelete}
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
    CoverageCountryEditor,
    CoverageCountryEditor as default,
}
