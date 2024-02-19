// react:
import {
    // react:
    default as React,
}                           from 'react'

// heymarco:
import {
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'

// reusable-ui components:
import type {
    // react components:
    GenericProps,
}                           from '@reusable-ui/generic'         // an unstyled basic building block of Reusable-UI components
import type {
    // react components:
    IndicatorProps,
}                           from '@reusable-ui/indicator'       // a base indicator control of Reusable-UI components

// internals:
import type {
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    // react components:
    DropdownListButtonProps,
    DropdownListButton,
    ListItem,
}                           from '@reusable-ui/dropdown-list-button'



// react components:
export type BasicSelectEditorProps<TElement extends Element = HTMLElement, TValue extends any = string> =
    &Pick<EditorProps<TElement, TValue|null>,
        // values:
        |'defaultValue'
        |'value'
        |'onChange'
    >
    &Omit<IndicatorProps<TElement>,
        |keyof GenericProps
    >
export interface SelectEditorProps<TElement extends Element = HTMLElement, TValue extends any = string>
    extends
        // bases:
        Omit<DropdownListButtonProps,
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
        >,
        BasicSelectEditorProps<TElement, TValue>
{
    // values:
    valueOptions ?: (TValue|null)[]
    valueToText  ?: (value: TValue|null) => string
}
const SelectEditor = <TElement extends Element = HTMLElement, TValue extends any = string>(props: SelectEditorProps<TElement, TValue>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        defaultValue : defaultUncontrollableValue = null,
        value        : controllableValue,
        onChange     : onControllableValueChange,
        
        valueOptions = [],
        valueToText  = (value) => `${value}`,
    ...restDropdownListButtonProps} = props;
    
    
    
    // states:
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<TValue|null>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onControllableValueChange,
    });
    
    
    
    // jsx:
    return (
        <DropdownListButton
            // other props:
            {...restDropdownListButtonProps}
            
            
            
            // children:
            buttonChildren={valueToText(value)}
        >
            {valueOptions.map((valueOption, index) =>
                <ListItem
                    // identifiers:
                    key={index}
                    
                    
                    
                    // accessibilities:
                    active={(valueOption === value)}
                    
                    
                    
                    // handlers:
                    onClick={() => triggerValueChange(valueOption, { triggerAt: 'immediately' })}
                >
                    {valueToText(valueOption)}
                </ListItem>
            )}
        </DropdownListButton>
    );
};
export {
    SelectEditor,
    SelectEditor as default,
}
