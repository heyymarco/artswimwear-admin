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
    
    usePostImage,
    useDeleteImage,
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
    
    const initialImageRef                         = useRef<string|null>(user.image);
    const [draftDeletedImages                   ] = useState<Map<string, boolean|null>>(() => new Map<string, boolean|null>());
    
    
    
    // stores:
    const [updateUser , {isLoading : isLoadingModel                  }] = useUpdateUser();
    const [postImage                                                  ] = usePostImage();
    const [commitDeleteImage, {isLoading : isLoadingCommitDeleteImage}] = useDeleteImage();
    const [revertDeleteImage, {isLoading : isLoadingRevertDeleteImage}] = useDeleteImage();
    const isCommiting = isLoadingModel || isLoadingCommitDeleteImage;
    const isReverting = isLoadingRevertDeleteImage;
    const isLoading   = isCommiting || isReverting;
    
    
    
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
            const updatingUserTask = updateUser({
                id             : user.id,
                
                name,
                email,
                image,
                roleId,
                username : username || null, // convert empty string to null
            }).unwrap();
            
            await handleClose(/*commitImages = */true, [updatingUserTask]);
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
            <ValidationProvider enableValidation={enableValidation}>
                <Tab
                    // variants:
                    mild='inherit'
                    
                    
                    
                    // classes:
                    className={styles.cardBody}
                    
                    
                    
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
                    <TabPanel label={PAGE_USER_TAB_ROLE}         panelComponent={<Generic className={styles.roleTab} />}>
                        Testing...
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
