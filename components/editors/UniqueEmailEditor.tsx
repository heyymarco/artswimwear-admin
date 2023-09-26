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
    useAvailableEmail,
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
export interface UniqueEmailEditorProps<TElement extends Element = HTMLElement>
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
const UniqueEmailEditor = <TElement extends Element = HTMLElement>(props: UniqueEmailEditorProps<TElement>): JSX.Element|null => {
    // stores:
    const [availableEmail] = useAvailableEmail();
    
    
    
    // handlers:
    const handleCheckAvailable = useEvent(async (value: string): Promise<boolean> => {
        return await availableEmail(value).unwrap();
    });
    
    
    
    // jsx:
    return (
        <UniqueEditor<TElement>
            // other props:
            {...props}
            
            
            
            // accessibilities:
            aria-label={props['aria-label'] ?? 'Email'}
            
            
            
            // validations:
            required={props.required ?? true}
            
            
            
            // formats:
            type={props.type ?? 'email'}
            autoComplete={props.autoComplete ?? 'nope'}
            
            
            
            // constraints:
            minLength        = {credentialsConfig.EMAIL_MIN_LENGTH}
            maxLength        = {credentialsConfig.EMAIL_MAX_LENGTH}
            format           = {credentialsConfig.EMAIL_FORMAT}
            formatHint       = {credentialsConfig.EMAIL_FORMAT_HINT}
            onCheckAvailable = {handleCheckAvailable}
        />
    );
};
export {
    UniqueEmailEditor,
    UniqueEmailEditor as default,
}
