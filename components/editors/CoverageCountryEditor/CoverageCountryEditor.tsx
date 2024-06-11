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
    
    
    
    // layout-components:
    ListItem,
    List,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

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
    CoverageCountryPreview,
}                           from '@/components/views/CoverageCountryPreview'

// models:
import {
    // types:
    type CoverageCountry,
}                           from '@/models'

// others:
import {
    customAlphabet,
}                           from 'nanoid'



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
}
const CoverageCountryEditor = <TElement extends Element = HTMLElement>(props: CoverageCountryEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        defaultValue : defaultUncontrollableValue = [],
        value        : controllableValue,
        onChange     : onControllableValueChange,
        
        
        
        // other props:
        ...restCoverageCountryEditorProps
    } = props;
    
    
    
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
        const uniqueCountries = new Set(
            value
            .map(({country}) => country)
        );
        return (value.length === uniqueCountries.size);
    }, [value]);
    
    
    
    // accessibilities:
    const propEnabled          = usePropEnabled(props);
    const propReadOnly         = usePropReadOnly(props);
    const isDisabledOrReadOnly = (!propEnabled || propReadOnly);
    
    
    
    // handlers:
    const handleModelCreated = useEvent<CreateHandler<CoverageCountry & { id: string }>>((createdModelWithId) => {
        const {
            id : _id, // remove
            ...createdModel
        } = createdModelWithId;
        
        const mutatedValue = value.slice(0); // copy
        mutatedValue.push(createdModel as CoverageCountry & { id: string });
        triggerValueChange(mutatedValue, { triggerAt: 'immediately' });
    });
    const handleModelUpdated = useEvent<UpdatedHandler<CoverageCountry & { id: string }>>((updatedModelWithId) => {
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
            const currentModel           = mutatedValue[modelIndex];
            currentModel.country         = mutatedModel.country         ?? '';
            currentModel.estimate        = mutatedModel.estimate        || null;
            currentModel.shippingRates   = mutatedModel.shippingRates   ?? [];
            currentModel.useSpecificArea = mutatedModel.useSpecificArea ?? true;
            currentModel.zones           = mutatedModel.zones           ?? [];
            
            mutatedValue[modelIndex] = currentModel;
        } // if
        triggerValueChange(mutatedValue, { triggerAt: 'immediately' });
    });
    const handleModelDeleted = useEvent<DeleteHandler<CoverageCountry & { id: string }>>(({id}) => {
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
            
            
            
            // accessibilities:
            aria-label={ariaLabel}
            
            
            
            // validations:
            isValid={isValid}
            
            
            
            // states:
            focused={focused}
            arrived={arrived}
        >
            <List>
                {!mirrorValueWithId.length && <ModelEmpty />}
                
                {mirrorValueWithId.map((coverageCountry) =>
                    /* <ModelPreview> */
                    <CoverageCountryPreview
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
                        />
                    }
                    listItemComponent={
                        <ListItem />
                    }
                    
                    
                    
                    // handlers:
                    onCreated={handleModelCreated}
                />
            </List>
        </EditableControl>
    );
};
export {
    CoverageCountryEditor,
    CoverageCountryEditor as default,
}