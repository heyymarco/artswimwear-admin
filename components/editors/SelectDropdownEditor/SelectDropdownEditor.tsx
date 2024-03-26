// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // layout-components:
    ListItemProps,
    ListItemComponentProps,
}                           from '@reusable-ui/list'                    // represents a series of content
import type {
    DropdownProps,
}                           from '@reusable-ui/dropdown'                // overlays contextual element such as lists, menus, and more
import {
    // menu-components:
    DropdownListExpandedChangeEvent,
    DropdownListButtonProps,
    DropdownListButton,
}                           from '@reusable-ui/dropdown-list-button'    // a button component with a dropdown list UI

// internal components:
import {
    SelectDropdownEditorItem,
}                           from './SelectDropdownEditorItem'

// heymarco:
import {
    // utilities:
    useControllable,
}                           from '@heymarco/events'

// internals:
import type {
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    ListItemWithClickHandler,
}                           from './ListItemWithClickHandler'



// react components:
export interface SelectDropdownEditorProps<TElement extends Element = HTMLElement, TValue extends any = string, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>
    extends
        // bases:
        Pick<EditorProps<TElement, TValue>,
            // values:
            |'value'
            |'onChange'
        >,
        Omit<DropdownListButtonProps<TDropdownListExpandedChangeEvent>,
            // values:
            |'value'
            |'onChange'
        >,
        ListItemComponentProps<Element>
{
    // values:
    valueOptions  : TValue[]
    valueToUi    ?: (value: TValue|null) => string
    
    value         : TValue
}
const SelectDropdownEditor = <TElement extends Element = HTMLElement, TValue extends any = string, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>(props: SelectDropdownEditorProps<TElement, TValue, TDropdownListExpandedChangeEvent>): JSX.Element|null => {
    // props:
    const {
        // values:
        valueOptions,
        valueToUi         = (value) => `${value}`,
        
        value             : controllableValue,
        onChange          : onControllableValueChange,
        
        
        
        // components:
        listItemComponent = (<SelectDropdownEditorItem /> as React.ReactComponentElement<any, ListItemProps<Element>>),
        
        
        
        // other props:
        ...restSelectDropdownEditorProps
    } = props;
    
    
    
    // states:
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllable<TValue>({
        value              : controllableValue,
        onValueChange      : onControllableValueChange,
    });
    
    
    
    // default props:
    const {
        // variants:
        floatingPlacement = 'bottom-end',     // defaults to 'bottom-end'
        
        
        
        // components:
        dropdownComponent,
        
        
        
        // children:
        buttonChildren    = valueToUi(value), // defaults to `valueToUi(value)`
        
        
        
        // other props:
        ...restDropdownListButtonProps
    } = restSelectDropdownEditorProps;
    
    const defaultChildren : React.ReactElement = <>
        {valueOptions.map((valueOption, index) => {
            // default props:
            const {
                // states:
                active   = Object.is(valueOption, value),
                
                
                
                // children:
                children = valueToUi(valueOption),
                
                
                
                // other props:
                ...restListItemProps
            } = listItemComponent.props;
            
            
            
            // jsx:
            return (
                <ListItemWithClickHandler
                    // identifiers:
                    key={index}
                    
                    
                    
                    // components:
                    listItemComponent={
                        React.cloneElement<ListItemProps<Element>>(listItemComponent,
                            // props:
                            {
                                // other props:
                                ...restListItemProps,
                                
                                
                                
                                // states:
                                active : active,
                            },
                            
                            
                            
                            // children:
                            children,
                        )
                    }
                    
                    
                    
                    // handlers:
                    onClick={(event) => {
                        // conditions:
                        if (event.defaultPrevented) return;
                        
                        
                        
                        // actions:
                        triggerValueChange(valueOption, { triggerAt: 'immediately' });
                    }}
                />
            );
        })}
    </>;
    
    const {
        // children:
        children : dropdownChildren = defaultChildren,
    } = dropdownComponent?.props ?? {};
    
    
    
    // jsx:
    return (
        <DropdownListButton<TDropdownListExpandedChangeEvent>
            // other props:
            {...restDropdownListButtonProps}
            
            
            
            // variants:
            floatingPlacement={floatingPlacement}
            
            
            
            // components:
            dropdownComponent={
                (dropdownComponent === undefined)
                ? undefined
                : React.cloneElement<DropdownProps<Element, TDropdownListExpandedChangeEvent>>(dropdownComponent,
                    // props:
                    undefined,
                    
                    
                    
                    // children:
                    dropdownChildren,
                )
            }
            
            
            
            // children:
            buttonChildren={buttonChildren}
        >
            {dropdownChildren}
        </DropdownListButton>
    );
};
export {
    SelectDropdownEditor,            // named export for readibility
    SelectDropdownEditor as default, // default export to support React.lazy
}
