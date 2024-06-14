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
    getCountryDisplay,
    countryList,
}                           from './utilities'



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
        valueOptions = countryList,
        valueToUi    = getCountryDisplay,
        
        
        
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
