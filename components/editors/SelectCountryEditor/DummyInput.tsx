// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useMergeEvents,
    useMergeRefs,
    
    
    
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



// handlers:
const handleChangeDummy : React.ChangeEventHandler<HTMLInputElement> = (_event) => {
    /* nothing to do */
};



// react components:
export interface DummyInputProps<TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        InputProps<TElement>,
        
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
        outerRef,
        
        
        
        // accessibilities:
        autoFocus,
        enterKeyHint,
        
        
        
        // forms:
        name,
        form,
        
        
        
        // values:
        valueToUi,
        defaultValue,
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
    
    
    
    // handlers:
    const handleChange = useMergeEvents(
        // preserves the original `onChange`:
        onChange,
        
        
        
        // dummy:
        handleChangeDummy, // just for satisfying React of controllable <input>
    );
    
    
    
    // refs:
    const inputRefInternal = useRef<HTMLInputElement|null>(null);
    const mergedInputRef   = useMergeRefs(
        // preserves the original `elmRef` from `props`:
        elmRef,
        
        
        
        inputRefInternal,
    );
    
    const outerRefInternal = useRef<TElement|null>(null);
    const mergedOuterRef   = useMergeRefs(
        // preserves the original `outerRef` from `props`:
        outerRef,
        
        
        
        outerRefInternal,
    );
    
    
    
    // effects:
    useIsomorphicLayoutEffect(() => {
        // conditions:
        const inputElm = inputRefInternal.current;
        const dummyElm = outerRefInternal.current;
        if (!inputElm) return;
        if (!dummyElm) return;
        
        
        
        // setups:
        const backupOriginFocusFunc = inputElm.focus;
        inputElm.focus = (options?: FocusOptions) => {
            const dummyFocus = (dummyElm as unknown as HTMLElement)?.focus;
            if (!dummyFocus) return;
            dummyFocus.call(/* this: */dummyElm, options);
        };
        
        
        
        // celanups:
        return () => {
            inputElm.focus = backupOriginFocusFunc;
        };
    }, []);
    
    
    
    // default props:
    const {
        // semantics:
        tag                = 'span',
        
        
        
        // states:
        assertiveFocusable = true,
        
        
        
        // other props:
        ...restEditableControlProps
    } = restDummyInputProps;
    
    
    
    // jsx:
    return (
        <EditableControl<TElement>
            // other props:
            {...restEditableControlProps}
            
            
            
            // refs:
            outerRef={mergedOuterRef}
            
            
            
            // semantics:
            tag={tag}
            
            
            
            // classes:
            // mainClass={props.mainClass ?? styleSheet.main}
            
            
            
            // states:
            assertiveFocusable={assertiveFocusable}
        >
            <input
                // refs:
                ref={mergedInputRef}
                
                
                
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
                    defaultValue,
                    value,
                    onChange : handleChange,
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
