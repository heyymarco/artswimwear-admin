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
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// heymarco:
import {
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'

// reusable-ui components:
import {
    // layout-components:
    ListItem,
    
    type ListProps,
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
        Omit<ListProps<TElement>,
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
    ...restListProps} = props;
    
    
    
    // states:
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<ShippingRate[]>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onControllableValueChange,
    });
    
    const [idMap] = useState<Map<ShippingRate, string>>(() => new Map<ShippingRate, string>());
    const mirrorValueWithId = useMemo((): (ShippingRate & { id: string })[] => {
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
    
    
    
    // handlers:
    const handleModelCreate    = useEvent((): ShippingRate & { id: string } => {
        return {
            id             : '',
            startingWeight : 0,
            rate           : 0,
        };
    });
    const handleModelCreated   = useEvent<CreateHandler<ShippingRate & { id: string }>>((createdModelWithId) => {
        const {
            id : _id, // remove
            ...createdModel
        } = createdModelWithId;
        
        const mutatedValue = value.slice(0); // copy
        mutatedValue.push(createdModel as ShippingRate & { id: string });
        triggerValueChange(mutatedValue, { triggerAt: 'immediately' });
    });
    const handleModelUpdated   = useEvent<UpdatedHandler<ShippingRate & { id: string }>>((updatedModelWithId) => {
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
            const currentModel = mutatedValue[modelIndex];
            currentModel.startingWeight = mutatedModel.startingWeight ?? 0;
            currentModel.rate           = mutatedModel.rate ?? 0;
            
            mutatedValue[modelIndex] = currentModel;
        } // if
        triggerValueChange(mutatedValue, { triggerAt: 'immediately' });
    });
    const handleModelDeleted   = useEvent<DeleteHandler<ShippingRate & { id: string }>>(({id}) => {
        const mutatedValue = value.slice(0); // copy
        const modelIndex = mirrorValueWithId.findIndex((model) => model.id === id);
        if (modelIndex < 0) return;
        mutatedValue.splice(modelIndex, 1);
        triggerValueChange(mutatedValue, { triggerAt: 'immediately' });
    });
    
    
    
    // jsx:
    return (
        <List<TElement>
            // other props:
            {...restListProps}
        >
            {!mirrorValueWithId.length && <ModelEmpty />}
            
            {mirrorValueWithId.map((shippingRate) =>
                /* <ModelPreview> */
                <ShippingRatePreview
                    // identifiers:
                    key={shippingRate.id}
                    
                    
                    
                    // data:
                    model={shippingRate}
                    
                    
                    
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
                modelCreateComponent={handleModelCreate}
                listItemComponent={
                    <ListItem />
                }
                
                
                
                // handlers:
                onCreated={handleModelCreated}
            />
        </List>
    );
};
export {
    ShippingRateEditor,
    ShippingRateEditor as default,
}
