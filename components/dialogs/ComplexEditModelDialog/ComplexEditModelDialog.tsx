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
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

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
    // base-content-components:
    Content,
    
    
    
    // simple-components:
    ButtonIcon,
    CloseButton,
    
    
    
    // layout-components:
    List,
    CardHeader,
    CardFooter,
    
    
    
    // dialog-components:
    ModalExpandedChangeEvent,
    ModalCardProps,
    ModalCard,
    
    
    
    // composite-components:
    TabPanel,
    TabProps,
    Tab,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    MessageLoading,
}                           from '@/components/MessageLoading'
import {
    MessageErrorProps,
    MessageError,
}                           from '@/components/MessageError'

// internals:
import type {
    Model,
    PartialModel,
}                           from '@/libs/types'



// styles:
const useComplexEditModelDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./ComplexEditModelDialogStyles')
, { id: 'h5dj0g5h71' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './ComplexEditModelDialogStyles'



// react components:
export type ComplexEditModelDialogResult<TModel extends Model> = PartialModel<TModel>|false|undefined // TModel: created|updated; false: deleted; undefined: not created|modified
export interface ComplexEditModelDialogExpandedChangeEvent<TModel extends Model> extends ModalExpandedChangeEvent<ComplexEditModelDialogResult<TModel>> {}

export type UpdateHandler<TModel extends Model>         = (args: { id: string|null, whenAdd: boolean, whenUpdate: Record<string, boolean> }) => PartialModel<TModel>|Promise<PartialModel<TModel>>
export type UpdateDraftHandler<TModel extends Model>    = (args: { draftModel: TModel, whenAdd: boolean, whenUpdate: Record<string, boolean> }) => PartialModel<TModel>|Promise<PartialModel<TModel>>
export type UpdatedHandler<TModel extends Model>        = (updatedModel: PartialModel<TModel>) => void|Promise<void>
export type AfterUpdateHandler                          = () => void|Promise<void>

export type DeleteHandler<TModel extends Model>         = (deletingModel: TModel) => void|Promise<void>
export type AfterDeleteHandler                          = () => void|Promise<void>

export type UpdateSideHandler                           = () => void|Promise<void>
export type DeleteSideHandler                           = () => void|Promise<void>

export type ConfirmDeleteHandler<TModel extends Model>  = (args: { model: TModel      }) => { title?: React.ReactNode, message: React.ReactNode }
export type ConfirmUnsavedHandler<TModel extends Model> = (args: { model: TModel|null }) => { title?: React.ReactNode, message: React.ReactNode }

export interface ComplexEditModelDialogProps<TModel extends Model>
    extends
        // bases:
        Omit<ModalCardProps<HTMLElement, ComplexEditModelDialogExpandedChangeEvent<TModel>>,
            // children:
            |'children'        // already taken over
        >,
        
        // components:
        Pick<TabProps,
            // states:
            |'defaultExpandedTabIndex'
        >
{
    // data:
    modelName         : string
    modelEntryName   ?: string|null
    model             : TModel|null
    
    
    
    // privileges:
    privilegeAdd     ?: boolean
    privilegeUpdate  ?: Record<string, boolean>
    privilegeDelete  ?: boolean
    
    
    
    // stores:
    isModelLoading   ?: boolean
    isModelError     ?: boolean
    onModelRetry     ?: MessageErrorProps['onRetry']
    
    isModified       ?: boolean
    isCommiting      ?: boolean
    isReverting      ?: boolean
    isDeleting       ?: boolean
    
    
    
    // tabs:
    tabDelete        ?: React.ReactNode
    
    
    
    // handlers:
    onUpdate         ?: UpdateHandler<TModel>
    onAfterUpdate    ?: AfterUpdateHandler
    
    onDelete         ?: DeleteHandler<TModel>
    onAfterDelete    ?: AfterDeleteHandler
    
    onSideUpdate     ?: UpdateSideHandler
    onSideDelete     ?: DeleteSideHandler
    
    onConfirmDelete  ?: ConfirmDeleteHandler<TModel>
    onConfirmUnsaved ?: ConfirmUnsavedHandler<TModel>
    
    
    
    // children:
    children          : React.ReactNode | ((args: { whenAdd: boolean, whenUpdate: Record<string, boolean> }) => React.ReactNode)
}
export type ImplementedComplexEditModelDialogProps<TModel extends Model> = Omit<ComplexEditModelDialogProps<TModel>,
    // data:
    |'modelName'        // already taken over
    |'modelEntryName'   // already taken over
    
    // privileges:
    |'privilegeAdd'     // already taken over
    |'privilegeUpdate'  // already taken over
    |'privilegeDelete'  // already taken over
    
    // stores:
    |'isModified'       // already taken over
    |'isCommiting'      // already taken over
    |'isReverting'      // already taken over
    |'isDeleting'       // already taken over
    
    // tabs:
    |'tabDelete'        // already taken over
    
    // handlers:
    |'onUpdate'         // already taken over
    |'onAfterUpdate'    // already taken over
    |'onDelete'         // already taken over
    |'onAfterDelete'    // already taken over
    |'onSideUpdate'     // already taken over
    |'onSideDelete'     // already taken over
    |'onConfirmDelete'  // already taken over
    |'onConfirmUnsaved' // already taken over
    
    // children:
    |'children'         // already taken over
>
const ComplexEditModelDialog = <TModel extends Model>(props: ComplexEditModelDialogProps<TModel>): JSX.Element|null => {
    // styles:
    const styleSheet = useComplexEditModelDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        modelName,
        modelEntryName,
        model,
        
        
        
        // privileges:
        privilegeAdd    = false,
        privilegeUpdate = {},
        privilegeDelete = false,
        
        
        
        // stores:
        isModelLoading = false,
        isModelError   = false,
        onModelRetry,
        
        isModified     = false,
        isCommiting    = false,
        isReverting    = false,
        isDeleting     = false,
        
        
        
        // tabs:
        tabDelete,
        
        
        
        // states:
        defaultExpandedTabIndex,
        
        
        
        // handlers:
        onUpdate,
        onAfterUpdate,
        
        onDelete,
        onAfterDelete,
        
        onSideUpdate,
        onSideDelete,
        
        onConfirmDelete,
        onConfirmUnsaved,
        
        onExpandedChange,
        
        
        
        // children:
        children : childrenFn,
    ...restModalCardProps} = props;
    const isModelNoData = isModelLoading || isModelError;
    
    const whenAdd    : boolean                 =   !model && privilegeAdd;
    const whenUpdate : Record<string, boolean> =  !!model ?  privilegeUpdate : {};
    const whenDelete : boolean                 =  !!model && privilegeDelete;
    const whenWrite  : boolean                 = (
        whenAdd
        || !!Object.keys(whenUpdate).length
        /* || whenDelete */ // except for delete
    );
    const isLoading = isCommiting || isReverting || isDeleting;
    
    
    
    // states:
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    
    
    
    // refs:
    const editorRef = useRef<HTMLFormElement|null>(null);
    
    
    
    // effects:
    const isMounted = useMountedFlag();
    
    
    
    // dialogs:
    const {
        showMessage,
        showMessageFieldError,
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleSave           = useEvent(async () => {
        if (!whenWrite) return;
        
        
        
        setEnableValidation(true);
        await new Promise<void>((resolve) => { // wait for a validation state applied
            setTimeout(() => {
                setTimeout(() => {
                    resolve();
                }, 0);
            }, 0);
        });
        const fieldErrors = editorRef?.current?.querySelectorAll?.(':is(.invalidating, .invalidated):not([aria-invalid="false"])');
        if (fieldErrors?.length) { // there is an/some invalid field
            showMessageFieldError(fieldErrors);
            return;
        } // if
        
        
        
        try {
            const updatingModelRaw = onUpdate?.({
                id : model?.id || null,
                
                whenAdd,
                whenUpdate,
            });
            const updatingModelTask = (updatingModelRaw instanceof Promise) ? updatingModelRaw : Promise.resolve(updatingModelRaw);
            
            const updatingModelAndOthersTask = (
                updatingModelTask
                ? (
                    onAfterUpdate
                    ? updatingModelTask.then(onAfterUpdate)
                    : updatingModelTask
                )
                : Promise.resolve(onAfterUpdate)
            );
            
            await handleFinalizing(updatingModelTask, /*commitSides = */true, [updatingModelAndOthersTask]); // result: created|mutated
        }
        catch (fetchError: any) {
            showMessageFetchError(fetchError);
        } // try
    });
    const handleDelete         = useEvent(async () => {
        // conditions:
        if (!model) return; // no model to delete => ignore
        {
            const {
                title   = <h1>Delete Confirmation</h1>,
                message = <p>
                    Are you sure to delete {!modelEntryName ? 'this ' : ''}<strong>{
                        // the model name is entered:
                        modelEntryName
                        ||
                        // the model name is blank:
                        modelName
                    }</strong>
                </p>,
            } = onConfirmDelete?.({model}) ?? {};
            if (
                (await showMessage<'yes'|'no'>({
                    theme    : 'warning',
                    title    : title,
                    message  : message,
                    options  : {
                        yes  : <ButtonIcon icon='check'          theme='primary'>Yes</ButtonIcon>,
                        no   : <ButtonIcon icon='not_interested' theme='secondary' autoFocus={true}>No</ButtonIcon>,
                    },
                }))
                !==
                'yes'
            ) return false;
            if (!isMounted.current) return false; // the component was unloaded before awaiting returned => do nothing
        } // if
        
        
        
        // actions:
        try {
            const deletingModelTask = onDelete?.(model);
            
            const deletingModelAndOthersTask = (
                deletingModelTask
                ? (
                    onAfterDelete
                    ? deletingModelTask.then(onAfterDelete)
                    : deletingModelTask
                )
                : Promise.resolve(onAfterDelete)
            );
            
            await handleFinalizing(false, /*commitSides = */false, [deletingModelAndOthersTask]); // result: deleted
        }
        catch (fetchError: any) {
            showMessageFetchError(fetchError);
        } // try
    });
    const handleSideSave       = useEvent(async (commitSides : boolean) => {
        if (!whenWrite) return;
        
        
        
        if (commitSides) {
            await onSideUpdate?.();
        }
        else {
            await onSideDelete?.();
        } // if
    });
    
    const handleCloseDialog    = useEvent(async () => {
        if (whenWrite && isModified) {
            // conditions:
            let answer : 'save'|'dontSave'|'continue'|undefined = 'save';
            {
                const {
                    title   = <h1>Unsaved Data</h1>,
                    message = <p>
                        Do you want to save the changes?
                    </p>,
                } = onConfirmUnsaved?.({model}) ?? {};
                answer = await showMessage<'save'|'dontSave'|'continue'>({
                    theme         : 'warning',
                    title         : title,
                    message       : message,
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
            } // if
            
            
            
            // actions:
            switch (answer) {
                case 'save':
                    // then do a save (it will automatically close the editor after successfully saving):
                    handleSave();
                    break;
                case 'dontSave':
                    // then close the editor (without saving):
                    await handleFinalizing(undefined, /*commitSides = */false); // result: discard changes
                    break;
                default:
                    // do nothing (continue editing)
                    break;
            } // switch
        }
        else {
            await handleFinalizing(undefined, /*commitSides = */false); // result: no changes
        } // if
    });
    const handleFinalizing     = useEvent(async (result: ComplexEditModelDialogResult<TModel>|Promise<ComplexEditModelDialogResult<TModel>>, commitSides : boolean, processingTasks : Promise<any>[] = []) => {
        await Promise.all([
            handleSideSave(commitSides),
            ...processingTasks,
        ]);
        
        
        
        onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
            data       : await result,
        });
    });
    
    const handleExpandedChange = useEvent<EventHandler<ComplexEditModelDialogExpandedChangeEvent<TModel>>>((event) => {
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
                
                
                
                // handlers:
                onExpandedChange = {handleExpandedChange}
            >
                <CardHeader>
                    <h1>{
                        // the model name is entered:
                        modelEntryName
                        ||
                        // the model name is blank:
                        (
                            !model
                            ? `Create New ${modelName}` // create new model, if no  model
                            : `Edit ${modelName}`       // edit model      , if has model
                        )
                    }</h1>
                    <CloseButton onClick={handleCloseDialog} />
                </CardHeader>
                
                {isModelNoData && <Content
                    // variants:
                    theme={isModelError ? 'danger' : undefined}
                    
                    
                    
                    // classes:
                    className={`${styleSheet.cardBody} body noData`}
                >
                    {!isModelError && <MessageLoading />}
                    {isModelError  && <MessageError onRetry={onModelRetry} />}
                </Content>}
                
                {!isModelNoData && <ValidationProvider
                    // validations:
                    enableValidation={enableValidation}
                    inheritValidation={false}
                >
                    <Tab
                        // variants:
                        mild='inherit'
                        
                        
                        
                        // classes:
                        className={styleSheet.cardBody}
                        
                        
                        
                        // states:
                        defaultExpandedTabIndex={defaultExpandedTabIndex}
                        
                        
                        
                        // components:
                        listComponent={
                            <List
                                // classes:
                                className={styleSheet.tabList}
                            />
                        }
                        bodyComponent={
                            <Content
                                // refs:
                                elmRef={editorRef} // use elmRef, to validate all input(s) inside <Tab>'s body
                                
                                
                                
                                // classes:
                                className={styleSheet.tabBody}
                            />
                        }
                    >
                        {(typeof(childrenFn) === 'function') ? childrenFn?.({
                            whenAdd,
                            whenUpdate,
                        }) : childrenFn}
                        {whenDelete && <TabPanel label={tabDelete} panelComponent={<Content theme='warning' className={styleSheet.tabDelete} />}>
                            <ButtonIcon icon={isDeleting ? 'busy' : 'delete'} theme='danger' onClick={handleDelete}>
                                Delete {!modelEntryName ? 'this ' : ''}<strong>{
                                    // the model name is entered:
                                    modelEntryName
                                    ||
                                    // the model name is blank:
                                    modelName
                                }</strong>
                            </ButtonIcon>
                        </TabPanel>}
                    </Tab>
                </ValidationProvider>}
                
                <CardFooter>
                    {whenWrite && !isModelNoData && <ButtonIcon
                        // appearances:
                        icon={
                            isCommiting
                            ? 'busy'
                            : 'save'
                        }
                        
                        
                        
                        // variants:
                        theme='success'
                        
                        
                        
                        // classes:
                        className='btnSave'
                        
                        
                        
                        // handlers:
                        onClick={handleSave}
                    >
                        Save
                    </ButtonIcon>}
                    
                    <ButtonIcon
                        // appearances:
                        icon={
                            isModelNoData
                            ? 'cancel'
                            : (
                                whenWrite
                                ? (
                                    isReverting
                                    ? 'busy'
                                    : 'cancel'
                                )
                                : 'done'
                            )
                        }
                        
                        
                        
                        // variants:
                        theme={
                            isModelNoData
                            ? 'primary'
                            : (
                                whenWrite
                                ? 'danger'
                                : 'primary'
                            )
                        }
                        
                        
                        
                        // classes:
                        className='btnCancel'
                        
                        
                        
                        // handlers:
                        onClick={handleCloseDialog}
                    >
                        {
                            isModelNoData
                            ? 'Close'
                            : (
                                isReverting
                                ? 'Reverting'
                                : (
                                    whenWrite
                                    ? 'Cancel'
                                    : 'Close'
                                )
                            )
                        }
                    </ButtonIcon>
                </CardFooter>
            </ModalCard>
        </AccessibilityProvider>
    );
};
export {
    ComplexEditModelDialog,
    ComplexEditModelDialog as default,
}
