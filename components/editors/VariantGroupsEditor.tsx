// react:
import {
    // react:
    default as React,
}                           from 'react'

// redux:
import type {
    EntityState
}                           from '@reduxjs/toolkit'

// reusable-ui components:
import {
    // layout-components:
    ListItemProps,
    ListProps,
    List,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    OrderableListItemDragStartEvent,
    OrderableListItemDropHandshakeEvent,
    OrderableListItem,
    OrderableList,
}                           from '@heymarco/orderable-list'

// internal components:
import type {
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    ModelCreateOuterProps,
    ModelCreateOuter,
}                           from '@/components/explorers/PagedModelExplorer'
import type {
    VariantGroupPreviewProps,
}                           from '@/components/views/VariantGroupPreview'

// stores:
import type {
    // types:
    ProductVariantGroupDetail,
}                           from '@/store/features/api/apiSlice'



// react components:
interface VariantGroupsEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Pick<EditorProps<TElement, string|null>,
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
        >,
        // data:
        Partial<Pick<ModelCreateOuterProps,
            // components:
            |'modelCreateComponent'
        >>
{
    // values:
    modelList             ?: EntityState<ProductVariantGroupDetail>
    
    
    
    // components:
    modelPreviewComponent  : (model: ProductVariantGroupDetail) => React.ReactComponentElement<any, VariantGroupPreviewProps>
}
const VariantGroupsEditor = <TElement extends Element = HTMLElement>(props: VariantGroupsEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // accessibilities:
        readOnly = false,
        
        
        
        // values:
        modelList,
        
        defaultValue,
        value,
        onChange,
        
        
        
        // components:
        modelCreateComponent,
        modelPreviewComponent : modelPreviewComponentFn,
    ...restListProps} = props;
    
    const filteredModelList = !modelList ? [] : Object.values(modelList.entities).filter((model): model is Exclude<typeof model, undefined> => !!model);
    
    
    
    // jsx:
    const ConditionalList = readOnly ? List<TElement> : OrderableList<TElement, unknown>;
    return (
        <ConditionalList
            // other props:
            {...restListProps}
        >
            {/* <ModelCreate> */}
            {!!modelCreateComponent  && <ModelCreateOuter
                // classes:
                className='solid'
                
                
                
                // accessibilities:
                createItemText='Add New Variant Group'
                
                
                
                // components:
                modelCreateComponent={modelCreateComponent}
                listItemComponent={
                    <OrderableListItem
                        orderable={false}
                    />
                }
            />}
            
            {filteredModelList.map((model) => {
                const modelPreviewComponent = modelPreviewComponentFn(model);
                // jsx:
                return (
                    /* <ModelPreview> */
                    React.cloneElement<VariantGroupPreviewProps>(modelPreviewComponent,
                        // props:
                        {
                            // identifiers:
                            key      : modelPreviewComponent.key          ?? model.id,
                            
                            
                            
                            // data:
                            model    : modelPreviewComponent.props.model  ?? model,
                            
                            
                            
                            // states:
                            active   : modelPreviewComponent.props.active ?? ((value ?? '') === model.id),
                            
                            
                            
                            // handlers:
                            onChange : onChange,
                        },
                    )
                );
            })}
        </ConditionalList>
    );
};
export {
    VariantGroupsEditor,
    VariantGroupsEditor as default,
}
