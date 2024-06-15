// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
    useMergeEvents,
    useMergeRefs,
    useMountedFlag,
    
    
    
    // a possibility of UI having an invalid state:
    ValidityChangeEvent,
    
    
    
    // basic variants of UI:
    useBasicVariantProps,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    Group,
}                           from '@reusable-ui/components'              // groups a list of components as a single component

// heymarco:
import {
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'

// internals:
import {
    // types:
    type EditorChangeEventHandler,
}                           from '@/components/editors/Editor'
import {
    // react components:
    type TextEditorProps,
    TextEditor,
}                           from '@/components/editors/TextEditor'
import {
    // react components:
    type SelectDropdownEditorProps,
    SelectDropdownEditor,
}                           from '@/components/editors/SelectDropdownEditor'



// react components:
export interface TextDropdownEditorProps<TElement extends Element = HTMLDivElement>
    extends
        // bases:
        TextEditorProps<TElement>,
        Pick<SelectDropdownEditorProps<Element, string>,
            // values:
            |'valueOptions'
            |'valueToUi'
        >
{
    // validations:
    // customValidator ?: CustomValidatorHandler
}
const TextDropdownEditor = <TElement extends Element = HTMLDivElement>(props: TextDropdownEditorProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // refs:
        elmRef,         // take, moved to <TextEditor>
        outerRef,       // take, moved to <Group>
        
        
        
        // identifiers:
        id,             // take, moved to <Group>
        
        
        
        // variants:
        size,           // take, moved to <Group>
        theme,          // take, moved to <Group>
        gradient,       // take, moved to <Group>
        outlined,       // take, moved to <Group>
        mild,           // take, moved to <Group>
        
        
        
        // classes:
        mainClass,      // take, moved to <Group>
        classes,        // take, moved to <Group>
        variantClasses, // take, moved to <Group>
        stateClasses,   // take, moved to <Group>
        className,      // take, moved to <Group>
        
        
        
        // styles:
        style,          // take, moved to <Group>
        
        
        
        // validations:
        onValidation,   // take, moved to <TextEditor>
        
        
        
        // values:
        valueOptions,   // take, moved to <SelectDropdownEditor>
        valueToUi,      // take, moved to <SelectDropdownEditor>
        
        defaultValue   : defaultUncontrollableValue = '',
        value          : controllableValue,
        onChange       : onControllableValueChange,
        onChangeAsText : onControllableTextChange,
        
        
        
        // other props:
        ...restSelectDropdownEditorProps
    } = props;
    
    
    
    // basic variant props:
    const basicVariantProps = useBasicVariantProps(props);
    
    
    
    // states:
    const handleControllableValueChangeInternal = useEvent<EditorChangeEventHandler<string>>((newValue) => {
        // normalize: null => empty string, string => string:
        onControllableTextChange?.((newValue !== null) ? newValue : '' /* null => empty string */);
    });
    const handleControllableValueChange         = useMergeEvents(
        // preserves the original `onCollapseEnd` from `props`:
        onControllableValueChange,
        
        
        
        // actions:
        handleControllableValueChangeInternal,
    );
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<string>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : handleControllableValueChange,
    });
    
    
    
    // states:
    const [isValid, setIsValid] = useState<boolean|null>(null);
    
    
    
    // refs:
    const inputRefInternal = useRef<HTMLInputElement|null>(null);
    const mergedInputRef   = useMergeRefs(
        // preserves the original `elmRef` from `props`:
        elmRef,
        
        
        
        inputRefInternal,
    );
    
    
    
    // effects:
    const isMounted = useMountedFlag();
    
    
    
    // handlers:
    const handleTextChange         = useEvent<EditorChangeEventHandler<string>>((newValue) => {
        triggerValueChange(newValue, { triggerAt: 'immediately' });
    });
    const handleDropdownChange     = useEvent<EditorChangeEventHandler<string>>((newValue) => {
        const inputElm = inputRefInternal.current;
        if (inputElm) {
            // react *hack*: trigger `onChange` event:
            const oldValue = inputElm.value;                     // react *hack* get_prev_value *before* modifying
            inputElm.value = newValue;                           // react *hack* set_value *before* firing `input` event
            (inputElm as any)._valueTracker?.setValue(oldValue); // react *hack* in order to React *see* the changes when `input` event fired
            
            
            
            // fire `input` native event to trigger `onChange` synthetic event:
            inputElm.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: false, composed: true, data: newValue, dataTransfer: null, inputType: 'insertText', isComposing: false, view: null, detail: 0 }));
        } // if
    });
    
    const handleValidationInternal = useEvent<EventHandler<ValidityChangeEvent>>(({isValid}) => {
        Promise.resolve().then(() => {
            // conditions:
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            
            
            
            // actions:
            setIsValid(isValid);
        });
    });
    const handleValidation         = useMergeEvents(
        // preserves the original `onValidation` from `props`:
        onValidation,
        
        
        
        // states:
        handleValidationInternal,
    );
    
    
    
    // default props:
    const {
        // other props:
        ...restTextEditorProps
    } = restSelectDropdownEditorProps;
    
    
    
    // jsx:
    return (
        <Group
            // refs:
            outerRef={outerRef}
            
            
            
            // identifiers:
            id={id}
            
            
            
            // variants:
            size={size}
            theme={theme}
            gradient={gradient}
            outlined={outlined}
            mild={mild}
            
            
            
            // classes:
            mainClass={mainClass}
            classes={classes}
            variantClasses={variantClasses}
            stateClasses={stateClasses}
            className={className}
            
            
            
            // styles:
            style={style}
        >
            <TextEditor<TElement>
                // other props:
                {...restTextEditorProps}
                
                
                
                // refs:
                elmRef={mergedInputRef}
                
                
                
                // classes:
                className='fluid'
                
                
                
                // validations:
                // a "validation_event" callback (only called when [isValid === undefined]):
                onValidation       = {handleValidation}         // if [isValid === undefined] => uncontrollable => `useInvalidable()` => calls onValidation() => calls `useInputValidator()::handleValidation()` => mutates ValidityChangeEvent::isValid
                // // a "validation_override" function:
                // customValidator = {props.customValidator} // called by `useInputValidator()` when `handleInit()`|`handleChange()` => calls `validate()` => calls `customValidator()`
                
                
                
                // values:
                value              = {value}            // internally controllable
                onChange           = {handleTextChange} // internally controllable
            />
            <SelectDropdownEditor<Element, string>
                // variants:
                {...basicVariantProps}
                
                
                
                // validations:
                enableValidation   = {props.enableValidation}  // follows <Editor>
                isValid            = {isValid}                 // controllable
                inheritValidation  = {props.inheritValidation} // follows <Editor>
                
                // // a "validation_event" callback (only called when [isValid === undefined]):
                // onValidation    = {undefined}
                // // a "validation_override" function:
                // customValidator = {undefined}
                
                
                
                // values:
                valueOptions       = {valueOptions}
                valueToUi          = {valueToUi}
                
                value              = {value}                // internally controllable
                onChange           = {handleDropdownChange} // internally controllable
                
                
                
                // children:
                buttonChildren={null}
            />
        </Group>
    );
};
export {
    TextDropdownEditor,            // named export for readibility
    TextDropdownEditor as default, // default export to support React.lazy
}
