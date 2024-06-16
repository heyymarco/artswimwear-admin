// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
    useEffect,
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
    type DropdownListExpandedChangeEvent,
}                           from '@reusable-ui/dropdown-list'           // overlays a list element (menu)
import {
    // react components:
    Group,
}                           from '@reusable-ui/group'                   // groups a list of components as a single component

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
            // // // ONLY NECESSARY props:
            // // // variants:
            // // |'buttonStyle'
            // // |'orientation' // the orientation of <Dropdown> __relative_to__ <Button>
            // // 
            // values:
            |'valueOptions'
            |'valueToUi'
            // // // ONLY NECESSARY props:
            // // 
            // // // states:
            // // |'defaultExpanded'
            // // |'expanded'
            // // |'onExpandedChange'
            // // 
            // // |'onExpandStart'
            // // |'onCollapseStart'
            // // |'onExpandEnd'
            // // |'onCollapseEnd'
            // // 
            // // // floatable:
            // // |'floatingRef'
            // // 
            // // |'floatingOn'
            // // // |'floatingFriends'
            // // |'floatingPlacement'
            // // |'floatingMiddleware'
            // // |'floatingStrategy'
            // // 
            // // |'floatingAutoFlip'
            // // |'floatingAutoShift'
            // // |'floatingOffset'
            // // |'floatingShift'
            // // 
            // // |'onFloatingUpdate'
            // // 
            // // // global stackable:
            // // |'viewport'
            // // 
            // // // auto focusable:
            // // |'autoFocusOn'
            // // |'restoreFocusOn'
            // // |'autoFocus'
            // // |'restoreFocus'
            // // |'autoFocusScroll'
            // // |'restoreFocusScroll'
            
            // components:
            |'buttonRef'
            |'buttonOrientation'
            |'buttonComponent'
            |'buttonChildren'
            |'toggleButtonComponent'
            |'dropdownRef'
            |'dropdownOrientation'
            |'dropdownComponent'
            |'listRef'
            |'listOrientation'
            |'listStyle'
            |'listComponent'
            |'listItemComponent'
            |'editableButtonComponent'
        >
{
    // behaviors:
    showDropdownOnFocus ?: boolean
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
        
        
        
        // values:
        valueOptions,   // take, moved to <SelectDropdownEditor>
        valueToUi,      // take, moved to <SelectDropdownEditor>
        
        defaultValue   : defaultUncontrollableValue = '',
        value          : controllableValue,
        onChange       : onControllableValueChange,
        onChangeAsText : onControllableTextChange,
        
        
        
        // validations:
        onValidation,   // take, moved to <TextEditor>
        
        
        
        // behaviors:
        showDropdownOnFocus = true,
        
        
        
        // components:
        buttonRef,                                         // take, moved to <SelectDropdownEditor>
        buttonOrientation,                                 // take, moved to <SelectDropdownEditor>
        buttonComponent,                                   // take, moved to <SelectDropdownEditor>
        buttonChildren = null /* remove text on button */, // take, moved to <SelectDropdownEditor>
        toggleButtonComponent,                             // take, moved to <SelectDropdownEditor>
        dropdownRef,                                       // take, moved to <SelectDropdownEditor>
        dropdownOrientation,                               // take, moved to <SelectDropdownEditor>
        dropdownComponent,                                 // take, moved to <SelectDropdownEditor>
        listRef,                                           // take, moved to <SelectDropdownEditor>
        listOrientation,                                   // take, moved to <SelectDropdownEditor>
        listStyle,                                         // take, moved to <SelectDropdownEditor>
        listComponent,                                     // take, moved to <SelectDropdownEditor>
        listItemComponent,                                 // take, moved to <SelectDropdownEditor>
        editableButtonComponent,                           // take, moved to <SelectDropdownEditor>
        
        
        
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
    const [autoShowDropdown, setAutoShowDropdown] = useState<boolean>(false);
    
    
    
    // refs:
    const inputRefInternal    = useRef<HTMLInputElement|null>(null);
    const mergedInputRef      = useMergeRefs(
        // preserves the original `elmRef` from `props`:
        elmRef,
        
        
        
        inputRefInternal,
    );
    
    const outerRefInternal    = useRef<TElement|null>(null);
    const mergedOuterRef      = useMergeRefs(
        // preserves the original `outerRef` from `props`:
        outerRef,
        
        
        
        outerRefInternal,
    );
    
    const dropdownRefInternal = useRef<Element|null>(null);
    const mergedDropdownRef   = useMergeRefs(
        // preserves the original `dropdownRef` from `props`:
        dropdownRef,
        
        
        
        dropdownRefInternal,
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
    
    const handleTextFocus          = useEvent<React.FocusEventHandler<TElement>>((event) => {
        setAutoShowDropdown(true);
    });
    
    const handleExpandedChange     = useEvent<EventHandler<DropdownListExpandedChangeEvent<string>>>(({expanded}) => {
        setAutoShowDropdown(expanded);
    });
    
    
    
    // effects:
    useEffect(() => {
        // conditions:
        if (!autoShowDropdown) return; // ignore if not shown
        
        
        
        // handlers:
        const handleMouseDown = (event: MouseEvent): void => {
            // conditions:
            if (event.button !== 0) return; // only handle left click
            
            
            
            // although clicking on page won't change the focus, but we decided this event as lost focus on <Dropdown>:
            handleFocus({ target: event.target } as FocusEvent);
        };
        const handleFocus     = (event: FocusEvent): void => {
            const focusedTarget = event.target;
            if (!focusedTarget) return;
            
            
            
            if (focusedTarget instanceof Element) {
                if (outerRefInternal.current?.contains(focusedTarget))    return; // consider still focus if has focus inside <Group>
                if (dropdownRefInternal.current?.contains(focusedTarget)) return; // consider still focus if has focus inside <Dropdown>
            } // if
            setAutoShowDropdown(false);
        };
        
        
        
        // setups:
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('focus'    , handleFocus    , { capture: true }); // force `focus` as bubbling
        
        
        
        // cleanups:
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('focus'    , handleFocus    , { capture: true });
        };
    }, [autoShowDropdown]);
    
    
    
    // default props:
    const {
        // other props:
        ...restTextEditorProps
    } = restSelectDropdownEditorProps;
    
    
    
    // jsx:
    return (
        <Group<TElement>
            // refs:
            outerRef={mergedOuterRef}
            
            
            
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
                
                
                
                // values:
                value              = {value}            // internally controllable
                onChange           = {handleTextChange} // internally controllable
                
                
                
                // validations:
                // a "validation_event" callback (only called when [isValid === undefined]):
                onValidation       = {handleValidation}         // if [isValid === undefined] => uncontrollable => `useInvalidable()` => calls onValidation() => calls `useInputValidator()::handleValidation()` => mutates ValidityChangeEvent::isValid
                // // a "validation_override" function:
                // customValidator = {props.customValidator} // called by `useInputValidator()` when `handleInit()`|`handleChange()` => calls `validate()` => calls `customValidator()`
                
                
                
                // handlers:
                onFocus={handleTextFocus}
            />
            <SelectDropdownEditor<Element, string>
                // variants:
                {...basicVariantProps}
                
                
                
                // values:
                valueOptions       = {valueOptions}
                valueToUi          = {valueToUi}
                
                value              = {value}                // internally controllable
                onChange           = {handleDropdownChange} // internally controllable
                
                
                
                // validations:
                enableValidation   = {props.enableValidation}  // follows <Editor>
                isValid            = {isValid}                 // controllable
                inheritValidation  = {props.inheritValidation} // follows <Editor>
                
                // // a "validation_event" callback (only called when [isValid === undefined]):
                // onValidation    = {undefined}
                // // a "validation_override" function:
                // customValidator = {undefined}
                
                
                
                // states:
                expanded={autoShowDropdown}
                onExpandedChange={handleExpandedChange}
                
                
                
                // floatable:
                floatingOn={outerRefInternal}
                
                
                
                // auto focusable:
                autoFocus={autoShowDropdown ? false : undefined} // do not autoFocus when autoExpanded, otherwise do autoFocus}
                
                
                
                // components:
                buttonRef={buttonRef}
                buttonOrientation={buttonOrientation}
                buttonComponent={buttonComponent}
                buttonChildren={buttonChildren}
                toggleButtonComponent={toggleButtonComponent}
                dropdownRef={mergedDropdownRef}
                dropdownOrientation={dropdownOrientation}
                dropdownComponent={dropdownComponent}
                listRef={listRef}
                listOrientation={listOrientation}
                listStyle={listStyle}
                listComponent={listComponent}
                listItemComponent={listItemComponent}
                editableButtonComponent={editableButtonComponent}
            />
        </Group>
    );
};
export {
    TextDropdownEditor,            // named export for readibility
    TextDropdownEditor as default, // default export to support React.lazy
}
