// react:
import {
    // react:
    default as React,
}                           from 'react'

// cssfn:
import {
    // writes css in javascript:
    startsCapitalized,
}                           from '@cssfn/core'                  // writes css in javascript

// internal components:
import {
    type TextDropdownEditorProps,
    TextDropdownEditor,
}                           from '@/components/editors/TextDropdownEditor'



// react components:
export interface SelectZoneEditorProps<TElement extends Element = HTMLButtonElement>
    extends
        // bases:
        TextDropdownEditorProps<TElement>
{
    // data:
    modelName : string
}
const SelectZoneEditor = <TElement extends Element = HTMLButtonElement>(props: SelectZoneEditorProps<TElement>): JSX.Element|null => {
    // default props:
    const {
        // data:
        modelName,
        
        
        
        // accessibilities:
        'aria-label' : ariaLabel = `Select ${startsCapitalized(modelName)}`,
        
        
        
        // other props:
        ...restTextDropdownEditorProps
    } = props;
    
    
    
    // jsx:
    return (
        <TextDropdownEditor<TElement>
            // other props:
            {...restTextDropdownEditorProps}
            
            
            
            // accessibilities:
            aria-label={ariaLabel}
        />
    );
};
export {
    SelectZoneEditor,            // named export for readibility
    SelectZoneEditor as default, // default export to support React.lazy
}