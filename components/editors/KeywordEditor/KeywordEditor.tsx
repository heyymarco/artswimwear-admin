// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // layout-components:
    ListProps,
    List,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco core:
import {
    // types:
    type DraggedEvent,
}                           from '@heymarco/draggable'

// heymarco components:
import {
    // react components:
    type ListEditorProps,
    ListEditor,
}                           from '@heymarco/list-editor'



// react components:
export type EditorPosition = 'start'|'end'|'both'|'none'
export interface KeywordEditorProps<out TElement extends Element = HTMLElement, TValue extends unknown = string, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.KeyboardEvent<Element>|DraggedEvent<HTMLElement>>
    extends
        // bases:
        ListEditorProps<TElement, TValue, TChangeEvent>
{
}
const KeywordEditor = <TElement extends Element = HTMLElement, TValue extends unknown = string, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.KeyboardEvent<Element>|DraggedEvent<HTMLElement>>(props: KeywordEditorProps<TElement, TValue, TChangeEvent>): JSX.Element|null => {
    // props:
    const {
        // components:
        listComponent = (<List<TElement> orientation='inline' listStyle='island' /> as React.ReactElement<ListProps<TElement>>),
        
        
        
        // other props:
        ...restListEditorProps
    } = props;
    
    
    
    // jsx:
    return (
        <ListEditor<TElement, TValue, TChangeEvent>
            // other props:
            {...restListEditorProps satisfies NoForeignProps<typeof restListEditorProps, ListEditorProps<TElement, TValue, TChangeEvent>>}
            
            
            
            // components:
            listComponent={listComponent}
        />
    );
};
export {
    KeywordEditor,            // named export for readibility
    KeywordEditor as default, // default export to support React.lazy
}
