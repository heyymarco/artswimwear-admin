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

// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
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
    TextEditor,
}                           from '@/components/editors/TextEditor'
import {
    UploadImage,
}                           from '@/components/editors/UploadImage'
import {
    RoleEditor,
}                           from '@/components/editors/RoleEditor'

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
    id       : '',
    
    name      : '',
    product_r : false,
    product_c : false,
    product_u : false,
    product_d : false,
};



// react components:
export interface EditRoleDialogProps {
    // data:
    role    ?: RoleDetail
    
    
    
    // handlers:
    onClose  : () => void
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
    
    
    
    // stores:
    const [updateRole, {isLoading : isLoadingModelUpdate}] = useUpdateRole();
    const [deleteRole, {isLoading : isLoadingModelDelete}] = useDeleteRole();
    const isLoading = isLoadingModelUpdate || isLoadingModelDelete;
    
    
    
    // states:
    const [isPathModified  , setIsPathModified  ] = useState<boolean>(false);
    const [isModified      , setIsModified      ] = useState<boolean>(false);
    
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    const [name            , setName            ] = useState<string>(role.name);
    
    const [product_r       , setProduct_r       ] = useState<boolean>(role.product_r);
    const [product_c       , setProduct_c       ] = useState<boolean>(role.product_c);
    const [product_u       , setProduct_u       ] = useState<boolean>(role.product_u);
    const [product_d       , setProduct_d       ] = useState<boolean>(role.product_d);
    
    
    
    // stores:
    
    
    
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
            await updateRole({
                id : role.id,
                
                name,
                
                product_r,
                product_c,
                product_u,
                product_d,
            }).unwrap();
            
            await handleClose();
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
                        Are you sure to remove <strong>{role.name}</strong> role?
                    </p>
                    <p>
                        The users associated with the {role.name} role will still be logged in but will not have any authority.<br />
                        You can re-assign their authorities later.
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
            
            await handleClose();
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
                    await handleClose();
                    break;
                default:
                    // do nothing (continue editing)
                    break;
            } // switch
        }
        else {
            await handleClose();
        } // if
    });
    const handleClose = useEvent(async () => {
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
                            <TextEditor className='name editor' aria-label='Name' required={true } value={name} onChange={(value) => { setName(value); setIsModified(true); }} elmRef={firstEditorRef} autoCapitalize='words' />
                            
                            <span className='authorities label'>Authorities:</span>
                            <ValidationProvider enableValidation={false} inheritValidation={false}>
                                <ExclusiveAccordion className='authorities list' defaultExpandedListIndex={0}>
                                    <AccordionItem label='Products'>
                                        <Check      className='check editor' required={false} active={product_r} onActiveChange={({active}) => { setProduct_r(active); setIsModified(true); }}>
                                            View
                                        </Check>
                                        <Check      className='check editor' required={false} active={product_c} onActiveChange={({active}) => { setProduct_c(active); setIsModified(true); }}>
                                            Add New
                                        </Check>
                                        <Check      className='check editor' required={false} active={product_u} onActiveChange={({active}) => { setProduct_u(active); setIsModified(true); }}>
                                            Change
                                        </Check>
                                        <Check      className='check editor' required={false} active={product_d} onActiveChange={({active}) => { setProduct_d(active); setIsModified(true); }}>
                                            Delete
                                        </Check>
                                    </AccordionItem>
                                </ExclusiveAccordion>
                            </ValidationProvider>
                        </form>
                    </TabPanel>
                    <TabPanel label={PAGE_ROLE_TAB_DELETE} panelComponent={<Content theme='warning' className={styleSheet.deleteTab} />}>
                        <ButtonIcon icon={isLoadingModelDelete ? 'busy' : 'delete'} theme='danger' onClick={handleDelete}>
                            Delete <strong>{role.name}</strong> Role
                        </ButtonIcon>
                    </TabPanel>
                </Tab>
            </ValidationProvider>
            <CardFooter onKeyDown={handleKeyDown}>
                <ButtonIcon className='btnSave'   icon={isLoadingModelUpdate ? 'busy' : 'save'  } theme='success' onClick={handleSave}>Save</ButtonIcon>
                <ButtonIcon className='btnCancel' icon='cancel'                                   theme='danger'  onClick={handleClosing}>Cancel</ButtonIcon>
            </CardFooter>
        </AccessibilityProvider>
    );
}
