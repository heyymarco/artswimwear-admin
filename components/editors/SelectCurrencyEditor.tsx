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

// configs:
import {
    commerceConfig,
}                           from '@/commerce.config'



// react components:
export interface SelectCurrencyEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        SelectDropdownEditorProps<TElement, string>
{
}
const SelectCurrencyEditor = <TElement extends Element = HTMLElement>(props: SelectCurrencyEditorProps<TElement>): JSX.Element|null => {
    // default props:
    const {
        // values:
        valueOptions = Object.keys(commerceConfig.currencies), // defaults to currencies in config
        
        
        
        // other props:
        ...restSelectDropdownEditorProps
    } = props;
    
    
    
    // jsx:
    return (
        <SelectDropdownEditor<TElement, string>
            // other props:
            {...restSelectDropdownEditorProps}
            
            
            
            // values:
            valueOptions={valueOptions}
        />
    );
};
export {
    SelectCurrencyEditor,            // named export for readibility
    SelectCurrencyEditor as default, // default export to support React.lazy
}
