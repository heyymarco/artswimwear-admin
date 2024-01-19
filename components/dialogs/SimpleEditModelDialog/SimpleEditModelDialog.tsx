'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// react-redux:
import type {
    MutationDefinition,
    BaseQueryFn,
}                           from '@reduxjs/toolkit/dist/query'
import type {
    MutationTrigger,
}                           from '@reduxjs/toolkit/dist/query/react/buildHooks'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
    useMountedFlag,
    
    
    
    // an accessibility management system:
    AccessibilityProvider,
    
    
    
    // a validation management system:
    ValidationProvider,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
    
    
    
    // layout-components:
    CardBody,
    
    
    
    // dialog-components:
    ModalExpandedChangeEvent,
    ModalCardProps,
    ModalCard,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import type {
    EditorProps,
}                           from '@/components/editors/Editor'

// internals:
import type {
    Model, MutationArgs,
}                           from '@/libs/types'




// types:
export type UpdateModelApi<TModel extends Model> = readonly [
    MutationTrigger<MutationDefinition<MutationArgs<TModel>, BaseQueryFn<any, unknown, unknown, {}, {}>, string, TModel>>,
    {
        isLoading   : boolean
    }
]



// styles:
const useSimpleEditModelDialogStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./SimpleEditModelDialogStyles')
, { id: 'r1hbagluho', specificityWeight: 3 }); // need 3 degrees to overwrite `.cardClass.body`



// react components:
export type SimpleEditModelDialogResult<TModel extends Model> = TModel[Extract<keyof TModel, string>]|undefined
export interface SimpleEditModelDialogExpandedChangeEvent<TModel extends Model> extends ModalExpandedChangeEvent<SimpleEditModelDialogResult<TModel>> {}

export type InitialValueHandler<TValue extends any, TModel extends {}, TEdit extends string> = (edit: TEdit, model: TModel) => TValue
export type UpdateHandler<TValue extends any, TModel extends {}, TEdit extends string> = (value: TValue, edit: TEdit, model: TModel) => Promise<void>
export type TransformValueHandler<TValue extends any, TModel extends Model, TEdit extends string> = (value: TValue, edit: TEdit, model: TModel) => MutationArgs<TModel>

