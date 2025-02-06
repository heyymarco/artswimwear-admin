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
import {
    NameEditor,
}                           from '@heymarco/name-editor'

// internal components:
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
    // react components:
    ImplementedComplexEditModelDialogProps,
    ComplexEditModelDialog,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    EditRoleDialog,
}                           from '@/components/dialogs/EditRoleDialog'
import {
    RolePreview,
}                           from '@/components/views/RolePreview'

// models:
import {
    // types:
    type ModelConfirmUnsavedEventHandler,
    type ModelConfirmDeleteEventHandler,
    type ModelUpsertingEventHandler,
    type ModelDeletingEventHandler,
    type ModelCreateOrUpdateEventHandler,
    type ModelDeleteEventHandler,
    
    type AdminDetail,
    type RoleDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useUpdateAdmin,
    useDeleteAdmin,
    
    usePostImage,
    useDeleteImage,
    
    useGetRoleList,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'
import {
    useDraftDifferentialImages,
}                           from '@/states/draftDifferentialImages'

// configs:
import {
    PAGE_ADMIN_TAB_ACCOUNT,
    PAGE_ADMIN_TAB_IMAGE,
    PAGE_ADMIN_TAB_ROLE,
    PAGE_ADMIN_TAB_DELETE,
}                           from '@/website.config'



// styles:
const useEditAdminDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./EditAdminDialogStyles')
, { id: 'm4oi6itiaq' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './EditAdminDialogStyles';



// react components:
export interface EditAdminDialogProps
    extends
        // bases:
        ImplementedComplexEditModelDialogProps<AdminDetail>
{
}
const EditAdminDialog = (props: EditAdminDialogProps): JSX.Element|null => {
    // styles:
    const styleSheet = useEditAdminDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model = null,
        
        
        
        // states:
        defaultExpandedTabIndex = 0,
    ...restComplexEditModelDialogProps} = props;
    
    
    
    // states:
    const [isModified    , setIsModified    ] = useState<boolean>(false);
    
    const [name          , setName          ] = useState<string     >(model?.name     ?? ''  );
    const [email         , setEmail         ] = useState<string     >(model?.email    ?? ''  );
    const [image         , setImage         ] = useState<string|null>(model?.image    ?? null); // optional field
    const [roleId        , setRoleId        ] = useState<string|null>(model?.roleId   ?? null); // optional field
    const [username      , setUsername      ] = useState<string|null>(model?.username ?? null); // optional field
    
    const initialEmailRef                     = useRef  <string     >(model?.email    ?? ''  );
    const initialImageRef                     = useRef  <string|null>(model?.image    ?? null); // optional field
    
    const draftDifferentialImages             = useDraftDifferentialImages();
    
    const [isTabRoleShown, setIsTabRoleShown] = useState<boolean>(() => (defaultExpandedTabIndex === 2));
    
    
    
    // sessions:
    const { data: session, update : updateSession} = useSession();
    const role = session?.role;
    
    
    
    // stores:
    const [updateAdmin      , {isLoading : isLoadingUpdate           }] = useUpdateAdmin();
    const [deleteAdmin      , {isLoading : isLoadingDelete           }] = useDeleteAdmin();
    const [postImage                                                  ] = usePostImage();
    const [commitDeleteImage, {isLoading : isLoadingCommitDeleteImage}] = useDeleteImage();
    const [revertDeleteImage, {isLoading : isLoadingRevertDeleteImage}] = useDeleteImage();
    
    const {data: roleOptions, isLoading: isLoadingRole, isError: isErrorRole} = useGetRoleList();
    
    
    
    // refs:
    const firstEditorRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // handlers:
    const handleUpdating             = useEvent<ModelUpsertingEventHandler<AdminDetail>>(async ({ id, options: { addPermission, updatePermissions } }) => {
        return await updateAdmin({
            id       : id ?? '',
            
            name     : (updatePermissions.name     || addPermission) ? name               : undefined,
            email    : (updatePermissions.email    || addPermission) ? email              : undefined,
            image    : (updatePermissions.image    || addPermission) ? image              : undefined,
            roleId   : (updatePermissions.role                     ) ? roleId             : ((!id && addPermission) ? null : undefined),
            username : (updatePermissions.username || addPermission) ? (username || null) : undefined, // convert empty string to null
        }).unwrap();
    });
    const handleUpdate               = useEvent<ModelCreateOrUpdateEventHandler<AdminDetail>>(async () => {
        const sessionEmail = session?.user?.email;
        if (!!sessionEmail && (sessionEmail.toLowerCase() === initialEmailRef.current.toLowerCase())) await updateSession(); // update the session if updated current admin
    });
    
    const handleDeleting             = useEvent<ModelDeletingEventHandler<AdminDetail>>(async ({ draft: { id } }) => {
        await deleteAdmin({
            id : id,
        }).unwrap();
    });
    
    const handleRoleCreate           = useEvent<ModelCreateOrUpdateEventHandler<RoleDetail>>(async ({ model: { id } }) => {
        setRoleId(id); // select the last created role
        setIsModified(true);
    });
    const handleRoleDelete           = useEvent<ModelDeleteEventHandler<RoleDetail>>(async ({ draft: { id } }) => {
        if (id && (id === roleId)) { // if currently selected
            // the related role was deleted => set to null (no selection):
            setRoleId(null);
            setIsModified(true);
            console.log('related role deleted'); // TODO: refresh the Admin model
        }
        else {
            // TODO: refresh the Admin models where (admin.roleId === id)
        } // if
    });
    
    const handleSideModelCommitting  = useEvent(async (): Promise<void> => {
        await handleSideModelSave(/*commitImages = */true);
    });
    const handleSideModelDiscarding  = useEvent(async (): Promise<void> => {
        await handleSideModelSave(/*commitImages = */false);
    });
    const handleSideModelSave        = useEvent(async (commitImages : boolean): Promise<void> => {
        // initial_image have been replaced with new image:
        if (commitImages && initialImageRef.current && (initialImageRef.current !== image)) {
            // register to actual_delete the initial_image when committed:
            draftDifferentialImages.registerDeletedImage(initialImageRef.current);
        } // if
        
        
        
        // search for unused image(s) and delete them:
        const {unusedImages} = draftDifferentialImages.commitChanges(commitImages);
        
        
        
        try {
            if (unusedImages.length) {
                await (commitImages ? commitDeleteImage : revertDeleteImage)({
                    imageId : unusedImages,
                }).unwrap();
            } // if
        }
        catch {
            // ignore any error
            return; // but do not clear the draft
        } // try
    });
    
    const handleConfirmDelete        = useEvent<ModelConfirmDeleteEventHandler<AdminDetail>>(({ draft }) => {
        return {
            title   : <h1>Delete Confirmation</h1>,
            message : <p>
                Are you sure to delete admin <strong>{draft.name}</strong>?
            </p>,
        };
    });
    const handleConfirmUnsaved       = useEvent<ModelConfirmUnsavedEventHandler<AdminDetail>>(() => {
        return {
            title   : <h1>Unsaved Data</h1>,
            message : <p>
                Do you want to save the changes?
            </p>,
        };
    });
    
    const handleTabRoleCollapseStart = useEvent<EventHandler<void>>(() => {
        setIsTabRoleShown(false);
    });
    const handleTabRoleExpandEnd     = useEvent<EventHandler<void>>(() => {
        setIsTabRoleShown(true);
    });
    
    
    
    // jsx:
    return (
        <ComplexEditModelDialog<AdminDetail>
            // other props:
            {...restComplexEditModelDialogProps}
            
            
            
            // data:
            modelName='Admin'
            modelEntryName={model?.name}
            model={model}
            
            
            
            // privileges:
            privilegeAdd    = {!!role?.admin_c}
            privilegeUpdate = {useMemo(() => ({
                name     : !!role?.admin_un,
                username : !!role?.admin_uu,
                email    : !!role?.admin_ue,
                password : !!role?.admin_up,
                image    : !!role?.admin_ui,
                role     : !!role?.admin_ur,
            }), [role])}
            privilegeDelete = {!!role?.admin_d}
            
            
            
            // stores:
            isModified  = {isModified}
            
            isCommiting = {isLoadingUpdate || isLoadingCommitDeleteImage}
            isReverting = {                   isLoadingRevertDeleteImage}
            isDeleting  = {isLoadingDelete || isLoadingCommitDeleteImage}
            
            
            
            // tabs:
            tabDelete={PAGE_ADMIN_TAB_DELETE}
            
            
            
            // states:
            defaultExpandedTabIndex={defaultExpandedTabIndex}
            
            
            
            // auto focusable:
            autoFocusOn={props.autoFocusOn ?? firstEditorRef}
            
            
            
            // handlers:
            onUpdating={handleUpdating}
            onUpdate={handleUpdate}
            
            onDeleting={handleDeleting}
            // onDelete={undefined}
            
            onSideModelCommitting={handleSideModelCommitting}
            onSideModelDiscarding={handleSideModelDiscarding}
            
            onConfirmDelete={handleConfirmDelete}
            onConfirmUnsaved={handleConfirmUnsaved}
        >{({whenAdd, whenUpdate}) => <>
            <TabPanel label={PAGE_ADMIN_TAB_ACCOUNT} panelComponent={<Generic className={styleSheet.accountTab} />}>
                <form>
                    <span className='name label'>Name:</span>
                    <NameEditor
                        // refs:
                        elmRef={firstEditorRef}
                        
                        
                        
                        // classes:
                        className='name editor'
                        
                        
                        
                        // accessibilities:
                        enabled={whenUpdate.name || whenAdd}
                        
                        
                        
                        // values:
                        value={name}
                        onChange={(value) => {
                            setName(value);
                            setIsModified(true);
                        }}
                        
                        
                        
                        // validations:
                        required={true}
                    />
                    
                    <span className='username label'>Username:</span>
                    <UniqueUsernameEditor
                        // classes:
                        className='username editor'
                        
                        
                        
                        // accessibilities:
                        enabled={whenUpdate.username || whenAdd}
                        
                        
                        
                        // values:
                        currentValue={model?.username ?? ''}
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
                        enabled={whenUpdate.email || whenAdd}
                        
                        
                        
                        // values:
                        currentValue={model?.email ?? ''}
                        value={email}
                        onChange={(value) => {
                            setEmail(value);
                            setIsModified(true);
                        }}
                    />
                </form>
            </TabPanel>
            <TabPanel label={PAGE_ADMIN_TAB_IMAGE}   panelComponent={<Generic className={styleSheet.imageTab} />}>
                <UploadImage<HTMLElement, string>
                    // variants:
                    nude={true}
                    
                    
                    
                    // accessibilities:
                    readOnly={!(whenUpdate.image || whenAdd)}
                    
                    
                    
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
                                folder           : 'admins',
                                onUploadProgress : reportProgress,
                                abortSignal      : abortSignal,
                            }).unwrap();
                            
                            // replace => delete prev drafts:
                            await handleSideModelDiscarding();
                            
                            // register to actual_delete the new_image when reverted:
                            draftDifferentialImages.registerAddedImage(imageId);
                            
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
                        draftDifferentialImages.registerDeletedImage(imageId);
                        
                        return true;
                    }}
                    onResolveImageUrl={resolveMediaUrl<never>}
                />
            </TabPanel>
            <TabPanel label={PAGE_ADMIN_TAB_ROLE}    panelComponent={<Generic className={styleSheet.roleTab} />} onCollapseStart={handleTabRoleCollapseStart} onExpandEnd={handleTabRoleExpandEnd}>{
                isLoadingRole
                ? <LoadingBar />
                : isErrorRole
                    ? 'Error getting role data'
                    : <RoleEditor
                        // values:
                        valueOptions={roleOptions}
                        value={roleId}
                        onChange={(value) => {
                            setRoleId(value);
                            setIsModified(true);
                        }}
                        
                        
                        
                        // components:
                        modelPreviewComponent={
                            <RolePreview
                                // data:
                                model={undefined as any}
                                
                                
                                
                                // accessibilities:
                                readOnly={((): boolean => {
                                    /*
                                        when edit_mode:
                                            * if NO  privilege update_admin_role => UNABLE to change admin's role
                                            * if HAS privilege update_admin_role =>   ABLE to change admin's role
                                        
                                        when create_mode:
                                            * ALWAYS be ABLE to change new_admin's role
                                    */
                                    if (model) { // has model => edit_mode
                                        return !whenUpdate.role; // readOnly when NO  privilege update_admin_role => UNABLE to change admin's role
                                    }
                                    else {       // no model  => create_mode
                                        return false;            // ALWAYS be ABLE to change new_admin's role
                                    } // if
                                })()}
                                
                                
                                
                                // states:
                                isShown={isTabRoleShown}
                                
                                
                                
                                // handlers:
                                onModelDelete={handleRoleDelete}
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
                        onModelCreate={handleRoleCreate}
                    />
            }</TabPanel>
        </>}</ComplexEditModelDialog>
    );
};
export {
    EditAdminDialog,
    EditAdminDialog as default,
}
