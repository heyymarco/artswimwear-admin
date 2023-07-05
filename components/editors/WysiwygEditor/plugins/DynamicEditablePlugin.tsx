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
    useLexicalComposerContext,
}                           from '@lexical/react/LexicalComposerContext'



// react components:
export interface DynamicEditablePluginProps {
    editable ?: boolean
}
const DynamicEditablePlugin = ({editable}: DynamicEditablePluginProps): JSX.Element|null => {
    // contexts:
    const [editor] = useLexicalComposerContext();
    
    
    
    // dom effects:
    useEffect(() => {
        // conditions:
        if (editable === undefined) return; // unset editable => ignore
        
        
        
        // actions:
        editor.setEditable(editable);
    }, [editable]); // (re)run the setups on every time the `editable` changes
    
    
    
    // jsx:
    return null;
};
export {
    DynamicEditablePlugin,
    DynamicEditablePlugin as default,
}