export interface SimpleEditModelDialogProps<TModel extends Model>
    extends
        // bases:
        Omit<ModalCardProps<HTMLElement, SimpleEditModelDialogExpandedChangeEvent<TModel>>,
            // children:
            |'children'        // already taken over
        >
{
    // data:
    model           : TModel
    edit            : Extract<keyof TModel, string>
    initialValue   ?: InitialValueHandler<TModel[keyof TModel], TModel, Extract<keyof TModel, string>>
    transformValue ?: TransformValueHandler<TModel[keyof TModel], TModel, Extract<keyof TModel, string>>
    updateModelApi  : UpdateModelApi<TModel> | (() => UpdateModelApi<TModel>)
    
    
    
    // components:
    editorComponent : React.ReactComponentElement<any, EditorProps<Element, TModel[keyof TModel]>>
}
const SimpleEditModelDialog = <TModel extends Model>(props: SimpleEditModelDialogProps<TModel>): JSX.Element|null => {
    // styles:
    const styleSheet = useSimpleEditModelDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
        edit,
        initialValue,
        transformValue,
        updateModelApi,
        
        
        
        // components:
        editorComponent,
        
        
        
        // handlers:
        onExpandedChange,
    ...restModalCardProps} = props;
    
    
    
    // states:
    const [isModified      , setIsModified      ] = useState<boolean>(false);
    
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    const [editorValue     , setEditorValue     ] = useState<any>(() => (initialValue ?? handleDefaultInitialValue)(edit, model));
    
    
    
    // refs:
    const editorRef          = useRef<HTMLInputElement|null>(null);
    const autoFocusEditorRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // effects:
    const isMounted = useMountedFlag();
    
    
    
    // dialogs:
    const {
        showMessage,
        showMessageFieldError,
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // stores:
    const [updateModel, {isLoading}] = (typeof(updateModelApi) === 'function') ? updateModelApi() : updateModelApi;
    
    
    
    // handlers:
    const handleDefaultInitialValue   = useEvent<InitialValueHandler<TModel[keyof TModel], TModel, Extract<keyof TModel, string>>>((edit, model) => {
        return model[edit] as TModel[keyof TModel];
    });
    const handleDefaultTransformValue = useEvent<TransformValueHandler<TModel[keyof TModel], TModel, Extract<keyof TModel, string>>>((value, edit, model) => {
        return {
            id     : model.id,
            
            [edit] : (value === '') ? (null as typeof value) : value, // auto convert empty string to null
        } as any;
    });
    
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
        const fieldErrors = (
            // for <Form>:
            (() => {
                const matches = editorElm?.querySelectorAll?.(':is(.invalidating, .invalidated)');
                if (!matches?.length) return null;
                return matches;
            })()
            ??
            // for <input>:
            (editorElm?.matches?.(':is(.invalidating, .invalidated)') ? [editorElm] : null)
            ??
            // for <Input>:
            (editorElm?.parentElement?.matches?.(':is(.invalidating, .invalidated)') ? [editorElm.parentElement] : null)
        );
        if (fieldErrors?.length) { // there is an invalid field
            showMessageFieldError(fieldErrors);
            return;
        } // if
        
        
        
        try {
            const transformed = (transformValue ?? handleDefaultTransformValue)(editorValue, edit, model);
            const updatingModelTask = updateModel(transformed).unwrap();
            
            await handleFinalizing([updatingModelTask]); // result: created|mutated
        }
        catch (fetchError: any) {
            showMessageFetchError(fetchError);
        } // try
    });
    
    const handleCloseDialog = useEvent(async () => {
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
                ...{
                    backdropStyle : 'static',
                },
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
                    await handleFinalizing(); // result: discard changes
                    break;
                default:
                    // do nothing (continue editing)
                    break;
            } // switch
        }
        else {
            await handleFinalizing(); // result: no changes
        } // if
    });
    const handleFinalizing     = useEvent(async (processingTasks : Promise<any>[] = []) => {
        await Promise.all(processingTasks);
        
        
        
        onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
        });
    });
    
    const handleExpandedChange : EventHandler<SimpleEditModelDialogExpandedChangeEvent<TModel>> = useEvent((event) => {
        // conditions:
        if (event.actionType === 'shortcut') return; // prevents closing modal by accidentally pressing [esc]
        
        
        
        // actions:
        onExpandedChange?.(event);
    });
    
    
    
    // jsx:
    return (
        <AccessibilityProvider enabled={!isLoading}>
            <ModalCard
                // other props:
                {...restModalCardProps}
                
                
                
                // variants:
                theme          = {props.theme          ?? 'primary'   }
                backdropStyle  = {props.backdropStyle  ?? 'static'    }
                modalCardStyle = {props.modalCardStyle ?? 'scrollable'}
                
                
                
                // auto focusable:
                autoFocusOn={props.autoFocusOn ?? autoFocusEditorRef}
                
                
                
                // handlers:
                onExpandedChange = {handleExpandedChange}
            >
                <CardBody className={styleSheet.main}>
                    <ValidationProvider
                        // validations:
                        enableValidation={enableValidation}
                        inheritValidation={false}
                    >
                        {React.cloneElement<EditorProps<Element, TModel[keyof TModel]>>(editorComponent,
                            // props:
                            {
                                elmRef    : autoFocusEditorRef, // focus on the first_important editor, if the editor is a <form>, not the primary input
                                outerRef  : editorRef, // use outerRef instead of elmRef, to validate all input(s), if the editor is a <form>, not the primary input
                                
                                
                                
                                size      : 'sm',
                                
                                
                                
                                className : 'editor',
                                
                                
                                
                                value     : editorValue,
                                onChange  : (value: TModel[keyof TModel]) => { setEditorValue(value); setIsModified(true); },
                            },
                        )}
                    </ValidationProvider>
                    <ButtonIcon className='btnSave' icon={isLoading ? 'busy' : 'save'} theme='success' size='sm' onClick={handleSave}>Save</ButtonIcon>
                    <ButtonIcon className='btnCancel' icon='cancel' theme='danger' size='sm' onClick={handleCloseDialog}>Cancel</ButtonIcon>
                </CardBody>
            </ModalCard>
        </AccessibilityProvider>
    );
};
export {
    SimpleEditModelDialog,
    SimpleEditModelDialog as default,
}
