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
    useEvent,
    
    
    
    // an accessibility management system:
    usePropEnabled,
    usePropReadOnly,
    
    
    
    // basic variants of UI:
    useBasicVariantProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
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
        Omit<IndicatorProps<TElement>,
            // values:
            |'defaultValue' // taken over by EditorProps
            |'value'        // taken over by EditorProps
            |'onChange'     // taken over by EditorProps
            
            
            
            // children:
            |'children'     // not supported
        >,
        Pick<EditorProps<TElement, WysiwygEditorState|null>,
            // accessibilities:
            |'autoFocus'
            
            
            
            // values:
            |'defaultValue' // take
            |'value'        // take
            |'onChange'     // take
        >
{
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
        
        
        
        // plugins:
        children : plugins,
    ...restIndicatorProps} = props;
    
    
    
    // accessibilities:
    const propEnabled          = usePropEnabled(props);
    const propReadOnly         = usePropReadOnly(props);
    const isDisabledOrReadOnly = (!propEnabled || propReadOnly);
    
    
    
    // handlers:
    const handleError       = useEvent<InitialConfigType['onError']>((error, editor) => {
        // nothing to handle yet
    });
    
    
    
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
            <UpdateStatePlugin value={value} defaultValue={defaultValue} onChange={onChange} />
            
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
            >
                {React.Children.map(plugins, (plugin) => {
                    if (!React.isValidElement(plugin)) return plugin; // not an <element> => no modify
                    
                    
                    
                    // jsx:
                    return React.cloneElement(plugin,
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
