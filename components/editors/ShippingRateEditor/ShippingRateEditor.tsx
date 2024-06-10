// react:
import {
    // react:
    default as React,
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
    type ListItemProps,
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
    ModelCreateProps,
    CreateHandler,
    ModelCreateOuterProps,
    ModelCreateOuter,
    ModelEmpty,
}                           from '@/components/explorers/PagedModelExplorer'
import type {
    ShippingRatePreviewProps,
}                           from '@/components/views/ShippingRatePreview'

// models:
import {
    // types:
    type ShippingRate,
}                           from '@/models'



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
    // components:
    // modelCreateComponent  ?: React.ReactComponentElement<any, ModelCreateProps & EditShippingRateDialogProps>
    modelPreviewComponent  : React.ReactComponentElement<any, ShippingRatePreviewProps>
}
const ShippingRateEditor = <TElement extends Element = HTMLElement>(props: ShippingRateEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        defaultValue : defaultUncontrollableValue = [],
        value        : controllableValue,
        onChange     : onControllableValueChange,
        
        
        
        // components:
        // modelCreateComponent,
        modelPreviewComponent,
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
    
    
    
    // handlers:
    const handleModelCreated   = useEvent<CreateHandler<ShippingRate & { id: string }>>((createdModel) => {
        const mutatedValue = value.slice(0); // copy
        mutatedValue.unshift(createdModel as ShippingRate);
        mutatedValue.sort((a, b) => (a.startingWeight - b.startingWeight));
        triggerValueChange(mutatedValue, { triggerAt: 'immediately' });
    });
    const handleModelUpdated   = useEvent<UpdatedHandler<ShippingRate & { id: string }>>((updatedModel) => {
        const mutatedValue = value.slice(0); // copy
        const id = updatedModel.id;
        const modelIndex = Number.parseInt(id);
        if (modelIndex < 0) {
            mutatedValue.unshift(updatedModel as ShippingRate);
        }
        else {
            mutatedValue[modelIndex] = updatedModel as ShippingRate;
        } // if
        triggerValueChange(mutatedValue, { triggerAt: 'immediately' });
    });
    const handleModelDeleted   = useEvent<DeleteHandler<ShippingRate & { id: string }>>(({id}) => {
        const mutatedValue = value.slice(0); // copy
        const modelIndex = Number.parseInt(id);
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
            {/* <ModelCreate> */}
            {/* <ModelCreateOuter<ShippingRate & { id: string }>
                // classes:
                className='solid'
                
                
                
                // accessibilities:
                createItemText='Add New ShippingRate'
                
                
                
                // components:
                modelCreateComponent={modelCreateComponent}
                listItemComponent={
                    <ListItem />
                }
                
                
                
                // handlers:
                onCreated={handleModelCreated}
            /> */}
            
            {!value.length && <ModelEmpty />}
            
            {value.map((shippingRate, itemIndex) =>
                /* <ModelPreview> */
                React.cloneElement<ShippingRatePreviewProps>(modelPreviewComponent,
                    // props:
                    {
                        // identifiers:
                        key       : modelPreviewComponent.key         ?? itemIndex,
                        
                        
                        
                        // data:
                        model     : modelPreviewComponent.props.model ?? {
                            ...shippingRate,
                            id: `${itemIndex}`,
                        },
                        
                        
                        
                        // handlers:
                        onUpdated : handleModelUpdated,
                        onDeleted : handleModelDeleted,
                    },
                )
            )}
        </List>
    );
};
export {
    ShippingRateEditor,
    ShippingRateEditor as default,
}
