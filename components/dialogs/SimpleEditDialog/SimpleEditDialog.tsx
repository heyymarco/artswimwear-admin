'use client'

import { default as React } from 'react'
import { useEffect, useRef, useState } from 'react'

import { dynamicStyleSheet } from '@cssfn/cssfn-react'

import { AccessibilityProvider, ValidationProvider, useEvent } from '@reusable-ui/core'
import { ButtonIcon, CardBody, CardHeader, CardFooter, Button, CloseButton } from '@reusable-ui/components'

import type { EditorProps } from '@/components/editors/Editor'
import { ModalStatus } from '@/components/ModalStatus'



// styles:
const useSimpleEditDialogStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./SimpleEditDialogStyles')
, { id: 'c5am7ye0ko', specificityWeight: 3 }); // need 3 degrees to overwrite `.cardClass.body`



// react components:
export type InitialValueEventHandler<TValue extends any, TModel extends {}, TEdit extends string> = (edit: TEdit, model: TModel) => TValue
export type UpdateModelEventHandler<TValue extends any, TModel extends {}, TEdit extends string> = (value: TValue, edit: TEdit, model: TModel) => Promise<void>
export interface SimpleEditDialogProps<TValue extends any, TModel extends {}, TEdit extends string> {
    // states:
    isLoading       : boolean
    
    
    
    // data:
    model           : TModel
    edit            : TEdit
    initialValue    : InitialValueEventHandler<TValue, TModel, TEdit>
    
    
    
    // components:
    editorComponent : React.ReactComponentElement<any, EditorProps<Element, TValue>>
    
    
    
    // handlers:
    onClose         : () => void
    onUpdateModel   : UpdateModelEventHandler<TValue, TModel, TEdit>
}
export const SimpleEditDialog = <TValue extends any, TModel extends {}, TEdit extends string>(props: SimpleEditDialogProps<TValue, TModel, TEdit>) => {
    // styles:
    const styles = useSimpleEditDialogStyleSheet();
    
    
    
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
        onUpdateModel,
    } = props;
    
    
    
    // states:
    const [isModified      , setIsModified      ] = useState<boolean>(false);
    
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    const [editorValue     , setEditorValue     ] = useState<any>(() => initialValue(edit, model));
    
    
    
    // refs:
    const editorRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // dialogs:
    const [errorMessage   , setErrorMessage   ] = useState<React.ReactNode>(undefined);
    const [showWarnUnsaved, setShowWarnUnsaved] = useState<boolean>(false);
    
    
    
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
        if (
            // for <Form>:
            editorElm?.matches(':is(.invalidating, .invalidated)')
            ||
            // for <Input>:
            editorElm?.parentElement?.matches(':is(.invalidating, .invalidated)')
        ) return;
        
        
        
        try {
            await onUpdateModel(editorValue, edit, model);
            
            onClose();
        }
        catch (error: any) {
            const errorStatus = error?.status;
            setErrorMessage(<>
                <p>Oops, an error occured!</p>
                <p>We were unable to save data to the server.</p>
                {(errorStatus >= 400) && (errorStatus <= 499) && <p>
                    There was a <strong>problem contacting our server</strong>.<br />
                    Make sure your internet connection is available.
                </p>}
                {(errorStatus >= 500) && (errorStatus <= 599) && <p>
                    There was a <strong>problem on our server</strong>.<br />
                    The server may be busy or currently under maintenance.
                </p>}
                <p>
                    Please try again in a few minutes.
                </p>
            </>);
        } // try
    });
    const handleClosing = useEvent(() => {
        if (isModified) {
            setShowWarnUnsaved(true);
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
        <CardBody className={styles.main} onKeyDown={handleKeyDown}>
            <AccessibilityProvider enabled={!isLoading}>
                <ValidationProvider enableValidation={enableValidation}>
                    {React.cloneElement(editorComponent,
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
            <ModalStatus
                theme='danger'
                backdropStyle='static'
            >
                {!!errorMessage && <>
                    <CardHeader>
                        Error Saving Data
                        <CloseButton onClick={() => setErrorMessage(undefined)} />
                    </CardHeader>
                    <CardBody>
                        {errorMessage}
                    </CardBody>
                    <CardFooter>
                        <Button onClick={() => setErrorMessage(undefined)}>
                            Okay
                        </Button>
                    </CardFooter>
                </>}
            </ModalStatus>
            <ModalStatus
                theme='warning'
                backdropStyle='static'
            >
                {showWarnUnsaved && <>
                    <CardHeader>
                        Unsaved Data
                    </CardHeader>
                    <CardBody>
                        <p>
                            Do you want to save the changes?
                        </p>
                    </CardBody>
                    <CardFooter>
                        <ButtonIcon theme='success' icon='save' onClick={() => {
                            // close the dialog first:
                            setShowWarnUnsaved(false);
                            // then do a save (it will automatically close the editor after successfully saving):
                            handleSave();
                        }}>
                            Save
                        </ButtonIcon>
                        <ButtonIcon theme='danger' icon='cancel' onClick={() => {
                            // close the dialog first:
                            setShowWarnUnsaved(false);
                            // then close the editor (without saving):
                            onClose();
                        }}>
                            Don&apos;t Save
                        </ButtonIcon>
                        <ButtonIcon theme='secondary' icon='edit' onClick={() => {
                            // close the dialog:
                            setShowWarnUnsaved(false);
                        }}>
                            Continue Editing
                        </ButtonIcon>
                    </CardFooter>
                </>}
            </ModalStatus>
        </CardBody>
    );
}
