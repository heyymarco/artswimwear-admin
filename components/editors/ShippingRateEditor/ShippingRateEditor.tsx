// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useMemo,
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

// heymarco components:
import {
    type EditorProps,
}                           from '@heymarco/editor'

// internal components:
import {
    ModelCreateOuter,
    ModelEmpty,
}                           from '@/components/explorers/PaginationList'
import {
    ShippingRatePreview,
}                           from '@/components/views/ShippingRatePreview'

// models:
import {
    // types:
    type ModelUpsertEventHandler,
    type ModelDeleteEventHandler,
    
    type ShippingRate,
    type ShippingRateWithId,
}                           from '@/models'

// others:
import {
    customAlphabet,
}                           from 'nanoid'



// react components:
export interface ShippingRateEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Pick<EditorProps<TElement, ShippingRate[], React.MouseEvent<Element, MouseEvent>>,
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
    } = useControllableAndUncontrollable<ShippingRate[], React.MouseEvent<Element, MouseEvent>>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onControllableValueChange,
    });
    
    const lastValue : ShippingRate|undefined = value.length ? value[value.length - 1] : undefined;
    
    const [idMap]           = useState<Map<ShippingRate, string>>(() => new Map<ShippingRate, string>());
    const mirrorValueWithId = useMemo((): ShippingRateWithId[] => {
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
    
    const isValueValid      = useMemo((): boolean => {
        const uniqueStartingWiths = new Set(
            value
            .map(({start}) => start)
        );
        return (value.length === uniqueStartingWiths.size);
    }, [value]);
    
    
    
    // accessibilities:
    const propEnabled          = usePropEnabled(props);
    const propReadOnly         = usePropReadOnly(props);
    const isDisabledOrReadOnly = (!propEnabled || propReadOnly);
    
    
    
    // handlers:
    const handleModelCreating = useEvent((): ShippingRateWithId => {
        return {
            id    : '', // will be removed
            
            start : (lastValue === undefined) ? 0 : ((lastValue.start) + 0.01),
            rate  : (lastValue === undefined) ? 0 :   lastValue.rate,
        };
    });
    const handleModelCreate   = useEvent<ModelUpsertEventHandler<ShippingRateWithId>>(({ model: createdModelWithId }) => {
        const {
            id : _id, // remove
            ...createdModel
        } = createdModelWithId;
        
        const mutatedValue = value.slice(0); // copy
        mutatedValue.push(createdModel as ShippingRateWithId);
        triggerValueChange(mutatedValue, { triggerAt: 'immediately', event: undefined as any }); // TODO: fix this event
    });
    const handleModelUpdate   = useEvent<ModelUpsertEventHandler<ShippingRateWithId, React.ChangeEvent<HTMLInputElement>>>(({ model: updatedModelWithId }) => {
        const {
            id : findId, // take
            ...mutatedModel
        } = updatedModelWithId;
        
        const mutatedValue = value.slice(0); // copy
        const modelIndex = mirrorValueWithId.findIndex((model) => model.id === findId);
        if (modelIndex < 0) {
            mutatedValue.unshift(mutatedModel as ShippingRateWithId);
        }
        else {
            const currentModel = mutatedValue[modelIndex];
            currentModel.start = mutatedModel.start ?? 0;
            currentModel.rate  = mutatedModel.rate  ?? 0;
            
            mutatedValue[modelIndex] = currentModel;
        } // if
        mutatedValue.sort((a, b) => (a.start - b.start));
        triggerValueChange(mutatedValue, { triggerAt: 'immediately', event: undefined as any }); // TODO: fix this event
    });
    const handleModelDelete   = useEvent<ModelDeleteEventHandler<ShippingRateWithId>>(({ draft: { id } }) => {
        const mutatedValue = value.slice(0); // copy
        const modelIndex = mirrorValueWithId.findIndex((model) => model.id === id);
        if (modelIndex < 0) return;
        mutatedValue.splice(modelIndex, 1);
        triggerValueChange(mutatedValue, { triggerAt: 'immediately', event: undefined as any }); // TODO: fix this event
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
                
                {mirrorValueWithId.map((rate) =>
                    /* <ModelPreview> */
                    <ShippingRatePreview
                        // identifiers:
                        key={rate.id}
                        
                        
                        
                        // data:
                        model={rate}
                        
                        
                        
                        // values:
                        rates={mirrorValueWithId}
                        
                        
                        
                        // handlers:
                        onModelUpdate={handleModelUpdate}
                        onModelDelete={handleModelDelete}
                    />
                )}
                
                {/* <ModelCreate> */}
                <ModelCreateOuter<ShippingRateWithId>
                    // classes:
                    className='solid'
                    
                    
                    
                    // accessibilities:
                    createItemText='Add New Curve'
                    
                    
                    
                    // components:
                    modelCreateComponent={
                        (isDisabledOrReadOnly || ((lastValue !== undefined) && (lastValue.start >= 1000))) // reaches the limit => disable adding
                        ? false
                        : handleModelCreating
                    }
                    listItemComponent={
                        <ListItem />
                    }
                    
                    
                    
                    // handlers:
                    onModelCreate={handleModelCreate}
                />
            </List>
        </EditableControl>
    );
};
export {
    ShippingRateEditor,
    ShippingRateEditor as default,
}
