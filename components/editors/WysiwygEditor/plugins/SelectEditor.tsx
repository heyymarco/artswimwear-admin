// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeEvents,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

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
    possibleValues ?: (TValue|null)[]
    valueToText    ?: (value: TValue|null) => string
}
const SelectEditor = <TElement extends Element = HTMLElement, TValue extends any = string>(props: SelectEditorProps<TElement, TValue>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        defaultValue,
        value,
        onChange,
        
        possibleValues = [],
        valueToText    = (value) => `${value}`,
    ...restDropdownListButtonProps} = props;
    
    
    
    // states:
    const isControllableValue = (value !== undefined);
    const [valueDn, setValueDn] = useState<TValue|null>(defaultValue ?? null);
    const valueFn : TValue|null = ((value !== undefined) /*controllable*/ ? value : valueDn /*uncontrollable*/);
    
    
    
    // handlers:
    const handleChangeInternal = useEvent((value: TValue|null) => {
        // update state:
        if (!isControllableValue) setValueDn(value);
    });
    const handleChange         = useMergeEvents(
        // preserves the original `onChange` from `props`:
        onChange,
        
        
        
        // actions:
        handleChangeInternal,
    );
    
    
    
    // events:
    const triggerChange = useEvent((value: TValue|null): void => {
        // fire `onChange` react event:
        handleChange?.(value);
    });
    
    
    
    // jsx:
    return (
        <DropdownListButton
            // other props:
            {...restDropdownListButtonProps}
            
            
            
            // children:
            buttonChildren={valueToText(valueFn)}
        >
            {possibleValues.map((possibleValue, index) =>
                <ListItem
                    // identifiers:
                    key={index}
                    
                    
                    
                    // accessibilities:
                    active={(possibleValue === valueFn)}
                    
                    
                    
                    // handlers:
                    onClick={() => triggerChange(possibleValue)}
                >
                    {valueToText(possibleValue)}
                </ListItem>
            )}
        </DropdownListButton>
    );
};
export {
    SelectEditor,
    SelectEditor as default,
}
