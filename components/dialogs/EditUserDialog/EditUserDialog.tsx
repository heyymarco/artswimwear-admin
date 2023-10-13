'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
    useMemo,
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
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Generic,
    
    
    
    // composite-components:
    TabPanel,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'
import {
    LoadingBar,
}                           from '@heymarco/loading-bar'

// internal components:
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
import {
    // types:
    UpdateModelHandler,
    AfterUpdateModelHandler,
    
    DeleteModelHandler,
    
    UpdateSideModelHandler,
    DeleteSideModelHandler,
    
    DeleteModelConfirmHandler,
    UnsavedModelConfirmHandler,
    
    
    
    // react components:
    ImplementedComplexEditModelDialogProps,
    ComplexEditModelDialog,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    EditRoleDialog,
}                           from '@/components/dialogs/EditRoleDialog'
import {
    RolePreview,
}                           from '@/components/views//RolePreview'

// stores:
import {
    // types:
    UserDetail,
    
    
    
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



// react components:
export interface EditUserDialogProps
    extends
        // bases:
        ImplementedComplexEditModelDialogProps<UserDetail>
{
}
const EditUserDialog = (props: EditUserDialogProps): JSX.Element|null => {
    // styles:
    const styleSheet = useEditUserDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model = null,
        
        
        
        // states:
        defaultExpandedTabIndex = 0,
    ...restComplexEditModelDialogProps} = props;
    
    
    
    // states:
    const [isModelModified , setIsModelModified] = useState<boolean>(false);
    
    const [name            , setName           ] = useState<string     >(model?.name     ?? ''  );
    const [email           , setEmail          ] = useState<string     >(model?.email    ?? ''  );
    const [image           , setImage          ] = useState<string|null>(model?.image    ?? null); // optional field
    const [roleId          , setRoleId         ] = useState<string|null>(model?.roleId   ?? null); // optional field
    const [username        , setUsername       ] = useState<string|null>(model?.username ?? null); // optional field
    
    const initialEmailRef                        = useRef  <string     >(model?.email    ?? ''  );
    
    const initialImageRef                        = useRef  <string|null>(model?.image    ?? null); // optional field
    const [draftDeletedImages                  ] = useState<Map<string, boolean|null>>(() => new Map<string, boolean|null>());
    
    const [isTabRoleShown  , setIsTabRoleShown ] = useState<boolean>(() => (defaultExpandedTabIndex === 2));
    
    
    
    // sessions:
    const { data: session, update : updateSession} = useSession();
    const role = session?.role;
    
    
    
    // stores:
    const [updateUser       , {isLoading : isLoadingModelUpdate      }] = useUpdateUser();
    const [deleteUser       , {isLoading : isLoadingModelDelete      }] = useDeleteUser();
    const [postImage                                                  ] = usePostImage();
    const [commitDeleteImage, {isLoading : isLoadingCommitDeleteImage}] = useDeleteImage();
    const [revertDeleteImage, {isLoading : isLoadingRevertDeleteImage}] = useDeleteImage();
    
    const {data: roleList, isLoading: isLoadingRole, isError: isErrorRole} = useGetRoleList();
    
    
    
    // refs:
    const firstEditorRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // handlers:
    const handleUpdateModel          = useEvent<UpdateModelHandler>(async ({id, privilegeModelAdd, privilegeModelUpdate}) => {
        return (await updateUser({
            id       : model?.id ?? '',
            
            name     : (privilegeModelUpdate.name     || privilegeModelAdd) ? name               : undefined,
            email    : (privilegeModelUpdate.email    || privilegeModelAdd) ? email              : undefined,
            image    : (privilegeModelUpdate.image    || privilegeModelAdd) ? image              : undefined,
            roleId   : (privilegeModelUpdate.role                         ) ? roleId             : ((!id && privilegeModelAdd) ? null : undefined),
            username : (privilegeModelUpdate.username || privilegeModelAdd) ? (username || null) : undefined, // convert empty string to null
        }).unwrap()).id;
    });
    const handleAfterUpdateModel     = useEvent<AfterUpdateModelHandler>(async () => {
        const sessionEmail = session?.user?.email;
        if (!!sessionEmail && (sessionEmail.toLowerCase() === initialEmailRef.current.toLowerCase())) await updateSession(); // update the session if updated current user
    });
    
    const handleDeleteModel          = useEvent<DeleteModelHandler>(async ({id}) => {
        await deleteUser({
            id : id,
        }).unwrap();
    });
    
    const handleUpdateSideModel      = useEvent<UpdateSideModelHandler>(async () => {
        await handleSaveSideModel(/*commitImages = */true);
    });
    const handleDeleteSideModel      = useEvent<DeleteSideModelHandler>(async () => {
        await handleSaveSideModel(/*commitImages = */false);
    });
    const handleSaveSideModel        = useEvent(async (commitImages : boolean) => {
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
    
    const handleDeleteModelConfirm   = useEvent<DeleteModelConfirmHandler<UserDetail>>(({model}) => {
        return {
            title   : <h1>Delete Confirmation</h1>,
            message : <p>
                Are you sure to delete user <strong>{model.name}</strong>?
            </p>,
        };
    });
    const handleUnsavedModelConfirm  = useEvent<UnsavedModelConfirmHandler<UserDetail>>(() => {
        return {
            title   : <h1>Unsaved Data</h1>,
            message : <p>
                Do you want to save the changes?
            </p>,
        };
    });
    
    const tabRoleHandleCollapseStart = useEvent<EventHandler<void>>(() => {
        setIsTabRoleShown(false);
    });
    const tabRoleHandleExpandEnd     = useEvent<EventHandler<void>>(() => {
        setIsTabRoleShown(true);
    });
    
    
    
    // jsx:
    return (
        <ComplexEditModelDialog<UserDetail>
            // other props:
            {...restComplexEditModelDialogProps}
            
            
            
            // data:
            modelName='User'
            modelEntryName={model?.name}
            model={model}
            
            
            
            // privileges:
            privilegeModelAdd    = {!!role?.user_c}
            privilegeModelUpdate = {useMemo(() => ({
                name     : !!role?.user_un,
                username : !!role?.user_uu,
                email    : !!role?.user_ue,
                password : !!role?.user_up,
                image    : !!role?.user_ui,
                role     : !!role?.user_ur,
            }), [role])}
            privilegeModelDelete = {!!role?.user_d}
            
            
            
            // stores:
            isModelModified  = {isModelModified}
            
            isCommitingModel = {isLoadingModelUpdate || isLoadingCommitDeleteImage}
            isRevertingModel = {                        isLoadingRevertDeleteImage}
            isDeletingModel  = {isLoadingModelDelete || isLoadingCommitDeleteImage}
            
            
            
            // tabs:
            tabDelete={PAGE_USER_TAB_DELETE}
            
            
            
            // states:
            defaultExpandedTabIndex={defaultExpandedTabIndex}
            
            
            
            // auto focusable:
            autoFocusOn={props.autoFocusOn ?? firstEditorRef}
            
            
            
            // handlers:
            onUpdateModel={handleUpdateModel}
            onAfterUpdateModel={handleAfterUpdateModel}
            
            onDeleteModel={handleDeleteModel}
            // onAfterDeleteModel={undefined}
            
            onUpdateSideModel={handleUpdateSideModel}
            onDeleteSideModel={handleDeleteSideModel}
            
            onDeleteModelConfirm={handleDeleteModelConfirm}
            onUnsavedModelConfirm={handleUnsavedModelConfirm}
        >{({privilegeModelAdd, privilegeModelUpdate}) => <>
            <TabPanel label={PAGE_USER_TAB_ACCOUNT} panelComponent={<Generic className={styleSheet.accountTab} />}>
                <form>
                    <span className='name label'>Name:</span>
                    <NameEditor
                        // refs:
                        elmRef={firstEditorRef}
                        
                        
                        
                        // classes:
                        className='name editor'
                        
                        
                        
                        // accessibilities:
                        enabled={privilegeModelUpdate.name || privilegeModelAdd}
                        
                        
                        
                        // values:
                        value={name}
                        onChange={(value) => {
                            setName(value);
                            setIsModelModified(true);
                        }}
                    />
                    
                    <span className='username label'>Username:</span>
                    <UniqueUsernameEditor
                        // classes:
                        className='username editor'
                        
                        
                        
                        // accessibilities:
                        enabled={privilegeModelUpdate.username || privilegeModelAdd}
                        
                        
                        
                        // values:
                        currentValue={model?.username ?? ''}
                        value={username ?? ''}
                        onChange={(value) => {
                            setUsername(value);
                            setIsModelModified(true);
                        }}
                    />
                    
                    <span className='email label'>Email:</span>
                    <UniqueEmailEditor
                        // classes:
                        className='email editor'
                        
                        
                        
                        // accessibilities:
                        enabled={privilegeModelUpdate.email || privilegeModelAdd}
                        
                        
                        
                        // values:
                        currentValue={model?.email ?? ''}
                        value={email}
                        onChange={(value) => {
                            setEmail(value);
                            setIsModelModified(true);
                        }}
                    />
                </form>
            </TabPanel>
            <TabPanel label={PAGE_USER_TAB_IMAGE}   panelComponent={<Generic className={styleSheet.imageTab} />}>
                <UploadImage<HTMLElement, string>
                    // variants:
                    nude={true}
                    
                    
                    
                    // accessibilities:
                    readOnly={!(privilegeModelUpdate.image || privilegeModelAdd)}
                    
                    
                    
                    // values:
                    value={image}
                    onChange={(value) => {
                        setImage(value);
                        setIsModelModified(true);
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
                            await handleDeleteSideModel();
                            
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
            <TabPanel label={PAGE_USER_TAB_ROLE}    panelComponent={<Generic className={styleSheet.roleTab} />} onCollapseStart={tabRoleHandleCollapseStart} onExpandEnd={tabRoleHandleExpandEnd}>{
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
                            setIsModelModified(true);
                        }}
                        
                        
                        
                        // components:
                        modelPreviewComponent={
                            ({id}) => <RolePreview
                                // data:
                                model={undefined as any}
                                selectedRoleId={roleId}
                                
                                
                                
                                // accessibilities:
                                readOnly={!(privilegeModelUpdate.role /* || privilegeModelAdd */) && !(!id && privilegeModelAdd)}
                                
                                
                                
                                // states:
                                isShown={isTabRoleShown}
                                
                                
                                
                                // handlers:
                                onModelDeleted={(value) => {
                                    if (value && (value === roleId)) { // if currently selected
                                        // the related role was deleted => set to null (no selection):
                                        setRoleId(null);
                                        setIsModelModified(true);
                                        console.log('related role deleted'); // TODO: refresh the user model
                                    } // if
                                }}
                            />
                        }
                        modelCreateComponent={
                            !!role?.role_c
                            ? <EditRoleDialog
                                // data:
                                model={null} // create a new model
                            />
                            : undefined
                        }
                        
                        
                        
                        // handlers:
                        onModelCreated={(value) => {
                            setRoleId(value);
                            setIsModelModified(true);
                        }}
                    />
            }</TabPanel>
        </>}</ComplexEditModelDialog>
    );
};
export {
    EditUserDialog,
    EditUserDialog as default,
}
