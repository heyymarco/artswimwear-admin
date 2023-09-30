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
    NameEditor,
}                           from '@/components/editors/NameEditor'
import {
    UniqueUsernameEditor,
}                           from '@/components/editors/UniqueUsernameEditor'
import {
    UniqueEmailEditor,
}                           from '@/components/editors/UniqueEmailEditor'
import {
    UploadImage,
}                           from '@/components/editors/UploadImage'
import {
    RoleEditor,
}                           from '@/components/editors/RoleEditor'
import type {
    // types:
    CloseEvent,
    
    
    
    // react components:
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
    
    
    
    // rest props:
    const {
        // data:
        model,
        selectedRoleId,
        
        
        
        // appearances:
        isShown,
        
        
        
        // accessibilities:
        readOnly = false,
        
        
        
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
            actionCtrl={!readOnly}
            
            
            
            // states:
            active={isSelected}
            
            
            
            // handlers:
            onClick={!readOnly ? handleClick : undefined}
        >
            <RadioDecorator enabled={!readOnly} />
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
};

/* <EditUserDialog> */
export interface EditUserDialogProps {
    // data:
    user                    ?: UserDetail
    defaultExpandedTabIndex ?: number
    
    
    
    // handlers:
    onClose                  : EventHandler<CloseEvent>
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
    
    
    
    // states:
    const [isTabRoleShown  , setIsTabRoleShown   ] = useState<boolean>(() => (defaultExpandedTabIndex === 2));
    
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
    
    
    
    // sessions:
    const { data: session, update : updateSession} = useSession();
    const role = session?.role;
    const privilegeAdd               = !!role?.user_c && !user.id;
    const privilegeUpdateName        = !!role?.user_un;
    const privilegeUpdateUsername    = !!role?.user_uu;
    const privilegeUpdateEmail       = !!role?.user_ue;
    const privilegeUpdatePassword    = !!role?.user_up;
    const privilegeUpdateImage       = !!role?.user_ui;
    const privilegeUpdateRole        = !!role?.user_ur;
    const privilegeDelete            = !!role?.user_d;
    const privilegeWrite             = (
        privilegeAdd
        || privilegeUpdateName
        || privilegeUpdateUsername
        || privilegeUpdateEmail
        || privilegeUpdatePassword
        || privilegeUpdateImage
        || privilegeUpdateRole
        /* || privilegeDelete */ // except for delete
    );
    
    
    
    // stores:
    const [updateUser       , {isLoading : isLoadingModelUpdate      }] = useUpdateUser();
    const [deleteUser       , {isLoading : isLoadingModelDelete      }] = useDeleteUser();
    const [postImage                                                  ] = usePostImage();
    const [commitDeleteImage, {isLoading : isLoadingCommitDeleteImage}] = useDeleteImage();
    const [revertDeleteImage, {isLoading : isLoadingRevertDeleteImage}] = useDeleteImage();
    const isCommiting = isLoadingModelUpdate || isLoadingCommitDeleteImage;
    const isReverting = isLoadingRevertDeleteImage;
    const isLoading   = isCommiting || isReverting || isLoadingModelDelete;
    
    const {data: roleList, isLoading: isLoadingRole, isError: isErrorRole} = useGetRoleList();
    
    
    
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
    const tabRoleHandleExpandEnd     = useEvent<EventHandler<void>>(() => {
        setIsTabRoleShown(true);
    });
    
    const handleSave       = useEvent(async () => {
        if (!privilegeWrite) return;
        
        
        
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
            const updatingModelTask = updateUser({
                id             : user.id,
                
                name     : (privilegeUpdateName     || privilegeAdd) ? name               : undefined,
                email    : (privilegeUpdateEmail    || privilegeAdd) ? email              : undefined,
                image    : (privilegeUpdateImage    || privilegeAdd) ? image              : undefined,
                roleId   : (privilegeUpdateRole                    ) ? roleId             : ((!user.id && privilegeAdd) ? null : undefined),
                username : (privilegeUpdateUsername || privilegeAdd) ? (username || null) : undefined, // convert empty string to null
            }).unwrap().then((model) => model.id);
            
            const updatingSessionTask = updatingModelTask.then(async (): Promise<void> => {
                if (session?.user?.email?.toLowerCase() === initialEmailRef.current.toLowerCase()) await updateSession(); // update the session if updated current user
            });
            
            await handleClose(updatingModelTask, /*commitImages = */true, [updatingSessionTask]); // result: created|mutated
        }
        catch (error: any) {
            showMessageFetchError(error);
        } // try
    });
    const handleDelete     = useEvent(async () => {
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
            
            await handleClose(false, /*commitImages = */false); // result: deleted
        }
        catch (error: any) {
            showMessageFetchError(error);
        } // try
    });
    const handleClosing    = useEvent(async () => {
        if (privilegeWrite && isModified) {
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
                    await handleClose(null, /*commitImages = */false); // result: discard changes
                    break;
                default:
                    // do nothing (continue editing)
                    break;
            } // switch
        }
        else {
            await handleClose(null, /*commitImages = */false); // result: no changes
        } // if
    });
    const handleSaveImages = useEvent(async (commitImages : boolean) => {
        if (!privilegeWrite) return;
        
        
        
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
    const handleClose      = useEvent(async (event: CloseEvent|Promise<CloseEvent>, commitImages : boolean, otherTasks : Promise<any>[] = []) => {
        await Promise.all([
            handleSaveImages(commitImages),
            ...otherTasks,
        ]);
        onClose(await event);
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
                            <NameEditor
                                // refs:
                                elmRef={firstEditorRef}
                                
                                
                                
                                // classes:
                                className='name editor'
                                
                                
                                
                                // accessibilities:
                                enabled={privilegeUpdateName || privilegeAdd}
                                
                                
                                
                                // values:
                                value={name}
                                onChange={(value) => {
                                    setName(value);
                                    setIsModified(true);
                                }}
                            />
                            
                            <span className='username label'>Username:</span>
                            <UniqueUsernameEditor
                                // classes:
                                className='username editor'
                                
                                
                                
                                // accessibilities:
                                enabled={privilegeUpdateUsername || privilegeAdd}
                                
                                
                                
                                // values:
                                currentValue={user.username ?? ''}
                                value={username ?? ''}
                                onChange={(value) => {
                                    setUsername(value);
                                    setIsModified(true);
                                }}
                            />
                            
                            <span className='email label'>Email:</span>
                            <UniqueEmailEditor
                                // classes:
                                className='email editor'
                                
                                
                                
                                // accessibilities:
                                enabled={privilegeUpdateEmail || privilegeAdd}
                                
                                
                                
                                // values:
                                currentValue={user.email}
                                value={email}
                                onChange={(value) => {
                                    setEmail(value);
                                    setIsModified(true);
                                }}
                            />
                        </form>
                    </TabPanel>
                    <TabPanel label={PAGE_USER_TAB_IMAGE}        panelComponent={<Generic className={styleSheet.imageTab} />}>
                        <UploadImage<HTMLElement, string>
                            // variants:
                            nude={true}
                            
                            
                            
                            // accessibilities:
                            // TODO: readOnly={!(privilegeUpdateImage || privilegeAdd)}
                            
                            
                            
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
                                        folder           : 'users',
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
                                    ({id}) => <RolePreview model={undefined as any} selectedRoleId={roleId} isShown={isTabRoleShown} readOnly={!(privilegeUpdateRole /* || privilegeAdd */) && !(!id && privilegeAdd)} />
                                }
                                modelCreateComponent={
                                    !!role?.role_c
                                    ? <RoleCreate onClose={undefined as any} />
                                    : undefined
                                }
                            />
                    }</TabPanel>
                    {privilegeDelete && <TabPanel label={PAGE_USER_TAB_DELETE} panelComponent={<Content theme='warning' className={styleSheet.deleteTab} />}>
                        <ButtonIcon icon={isLoadingModelDelete ? 'busy' : 'delete'} theme='danger' onClick={handleDelete}>
                            Delete User <strong>{user.name}</strong>
                        </ButtonIcon>
                    </TabPanel>}
                </Tab>
            </ValidationProvider>
            <CardFooter onKeyDown={handleKeyDown}>
                {privilegeWrite && <ButtonIcon className='btnSave'   icon={isCommiting ? 'busy' : 'save'  } theme='success' onClick={handleSave}>Save</ButtonIcon>}
                <ButtonIcon className='btnCancel' icon={privilegeWrite ? (isReverting ? 'busy' : 'cancel') : 'done'} theme={privilegeWrite ? 'danger' : 'primary'}  onClick={handleClosing}>{isReverting ? 'Reverting' : (privilegeWrite ? 'Cancel' : 'Close')}</ButtonIcon>
            </CardFooter>
        </AccessibilityProvider>
    );
};
