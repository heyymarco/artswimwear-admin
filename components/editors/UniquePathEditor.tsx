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
import {
    // react components:
    ImplementedUniqueEditorProps,
    UniqueEditor,
}                           from '@/components/editors/UniqueEditor'

// stores:
import {
    // hooks:
    useAvailablePath,
}                           from '@/store/features/api/apiSlice'

// configs:
import {
    STORE_WEBSITE_URL,
}                           from '@/website.config'



// react components:
export interface UniquePathEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        ImplementedUniqueEditorProps<TElement>
{
    // appearances:
    homeUrl ?: string
}
const UniquePathEditor = <TElement extends Element = HTMLElement>(props: UniquePathEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // appearances:
        homeUrl = STORE_WEBSITE_URL,
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
            
            
            
            // accessibilities:
            aria-label={props['aria-label'] ?? 'Path'}
            
            
            
            // constraints:
            minLength        = {1}
            maxLength        = {100}
            
            format           = {/^[a-zA-Z0-9-_.!$%&'*+=^`|~(){}<>\[\]]+$/}
            formatHint       = {<>Must be a common url-path format.</>}
            
            onCheckAvailable = {handleCheckAvailable}
            
            
            
            // validations:
            required={props.required ?? true}
            
            
            
            // components:
            editorComponent={
                <EditorWithLabel
                    // appearances:
                    icon='home'
                    
                    
                    
                    // accessibilities:
                    title={homeUrl}
                    
                    
                    
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
    UniquePathEditor,
    UniquePathEditor as default,
}
