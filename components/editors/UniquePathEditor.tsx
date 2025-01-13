// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
    
    
    
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
    // types:
    type CheckAvailableHandler,
    
    
    
    // react components:
    type UniqueEditorProps,
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
        UniqueEditorProps<TElement>
{
    // data:
    useModelAvailablePath  : UseModelAvailablePath
    
    
    
    // appearances:
    homeUrl               ?: string
    modelSlug              : string
}
const UniquePathEditor = <TElement extends Element = HTMLSpanElement>(props: UniquePathEditorProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // data:
        useModelAvailablePath,
        
        
        
        // appearances:
        homeUrl = STORE_WEBSITE_URL,
        modelSlug,
        
        
        
        // other props:
        ...restUniquePathEditorProps
    } = props;
    
    
    
    // stores:
    const [availablePath] = useModelAvailablePath();
    
    
    
    // handlers:
    const handleDefaultCheckAvailable = useEvent<CheckAvailableHandler>((value) => {
        return availablePath(value).unwrap();
    });
    
    
    
    // default props:
    const {
        // accessibilities:
        'aria-label' : ariaLabel = 'Path',
        
        
        
        // validations:
        required                 = true,
        
        minLength                = 1,
        maxLength                = 100,
        
        pattern                  = /^[a-zA-Z0-9-_.!$%&'*+=^`|~(){}<>\[\]]+$/,
        
        onCheckAvailable         = handleDefaultCheckAvailable,
        
        patternHint              = <>Must be a common url-path pattern.</>,
        
        
        
        // components:
        textEditorComponent      = (
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
        ),
        
        
        
        // other props:
        ...restUniqueEditorProps
    } = restUniquePathEditorProps satisfies NoForeignProps<typeof restUniquePathEditorProps, UniqueEditorProps<TElement>>;
    
    
    
    // jsx:
    return (
        <UniqueEditor<TElement>
            // other props:
            {...restUniqueEditorProps}
            
            
            
            // accessibilities:
            aria-label          = {ariaLabel}
            
            
            
            // validations:
            required            = {required}
            
            minLength           = {minLength}
            maxLength           = {maxLength}
            
            pattern             = {pattern}
            
            onCheckAvailable    = {onCheckAvailable}
            
            patternHint         = {patternHint}
            
            
            
            // components:
            textEditorComponent = {textEditorComponent}
        />
    );
};
export {
    UniquePathEditor,            // named export for readibility
    UniquePathEditor as default, // default export to support React.lazy
}
