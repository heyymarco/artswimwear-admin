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
    ImplementedUniqueEditorProps,
    UniqueEditor,
}                           from '@/components/editors/UniqueEditor'

// configs:
import {
    credentialsConfigClient,
}                           from '@/credentials.config.client'



// react components:
export interface UniqueEmailEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        ImplementedUniqueEditorProps<TElement>
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
            minLength        = {credentialsConfigClient.email.minLength}
            maxLength        = {credentialsConfigClient.email.maxLength}
            
            format           = {credentialsConfigClient.email.format}
            formatHint       = {credentialsConfigClient.email.formatHint}
            
            onCheckAvailable = {handleCheckAvailable}
        />
    );
};
export {
    UniqueEmailEditor,
    UniqueEmailEditor as default,
}
