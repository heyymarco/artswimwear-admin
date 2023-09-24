// react:
import {
    // react:
    default as React,
}                           from 'react'

// redux:
import type {
    EntityState
}                           from '@reduxjs/toolkit'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // layout-components:
    ListItemProps,
    ListProps,
    List,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import type {
    // types:
    EditorChangeEventHandler,
    
    
    
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    ModelCreateOuterProps,
    ModelCreateOuter,
    
    ModelPreviewProps,
}                           from '@/components/SectionModelEditor'



// types:
export interface RoleEntry {
    id   : string
    name : string
}



// react components:
export type RolePreviewProps = Omit<ModelPreviewProps<RoleEntry, Element>, 'onChange'> & { onChange ?: EditorChangeEventHandler<string|null> }
interface RoleEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Pick<EditorProps<TElement, string|null>,
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
        >,
        Omit<ListProps<TElement>,
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
            
            
            
            // children:
            |'children'                // already taken over
        >,
        // data:
        Partial<Omit<ModelCreateOuterProps, keyof ListItemProps>>
{
    // values:
    roleList              ?: EntityState<RoleEntry>
    
    
    
    // components:
    modelPreviewComponent  : React.ReactComponentElement<any, RolePreviewProps>
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
        modelPreviewComponent,
    ...restListProps} = props;
    
    const filteredRoleList = !roleList ? undefined : Object.values(roleList.entities).filter((roleEntry): roleEntry is Exclude<typeof roleEntry, undefined> => !!roleEntry);
    const roleListWithNone = [
        {
            id   : '',
            name : 'No Access',
        },
        ...(filteredRoleList ?? []),
    ];
    
    
    
    // jsx:
    return (
        <List<TElement>
            // other props:
            {...restListProps}
        >
            {/* <ModelCreate> */}
            {!!modelCreateComponent  && <ModelCreateOuter className='solid' createItemText='Add New Role' modelCreateComponent={modelCreateComponent} />}
            
            {roleListWithNone.map((model) =>
                /* <ModelPreview> */
                React.cloneElement<RolePreviewProps>(modelPreviewComponent,
                    // props:
                    {
                        // identifiers:
                        key      : modelPreviewComponent.key         ?? model.id,
                        
                        
                        
                        // data:
                        model    : modelPreviewComponent.props.model ?? model,
                        
                        
                        
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
