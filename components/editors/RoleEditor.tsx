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
    RolePreviewProps,
}                           from '@/components/views/RolePreview'

// stores:
import type {
    // types:
    RoleDetail,
}                           from '@/store/features/api/apiSlice'



// react components:
interface RoleEditorProps<TElement extends Element = HTMLElement>
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
            
            
            
            // handlers:
            |'onCreate'
        >>
{
    // values:
    modelList             ?: EntityState<RoleDetail>
    
    
    
    // components:
    modelPreviewComponent  : React.ReactComponentElement<any, RolePreviewProps>
}
const RoleEditor = <TElement extends Element = HTMLElement>(props: RoleEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        modelList,
        
        defaultValue,
        value,
        onChange,
        
        
        
        // components:
        modelCreateComponent,
        modelPreviewComponent,
        
        
        
        // handlers:
        onCreate,
    ...restListProps} = props;
    
    const filteredModelList = !modelList ? undefined : Object.values(modelList.entities).filter((model): model is Exclude<typeof model, undefined> => !!model);
    const modelListWithNone : RoleDetail[] = [
        {
            id   : '',
            name : 'No Access',
        } as RoleDetail, // mock of 'No Access'
        ...(filteredModelList ?? []),
    ];
    
    
    
    // jsx:
    return (
        <List<TElement>
            // other props:
            {...restListProps}
        >
            {/* <ModelCreate> */}
            {!!modelCreateComponent  && <ModelCreateOuter
                // classes:
                className='solid'
                
                
                
                // accessibilities:
                createItemText='Add New Role'
                
                
                
                // components:
                modelCreateComponent={modelCreateComponent}
                
                
                
                // handlers:
                onCreate={onCreate}
            />}
            
            {modelListWithNone.map((model) =>
                /* <ModelPreview> */
                React.cloneElement<RolePreviewProps>(modelPreviewComponent,
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
            )}
        </List>
    );
};
export {
    RoleEditor,
    RoleEditor as default,
}
