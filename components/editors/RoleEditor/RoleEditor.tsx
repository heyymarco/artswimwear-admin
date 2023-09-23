// react:
import {
    // react:
    default as React,
}                           from 'react'

// redux:
import type {
    EntityState
}                           from '@reduxjs/toolkit'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    useMergeEvents,
    useMergeClasses,
    useMountedFlag,
    useScheduleTriggerEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
    
    
    
    // layout-components:
    ListItem,
    ListProps,
    List,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internals:
import type {
    // types:
    EditorChangeEventHandler,
    
    
    
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    // react components:
    RadioDecorator,
}                           from '@/components/RadioDecorator'



// styles:
export const useRoleEditorStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'w9jt10v10e' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// types:
export interface RoleEntry {
    id   : string
    name : string
}



// react components:
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
        >
{
    // values:
    roleList ?: EntityState<RoleEntry>
}
const RoleEditor = <TElement extends Element = HTMLElement>(props: RoleEditorProps<TElement>): JSX.Element|null => {
    // styles:
    const styleSheet = useRoleEditorStyleSheet();
    
    
    
    // rest props:
    const {
        // values:
        roleList,
        
        defaultValue,
        value,
        onChange,
    ...restListProps} = props;
    
    const filteredRoleList = !roleList ? undefined : Object.values(roleList.entities).filter((roleEntry): roleEntry is Exclude<typeof roleEntry, undefined> => !!roleEntry);
    const roleListWithNone = [
        {
            id   : null,
            name : 'No Access User',
        },
        ...(filteredRoleList ?? []),
    ];
    
    
    
    // jsx:
    return (
        <List<TElement>
            // other props:
            {...restListProps}
        >
            <ListItem className={styleSheet.createData} actionCtrl={false}>
                <ButtonIcon icon='create' onClick={undefined}>
                    Add New Role
                </ButtonIcon>
            </ListItem>
            
            {roleListWithNone.map(({id, name}) =>
                <ListItem
                    // identifiers:
                    key={id}
                    
                    
                    
                    // classes:
                    className={styleSheet.listDataInner}
                    
                    
                    
                    // behaviors:
                    actionCtrl={true}
                    
                    
                    
                    // states:
                    active={id === value}
                    
                    
                    
                    // handlers:
                    onClick={() => onChange?.(id)}
                >
                    <RadioDecorator />
                    {!!id ? name : <span className='noValue'>No Access User</span>}
                </ListItem>
            )}
        </List>
    );
};
export {
    RoleEditor,
    RoleEditor as default,
}
