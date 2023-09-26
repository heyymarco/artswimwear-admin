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
    UniqueEditorProps,
    UniqueEditor,
}                           from '@/components/editors/UniqueEditor'

// configs:
import {
    credentialsConfig,
}                           from '@/credentials.config'



// react components:
export interface UniqueUsernameEditorProps<TElement extends Element = HTMLElement>
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
            minLength        = {credentialsConfig.USERNAME_MIN_LENGTH}
            maxLength        = {credentialsConfig.USERNAME_MAX_LENGTH}
            format           = {credentialsConfig.USERNAME_FORMAT}
            formatHint       = {credentialsConfig.USERNAME_FORMAT_HINT}
            onCheckAvailable = {handleCheckAvailable}
        />
    );
};
export {
    UniqueUsernameEditor,
    UniqueUsernameEditor as default,
}
