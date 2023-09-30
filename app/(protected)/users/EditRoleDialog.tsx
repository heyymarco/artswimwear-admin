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
    Basic,
    
    
    
    // base-content-components:
    Content,
    
    
    
    // simple-components:
    Icon,
    ButtonIcon,
    CloseButton,
    Check,
    
    
    
    // layout-components:
    ListItemProps,
    ListItem,
    List,
    CardHeader,
    CardFooter,
    CardBody,
    
    
    
    // composite-components:
    AccordionItem,
    ExclusiveAccordion,
    TabPanel,
    Tab,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'

// internal components:
import {
    UniqueRolenameEditor,
}                           from '@/components/editors/UniqueRolenameEditor'
import {
    UploadImage,
}                           from '@/components/editors/UploadImage'
import {
    RoleEditor,
}                           from '@/components/editors/RoleEditor'
import type {
    // types:
    CloseEvent,
}                           from '@/components/SectionModelEditor'

// stores:
import {
    // types:
    RoleDetail,
    
    
    
    // hooks:
    useUpdateRole,
    useDeleteRole,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    getCurrencySign,
}                           from '@/libs/formatters'
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'

// configs:
import {
    STORE_WEBSITE_URL,
    
    PAGE_ROLE_TAB_ROLE,
    PAGE_ROLE_TAB_DELETE,
}                           from '@/website.config'



