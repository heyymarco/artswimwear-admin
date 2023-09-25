'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
    useEffect,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

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
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Generic,
    
    
    
    // base-content-components:
    Content,
    
    
    
    // simple-components:
    Icon,
    ButtonIcon,
    CloseButton,
    
    
    
    // layout-components:
    ListItem,
    List,
    CardHeader,
    CardFooter,
    
    
    
    // composite-components:
    TabPanel,
    Tab,
    
    
    
    // utility-components:
    ModalStatus,
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'

// internal components:
import {
    EditButton,
}                           from '@/components/EditButton'
import type {
    EditorChangeEventHandler,
}                           from '@/components/editors/Editor'
import {
    TextEditor,
}                           from '@/components/editors/TextEditor'
import {
    UsernameEditor,
}                           from '@/components/editors/UsernameEditor'
import {
    EmailEditor,
}                           from '@/components/editors/EmailEditor'
import {
    UploadImage,
}                           from '@/components/editors/UploadImage'
import {
    RoleEditor,
}                           from '@/components/editors/RoleEditor'
import type {
    ModelCreateProps,
    ModelPreviewProps,
}                           from '@/components/SectionModelEditor'
import {
    RadioDecorator,
}                           from '@/components/RadioDecorator'

// private components:
import {
    EditRoleDialog,
}                           from './EditRoleDialog'

