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

// plugins:
import {
    // readOnly editor.
    ViewerPlugin,
}                           from './plugins/ViewerPlugin'



// react components:
export interface WysiwygViewerProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<IndicatorProps<TElement>,
            // values:
            |'defaultValue' // not supported
            |'value'        // not supported
            |'onChange'     // not supported
            
            
            
            // children:
            |'children'     // not supported
        >,
        Pick<EditorProps<TElement, WysiwygEditorState|null>,
            // values:
            |'value'        // take
        >
{
}
const WysiwygViewer = <TElement extends Element = HTMLElement>(props: WysiwygViewerProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        value,
    ...restIndicatorProps} = props;
    
    
    
    // handlers:
    const handleError       = useEvent<InitialConfigType['onError']>((error, editor) => {
        // nothing to handle yet
    });
    
    
    
    // configs:
    const initialConfig : InitialConfigType = useMemo(() => ({
        namespace   : 'WysiwygViewer', 
        editable    : false,
        onError     : handleError,
        
        editorState : (editor) => {
            // actions:
            editor.setEditorState(value ?? ({} as any));
        },
        
        theme       : defaultTheme(),
        nodes       : defaultNodes(),
    }), []);
    
    
    
    // jsx:
    return (
        <LexicalComposer initialConfig={initialConfig}>
            {/* updates the state for the editor. */}
            <UpdateStatePlugin value={value} />
            
            
            
            {/* elements: */}
            <Group<TElement>
                // other props:
                {...restIndicatorProps}
                
                
                
                // variants:
                orientation='block'
            >
                <ViewerPlugin />
            </Group>
        </LexicalComposer>
    );
};
export {
    WysiwygViewer,
    WysiwygViewer as default,
}
