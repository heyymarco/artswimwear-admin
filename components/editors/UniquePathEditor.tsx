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

// heymarco components:
import {
    TextEditor,
}                           from '@heymarco/text-editor'

// internal components:
import {
    EditorWithLabel,
}                           from '@/components/EditorWithLabel'
import {
    // react components:
    ImplementedUniqueEditorProps,
    UniqueEditor,
}                           from '@/components/editors/UniqueEditor'

// configs:
import {
    STORE_WEBSITE_URL,
}                           from '@/website.config'



// types:
export type UseModelAvailablePath = () => UseGetModelAvailablePathApi
export type UseGetModelAvailablePathApi = [
    (path: string) => {
        unwrap : () => Promise<boolean>
    },
    
    {
        // data:
        data       ?: boolean
        isLoading   : boolean
        isFetching  : boolean
        isError     : boolean
    },
    
    {
        lastArg: string
    },
]



// react components:
export interface UniquePathEditorProps<TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        ImplementedUniqueEditorProps<TElement>
{
    // appearances:
    homeUrl   ?: string
    modelSlug  : string
    
    
    
    // data:
    useModelAvailablePath : UseModelAvailablePath
}
const UniquePathEditor = <TElement extends Element = HTMLSpanElement>(props: UniquePathEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // appearances:
        homeUrl = STORE_WEBSITE_URL,
        modelSlug,
        
        
        
        // data:
        useModelAvailablePath,
        
        
        
        // other props:
        ...restUniqueEditorProps
    } = props;
    
    
    
    // stores:
    const [availablePath] = useModelAvailablePath();
    
    
    
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
                            {modelSlug}
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
