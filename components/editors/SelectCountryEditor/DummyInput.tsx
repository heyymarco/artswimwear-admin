// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // an accessibility management system:
    usePropEnabled,
    usePropReadOnly,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    EditableControl,
}                           from '@reusable-ui/editable-control'        // a base editable UI (with validation indicator) of Reusable-UI components
import {
    // react components:
    type InputProps,
}                           from '@reusable-ui/input'                   // an interactive control in order to accept data from the user

// internal components:
import {
    type SelectZoneEditorProps,
}                           from '@/components/editors/SelectZoneEditor'



// react components:
export interface DummyInputProps<TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        Omit<InputProps<TElement>,
            // values:
            |'defaultValue' // changed to controllable
        >,
        
        // values:
        Required<Pick<SelectZoneEditorProps<TElement>,
            |'valueToUi'
        >>
{
    value ?: string // disallow number as value
}
const DummyInput = <TElement extends Element = HTMLSpanElement>(props: DummyInputProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // refs:
        elmRef,
        
        
        
        // accessibilities:
        autoFocus,
        enterKeyHint,
        
        
        
        // forms:
        name,
        form,
        
        
        
        // values:
        valueToUi,
        value,
        onChange, // forwards to `input[type]`
        
        
        
        // validations:
        required,
        
        minLength,
        maxLength,
        
        min,
        max,
        step,
        pattern,
        
        
        
        // formats:
        type,
        placeholder,
        autoComplete,
        autoCapitalize,
        list,
        inputMode,
        
        
        
        // other props:
        ...restDummyInputProps
    } = props;
    
    
    
    // fn props:
    const propEnabled  = usePropEnabled(props);
    const propReadOnly = usePropReadOnly(props);
    
    
    
    // default props:
    const {
        // semantics:
        tag = 'span',
        
        
        
        // other props:
        ...restEditableControlProps
    } = restDummyInputProps;
    
    
    
    // jsx:
    return (
        <EditableControl<TElement>
            // other props:
            {...restEditableControlProps}
            
            
            
            // semantics:
            tag={tag}
            
            
            
            // classes:
            // mainClass={props.mainClass ?? styleSheet.main}
        >
            <input
                // refs:
                ref={elmRef}
                
                
                
                // accessibilities:
                {...{
                    autoFocus,
                    tabIndex : -1, // makes non focusable (except programatically)
                    enterKeyHint,
                }}
                
                disabled={!propEnabled} // do not submit the value if disabled
                readOnly={propReadOnly} // locks the value & no validation if readOnly
                
                
                
                // forms:
                {...{
                    name,
                    form,
                }}
                
                
                
                // values:
                {...{
                    value,
                    onChange,
                }}
                
                
                
                // validations:
                {...{
                    required,
                    
                    minLength,
                    maxLength,
                    
                    min,
                    max,
                    step,
                    pattern,
                }}
                
                
                
                // formats:
                {...{
                    type,
                    placeholder,
                    autoComplete,
                    autoCapitalize,
                    list,
                    inputMode,
                }}
            />
            
            {valueToUi(value ?? null)}
        </EditableControl>
    );
};
export {
    DummyInput,            // named export for readibility
    DummyInput as default, // default export to support React.lazy
}
