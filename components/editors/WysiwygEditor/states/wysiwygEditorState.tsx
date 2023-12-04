// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
    useMemo,
}                           from 'react'



// hooks:

// states:

//#region wysiwygEditorState

// contexts:
export interface WysiwygEditorState
{
    // refs:
    editorRef : React.Ref<Element>|undefined // setter ref
}

const WysiwygEditorStateContext = createContext<WysiwygEditorState>({
    // refs:
    editorRef : undefined,
});
WysiwygEditorStateContext.displayName  = 'WysiwygEditorState';

export const useWysiwygEditorState = (): WysiwygEditorState => {
    return useContext(WysiwygEditorStateContext);
}



// react components:
export interface WysiwygEditorStateProps
    extends
        // contexts:
        WysiwygEditorState
{
}
const WysiwygEditorStateProvider = (props: React.PropsWithChildren<WysiwygEditorStateProps>): JSX.Element|null => {
    // props:
    const {
        // refs:
        editorRef,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // states:
    const wysiwygEditorState = useMemo<WysiwygEditorState>(() => ({
        // refs:
        editorRef,    // stable ref
    }), [
        // refs:
        // editorRef, // stable ref
    ]);
    
    
    
    // jsx:
    return (
        <WysiwygEditorStateContext.Provider value={wysiwygEditorState}>
            {children}
        </WysiwygEditorStateContext.Provider>
    );
};
export {
    WysiwygEditorStateProvider,
    WysiwygEditorStateProvider as default,
}
//#endregion wysiwygEditorState
