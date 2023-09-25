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
    useAvailableUser,
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
export interface UsernameEditorProps<TElement extends Element = HTMLElement>
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
const UsernameEditor = <TElement extends Element = HTMLElement>(props: UsernameEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        currentValue,
    ...restUniqueEditorProps} = props;
    
    
    
    // stores:
    const [availableUser] = useAvailableUser();
    
    
    
    // handlers:
    const handleCheckAvailable = useEvent(async (value: string): Promise<boolean> => {
        return await availableUser(value).unwrap();
    });
    
    
    
    // jsx:
    return (
        <UniqueEditor<TElement>
            // other props:
            {...restUniqueEditorProps}
            
            
            
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
    UsernameEditor,
    UsernameEditor as default,
}
