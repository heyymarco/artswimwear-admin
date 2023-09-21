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
    
    
    
    // layout-components:
    List,
    CardHeader,
    CardFooter,
    
    
    
    // composite-components:
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

// stores:
import {
    // types:
    UserDetail,
    
    
    
    // hooks:
    useUpdateUser,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    getCurrencySign,
}                           from '@/libs/formatters'
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'

// other libs:
import {
    default as axios,
}                           from 'axios'

// configs:
import {
    STORE_WEBSITE_URL,
    
    PAGE_USER_TAB_ACCOUNT,
    PAGE_USER_TAB_IMAGE,
    PAGE_USER_TAB_ROLE,
}                           from '@/website.config'



// styles:
const useEditUserDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./EditUserDialogStyles')
, { id: 'm4oi6itiaq' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './EditUserDialogStyles';



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
export interface EditUserDialogProps {
    // data:
    user                    ?: UserDetail
    defaultExpandedTabIndex ?: number
    
    
    
    // handlers:
    onClose                  : () => void
}
export const EditUserDialog = (props: EditUserDialogProps): JSX.Element|null => {
    // styles:
    const styles = useEditUserDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        user = emptyUser,
        defaultExpandedTabIndex,
        
        
        
        // handlers:
        onClose,
    } = props;
    
    
    
    // states:
    const [isPathModified  , setIsPathModified  ] = useState<boolean>(false);
    const [isModified      , setIsModified      ] = useState<boolean>(false);
    
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    const [name            , setName            ] = useState<string>(user.name);
    const [email           , setEmail           ] = useState<string>(user.email);
    const [image           , setImage           ] = useState<string|null>(user.image);
    const [roleId          , setRoleId          ] = useState<string|null>(user.roleId);
    const [username        , setUsername        ] = useState<string|null>(user.username);
    
    const [draftImages                          ] = useState<Map<string, boolean>>(() => new Map<string, boolean>());
    
    
    // stores:
    const [updateUser, {isLoading}] = useUpdateUser();
    
    
    
    // refs:
    const firstEditorRef = useRef<HTMLInputElement|null>(null); // TODO: finish this
    const editorFormRef  = useRef<HTMLFormElement|null>(null);
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    
    
    // dialogs:
    const {
        showMessage,
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
        if (editorFormRef.current?.querySelector(':is(.invalidating, .invalidated)')) return;
        
        
        
        try {
            await updateUser({
                id             : user.id,
                
                name,
                email,
                image,
                roleId,
                username : username || null, // convert empty string to null
            }).unwrap();
            
            await handleClosed(/*commitImages = */true);
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
                    await handleClosed(/*commitImages = */false);
                    break;
                default:
                    // do nothing (continue editing)
                    break;
            } // switch
        }
        else {
            await handleClosed(/*commitImages = */false);
        } // if
    });
    const handleSaveImages = useEvent(async (commitImages : boolean) => {
        // search for unused image(s) and delete them:
        const formData = new FormData();
        for (const unusedImageId of
            Array.from(draftImages.entries())
            .filter((draftImage) => (draftImage[1] !== commitImages))
            .map((draftImage) => draftImage[0])
        )
        {
            formData.append('image' , unusedImageId);
        } // for
        
        draftImages.clear(); // clear the drafts
        
        
        
        try {
            if (formData.getAll('image').length) {
                await axios.patch('/api/upload', formData, {
                    headers : { 'content-type': 'multipart/form-data' },
                });
            } // if
        }
        catch {
            // ignore any error
        } // try
    });
    const handleClosed = useEvent(async (commitImages : boolean) => {
        await handleSaveImages(commitImages);
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
        <>
            <CardHeader
                // handlers:
                onKeyDown={handleKeyDown}
            >
                <h1>{name || ((user === emptyUser) ? 'Create New User' : 'Edit User')}</h1>
                <CloseButton onClick={handleClosing} />
            </CardHeader>
            <ValidationProvider enableValidation={enableValidation}>
                <Tab
                    // variants:
                    mild='inherit'
                    
                    
                    
                    // classes:
                    className={styles.cardBody}
                    
                    
                    
                    // states:
                    enabled={!isLoading}
                    
                    
                    
                    // values:
                    defaultExpandedTabIndex={defaultExpandedTabIndex}
                    
                    
                    
                    // components:
                    listComponent={<List className={styles.tabList} />}
                    bodyComponent={<Content className={styles.tabBody} />}
                    
                    
                    
                    // handlers:
                    onKeyDown={handleKeyDown}
                >
                    <TabPanel label={PAGE_USER_TAB_ACCOUNT} panelComponent={<Generic className={styles.accountTab} />}>
                        <form ref={editorFormRef}>
                            <span className='name label'>Name:</span>
                            <TextEditor           className='name editor'       required={true }  value={name}           onChange={(value) => { setName(value);     setIsModified(true); }} elmRef={firstEditorRef} autoCapitalize='words' />
                            
                            <span className='username label'>Username:</span>
                            <TextEditor           className='username editor'   required={false}  value={username ?? ''} onChange={(value) => { setUsername(value); setIsModified(true); }} />
                            
                            <span className='email label'>Email:</span>
                            <TextEditor           className='email editor'      required={true}   value={email}          onChange={(value) => { setEmail(value);    setIsModified(true); }} />
                        </form>
                    </TabPanel>
                    <TabPanel label={PAGE_USER_TAB_IMAGE}        panelComponent={<Generic className={styles.imageTab} />}>
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
                                const formData = new FormData();
                                formData.append('image' , imageFile);
                                formData.append('folder', '@@user');
                                const response = await axios.post('/api/upload', formData, {
                                    headers          : { 'content-type': 'multipart/form-data' },
                                    onUploadProgress : (event) => {
                                        reportProgress(
                                            (event.loaded * 100) / (event.total ?? 100)
                                        );
                                    },
                                });
                                const imageId : string = response.data.id as any;
                                
                                // replace => delete prev drafts:
                                handleSaveImages(/*commitImages = */false);
                                
                                // mark the image as being used:
                                draftImages.set(imageId, true);
                                
                                return imageId;
                            }}
                            onDeleteImage={async ({ imageData: imageId }) => {
                                // delete later (on save/cancel):
                                // await axios.delete(`/api/upload?imageId=${encodeURIComponent(imageId)}`);
                                
                                // mark the image as unused:
                                draftImages.set(imageId, false);
                                
                                return true;
                            }}
                            onResolveImageUrl={resolveMediaUrl<never>}
                        />
                    </TabPanel>
                    <TabPanel label={PAGE_USER_TAB_ROLE}         panelComponent={<Generic className={styles.roleTab} />}>
                        Testing...
                    </TabPanel>
                </Tab>
            </ValidationProvider>
            <CardFooter onKeyDown={handleKeyDown}>
                <ButtonIcon className='btnSave' icon={isLoading ? 'busy' : 'save'} theme='success' onClick={handleSave}>Save</ButtonIcon>
                <ButtonIcon className='btnCancel' icon='cancel' theme='danger' onClick={handleClosing}>Cancel</ButtonIcon>
            </CardFooter>
        </>
    );
}
