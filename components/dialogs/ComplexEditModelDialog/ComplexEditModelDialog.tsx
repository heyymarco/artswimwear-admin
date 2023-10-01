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
    Tab,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internals:
import type {
    Model,
}                           from '@/libs/types'



// styles:
const useComplexEditModelDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./ComplexEditModelDialogStyles')
, { id: 'h5dj0g5h71' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './ComplexEditModelDialogStyles'



// react components:
export type EditModelDialogResult = string|false|null
export interface EditModelDialogExpandedChangeEvent extends ModalExpandedChangeEvent {
    result: EditModelDialogResult
}

export type UpdateModelHandler                               = (args: { id: string|null, privilegeModelAdd: boolean, privilegeModelUpdate: boolean }) => Promise<string>
export type AfterUpdateModelHandler                          = () => Promise<void>

export type DeleteModelHandler                               = (args: { id: string }) => Promise<void>
export type AfterDeleteModelHandler                          = () => Promise<void>

export type UpdateSideModelHandler                           = () => Promise<void>
export type DeleteSideModelHandler                           = () => Promise<void>

export type DeleteModelConfirmHandler<TModel extends Model>  = (args: { model: TModel }) => { title?: React.ReactNode, message: React.ReactNode }
export type UnsavedModelConfirmHandler<TModel extends Model> = (args: { model: TModel }) => { title?: React.ReactNode, message: React.ReactNode }

export interface ComplexEditModelDialogProps<TModel extends Model>
    extends
        Omit<ModalCardProps<HTMLElement, EditModelDialogExpandedChangeEvent>,
            // children:
            |'children'      // already taken over
        >
{
    // data:
    modelName                : string
    modelEntryName          ?: string|null
    model                    : TModel|null
    
    
    
    // privileges:
    privilegeModelAdd        : boolean
    privilegeModelUpdate     : boolean
    privilegeModelDelete     : boolean
    
    
    
    // stores:
    isModelModified          : boolean
    isCommitingModel         : boolean
    isRevertingModel         : boolean
    isDeletingModel          : boolean
    
    
    
    // tabs:
    tabDelete                : React.ReactNode
    
    
    
    // states:
    defaultExpandedTabIndex ?: number
    
    
    
    // handlers:
    onUpdateModel            : UpdateModelHandler
    onAfterUpdateModel      ?: AfterUpdateModelHandler
    
    onDeleteModel            : DeleteModelHandler
    onAfterDeleteModel      ?: AfterDeleteModelHandler
    
    onUpdateSideModel       ?: UpdateSideModelHandler
    onDeleteSideModel       ?: DeleteSideModelHandler
    
    onDeleteModelConfirm     : DeleteModelConfirmHandler<TModel>
    onUnsavedModelConfirm    : UnsavedModelConfirmHandler<TModel>
    
    
    
    // children:
    children                 : (args: { privilegeModelAdd: boolean, privilegeModelUpdate: boolean }) => React.ReactNode
}
export const ComplexEditModelDialog = <TModel extends Model>(props: ComplexEditModelDialogProps<TModel>): JSX.Element|null => {
    // styles:
    const styleSheet = useComplexEditModelDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        modelName,
        modelEntryName,
        model,
        
        
        
        // privileges:
        privilegeModelAdd    : privilegeModelAddRaw,
        privilegeModelUpdate : privilegeModelUpdateRaw,
        privilegeModelDelete : privilegeModelDeleteRaw,
        
        
        
        // stores:
        isModelModified,
        isCommitingModel,
        isRevertingModel,
        isDeletingModel,
        
        
        
        // tabs:
        tabDelete,
        
        
        
        // states:
        defaultExpandedTabIndex,
        
        
        
        // handlers:
        onUpdateModel,
        onAfterUpdateModel,
        
        onDeleteModel,
        onAfterDeleteModel,
        
        onUpdateSideModel,
        onDeleteSideModel,
        
        onDeleteModelConfirm,
        onUnsavedModelConfirm,
        
        onExpandedChange,
        
        
        
        // children:
        children : childrenFn,
    ...restModalCardProps} = props;
    const privilegeModelAdd    : boolean = privilegeModelAddRaw    &&  !model?.id;
    const privilegeModelUpdate : boolean = privilegeModelUpdateRaw && !!model?.id;
    const privilegeModelDelete : boolean = privilegeModelDeleteRaw && !!model?.id;
    const privilegeModelWrite  : boolean = (
        privilegeModelAdd
        || privilegeModelUpdate
        /* || privilegeModelDelete */ // except for delete
    );
    const isLoading = isCommitingModel || isRevertingModel || isDeletingModel;
    
    
    
    // states:
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    
    
    // dialogs:
    const {
        showMessage,
        showMessageFieldError,
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // refs:
    const editorRef = useRef<HTMLFormElement|null>(null);
    
    
    
    // handlers:
    const handleSaveModel      = useEvent(async () => {
        if (!privilegeModelWrite) return;
        
        
        
        setEnableValidation(true);
        await new Promise<void>((resolve) => { // wait for a validation state applied
            setTimeout(() => {
                setTimeout(() => {
                    resolve();
                }, 0);
            }, 0);
        });
        const fieldErrors = editorRef?.current?.querySelectorAll?.(':is(.invalidating, .invalidated)');
        if (fieldErrors?.length) { // there is an/some invalid field
            showMessageFieldError(fieldErrors);
            return;
        } // if
        
        
        
        try {
            const updatingModelTask = onUpdateModel({
                id : model?.id || null,
                
                privilegeModelAdd,
                privilegeModelUpdate,
            });
            
            const updatingModelAndOthersTask = onAfterUpdateModel ? updatingModelTask.then(onAfterUpdateModel) : updatingModelTask;
            
            await handleFinalizing(updatingModelTask, /*commitImages = */true, [updatingModelAndOthersTask]); // result: created|mutated
        }
        catch (error: any) {
            showMessageFetchError(error);
        } // try
    });
    const handleDeleteModel    = useEvent(async () => {
        // conditions:
        if (!model) return; // no model to delete => ignore
        const {
            title   = <h1>Delete Confirmation</h1>,
            message,
        } = onDeleteModelConfirm({model});
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
        
        
        
        // actions:
        try {
            const deletingModelTask = onDeleteModel({
                id : model.id,
            });
            
            const deletingModelAndOthersTask = onAfterDeleteModel ? deletingModelTask.then(onAfterDeleteModel) : deletingModelTask;
            
            await handleFinalizing(false, /*commitImages = */false, [deletingModelAndOthersTask]); // result: deleted
        }
        catch (error: any) {
            showMessageFetchError(error);
        } // try
    });
    const handleSaveSideModel  = useEvent(async (commitImages : boolean) => {
        if (!privilegeModelWrite) return;
        
        
        
        if (commitImages) {
            await onUpdateSideModel?.();
        }
        else {
            await onDeleteSideModel?.();
        } // if
    });
    
    const handleCloseDialog    = useEvent(async () => {
        if (privilegeModelWrite && isModelModified) {
            // conditions:
            if (!model) return; // no model to update => ignore
            const {
                title   = <h1>Unsaved Data</h1>,
                message = <p>
                    Do you want to save the changes?
                </p>,
            } = onUnsavedModelConfirm({model});
            const answer = await showMessage<'save'|'dontSave'|'continue'>({
                theme         : 'warning',
                title         : title,
                message       : message,
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
                    handleSaveModel();
                    break;
                case 'dontSave':
                    // then close the editor (without saving):
                    await handleFinalizing(null, /*commitImages = */false); // result: discard changes
                    break;
                default:
                    // do nothing (continue editing)
                    break;
            } // switch
        }
        else {
            await handleFinalizing(null, /*commitImages = */false); // result: no changes
        } // if
    });
    const handleFinalizing     = useEvent(async (event: EditModelDialogResult|Promise<EditModelDialogResult>, commitImages : boolean, otherTasks : Promise<any>[] = []) => {
        await Promise.all([
            handleSaveSideModel(commitImages),
            ...otherTasks,
        ]);
        onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
            result     : await event,
        });
    });
    const handleExpandedChange : EventHandler<EditModelDialogExpandedChangeEvent> = useEvent((event) => {
        // conditions:
        if (event.actionType === 'shortcut') return; // prevents closing modal by accidentally pressing [esc]
        
        
        
        // actions:
        onExpandedChange?.({
            ...event,
            result : event.result ?? null,
        });
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
                onExpandedChange={handleExpandedChange}
            >
                <CardHeader>
                    <h1>{!!modelEntryName ? `Create New ${modelName}` : `Edit ${modelName}`}</h1>
                    <CloseButton onClick={handleCloseDialog} />
                </CardHeader>
                <ValidationProvider enableValidation={enableValidation} inheritValidation={false}>
                    <Tab
                        // refs:
                        elmRef={editorRef}
                        
                        
                        
                        // variants:
                        mild='inherit'
                        
                        
                        
                        // classes:
                        className={styleSheet.cardBody}
                        
                        
                        
                        // states:
                        defaultExpandedTabIndex={defaultExpandedTabIndex}
                        
                        
                        
                        // components:
                        listComponent={<List className={styleSheet.tabList} />}
                        bodyComponent={<Content className={styleSheet.tabBody} />}
                    >
                        {childrenFn?.({
                            privilegeModelAdd,
                            privilegeModelUpdate,
                        })}
                        {privilegeModelDelete && <TabPanel label={tabDelete} panelComponent={<Content theme='warning' className={styleSheet.tabDelete} />}>
                            <ButtonIcon icon={isDeletingModel ? 'busy' : 'delete'} theme='danger' onClick={handleDeleteModel}>
                                Delete <strong>{modelEntryName}</strong>
                            </ButtonIcon>
                        </TabPanel>}
                    </Tab>
                </ValidationProvider>
                <CardFooter>
                    {privilegeModelWrite && <ButtonIcon className='btnSave'   icon={isCommitingModel ? 'busy' : 'save'  } theme='success' onClick={handleSaveModel}>Save</ButtonIcon>}
                    <ButtonIcon className='btnCancel' icon={privilegeModelWrite ? (isRevertingModel ? 'busy' : 'cancel') : 'done'} theme={privilegeModelWrite ? 'danger' : 'primary'}  onClick={handleCloseDialog}>{isRevertingModel ? 'Reverting' : (privilegeModelWrite ? 'Cancel' : 'Close')}</ButtonIcon>
                </CardFooter>
            </ModalCard>
        </AccessibilityProvider>
    );
};
