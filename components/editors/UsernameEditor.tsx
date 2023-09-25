// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useEffect,
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeEvents,
    useMergeRefs,
    useMountedFlag,
    
    
    
    // an accessibility management system:
    usePropEnabled,
    
    
    
    // color options of UI:
    ThemeName,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    IconProps,
    Icon,
    
    
    
    // layout-components:
    ListItem,
    List,
    
    
    
    // notification-components:
    Tooltip,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import type {
    ValidityStatus,
}                           from '@heymarco/next-auth'
import {
    getValidityTheme,
    getValidityIcon,
    isClientError,
}                           from '@heymarco/next-auth/utilities'

// stores:
import {
    // hooks:
    useAvailableUser,
}                           from '@/store/features/api/apiSlice'

// internals:
import type {
    // types:
    EditorChangeEventHandler,
}                           from '@/components/editors/Editor'
import {
    // react components:
    TextEditorProps,
    TextEditor,
}                           from '@/components/editors/TextEditor'

// configs:
import {
    credentialsConfig,
}                           from '@/credentials.config'



// react components:
export interface UsernameEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        TextEditorProps<TElement>
{
    currentValue ?: string
}
const UsernameEditor = <TElement extends Element = HTMLElement>(props: UsernameEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        currentValue,
    ...restTextEditorProps} = props;
    
    
    
    // states:
    const [value           , setValue           ] = useState<string>(props.value ?? props.defaultValue ?? '');
    const [isUserInteracted, setIsUserInteracted] = useState<boolean>(false);
    const [isFocused       , setIsFocused       ] = useState<boolean>(false);
    const [isValidAvailable, setIsValidAvailable] = useState<ValidityStatus>('unknown');
    
    
    
    // stores:
    const [availableUser] = useAvailableUser();
    
    
    
    // handlers:
    const handleChangeInternal = useEvent<EditorChangeEventHandler<string>>((value) => {
        setValue(value);
        setIsUserInteracted(true);
    });
    const handleChange         = useMergeEvents(
        // preserves the original `onChange`:
        props.onChange,
        
        
        
        // actions:
        handleChangeInternal,
    );
    
    const handleFocusInternal  = useEvent((): void => {
        setIsFocused(true);
    });
    const handleFocus          = useMergeEvents(
        // preserves the original `onFocus`:
        props.onFocus,
        
        
        
        // actions:
        handleFocusInternal,
    );
    
    const handleBlurInternal   = useEvent((): void => {
        setIsFocused(false);
    });
    const handleBlur           = useMergeEvents(
        // preserves the original `onBlur`:
        props.onBlur,
        
        
        
        // actions:
        handleBlurInternal,
    );
    
    
    
    // dom effects:
    
    const isMounted = useMountedFlag();
    
    // validate username availability:
    const isValidLength = !value || ((value.length >= credentialsConfig.USERNAME_MIN_LENGTH) && (value.length <= credentialsConfig.USERNAME_MAX_LENGTH));
    const isValidFormat = !value || !!value.match(credentialsConfig.USERNAME_FORMAT);
    useEffect(() => {
        // conditions:
        if (
            !value
            ||
            !isValidLength
            ||
            !isValidFormat
        ) {
            setIsValidAvailable('unknown');
            return;
        } // if
        
        if (value && currentValue && (value === currentValue)) {
            setIsValidAvailable(true);
            return;
        } // if
        
        
        
        // actions:
        (async () => {
            try {
                // delay a brief moment, waiting for the user typing:
                setIsValidAvailable('unknown');
                await new Promise<void>((resolved) => {
                    setTimeout(() => {
                        resolved();
                    }, 500);
                });
                if (!isMounted.current) return; // unmounted => abort
                
                
                
                setIsValidAvailable('loading');
                await availableUser(value).unwrap();
                if (!isMounted.current) return; // unmounted => abort
                
                
                
                // success
                
                
                
                // save the success:
                setIsValidAvailable(true);
            }
            catch (error) {
                setIsValidAvailable(isClientError(error) ? false : 'error');
            } // try
        })();
    }, [value, isValidLength, isValidFormat]);
    
    
    
    // validations:
    const specificValidations = {
        isValidLength,
        isValidFormat,
        isValidAvailable,
    };
    const validationMap = {
        Length        : <>Must be {credentialsConfig.USERNAME_MIN_LENGTH}-{credentialsConfig.USERNAME_MAX_LENGTH} characters.</>,
        Format        : credentialsConfig.USERNAME_FORMAT_HINT,
        Available     : <>Must have never been registered.</>,
    };
    
    
    
    // refs:
    const editorRef = useRef<HTMLInputElement|null>(null);
    const elmRef    = useMergeRefs(
        // preserves the original `elmRef`:
        props.elmRef,
        
        
        
        editorRef,
    );
    
    
    
    // fn props:
    const isEnabled = usePropEnabled(props);
    
    
    
    // jsx:
    return (
        <>
            <TextEditor<TElement>
                // other props:
                {...restTextEditorProps}
                
                
                
                // refs:
                elmRef={elmRef}
                
                
                
                // values:
                value={value}
                onChange={handleChange}
                
                
                
                // states:
                enabled={isEnabled}
                isValid={
                    !value
                    ||
                    (
                        isValidLength
                        &&
                        isValidFormat
                        &&
                        (isValidAvailable === true)
                    )
                }
                
                
                
                // handlers:
                onFocus = {handleFocus}
                onBlur  = {handleBlur }
            />
            <Tooltip
                // variants:
                theme='warning'
                
                
                
                // states:
                expanded={isUserInteracted && isFocused && !!value && isEnabled}
                
                
                
                // floatable:
                floatingPlacement='top'
                floatingOn={editorRef}
            >
                <List
                    // variants:
                    listStyle='flat'
                >
                    {Object.entries(validationMap).map(([validationType, text], index) => {
                        // conditions:
                        if (!text) return null; // disabled => ignore
                        
                        
                        
                        // fn props:
                        const isValid = (specificValidations as any)?.[`isValid${validationType}`] as (ValidityStatus|undefined);
                        if (isValid === undefined) return null;
                        
                        
                        
                        // jsx:
                        return (
                            <ListItem
                                // identifiers:
                                key={index}
                                
                                
                                
                                // variants:
                                size='sm'
                                theme={getValidityTheme(isValid)}
                                outlined={true}
                            >
                                <Icon
                                    // appearances:
                                    icon={getValidityIcon(isValid)}
                                    
                                    
                                    
                                    // variants:
                                    size='sm'
                                />
                                &nbsp;
                                {text}
                            </ListItem>
                        );
                    })}
                </List>
            </Tooltip>
        </>
    );
};
export {
    UsernameEditor,
    UsernameEditor as default,
}
