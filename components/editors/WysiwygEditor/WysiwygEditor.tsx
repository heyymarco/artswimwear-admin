// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMountedFlag,
    
    
    
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
    $generateHtmlFromNodes,
}                           from '@lexical/html'

// lexical functions:
import {
    // types:
    InitialConfigType,
    
    
    
    // react components:
    LexicalComposer,
}                           from '@lexical/react/LexicalComposer'
import {
    // calls onChange whenever Lexical state is updated.
    OnChangePlugin,
}                           from '@lexical/react/LexicalOnChangePlugin'
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

// theme:
import {
    // defined classes to match Reusable-UI's styles & components.
    defaultTheme,
}                           from './defaultTheme'

// theme:
import {
    // defined supported nodes.
    defaultNodes,
}                           from './defaultNodes'

// behaviors:
import {
    // setups the initial value for the editor.
    InitialValuePlugin,
}                           from './plugins/InitialValuePlugin'
import {
    // dynamically setups the editable prop.
    DynamicEditablePlugin,
}                           from './plugins/DynamicEditablePlugin'

// resources:
// import
//     // auto converts link-like-texts to links.
//     AutoLinkPlugin
//                             from './plugins/AutoLinkPlugin'

// codes:
// import
//     CodeHighlightPlugin
//                             from './plugins/CodeHighlightPlugin'



// react components:
export interface WysiwygEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<IndicatorProps<TElement>,
            // values:
            |'defaultValue' // taken over by EditorProps
            |'value'        // taken over by EditorProps
            |'onChange'     // taken over by EditorProps
        >,
        Pick<EditorProps<TElement, string>,
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
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    
    
    // handlers:
    const prevValueCache = useRef<string|undefined>(undefined);
    const handleValueChange = useEvent<Parameters<typeof OnChangePlugin>[0]['onChange']>((editorState, editor) => {
        // conditions:
        if (!onChange) return; // onChange handler is not set => ignore
        
        
        
        editorState.read(() => {
            // conditions:
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            
            
            
            // actions:
            const isInit = (prevValueCache.current === undefined);
            const htmlString = $generateHtmlFromNodes(editor);
            prevValueCache.current = htmlString; // sync
            if (!isInit) {
                onChange(htmlString);
            } // if
        });
    });
    const handleError       = useEvent<InitialConfigType['onError']>((error, editor) => {
        // nothing to handle yet
    });
    
    
    
    // configs:
    const initialConfig : InitialConfigType = useMemo(() => ({
        namespace   : 'WysiwygEditor', 
        editable    : !isDisabledOrReadOnly,
        onError     : handleError,
        
        // causes hydration error:
        // editorState : (editor) => {
        //     // conditions:
        //     const htmlString = value ?? defaultValue;
        //     if (!htmlString) return;
        //     
        //     
        //     
        //     // actions:
        //     const htmlDom = (new DOMParser()).parseFromString(htmlString, 'text/html');
        //     const node    = $generateNodesFromDOM(editor, htmlDom);
        //     $getRoot().append(...node);
        // },
        
        theme : defaultTheme(),
        nodes : defaultNodes(),
    }), []);
    
    
    
    // jsx:
    return (
        <LexicalComposer initialConfig={initialConfig}>
            {/* functions: */}
            {!!autoFocus ? <AutoFocusPlugin /> : <></>}
            
            {/* setups the initial value for the editor. */}
            <InitialValuePlugin initialValue={value} defaultValue={defaultValue} />
            
            {/* dynamically setups the editable prop. */}
            <DynamicEditablePlugin editable={!isDisabledOrReadOnly} />
            
            {/* calls onChange whenever Lexical state is updated. */}
            <OnChangePlugin
                // behaviors:
                ignoreHistoryMergeTagChange={true}
                ignoreSelectionChange={true}
                
                
                
                // handlers:
                onChange={handleValueChange}
            />
            
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
