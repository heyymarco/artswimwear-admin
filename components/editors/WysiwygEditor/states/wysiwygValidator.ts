// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useEffect,
    
    
    
    // utilities:
    startTransition,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useTriggerRender,
    useEvent,
    EventHandler,
    
    
    
    // a validation management system:
    Result as ValResult,
    
    
    
    // a possibility of UI having an invalid state:
    ValidityChangeEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// internals:
import type {
    // types:
    EditorChangeEventHandler,
}                           from '@/components/editors/Editor'
import type {
    // types:
    WysiwygEditorState,
}                           from '../types'



// hooks:

// states:

//#region wysiwygValidator
export type CustomValidatorHandler = (isValid: ValResult) => ValResult

const isWysiwygValid = (value: WysiwygEditorState|null, required: boolean): ValResult => {
    if (!required) return true;
    return (value !== null);
};

export interface WysiwygValidatorApi {
    handleValidation : EventHandler<ValidityChangeEvent>
    handleInit       : EditorChangeEventHandler<WysiwygEditorState|null>
    handleChange     : EditorChangeEventHandler<WysiwygEditorState|null>
}
export interface WysiwygValidatorProps {
    required        ?: boolean
    customValidator ?: CustomValidatorHandler
}
export const useWysiwygValidator      = (props: WysiwygValidatorProps): WysiwygValidatorApi => {
    const {
        required = false,
        customValidator,
    } = props;
    
    
    
    // states:
    // we stores the `isValid` in `useRef` instead of `useState` because we need to *real-time export* of its value:
    const isValid = useRef<ValResult>(null); // initially unchecked (neither valid nor invalid)
    
    // manually controls the (re)render event:
    const [triggerRender] = useTriggerRender();
    
    
    
    // functions:
    
    const asyncPerformUpdate = useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
    useEffect(() => {
        // cleanups:
        return () => {
            // cancel out previously performUpdate (if any):
            if (asyncPerformUpdate.current) clearTimeout(asyncPerformUpdate.current);
        };
    }, []); // runs once on startup
    
    const validate = (newValue: WysiwygEditorState|null, immediately = false) => {
        const performUpdate = () => {
            // remember the validation result:
            const currentIsValid = isWysiwygValid(newValue, required);
            const newIsValid : ValResult = (customValidator ? customValidator(currentIsValid) : currentIsValid);
            if (isValid.current !== newIsValid) {
                isValid.current = newIsValid;
                
                // lazy responsives => a bit delayed of responsives is ok:
                startTransition(() => {
                    triggerRender(); // notify to react runtime to re-render with a new validity state
                });
            } // if
        };
        
        
        
        if (immediately) {
            // instant validating:
            performUpdate();
        }
        else {
            // cancel out previously performUpdate (if any):
            if (asyncPerformUpdate.current) clearTimeout(asyncPerformUpdate.current);
            
            
            
            // delaying the validation, to avoid unpleasant splash effect during editing
            const currentIsValid = isWysiwygValid(newValue, required);
            asyncPerformUpdate.current = setTimeout(
                performUpdate,
                (currentIsValid !== false) ? 300 : 600
            );
        } // if
    };
    
    
    
    // handlers:
    
    /**
     * Handles the validation result.
     * @returns  
     * `null`  = uncheck.  
     * `true`  = valid.  
     * `false` = invalid.
     */
    const handleValidation = useEvent<EventHandler<ValidityChangeEvent>>((event) => {
        if (event.isValid !== undefined) event.isValid = isValid.current;
    });
    
    const handleInit       = useEvent<EditorChangeEventHandler<WysiwygEditorState|null>>((newValue) => {
        validate(newValue, /*immediately =*/true);
    });
    
    const handleChange     = useEvent<EditorChangeEventHandler<WysiwygEditorState|null>>((newValue) => {
        validate(newValue);
    });
    
    
    
    // api:
    return {
        handleValidation,
        handleInit,
        handleChange,
    };
};
//#endregion wysiwygValidator
