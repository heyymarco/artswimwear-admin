// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    useMergeEvents,
    useMergeClasses,
    
    
    
    // an accessibility management system:
    usePropEnabled,
    usePropReadOnly,
    
    
    
    // basic variants of UI:
    useBasicVariantProps,
    
    
    
    // a possibility of UI having an invalid state:
    useInvalidable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import type {
    // react components:
    BasicProps,
}                           from '@reusable-ui/basic'           // a styled basic building block of Reusable-UI components
import type {
    // react components:
    IndicatorProps,
}                           from '@reusable-ui/indicator'       // a base component
import {
    // react components:
    Group,
}                           from '@reusable-ui/group'           // a base component

// lexical functions:
import {
    // types:
    InitialConfigType,
    
    
    
    // react components:
    LexicalComposer,
}                           from '@lexical/react/LexicalComposer'
import {
    // adds support for history stack management and undo / redo commands.
    HistoryPlugin,
}                           from '@lexical/react/LexicalHistoryPlugin'

// behaviors:
import {
    AutoFocusPlugin,
}                           from '@lexical/react/LexicalAutoFocusPlugin'

// internals:
import type {
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import type {
    // types:
    WysiwygEditorState,
}                           from './types'
import {
    // states:
    CustomValidatorHandler,
    useWysiwygValidator,
}                           from './states/WysiwygValidator'

// theme:
import {
    // defined classes to match Reusable-UI's styles & components.
    defaultTheme,
}                           from './defaultTheme'

// nodes:
import {
    // defined supported nodes.
    defaultNodes,
}                           from './defaultNodes'

// behaviors:
import {
    // updates the state for the editor.
    normalizeWysiwygEditorState,
    UpdateStatePlugin,
}                           from './plugins/UpdateStatePlugin'
import {
    // dynamically setups the editable prop.
    DynamicEditablePlugin,
}                           from './plugins/DynamicEditablePlugin'



// react components:
export interface WysiwygEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Pick<EditorProps<TElement, WysiwygEditorState|null>,
            // accessibilities:
            |'autoFocus'    // supported
            
            
            
            // values:
            |'defaultValue' // supported
            |'value'        // supported
            |'onChange'     // supported
            
            
            
            // validations:
            |'enableValidation'
            |'isValid'
            |'inheritValidation'
            |'onValidation'
            
            |'required'
        >,
        Omit<IndicatorProps<TElement>,
            // values:
            |'defaultValue' // taken over by EditorProps
            |'value'        // taken over by EditorProps
            |'onChange'     // taken over by EditorProps
            
            
            
            // children:
            |'children'     // not supported
        >
{
    // validations:
    customValidator ?: CustomValidatorHandler
    
    
    
    // plugins:
    children ?: React.ReactNode
}
const WysiwygEditor = <TElement extends Element = HTMLElement>(props: WysiwygEditorProps<TElement>): JSX.Element|null => {
    // basic variant props:
    const basicVariantProps = useBasicVariantProps(props);
    
    
    
    // rest props:
    const {
        // accessibilities:
        autoFocus,
        
        
        
        // values:
        defaultValue,
        value,
        onChange,
        
        
        
        // validations:
        enableValidation  : _enableValidation,  // remove
        isValid           : _isValid,           // remove
        inheritValidation : _inheritValidation, // remove
        onValidation      : onValidation,       // use
        customValidator   : customValidator,    // use
        
        required          : required,           // use
        
        
        
        // plugins:
        children : plugins,
    ...restIndicatorProps} = props;
    
    
    
    // states:
    const wysiwygValidator = useWysiwygValidator({
        customValidator : props.customValidator,
        required        : required,
    });
    const handleValidation = useMergeEvents(
        // preserves the original `onValidation`:
        onValidation,
        
        
        
        // states:
        wysiwygValidator.handleValidation,
    );
    const invalidableState = useInvalidable<TElement>({
        enabled           : props.enabled,
        inheritEnabled    : props.inheritEnabled,
        readOnly          : props.readOnly,
        inheritReadOnly   : props.inheritReadOnly,
        
        enableValidation  : props.enableValidation,
        isValid           : props.isValid,
        inheritValidation : props.inheritValidation,
        onValidation      : handleValidation,
    });
    
    
    
    // accessibilities:
    const propEnabled          = usePropEnabled(props);
    const propReadOnly         = usePropReadOnly(props);
    const isDisabledOrReadOnly = (!propEnabled || propReadOnly);
    
    
    
    // classes:
    const stateClasses = useMergeClasses(
        // preserves the original `stateClasses`:
        props.stateClasses,
        
        
        
        // states:
        invalidableState.class,
    );
    
    
    
    // handlers:
    const handleError          = useEvent<InitialConfigType['onError']>((error, editor) => {
        // nothing to handle yet
    });
    const handleChange         = useMergeEvents(
        // preserves the original `onChange`:
        onChange,
        
        
        
        // states:
        
        // validations:
        wysiwygValidator.handleChange,
    );
    const handleAnimationStart = useMergeEvents(
        // preserves the original `onAnimationStart`:
        props.onAnimationStart,
        
        
        
        // states:
        invalidableState.handleAnimationStart,
    );
    const handleAnimationEnd   = useMergeEvents(
        // preserves the original `onAnimationEnd`:
        props.onAnimationEnd,
        
        
        
        // states:
        invalidableState.handleAnimationEnd,
    );
    
    
    
    // dom effects:
    useIsomorphicLayoutEffect(() => {
        const normalizedValue = normalizeWysiwygEditorState(value ?? null);
        wysiwygValidator.handleChange(normalizedValue);
    }, []);
    
    
    
    // configs:
    const initialConfig : InitialConfigType = useMemo(() => ({
        namespace   : 'WysiwygEditor', 
        editable    : !isDisabledOrReadOnly,
        onError     : handleError,
        
        editorState : (editor) => {
            // fn props:
            const initialValue = ((value !== undefined) ? value : defaultValue) ?? null;
            const editorState = (
                !initialValue
                ? null
                : ('root' in initialValue)
                    ? editor.parseEditorState(initialValue as any)
                    : initialValue
            );
            
            
            
            // actions:
            editor.setEditorState(editorState ?? ({} as any));
        },
        
        theme       : defaultTheme(),
        nodes       : defaultNodes(),
    }), []);
    
    
    
    // jsx:
    return (
        <LexicalComposer initialConfig={initialConfig}>
            {/* functions: */}
            {!!autoFocus ? <AutoFocusPlugin /> : <></>}
            
            {/* updates the state for the editor. */}
            <UpdateStatePlugin value={value} defaultValue={defaultValue} onChange={handleChange} />
            
            {/* dynamically setups the editable prop. */}
            <DynamicEditablePlugin editable={!isDisabledOrReadOnly} />
            
            {/* adds support for history stack management and undo / redo commands. */}
            <HistoryPlugin />
            
            
            
            {/* elements: */}
            <Group<TElement>
                // other props:
                {...restIndicatorProps}
                
                
                
                // variants:
                orientation='block'
                
                
                
                // classes:
                stateClasses={stateClasses}
                
                
                
                // handlers:
                onAnimationStart = {handleAnimationStart}
                onAnimationEnd   = {handleAnimationEnd  }
            >
                {React.Children.map<React.ReactNode, React.ReactNode>(plugins, (plugin) => {
                    if (!React.isValidElement<BasicProps<Element>>(plugin)) return plugin; // not an <element> => no modify
                    
                    
                    
                    // jsx:
                    return React.cloneElement<BasicProps<Element>>(plugin,
                        // props:
                        {
                            // basic variant props:
                            ...basicVariantProps,
                            
                            
                            
                            // other props:
                            ...plugin.props,
                        },
                    );
                })}
            </Group>
        </LexicalComposer>
    );
};
export {
    WysiwygEditor,
    WysiwygEditor as default,
}
