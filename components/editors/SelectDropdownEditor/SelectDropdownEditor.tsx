// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // layout-components:
    ListItemProps,
    ListItem,
    ListItemComponentProps,
    
    
    
    // menu-components:
    DropdownListExpandedChangeEvent,
    DropdownListButtonProps,
    DropdownListButton,
}                           from '@reusable-ui/components'

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
interface SelectDropdownEditorProps<TElement extends Element = HTMLElement, TValue extends any = string, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>
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
    valueToText  ?: (value: TValue|null) => string
    
    value         : TValue
}
const SelectDropdownEditor = <TElement extends Element = HTMLElement, TValue extends any = string, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>(props: SelectDropdownEditorProps<TElement, TValue, TDropdownListExpandedChangeEvent>): JSX.Element|null => {
    // props:
    const {
        // values:
        valueOptions,
        valueToText   = (value) => `${value}`,
        
        value         : controllableValue,
        onChange      : onControllableValueChange,
        
        
        
        // components:
        listItemComponent = (<ListItem /> as React.ReactComponentElement<any, ListItemProps<Element>>),
        
        
        
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
        // children:
        buttonChildren = valueToText(value),
        
        
        
        // other props:
        ...restDropdownListButtonProps
    } = restSelectDropdownEditorProps;
    
    
    
    // jsx:
    return (
        <DropdownListButton<TDropdownListExpandedChangeEvent>
            // other props:
            {...restDropdownListButtonProps}
            
            
            
            // children:
            buttonChildren={buttonChildren}
        >
            {valueOptions.map((valueOption, index) => {
                // default props:
                const {
                    // states:
                    active   = Object.is(valueOption, value),
                    
                    
                    
                    // children:
                    children = valueToText(valueOption),
                    
                    
                    
                    // other props:
                    ...restListItemProps
                } = listItemComponent.props;
                
                
                
                // jsx:
                return (
                    <ListItemWithClickHandler
                        // components:
                        listItemComponent={
                            React.cloneElement<ListItemProps<Element>>(listItemComponent,
                                // props:
                                {
                                    // other props:
                                    ...restListItemProps,
                                    
                                    
                                    
                                    // identifiers:
                                    key    : index,
                                    
                                    
                                    
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
        </DropdownListButton>
    )
};
export {
    SelectDropdownEditor,
    SelectDropdownEditor as default,
}