// styles:
const useEditRoleDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./EditRoleDialogStyles')
, { id: 'vsc19zuymv' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './EditRoleDialogStyles';
import LoadingBar from '@heymarco/loading-bar'



// utilities:
const emptyRole : RoleDetail = {
    id         : '',
    
    name       : '',
    
    product_r  : false,
    product_c  : false,
    product_ud : false,
    product_ui : false,
    product_up : false,
    product_us : false,
    product_uv : false,
    product_d  : false,
    
    user_r     : false,
    user_c     : false,
    user_un    : false,
    user_uu    : false,
    user_ue    : false,
    user_up    : false,
    user_ui    : false,
    user_ur    : false,
    user_d     : false,
    
    role_c     : false,
    role_u     : false,
    role_d     : false,
};



// react components:

/* <EditRoleDialog> */
export interface EditRoleDialogProps {
    // data:
    role    ?: RoleDetail
    
    
    
    // handlers:
    onClose  : EventHandler<CloseEvent>
}
export const EditRoleDialog = (props: EditRoleDialogProps): JSX.Element|null => {
    // styles:
    const styleSheet = useEditRoleDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        role = emptyRole,
        
        
        
        // handlers:
        onClose,
    } = props;
    
    
    
    // states:
    const [isPathModified  , setIsPathModified  ] = useState<boolean>(false);
    const [isModified      , setIsModified      ] = useState<boolean>(false);
    
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    const [name            , setName            ] = useState<string>(role.name);
    
    const [product_r       , setProduct_r       ] = useState<boolean>(role.product_r);
    const [product_c       , setProduct_c       ] = useState<boolean>(role.product_c);
    const [product_ud      , setProduct_ud      ] = useState<boolean>(role.product_ud);
    const [product_ui      , setProduct_ui      ] = useState<boolean>(role.product_ui);
    const [product_up      , setProduct_up      ] = useState<boolean>(role.product_up);
    const [product_us      , setProduct_us      ] = useState<boolean>(role.product_us);
    const [product_uv      , setProduct_uv      ] = useState<boolean>(role.product_uv);
    const [product_d       , setProduct_d       ] = useState<boolean>(role.product_d);
    
    const [user_r          , setUser_r          ] = useState<boolean>(role.user_r);
    const [user_c          , setUser_c          ] = useState<boolean>(role.user_c);
    const [user_un         , setUser_un         ] = useState<boolean>(role.user_un);
    const [user_uu         , setUser_uu         ] = useState<boolean>(role.user_uu);
    const [user_ue         , setUser_ue         ] = useState<boolean>(role.user_ue);
    const [user_up         , setUser_up         ] = useState<boolean>(role.user_up);
    const [user_ui         , setUser_ui         ] = useState<boolean>(role.user_ui);
    const [user_ur         , setUser_ur         ] = useState<boolean>(role.user_ur);
    const [user_d          , setUser_d          ] = useState<boolean>(role.user_d);
    
    const [role_c          , setRole_c          ] = useState<boolean>(role.role_c);
    const [role_u          , setRole_u          ] = useState<boolean>(role.role_u);
    const [role_d          , setRole_d          ] = useState<boolean>(role.role_d);
    
    
    
    // sessions:
    const { data: session, update : updateSession} = useSession();
    const rolee = session?.role;
    const privilegeAdd               = !!rolee?.role_c && !role.id;
    const privilegeUpdate            = !!rolee?.role_u;
    const privilegeDelete            = !!rolee?.role_d;
    const privilegeWrite             = (
        privilegeAdd
        || privilegeUpdate
        /* || privilegeDelete */ // except for delete
    );
    
    
    
    // stores:
    const [updateRole, {isLoading : isLoadingModelUpdate}] = useUpdateRole();
    const [deleteRole, {isLoading : isLoadingModelDelete}] = useDeleteRole();
    const isLoading = isLoadingModelUpdate || isLoadingModelDelete;
    
    
    
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
    const handleSave    = useEvent(async () => {
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
            const updatedModel = await updateRole({
                id : role.id,
                
                name,
                
                product_r,
                product_c,
                product_ud,
                product_ui,
                product_up,
                product_us,
                product_uv,
                product_d,
                
                user_r,
                user_c,
                user_un,
                user_uu,
                user_ue,
                user_up,
                user_ui,
                user_ur,
                user_d,
                
                role_c,
                role_u,
                role_d,
            }).unwrap();
            
            await handleClose(updatedModel.id); // result: created|mutated
        }
        catch (error: any) {
            showMessageFetchError(error);
        } // try
    });
    const handleDelete  = useEvent(async () => {
        // conditions:
        if (
            (await showMessage<'yes'|'no'>({
                theme    : 'warning',
                title    : <h1>Delete Confirmation</h1>,
                message  : <>
                    <p>
                        Are you sure to delete <strong>{role.name}</strong> role?
                    </p>
                    <p>
                        The users associated with the {role.name} role will still be logged in but will not have any access.<br />
                        You can re-assign their roles later.
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
            await deleteRole({
                id : role.id,
            }).unwrap();
            
            await handleClose(false); // result: deleted
        }
        catch (error: any) {
            showMessageFetchError(error);
        } // try
    });
    const handleClosing = useEvent(async () => {
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
                    await handleClose(null); // result: discard changes
                    break;
                default:
                    // do nothing (continue editing)
                    break;
            } // switch
        }
        else {
            await handleClose(null); // result: no changes
        } // if
    });
    const handleClose   = useEvent<EventHandler<CloseEvent>>(async (event) => {
        onClose(event);
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
                <h1>{name || ((role === emptyRole) ? 'Create New Role' : 'Edit Role')}</h1>
                <CloseButton onClick={handleClosing} />
            </CardHeader>
            <ValidationProvider enableValidation={enableValidation} inheritValidation={false}>
                <Tab
                    // variants:
                    mild='inherit'
                    
                    
                    
                    // classes:
                    className={styleSheet.cardBody}
                    
                    
                    
                    // components:
                    listComponent={<List className={styleSheet.tabList} />}
                    bodyComponent={<Content className={styleSheet.tabBody} />}
                    
                    
                    
                    // handlers:
                    onKeyDown={handleKeyDown}
                >
                    <TabPanel label={PAGE_ROLE_TAB_ROLE} panelComponent={<Generic className={styleSheet.roleTab} />}>
                        <form ref={editorFormRef}>
                            <span className='name label'>Name:</span>
                            <UniqueRolenameEditor
                                // refs:
                                elmRef={firstEditorRef}
                                
                                
                                
                                // classes:
                                className='name editor'
                                
                                
                                
                                // accessibilities:
                                enabled={privilegeUpdate || privilegeAdd}
                                
                                
                                
                                // values:
                                currentValue={role.name ?? ''}
                                value={name}
                                onChange={(value) => {
                                    setName(value);
                                    setIsModified(true);
                                }}
                            />
                            
                            <span className='privileges label'>Privileges:</span>
                            <ValidationProvider enableValidation={false} inheritValidation={false}>
                                <AccessibilityProvider enabled={privilegeUpdate || privilegeAdd}>
                                    <ExclusiveAccordion className='privileges list' defaultExpandedListIndex={0}>
                                        <AccordionItem label='Products' inheritEnabled={false}>
                                            <Check      className='check editor' required={false} active={product_r}  onActiveChange={({active}) => { setProduct_r(active);  setIsModified(true); }}>
                                                View
                                            </Check>
                                            <Check      className='check editor' required={false} active={product_c}  onActiveChange={({active}) => { setProduct_c(active);  setIsModified(true); }}>
                                                Add New
                                            </Check>
                                            <Check      className='check editor' required={false} active={product_ud} onActiveChange={({active}) => { setProduct_ud(active); setIsModified(true); }}>
                                                Change Name, Path &amp; Description
                                            </Check>
                                            <Check      className='check editor' required={false} active={product_ui} onActiveChange={({active}) => { setProduct_ui(active); setIsModified(true); }}>
                                                Change Images
                                            </Check>
                                            <Check      className='check editor' required={false} active={product_up} onActiveChange={({active}) => { setProduct_up(active); setIsModified(true); }}>
                                                Change Price &amp; Shipping Weight
                                            </Check>
                                            <Check      className='check editor' required={false} active={product_us} onActiveChange={({active}) => { setProduct_us(active); setIsModified(true); }}>
                                                Change Stock
                                            </Check>
                                            <Check      className='check editor' required={false} active={product_uv} onActiveChange={({active}) => { setProduct_uv(active); setIsModified(true); }}>
                                                Change Visibility
                                            </Check>
                                            <Check      className='check editor' required={false} active={product_d}  onActiveChange={({active}) => { setProduct_d(active);  setIsModified(true); }}>
                                                Delete
                                            </Check>
                                        </AccordionItem>
                                        <AccordionItem label='Users' inheritEnabled={false}>
                                            <Check      className='check editor' required={false} active={user_r}  onActiveChange={({active}) => { setUser_r(active);  setIsModified(true); }}>
                                                View
                                            </Check>
                                            <Check      className='check editor' required={false} active={user_c}  onActiveChange={({active}) => { setUser_c(active);  setIsModified(true); }}>
                                                Add New
                                            </Check>
                                            <Check      className='check editor' required={false} active={user_un} onActiveChange={({active}) => { setUser_un(active); setIsModified(true); }}>
                                                Change Name
                                            </Check>
                                            <Check      className='check editor' required={false} active={user_uu} onActiveChange={({active}) => { setUser_uu(active); setIsModified(true); }}>
                                                Change Username
                                            </Check>
                                            <Check      className='check editor' required={false} active={user_ue} onActiveChange={({active}) => { setUser_ue(active); setIsModified(true); }}>
                                                Change Email
                                            </Check>
                                            <Check      className='check editor' required={false} active={user_up} onActiveChange={({active}) => { setUser_up(active); setIsModified(true); }}>
                                                Change Password
                                            </Check>
                                            <Check      className='check editor' required={false} active={user_ui} onActiveChange={({active}) => { setUser_ui(active); setIsModified(true); }}>
                                                Change Image
                                            </Check>
                                            <Check      className='check editor' required={false} active={user_ur} onActiveChange={({active}) => { setUser_ur(active); setIsModified(true); }}>
                                                Change Role
                                            </Check>
                                            <Check      className='check editor' required={false} active={user_d}  onActiveChange={({active}) => { setUser_d(active);  setIsModified(true); }}>
                                                Delete
                                            </Check>
                                        </AccordionItem>
                                        <AccordionItem label='Roles' inheritEnabled={false}>
                                            <Check      className='check editor' required={false} active={role_c}  onActiveChange={({active}) => { setRole_c(active);  setIsModified(true); }}>
                                                Add New
                                            </Check>
                                            <Check      className='check editor' required={false} active={role_u}  onActiveChange={({active}) => { setRole_u(active); setIsModified(true); }}>
                                                Change
                                            </Check>
                                            <Check      className='check editor' required={false} active={role_d}  onActiveChange={({active}) => { setRole_d(active);  setIsModified(true); }}>
                                                Delete
                                            </Check>
                                        </AccordionItem>
                                    </ExclusiveAccordion>
                                </AccessibilityProvider>
                            </ValidationProvider>
                        </form>
                    </TabPanel>
                    {privilegeDelete && <TabPanel label={PAGE_ROLE_TAB_DELETE} panelComponent={<Content theme='warning' className={styleSheet.deleteTab} />}>
                        <ButtonIcon icon={isLoadingModelDelete ? 'busy' : 'delete'} theme='danger' onClick={handleDelete}>
                            Delete <strong>{role.name}</strong> Role
                        </ButtonIcon>
                    </TabPanel>}
                </Tab>
            </ValidationProvider>
            <CardFooter onKeyDown={handleKeyDown}>
            {privilegeWrite && <ButtonIcon className='btnSave'   icon='save' theme='success' onClick={handleSave}>Save</ButtonIcon>}
            <ButtonIcon className='btnCancel' icon={privilegeWrite ? 'cancel' : 'done'} theme={privilegeWrite ? 'danger' : 'primary'}  onClick={handleClosing}>{privilegeWrite ? 'Cancel' : 'Close'}</ButtonIcon>
            </CardFooter>
        </AccessibilityProvider>
    );
};
