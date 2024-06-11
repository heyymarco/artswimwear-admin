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
    CreateHandler,
    ModelCreateOuter,
    ModelEmpty,
}                           from '@/components/explorers/PagedModelExplorer'
import {
    ShippingRatePreview,
}                           from '@/components/views/ShippingRatePreview'

// models:
import {
    // types:
    type ShippingRate,
}                           from '@/models'

// others:
import {
    customAlphabet,
}                           from 'nanoid'



// react components:
export interface ShippingRateEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Pick<EditorProps<TElement, ShippingRate[]>,
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
const ShippingRateEditor = <TElement extends Element = HTMLElement>(props: ShippingRateEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        defaultValue : defaultUncontrollableValue = [],
        value        : controllableValue,
        onChange     : onControllableValueChange,
        
        
        
        // other props:
        ...restShippingRateEditorProps
    } = props;
    
    
    
    // states:
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<ShippingRate[]>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onControllableValueChange,
    });
    
    const lastValue : ShippingRate|undefined = value.length ? value[value.length - 1] : undefined;
    
    const [idMap] = useState<Map<ShippingRate, string>>(() => new Map<ShippingRate, string>());
    const mirrorValueWithId = useMemo((): (ShippingRate & { id: string })[] => {
        const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);
        return (
            value
            .map((item) => {
                let id = idMap.get(item);
                if (id === undefined) {
                    id = ` ${nanoid()}`; // starts with space{random-temporary-id}
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
        const uniqueStartingWiths = new Set(
            value
            .map(({startingWeight}) => startingWeight)
        );
        return (value.length === uniqueStartingWiths.size);
    }, [value]);
    
    
    
    // accessibilities:
    const propEnabled          = usePropEnabled(props);
    const propReadOnly         = usePropReadOnly(props);
    const isDisabledOrReadOnly = (!propEnabled || propReadOnly);
    
    
    
    // handlers:
    const handleModelCreate  = useEvent((): ShippingRate & { id: string } => {
        return {
            id             : '', // will be removed
            
            startingWeight : (lastValue === undefined) ? 0 : ((lastValue.startingWeight) + 0.01),
            rate           : (lastValue === undefined) ? 0 :   lastValue.rate,
        };
    });
    const handleModelCreated = useEvent<CreateHandler<ShippingRate & { id: string }>>((createdModelWithId) => {
        const {
            id : _id, // remove
            ...createdModel
        } = createdModelWithId;
        
        const mutatedValue = value.slice(0); // copy
        mutatedValue.push(createdModel as ShippingRate & { id: string });
        triggerValueChange(mutatedValue, { triggerAt: 'immediately' });
    });
    const handleModelUpdated = useEvent<UpdatedHandler<ShippingRate & { id: string }>>((updatedModelWithId) => {
        const {
            id : findId, // take
            ...mutatedModel
        } = updatedModelWithId;
        
        const mutatedValue = value.slice(0); // copy
        const modelIndex = mirrorValueWithId.findIndex((model) => model.id === findId);
        if (modelIndex < 0) {
            mutatedValue.unshift(mutatedModel as ShippingRate & { id: string });
        }
        else {
            const currentModel          = mutatedValue[modelIndex];
            currentModel.startingWeight = mutatedModel.startingWeight ?? 0;
            currentModel.rate           = mutatedModel.rate ?? 0;
            
            mutatedValue[modelIndex] = currentModel;
        } // if
        mutatedValue.sort((a, b) => (a.startingWeight - b.startingWeight));
        triggerValueChange(mutatedValue, { triggerAt: 'immediately' });
    });
    const handleModelDeleted = useEvent<DeleteHandler<ShippingRate & { id: string }>>(({id}) => {
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
    } = restShippingRateEditorProps;
    
    
    
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
                
                {mirrorValueWithId.map((shippingRate) =>
                    /* <ModelPreview> */
                    <ShippingRatePreview
                        // identifiers:
                        key={shippingRate.id}
                        
                        
                        
                        // data:
                        model={shippingRate}
                        
                        
                        
                        // values:
                        shippingRates={mirrorValueWithId}
                        
                        
                        
                        // handlers:
                        onUpdated={handleModelUpdated}
                        onDeleted={handleModelDeleted}
                    />
                )}
                
                {/* <ModelCreate> */}
                <ModelCreateOuter<ShippingRate & { id: string }>
                    // classes:
                    className='solid'
                    
                    
                    
                    // accessibilities:
                    createItemText='Add New Curve'
                    
                    
                    
                    // components:
                    modelCreateComponent={
                        (isDisabledOrReadOnly || ((lastValue !== undefined) && (lastValue.startingWeight >= 1000))) // reaches the limit => disable adding
                        ? false
                        : handleModelCreate
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
    ShippingRateEditor,
    ShippingRateEditor as default,
}
