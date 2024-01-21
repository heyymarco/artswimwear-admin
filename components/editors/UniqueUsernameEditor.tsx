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

// stores:
import {
    // hooks:
    useAvailableUsername,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    // react components:
    ImplementedUniqueEditorProps,
    UniqueEditor,
}                           from '@/components/editors/UniqueEditor'

// configs:
import {
    credentialsConfigClient,
}                           from '@/credentials.config.client'



// react components:
export interface UniqueUsernameEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        ImplementedUniqueEditorProps<TElement>
{
}
const UniqueUsernameEditor = <TElement extends Element = HTMLElement>(props: UniqueUsernameEditorProps<TElement>): JSX.Element|null => {
    // stores:
    const [availableUsername] = useAvailableUsername();
    
    
    
    // handlers:
    const handleCheckAvailable = useEvent(async (value: string): Promise<boolean> => {
        return await availableUsername(value).unwrap();
    });
    
    
    
    // jsx:
    return (
        <UniqueEditor<TElement>
            // other props:
            {...props}
            
            
            
            // accessibilities:
            aria-label={props['aria-label'] ?? 'Username'}
            
            
            
            // validations:
            required={props.required ?? false}
            
            
            
            // formats:
            type={props.type ?? 'text'}
            autoComplete={props.autoComplete ?? 'nope'}
            
            
            
            // constraints:
            minLength        = {credentialsConfigClient.username.minLength}
            maxLength        = {credentialsConfigClient.username.maxLength}
            
            format           = {credentialsConfigClient.username.format}
            formatHint       = {credentialsConfigClient.username.formatHint}
            
            onCheckAvailable = {handleCheckAvailable}
        />
    );
};
export {
    UniqueUsernameEditor,
    UniqueUsernameEditor as default,
}
