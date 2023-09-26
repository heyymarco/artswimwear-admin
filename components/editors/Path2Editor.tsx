// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    Label,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    EditorWithLabel,
}                           from '@/components/EditorWithLabel'
import {
    TextEditor,
}                           from '@/components/editors/TextEditor'

// stores:
import {
    // hooks:
    useAvailablePath,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    // react components:
    UniqueEditorProps,
    UniqueEditor,
}                           from '@/components/editors/UniqueEditor'



// react components:
export interface PathEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<UniqueEditorProps<TElement>,
            // constraints:
            |'minLength'        // already handled internally
            |'maxLength'        // already handled internally
            |'format'           // already handled internally
            |'formatHint'       // already handled internally
            |'onCheckAvailable' // already handled internally
        >
{
    homeUrl ?: string
}
const PathEditor = <TElement extends Element = HTMLElement>(props: PathEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        homeUrl,
    ...restUniqueEditorProps} = props;
    
    
    
    // stores:
    const [availablePath] = useAvailablePath();
    
    
    
    // handlers:
    const handleCheckAvailable = useEvent(async (value: string): Promise<boolean> => {
        return await availablePath(value).unwrap();
    });
    
    
    
    // jsx:
    return (
        <UniqueEditor<TElement>
            // other props:
            {...restUniqueEditorProps}
            
            
            
            // constraints:
            minLength        = {1}
            maxLength        = {100}
            format           = {/^[a-zA-Z0-9-_.!$%&'*+=^`|~(){}<>\[\]]+$/}
            formatHint       = {<>Must be a common url-path format.</>}
            onCheckAvailable = {handleCheckAvailable}
            
            
            
            // components:
            editorComponent={
                <EditorWithLabel
                    // appearances:
                    icon='home'
                    
                    
                    
                    // components:
                    labelBeforeComponent={
                        <Label
                            // classes:
                            className='solid'
                        >
                            /products/
                        </Label>
                    }
                    editorComponent={
                        <TextEditor<TElement> />
                    }
                />
            }
        />
    );
};
export {
    PathEditor,
    PathEditor as default,
}
