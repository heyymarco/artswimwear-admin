// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    type SelectZoneEditorProps,
    SelectZoneEditor,
}                           from '@/components/editors/SelectZoneEditor'

// privates:
import {
    getCountryDisplay,
    countryList,
}                           from './utilities'
import {
    DummyInput,
}                           from './DummyInput'



// react components:
export interface SelectCountryEditorProps<TElement extends Element = HTMLButtonElement>
    extends
        // bases:
        Omit<SelectZoneEditorProps<TElement>,
            // values:
            |'valueOptions'
        >,
        Partial<Pick<SelectZoneEditorProps<TElement>,
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
        <SelectZoneEditor<TElement>
            // other props:
            {...restSelectDropdownEditorProps}
            
            
            
            // accessibilities:
            aria-label={ariaLabel}
            
            
            
            // values:
            valueOptions={valueOptions}
            valueToUi={valueToUi}
            // components:
            textEditorComponent={
                <DummyInput
                    // values:
                    valueToUi={valueToUi}
                />
            }
        />
    );
};
export {
    SelectCountryEditor,            // named export for readibility
    SelectCountryEditor as default, // default export to support React.lazy
}
