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
}                           from '@/components/explorers/PaginationList'
import type {
    RolePreviewProps,
}                           from '@/components/views/RolePreview'

// models:
import {
    type RoleDetail,
}                           from '@/models'



// react components:
interface RoleEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Pick<EditorProps<TElement, string|null>,
            // values:
            // |'defaultValue' // not supported, controllable only
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
        Partial<Pick<ModelCreateOuterProps<RoleDetail>,
            // components:
            |'modelCreateComponent'
            
            
            
            // handlers:
            |'onModelCreate'
        >>
{
    // values:
    valueOptions          ?: EntityState<RoleDetail>
    
    
    
    // components:
    modelPreviewComponent  : React.ReactComponentElement<any, RolePreviewProps>
}
const RoleEditor = <TElement extends Element = HTMLElement>(props: RoleEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        valueOptions,
        
        // defaultValue, // not supported, controllable only
        value,
        onChange,
        
        
        
        // components:
        modelCreateComponent,
        modelPreviewComponent,
        
        
        
        // handlers:
        onModelCreate,
        
        
        
        // other props:
        ...restListProps
    } = props;
    
    const filteredValueOptions = !valueOptions ? undefined : Object.values(valueOptions.entities).filter((model): model is Exclude<typeof model, undefined> => !!model);
    const valueOptionsWithNone : RoleDetail[] = [
        {
            id   : '',
            name : 'No Access',
        } as RoleDetail, // mock of 'No Access'
        ...(filteredValueOptions ?? []),
    ];
    
    
    
    // jsx:
    return (
        <List<TElement>
            // other props:
            {...restListProps}
        >
            {/* <ModelCreate> */}
            {!!modelCreateComponent  && <ModelCreateOuter<RoleDetail>
                // classes:
                className='solid'
                
                
                
                // accessibilities:
                createItemText='Add New Role'
                
                
                
                // components:
                modelCreateComponent={modelCreateComponent}
                
                
                
                // handlers:
                onModelCreate={onModelCreate}
            />}
            
            {valueOptionsWithNone.map((modelOption) =>
                /* <ModelPreview> */
                React.cloneElement<RolePreviewProps>(modelPreviewComponent,
                    // props:
                    {
                        // identifiers:
                        key           : modelPreviewComponent.key          ?? modelOption.id,
                        
                        
                        
                        // data:
                        model         : modelPreviewComponent.props.model  ?? modelOption,
                        
                        
                        
                        // states:
                        active        : modelPreviewComponent.props.active ?? ((value ?? '') === modelOption.id),
                        
                        
                        
                        // handlers:
                        onModelChange : onChange,
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
