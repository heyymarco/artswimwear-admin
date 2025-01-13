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

// stores:
import {
    // hooks:
    useAvailableEmail,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    // types:
    type CheckAvailableHandler,
    
    
    
    // react components:
    type UniqueEditorProps,
    UniqueEditor,
}                           from '@/components/editors/UniqueEditor'

// configs:
import {
    credentialsConfigClient,
}                           from '@/credentials.config.client'



// react components:
export interface UniqueEmailEditorProps<TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        UniqueEditorProps<TElement>
{
}
const UniqueEmailEditor = <TElement extends Element = HTMLSpanElement>(props: UniqueEmailEditorProps<TElement>): JSX.Element|null => {
    // stores:
    const [availableEmail] = useAvailableEmail();
    
    
    
    // handlers:
    const handleDefaultCheckAvailable = useEvent<CheckAvailableHandler>((value) => {
        return availableEmail(value).unwrap();
    });
    
    
    
    // default props:
    const {
        // accessibilities:
        'aria-label' : ariaLabel = 'Email',
        
        
        
        // validations:
        required                 = true, // disallows account without email
        
        minLength                = credentialsConfigClient.email.minLength,
        maxLength                = credentialsConfigClient.email.maxLength,
        
        pattern                  = credentialsConfigClient.email.format,
        
        onCheckAvailable         = handleDefaultCheckAvailable,
        
        patternHint              = credentialsConfigClient.email.formatHint,
        
        
        
        // formats:
        type                     = 'email',
        autoComplete             = 'nope',
        
        
        
        // other props:
        ...restUniqueEditorProps
    } = props satisfies NoForeignProps<typeof props, UniqueEditorProps<TElement>>;
    
    
    
    // jsx:
    return (
        <UniqueEditor<TElement>
            // other props:
            {...restUniqueEditorProps}
            
            
            
            // accessibilities:
            aria-label           = {ariaLabel}
            
            
            
            // validations:
            required             = {required}
            
            minLength            = {minLength}
            maxLength            = {maxLength}
            
            pattern              = {pattern}
            
            onCheckAvailable     = {onCheckAvailable}
            
            patternHint          = {patternHint}
            
            
            
            // formats:
            type                 = {type}
            autoComplete         = {autoComplete}
        />
    );
};
export {
    UniqueEmailEditor,            // named export for readibility
    UniqueEmailEditor as default, // default export to support React.lazy
}
