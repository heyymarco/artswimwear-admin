// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    SelectDropdownEditorProps,
    SelectDropdownEditor,
}                           from '@/components/editors/SelectDropdownEditor'

// privates:
import {
    default as defaultCountryMap
}                           from './defaultCountryMap'



// utilities:
const defaultValueToUi   = (value: string|null): string => (value ? defaultCountryMap.get(value) : undefined) ?? 'Select Country';
const defaultCountryList = Array.from(defaultCountryMap.keys());



// react components:
export interface SelectCountryEditorProps<TElement extends Element = HTMLButtonElement>
    extends
        // bases:
        Omit<SelectDropdownEditorProps<TElement, string>,
            // values:
            |'valueOptions'
        >,
        Partial<Pick<SelectDropdownEditorProps<TElement, string>,
            // values:
            |'valueOptions'
        >>
{
}
const SelectCountryEditor = <TElement extends Element = HTMLButtonElement>(props: SelectCountryEditorProps<TElement>): JSX.Element|null => {
    // default props:
    const {
        // accessibilities:
        'aria-label' : ariaLabel = 'Select Country',
        
        
        
        // values:
        valueOptions = defaultCountryList,
        valueToUi    = defaultValueToUi,
        
        
        
        // other props:
        ...restSelectDropdownEditorProps
    } = props;
    
    
    
    // jsx:
    return (
        <SelectDropdownEditor<TElement, string>
            // other props:
            {...restSelectDropdownEditorProps}
            
            
            
            // accessibilities:
            aria-label={ariaLabel}
            
            
            
            // values:
            valueOptions={valueOptions}
            valueToUi={valueToUi}
        />
    );
};
export {
    SelectCountryEditor,            // named export for readibility
    SelectCountryEditor as default, // default export to support React.lazy
}
