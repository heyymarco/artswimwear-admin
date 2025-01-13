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
    useAvailableRolename,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    // types:
    type CheckAvailableHandler,
    
    
    
    // react components:
    type UniqueEditorProps,
    UniqueEditor,
}                           from '@/components/editors/UniqueEditor'



// react components:
export interface UniqueRolenameEditorProps<TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        UniqueEditorProps<TElement>
{
}
const UniqueRolenameEditor = <TElement extends Element = HTMLSpanElement>(props: UniqueRolenameEditorProps<TElement>): JSX.Element|null => {
    // stores:
    const [availableRolename] = useAvailableRolename();
    
    
    
    // handlers:
    const handleDefaultCheckAvailable = useEvent<CheckAvailableHandler>((value) => {
        return availableRolename(value).unwrap();
    });
    
    
    
    // default props:
    const {
        // accessibilities:
        'aria-label' : ariaLabel = 'Name',
        
        
        
        // validations:
        required                 = true, // disallows role without name
        
        minLength                = 1,
        maxLength                = 30,
        
        pattern                  = /^.+$/,
        
        onCheckAvailable         = handleDefaultCheckAvailable,
        
        patternHint              = <>Must be a common role-name pattern.</>,
        
        
        
        // formats:
        type                     = 'text',
        autoComplete             = 'nope',
        autoCapitalize           = 'words',
        
        
        
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
            autoCapitalize       = {autoCapitalize}
        />
    );
};
export {
    UniqueRolenameEditor,            // named export for readibility
    UniqueRolenameEditor as default, // default export to support React.lazy
}
