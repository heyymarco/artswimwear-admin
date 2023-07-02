// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
}                           from 'react'

// lexical functions:
import {
    // hooks:
    $getRoot,
}                           from 'lexical'
import {
    $generateNodesFromDOM,
}                           from '@lexical/html'

// lexical functions:
import {
    // hooks:
    useLexicalComposerContext,
}                           from '@lexical/react/LexicalComposerContext'



// react components:
export interface InitialValuePluginProps {
    initialValue ?: string
    defaultValue ?: string
}
const InitialValuePlugin = ({initialValue, defaultValue}: InitialValuePluginProps): JSX.Element|null => {
    // contexts:
    const [editor] = useLexicalComposerContext();
    
    
    
    // dom effects:
    useEffect(() => {
        // conditions:
        const htmlString = initialValue ?? defaultValue;
        if (!htmlString) return;
        
        
        
        // actions:
        editor.update(() => {
            const htmlDom = (new DOMParser()).parseFromString(htmlString, 'text/html');
            const nodes   = $generateNodesFromDOM(editor, htmlDom);
            
            $getRoot()
            .clear()
            .append(...nodes);
        });
    }, []); // runs once on startup
    
    
    
    // jsx:
    return null;
};
export {
    InitialValuePlugin,
    InitialValuePlugin as default,
}
