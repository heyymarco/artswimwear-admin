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
    EventHandler,
    useMergeEvents,
    
    
    
    // a possibility of UI having an invalid state:
    ValidityChangeEvent,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    Group,
}                           from '@reusable-ui/components'              // groups a list of components as a single component
import {
    // menu-components:
    type DropdownListExpandedChangeEvent,
}                           from '@reusable-ui/dropdown-list-button'    // a button component with a dropdown list UI

// heymarco:
import {
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'

// internals:
import {
    // types:
    type EditorChangeEventHandler,
    
    
    
    // react components:
    type EditorProps,
    Editor,
}                           from '@/components/editors/Editor'
import {
    // react components:
    type SelectDropdownEditorProps,
    SelectDropdownEditor,
}                           from '@/components/editors/SelectDropdownEditor'



// react components:
export interface InputDropdownEditorProps<TElement extends Element = HTMLDivElement, TValue extends any = string, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>
    extends
        // bases:
        EditorProps<TElement, TValue>,
        Pick<SelectDropdownEditorProps<Element, TValue>,
            // values:
            |'valueOptions'
            |'valueToUi'
        >
{
    // validations:
    // customValidator ?: CustomValidatorHandler
}
const InputDropdownEditor = <TElement extends Element = HTMLDivElement, TValue extends any = string, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>(props: InputDropdownEditorProps<TElement, TValue, TDropdownListExpandedChangeEvent>): JSX.Element|null => {
    // props:
    const {
        // refs:
        elmRef,         // take, moved to <Editor>
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
        
        
        
        // values:
        valueOptions,   // take, moved to <SelectDropdownEditor>
        valueToUi,      // take, moved to <SelectDropdownEditor>
        
        defaultValue   : defaultUncontrollableValue = '' as TValue,
        value          : controllableValue,
        onChange       : onControllableValueChange,
        onChangeAsText : onControllableTextChange,
        
        
        
        // other props:
        ...restSelectDropdownEditorProps
    } = props;
    
    
    
    // states:
    const handleControllableValueChangeInternal = useEvent<EditorChangeEventHandler<TValue>>((newValue) => {
        // normalize: null => empty string, TValue => toString:
        onControllableTextChange?.((newValue !== null) ? `${newValue}` /* any TValue => toString */ : '' /* null => empty string */);
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
    } = useControllableAndUncontrollable<TValue>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : handleControllableValueChange,
    });
    
    
    
    // states:
    const [isValid, setIsValid] = useState<boolean|null>(null);
    
    
    
    // handlers:
    const handleValueChange = useEvent<EditorChangeEventHandler<TValue>>((newValue) => {
        triggerValueChange(newValue, { triggerAt: 'immediately' });
    });
    
    const handleValidationInternal = useEvent<EventHandler<ValidityChangeEvent>>(({isValid}) => {
        setIsValid(isValid);
    });
    const handleValidation = useMergeEvents(
        // preserves the original `onValidation`:
        props.onValidation,
        
        
        
        // states:
        handleValidationInternal,
    );
    
    
    
    // default props:
    const {
        // other props:
        ...restInputProps
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
            <Editor<TElement, TValue>
                // other props:
                {...restInputProps}
                
                
                
                // refs:
                elmRef={elmRef}
                
                
                
                // classes:
                className='fluid'
                
                
                
                // validations:
                // a "validation_event" callback (only called when [isValid === undefined]):
                onValidation       = {handleValidation}         // if [isValid === undefined] => uncontrollable => `useInvalidable()` => calls onValidation() => calls `useInputValidator()::handleValidation()` => mutates ValidityChangeEvent::isValid
                // // a "validation_override" function:
                // customValidator = {props.customValidator} // called by `useInputValidator()` when `handleInit()`|`handleChange()` => calls `validate()` => calls `customValidator()`
                
                
                
                // values:
                value              = {value}             // internally controllable
                onChange           = {handleValueChange} // internally controllable
            />
            <SelectDropdownEditor<Element, TValue>
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
                
                value              = {value}             // internally controllable
                onChange           = {handleValueChange} // internally controllable
            />
        </Group>
    );
};
export {
    InputDropdownEditor,            // named export for readibility
    InputDropdownEditor as default, // default export to support React.lazy
}
