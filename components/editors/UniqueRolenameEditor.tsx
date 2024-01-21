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
    useAvailableRolename,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    // react components:
    ImplementedUniqueEditorProps,
    UniqueEditor,
}                           from '@/components/editors/UniqueEditor'



// react components:
export interface UniqueRolenameEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        ImplementedUniqueEditorProps<TElement>
{
}
const UniqueRolenameEditor = <TElement extends Element = HTMLElement>(props: UniqueRolenameEditorProps<TElement>): JSX.Element|null => {
    // stores:
    const [availableRolename] = useAvailableRolename();
    
    
    
    // handlers:
    const handleCheckAvailable = useEvent(async (value: string): Promise<boolean> => {
        return await availableRolename(value).unwrap();
    });
    
    
    
    // jsx:
    return (
        <UniqueEditor<TElement>
            // other props:
            {...props}
            
            
            
            // accessibilities:
            aria-label={props['aria-label'] ?? 'Name'}
            
            
            
            // validations:
            required={props.required ?? true}
            
            
            
            // formats:
            type={props.type ?? 'text'}
            autoComplete={props.autoComplete ?? 'nope'}
            autoCapitalize={props.autoCapitalize ?? 'words'}
            
            
            
            // constraints:
            minLength        = {1}
            maxLength        = {30}
            
            format           = {/^.+$/}
            formatHint       = {<>Must be a common role-name format.</>}
            
            onCheckAvailable = {handleCheckAvailable}
        />
    );
};
export {
    UniqueRolenameEditor,
    UniqueRolenameEditor as default,
}
