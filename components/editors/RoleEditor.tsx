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
        Partial<Omit<ModelCreateOuterProps, keyof ListItemProps>>
{
    // values:
    roleList              ?: EntityState<RoleDetail>
    
    
    
    // components:
    modelPreviewComponent  : (model: RoleDetail) => React.ReactComponentElement<any, RolePreviewProps>
}
const RoleEditor = <TElement extends Element = HTMLElement>(props: RoleEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        roleList,
        
        defaultValue,
        value,
        onChange,
        
        
        
        // components:
        modelCreateComponent,
        modelPreviewComponent : modelPreviewComponentFn,
        
        
        
        // handlers:
        onCreate,
    ...restListProps} = props;
    
    const filteredRoleList = !roleList ? undefined : Object.values(roleList.entities).filter((roleEntry): roleEntry is Exclude<typeof roleEntry, undefined> => !!roleEntry);
    const roleListWithNone : RoleDetail[] = [
        {
            id   : '',
            name : 'No Access',
        } as RoleDetail, // mock of 'No Access'
        ...(filteredRoleList ?? []),
    ];
    
    
    
    // jsx:
    return (
        <List<TElement>
            // other props:
            {...restListProps}
        >
            {/* <ModelCreate> */}
            {!!modelCreateComponent  && <ModelCreateOuter className='solid' createItemText='Add New Role' modelCreateComponent={modelCreateComponent} onCreate={onCreate} />}
            
            {roleListWithNone.map((model) => {
                const modelPreviewComponent = modelPreviewComponentFn(model);
                // jsx:
                return (
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
                );
            })}
        </List>
    );
};
export {
    RoleEditor,
    RoleEditor as default,
}
