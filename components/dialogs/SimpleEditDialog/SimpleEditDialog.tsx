'use client'

import { default as React } from 'react'
import { useEffect, useRef, useState } from 'react'

import { dynamicStyleSheet } from '@cssfn/cssfn-react'

import { AccessibilityProvider, ValidationProvider, useEvent, useMountedFlag } from '@reusable-ui/core'
import { ButtonIcon, CardBody, useDialogMessage } from '@reusable-ui/components'

import type { EditorProps } from '@/components/editors/Editor'



// styles:
const useSimpleEditDialogStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./SimpleEditDialogStyles')
, { id: 'c5am7ye0ko', specificityWeight: 3 }); // need 3 degrees to overwrite `.cardClass.body`



// react components:
export type InitialValueHandler<TValue extends any, TModel extends {}, TEdit extends string> = (edit: TEdit, model: TModel) => TValue
export type UpdateModelHandler<TValue extends any, TModel extends {}, TEdit extends string> = (value: TValue, edit: TEdit, model: TModel) => Promise<void>
export interface SimpleEditDialogProps<TValue extends any, TModel extends {}, TEdit extends string> {
    // states:
    isLoading       : boolean
    
    
    
    // data:
    model           : TModel
    edit            : TEdit
    initialValue    : InitialValueHandler<TValue, TModel, TEdit>
    
    
    
    // components:
    editorComponent : React.ReactComponentElement<any, EditorProps<Element, TValue>>
    
    
    
    // handlers:
    onClose         : () => void
    onUpdate        : UpdateModelHandler<TValue, TModel, TEdit>
}
export type ImplementedSimpleEditDialogProps<TValue extends any, TModel extends {}, TEdit extends string> = Omit<SimpleEditDialogProps<TValue, TModel, TEdit>,
    // states:
    |'isLoading'
    
    
    
    // data:
    |'initialValue'
    
    
    
    // handlers:
    |'onUpdate'
>
export const SimpleEditDialog = <TValue extends any, TModel extends {}, TEdit extends string>(props: SimpleEditDialogProps<TValue, TModel, TEdit>) => {
    // styles:
    const styleSheet = useSimpleEditDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // states:
        isLoading,
        
        
        
        // data:
        model,
        edit,
        initialValue,
        
        
        
        // components:
        editorComponent,
        
        
        
        // handlers:
        onClose,
        onUpdate,
    } = props;
    
    
    
    // states:
    const [isModified      , setIsModified      ] = useState<boolean>(false);
    
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    const [editorValue     , setEditorValue     ] = useState<any>(() => initialValue(edit, model));
    
    
    
    // refs:
    const editorRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    
    
    // dialogs:
    const {
        showMessage,
        showMessageFieldError,
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleSave = useEvent(async () => {
        setEnableValidation(true);
        await new Promise<void>((resolve) => { // wait for a validation state applied
            setTimeout(() => {
                setTimeout(() => {
                    resolve();
                }, 0);
            }, 0);
        });
        const editorElm = editorRef.current;
        const fieldError = (
            // for <Form>:
            (editorElm?.matches?.(':is(.invalidating, .invalidated)') ? editorElm : null)
            ??
            // for <Input>:
            (editorElm?.parentElement?.matches?.(':is(.invalidating, .invalidated)') ? editorElm.parentElement : null)
        );
        if (fieldError) { // there is an invalid field
            showMessageFieldError([fieldError]);
            return;
        } // if
        
        
        
        try {
            await onUpdate(editorValue, edit, model);
            
            onClose();
        }
        catch (error: any) {
            showMessageFetchError(error);
        } // try
    });
    const handleClosing = useEvent(async () => {
        if (isModified) {
            // conditions:
            const answer = await showMessage<'save'|'dontSave'|'continue'>({
                theme         : 'warning',
                title         : <h1>Unsaved Data</h1>,
                message       : <p>
                    Do you want to save the changes?
                </p>,
                options       : {
                    save      : <ButtonIcon icon='save'   theme='success' autoFocus={true}>Save</ButtonIcon>,
                    dontSave  : <ButtonIcon icon='cancel' theme='danger' >Don&apos;t Save</ButtonIcon>,
                    continue  : <ButtonIcon icon='edit'   theme='secondary'>Continue Editing</ButtonIcon>,
                },
                backdropStyle : 'static',
            });
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            
            
            
            // actions:
            switch (answer) {
                case 'save':
                    // then do a save (it will automatically close the editor after successfully saving):
                    handleSave();
                    break;
                case 'dontSave':
                    // then close the editor (without saving):
                    onClose();
                    break;
                default:
                    // do nothing (continue editing)
                    break;
            } // switch
        }
        else {
            onClose();
        } // if
    });
    const handleKeyDown : React.KeyboardEventHandler<HTMLElement> = useEvent((event) => {
        switch (event.key) {
            case 'Enter':
                event.preventDefault();
                handleSave();
                break;
            
            case 'Escape':
                event.preventDefault();
                handleClosing();
                break;
        } // switch
    });
    
    
    
    // dom effects:
    useEffect(() => {
        // conditions:
        const editorElm = editorRef.current;
        if (!editorElm) return;
        if (typeof(editorElm.setSelectionRange) !== 'function') return;
        
        
        
        // setups:
        const cancelFocus = setTimeout(() => {
            const originType = editorElm.type;
            try {
                if (originType !== 'text') editorElm.type = 'text';
                editorElm.setSelectionRange(0, -1);
            }
            finally {
                if (originType !== 'text') editorElm.type = originType;
            } // try
            editorElm.focus({ preventScroll: true });
        }, 0);
        
        
        
        // cleanups:
        return () => {
            clearTimeout(cancelFocus);
        }
    }, []);
    
    
    
    // jsx:
    return (
        <CardBody className={styleSheet.main} onKeyDown={handleKeyDown}>
            <AccessibilityProvider enabled={!isLoading}>
                <ValidationProvider enableValidation={enableValidation} inheritValidation={false}>
                    {React.cloneElement<EditorProps<Element, TValue>>(editorComponent,
                        // props:
                        {
                            elmRef    : editorRef,
                            
                            
                            
                            size      : 'sm',
                            
                            
                            
                            className : 'editor',
                            
                            
                            
                            value     : editorValue,
                            onChange  : (value: TValue) => { setEditorValue(value); setIsModified(true); },
                        },
                    )}
                </ValidationProvider>
                <ButtonIcon className='btnSave' icon={isLoading ? 'busy' : 'save'} theme='success' size='sm' onClick={handleSave}>Save</ButtonIcon>
                <ButtonIcon className='btnCancel' icon='cancel' theme='danger' size='sm' onClick={handleClosing}>Cancel</ButtonIcon>
            </AccessibilityProvider>
        </CardBody>
    );
}