// stores:
import {
    // types:
    UserDetail,
    RoleDetail,
    
    
    
    // hooks:
    useUpdateUser,
    useDeleteUser,
    
    usePostImage,
    useDeleteImage,
    
    useGetRoleList,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'

// configs:
import {
    STORE_WEBSITE_URL,
    
    PAGE_USER_TAB_ACCOUNT,
    PAGE_USER_TAB_IMAGE,
    PAGE_USER_TAB_ROLE,
    PAGE_USER_TAB_DELETE,
}                           from '@/website.config'



// styles:
const useEditUserDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./EditUserDialogStyles')
, { id: 'm4oi6itiaq' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './EditUserDialogStyles';
import LoadingBar from '@heymarco/loading-bar'



// utilities:
const emptyUser : UserDetail = {
    id       : '',
    
    name     : '',
    email    : '',
    image    : null,
    
    roleId   : null,
    
    username : null,
};



// react components:

/* <RoleCreate> */
interface RoleCreateProps extends ModelCreateProps {}
const RoleCreate = (props: RoleCreateProps): JSX.Element|null => {
    // jsx:
    return (
        <EditRoleDialog role={undefined} onClose={props.onClose} />
    );
};

/* <RolePreview> */
interface RolePreviewProps extends Omit<ModelPreviewProps<RoleDetail>, 'onChange'> {
    // data:
    selectedRoleId : string|null
    
    
    
    // appearances:
    isShown        : boolean
    
    
    
    // handlers:
    onChange      ?: EditorChangeEventHandler<string|null>
}
const RolePreview = (props: RolePreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = useEditUserDialogStyleSheet();
    
    
    
    const {
        // data:
        model,
        selectedRoleId,
        
        
        
        // appearances:
        isShown,
        
        
        
        // handlers:
        onChange,
    ...restListItemProps} = props;
    const {
        id,
        name,
    } = model;
    const isSelected = ((selectedRoleId || null) === (id || null));
    
    
    
    // states:
    type EditMode = 'full'
    const [editMode, setEditMode] = useState<EditMode|null>(null);
    
    
    
    // refs:
    const listItemRef = useRef<HTMLElement|null>(null);
    
    
    
    // handlers:
    const handleEditDialogClose = useEvent((): void => {
        setEditMode(null);
    });
    const handleClick = useEvent<React.MouseEventHandler<HTMLElement>>((event) => {
        if (!!editMode) return; // ignore bubbling from <EditRoleDialog>
        onChange?.(id || null);
    });
    
    
    
    // dom effects:
    // initial-focus on initial-tab-is-role:
    useEffect(() => {
        // conditions:
        if (!isShown)     return;
        if (!isSelected)  return;
        const listItemElm = listItemRef.current;
        if (!listItemElm) return;
        
        
        
        // actions:
        setTimeout(() => {
            listItemElm.scrollIntoView({
                behavior : 'smooth',
                
                inline   : 'nearest',
                block    : 'nearest',
            });
        }, 500); // a delay to compensate <Modal> showing => <Modal> shown
        // @ts-ignore
    }, []);
    
    // re-focus on selected tab changed:
    useEffect(() => {
        // conditions:
        if (!isShown)     return;
        if (!isSelected)  return;
        const listItemElm = listItemRef.current;
        if (!listItemElm) return;
        
        
        
        // actions:
        listItemElm.scrollIntoView({
            behavior : 'smooth',
            
            inline   : 'nearest',
            block    : 'nearest',
        });
        // @ts-ignore
    }, [isShown, /* isSelected // do not re-focus on re-selected */]);
    
    
    
    // jsx:
    return (
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // refs:
            elmRef={listItemRef}
            
            
            
            // classes:
            className={styleSheet.roleItem}
            
            
            
            // behaviors:
            actionCtrl={true}
            
            
            
            // states:
            active={isSelected}
            
            
            
            // handlers:
            onClick={handleClick}
        >
            <RadioDecorator />
            <p className='name'>{!!id ? name : <span className='noValue'>No Access</span>}</p>
            {!!id && <EditButton
                iconComponent={<Icon icon='edit' mild={isSelected} />}
                onClick={(event) => { setEditMode('full'); event.stopPropagation(); }}
            />}
            {/* edit dialog: */}
            {!!id && <ModalStatus theme='primary' modalCardStyle='scrollable' backdropStyle='static' onExpandedChange={({expanded}) => !expanded && setEditMode(null)}>
                {!!editMode && (editMode === 'full') && <EditRoleDialog role={model} onClose={handleEditDialogClose} />}
            </ModalStatus>}
        </ListItem>
    );
}

/* <EditUserDialog> */
export interface EditUserDialogProps {
    // data:
    user                    ?: UserDetail
    defaultExpandedTabIndex ?: number
    
    
    
    // handlers:
    onClose                  : () => void
}
export const EditUserDialog = (props: EditUserDialogProps): JSX.Element|null => {
    // styles:
    const styleSheet = useEditUserDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        user = emptyUser,
        defaultExpandedTabIndex,
        
        
        
        // handlers:
        onClose,
    } = props;
    
    
    
    // stores:
    const {data: roleList, isLoading: isLoadingRole, isError: isErrorRole} = useGetRoleList();
    
    
    
    // states:
    const { data: session, update : updateSession} = useSession();
    
    const [isTabRoleShown  , setIsTabRoleShown   ] = useState<boolean>(() => (defaultExpandedTabIndex === 2));
    
    const [isPathModified  , setIsPathModified   ] = useState<boolean>(false);
    const [isModified      , setIsModified       ] = useState<boolean>(false);
    
    const [enableValidation, setEnableValidation ] = useState<boolean>(false);
    const [name            , setName             ] = useState<string>(user.name);
    const [email           , setEmail            ] = useState<string>(user.email);
    const [image           , setImage            ] = useState<string|null>(user.image);
    const [roleId          , setRoleId           ] = useState<string|null>(user.roleId);
    const [username        , setUsername         ] = useState<string|null>(user.username);
    
    const initialEmailRef                          = useRef<string>(user.email);
    
    const initialImageRef                          = useRef<string|null>(user.image);
    const [draftDeletedImages                    ] = useState<Map<string, boolean|null>>(() => new Map<string, boolean|null>());
    
    
    
    // stores:
    const [updateUser       , {isLoading : isLoadingModelUpdate      }] = useUpdateUser();
    const [deleteUser       , {isLoading : isLoadingModelDelete      }] = useDeleteUser();
    const [postImage                                                  ] = usePostImage();
    const [commitDeleteImage, {isLoading : isLoadingCommitDeleteImage}] = useDeleteImage();
    const [revertDeleteImage, {isLoading : isLoadingRevertDeleteImage}] = useDeleteImage();
    const isCommiting = isLoadingModelUpdate || isLoadingCommitDeleteImage;
    const isReverting = isLoadingRevertDeleteImage;
    const isLoading   = isCommiting || isReverting || isLoadingModelDelete;
    
    
    
    // refs:
    const firstEditorRef = useRef<HTMLInputElement|null>(null); // TODO: finish this
    const editorFormRef  = useRef<HTMLFormElement|null>(null);
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    
    
    // dialogs:
    const {
        showMessage,
        showMessageFieldError,
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const tabRoleHandleCollapseStart = useEvent<EventHandler<void>>(() => {
        setIsTabRoleShown(false);
    });
    const tabRoleHandleExpandEnd    = useEvent<EventHandler<void>>(() => {
        setIsTabRoleShown(true);
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
        const fieldErrors = editorFormRef?.current?.querySelectorAll?.(':is(.invalidating, .invalidated)');
        if (fieldErrors?.length) { // there is an/some invalid field
            showMessageFieldError(fieldErrors);
            return;
        } // if
        
        
        
        try {
            const updatingUserTask = updateUser({
                id             : user.id,
                
                name,
                email,
                image,
                roleId,
                username : username || null, // convert empty string to null
            }).unwrap().then(async (): Promise<void> => {
                if (session?.user?.email?.toLowerCase() === initialEmailRef.current.toLowerCase()) await updateSession(); // update the session if updated current user
            });
            
            await handleClose(/*commitImages = */true, [updatingUserTask]);
        }
        catch (error: any) {
            showMessageFetchError(error);
        } // try
    });
    const handleDelete = useEvent(async () => {
        // conditions:
        if (
            (await showMessage<'yes'|'no'>({
                theme    : 'warning',
                title    : <h1>Delete Confirmation</h1>,
                message  : <>
                    <p>
                        Are you sure to delete user <strong>{user.name}</strong>?
                    </p>
                </>,
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
            await deleteUser({
                id : user.id,
            }).unwrap();
            
            await handleClose(/*commitImages = */false);
        }
        catch (error: any) {
            showMessageFetchError(error);
        } // try
    });
    const handleClosing = useEvent(async () => {
        if (isModified || isPathModified) {
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
                    await handleClose(/*commitImages = */false);
                    break;
                default:
                    // do nothing (continue editing)
                    break;
            } // switch
        }
        else {
            await handleClose(/*commitImages = */false);
        } // if
    });
    const handleSaveImages = useEvent(async (commitImages : boolean) => {
        // initial_image have been replaced with new image:
        if (commitImages && initialImageRef.current && (initialImageRef.current !== image)) {
            // register to actual_delete the initial_image when committed:
            draftDeletedImages.set(initialImageRef.current, true /* true: delete when committed, noop when reverted */);
        } // if
        
        
        
        // search for unused image(s) and delete them:
        const unusedImageIds : string[] = [];
        for (const unusedImageId of
            Array.from(draftDeletedImages.entries())
            .filter((draftDeletedImage) => ((draftDeletedImage[1] === commitImages) || (draftDeletedImage[1] === null)))
            .map((draftDeletedImage) => draftDeletedImage[0])
        )
        {
            unusedImageIds.push(unusedImageId);
        } // for
        
        
        
        try {
            if (unusedImageIds.length) {
                await (commitImages ? commitDeleteImage : revertDeleteImage)({
                    imageId : unusedImageIds,
                }).unwrap();
            } // if
        }
        catch {
            // ignore any error
            return; // but do not clear the draft
        } // try
        
        
        
        // substract the drafts:
        for (const unusedImageId of unusedImageIds) draftDeletedImages.delete(unusedImageId);
    });
    const handleClose = useEvent(async (commitImages : boolean, otherTasks : Promise<any>[] = []) => {
        await Promise.all([
            handleSaveImages(commitImages),
            ...otherTasks,
        ]);
        onClose();
    });
    const handleKeyDown : React.KeyboardEventHandler<HTMLElement> = useEvent((event) => {
        switch (event.key) {
            // case 'Enter':
            //     event.preventDefault();
            //     handleSave();
            //     break;
            
            case 'Escape':
                event.preventDefault();
                // handleClosing();
                break;
        } // switch
    });
    
    
    
    // dom effects:
    
    // autoFocus on first editor:
    useEffect(() => {
        // setups:
        const cancelFocus = setTimeout(() => {
            // conditions:
            const firstEditorElm = firstEditorRef.current;
            if (!firstEditorElm) return;
            
            
            
            firstEditorElm.setSelectionRange(0, -1);
            firstEditorElm.focus({ preventScroll: true });
        }, 100);
        
        
        
        // cleanups:
        return () => {
            clearTimeout(cancelFocus);
        };
    }, []);
    
    
    
    // jsx:
    return (
        <AccessibilityProvider enabled={!isLoading}>
            <CardHeader
                // handlers:
                onKeyDown={handleKeyDown}
            >
                <h1>{name || ((user === emptyUser) ? 'Create New User' : 'Edit User')}</h1>
                <CloseButton onClick={handleClosing} />
            </CardHeader>
            <ValidationProvider enableValidation={enableValidation} inheritValidation={false}>
                <Tab
                    // variants:
                    mild='inherit'
                    
                    
                    
                    // classes:
                    className={styleSheet.cardBody}
                    
                    
                    
                    // values:
                    defaultExpandedTabIndex={defaultExpandedTabIndex}
                    
                    
                    
                    // components:
                    listComponent={<List className={styleSheet.tabList} />}
                    bodyComponent={<Content className={styleSheet.tabBody} />}
                    
                    
                    
                    // handlers:
                    onKeyDown={handleKeyDown}
                >
                    <TabPanel label={PAGE_USER_TAB_ACCOUNT} panelComponent={<Generic className={styleSheet.accountTab} />}>
                        <form ref={editorFormRef}>
                            <span className='name label'>Name:</span>
                            <TextEditor     className='name editor'       aria-label='Name'     autoComplete='nope' required={true }  value={name}                                              onChange={(value) => { setName(value)    ; setIsModified(true); }} elmRef={firstEditorRef} autoCapitalize='words' />
                            
                            <span className='username label'>Username:</span>
                            <UsernameEditor className='username editor'   aria-label='Username' autoComplete='nope' required={false}  currentValue={user.username ?? ''} value={username ?? ''} onChange={(value) => { setUsername(value); setIsModified(true); }} />
                            
                            <span className='email label'>Email:</span>
                            <EmailEditor    className='email editor'      aria-label='Email'    autoComplete='nope' required={true}   currentValue={user.email}          value={email}          onChange={(value) => { setEmail(value)   ; setIsModified(true); }} />
                        </form>
                    </TabPanel>
                    <TabPanel label={PAGE_USER_TAB_IMAGE}        panelComponent={<Generic className={styleSheet.imageTab} />}>
                        <UploadImage<HTMLElement, string>
                            // variants:
                            nude={true}
                            
                            
                            
                            // values:
                            value={image}
                            onChange={(value) => {
                                setImage(value);
                                setIsModified(true);
                            }}
                            
                            
                            
                            // components:
                            imageComponent={
                                // @ts-ignore
                                <Image
                                    priority={true}
                                />
                            }
                            
                            
                            
                            // handlers:
                            onUploadImage={async ({ imageFile, reportProgress, abortSignal }) => {
                                try {
                                    const imageId = await postImage({
                                        image            : imageFile,
                                        folder           : '@@user',
                                        onUploadProgress : reportProgress,
                                        abortSignal      : abortSignal,
                                    }).unwrap();
                                    
                                    // replace => delete prev drafts:
                                    await handleSaveImages(/*commitImages = */false);
                                    
                                    // register to actual_delete the new_image when reverted:
                                    draftDeletedImages.set(imageId, false /* false: delete when reverted, noop when committed */);
                                    
                                    return imageId;
                                }
                                catch (error : any) {
                                    if (error.status === 0) { // non_standard HTTP status code: a request was aborted
                                        // TODO: try to cleanup a prematurely image (if any)
                                        
                                        return null; // prevents showing error
                                    } // if
                                    
                                    throw error;     // shows the error detail
                                } // try
                            }}
                            onDeleteImage={async ({ imageData: imageId }) => {
                                // register to actual_delete the deleted_image when committed:
                                draftDeletedImages.set(imageId,
                                    draftDeletedImages.has(imageId) // if has been created but not saved
                                    ? null /* null: delete when committed, delete when reverted */
                                    : true /* true: delete when committed, noop when reverted */
                                );
                                
                                return true;
                            }}
                            onResolveImageUrl={resolveMediaUrl<never>}
                        />
                    </TabPanel>
                    <TabPanel label={PAGE_USER_TAB_ROLE}         panelComponent={<Generic className={styleSheet.roleTab} />} onCollapseStart={tabRoleHandleCollapseStart} onExpandEnd={tabRoleHandleExpandEnd}>{
                        isLoadingRole
                        ? <LoadingBar />
                        : isErrorRole
                            ? 'Error getting role data'
                            : <RoleEditor
                                // values:
                                roleList={roleList}
                                value={roleId}
                                onChange={(value) => {
                                    setRoleId(value);
                                    setIsModified(true);
                                }}
                                
                                
                                
                                // components:
                                modelPreviewComponent={
                                    <RolePreview model={undefined as any} selectedRoleId={roleId} isShown={isTabRoleShown} />
                                }
                                modelCreateComponent={
                                    <RoleCreate onClose={undefined as any} />
                                }
                            />
                    }</TabPanel>
                    <TabPanel label={PAGE_USER_TAB_DELETE} panelComponent={<Content theme='warning' className={styleSheet.deleteTab} />}>
                        <ButtonIcon icon={isLoadingModelDelete ? 'busy' : 'delete'} theme='danger' onClick={handleDelete}>
                            Delete User <strong>{user.name}</strong>
                        </ButtonIcon>
                    </TabPanel>
                </Tab>
            </ValidationProvider>
            <CardFooter onKeyDown={handleKeyDown}>
                <ButtonIcon className='btnSave'   icon={isCommiting ? 'busy' : 'save'  } theme='success' onClick={handleSave}>Save</ButtonIcon>
                <ButtonIcon className='btnCancel' icon={isReverting ? 'busy' : 'cancel'} theme='danger'  onClick={handleClosing}>{isReverting ? 'Reverting' : 'Cancel'}</ButtonIcon>
            </CardFooter>
        </AccessibilityProvider>
    );
}
