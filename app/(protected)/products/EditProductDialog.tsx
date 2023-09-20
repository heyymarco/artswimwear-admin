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
    
    
    
    // base-content-components:
    Content,
    
    
    
    // simple-components:
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
    PathEditor,
}                           from '@/components/editors/PathEditor'
import {
    CurrencyEditor,
}                           from '@/components/editors/CurrencyEditor'
import {
    ShippingWeightEditor,
}                           from '@/components/editors/ShippingWeightEditor'
import {
    StockEditor,
}                           from '@/components/editors/StockEditor'
import {
    VisibilityEditor,
}                           from '@/components/editors/VisibilityEditor'
import {
    GalleryEditor,
}                           from '@/components/editors/GalleryEditor'
import {
    WysiwygEditorState,
    ToolbarPlugin,
    EditorPlugin,
    WysiwygEditor,
}                           from '@/components/editors/WysiwygEditor'

// models:
import type {
    ProductVisibility,
}                           from '@prisma/client'

// stores:
import {
    // types:
    ProductDetail,
    
    
    
    // hooks:
    useUpdateProduct,
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
    
    PAGE_PRODUCT_TAB_INFORMATIONS,
    PAGE_PRODUCT_TAB_IMAGES,
    PAGE_PRODUCT_TAB_DESCRIPTION,
}                           from '@/website.config'
import {
    COMMERCE_CURRENCY_FRACTION_MAX,
}                           from '@/commerce.config'



// styles:
const useEditProductDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./EditProductDialogStyles')
, { id: 'pkeb1tledn' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// utilities:
const emptyProduct : ProductDetail = {
    id             : '',
    
    visibility     : 'DRAFT',
    
    name           : '',
    
    price          : 0,
    shippingWeight : null,
    
    stock          : null,
    
    path           : '',
    
    excerpt        : null,
    description    : null,
    
    images         : [],
};



// react components:
export interface EditProductDialogProps {
    // data:
    product                 ?: ProductDetail
    defaultExpandedTabIndex ?: number
    
    
    
    // handlers:
    onClose                  : () => void
}
export const EditProductDialog = (props: EditProductDialogProps): JSX.Element|null => {
    // styles:
    const styles = useEditProductDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        product = emptyProduct,
        defaultExpandedTabIndex,
        
        
        
        // handlers:
        onClose,
    } = props;
    
    
    
    // states:
    const [isPathModified  , setIsPathModified  ] = useState<boolean>(false);
    const [isModified      , setIsModified      ] = useState<boolean>(false);
    
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    const [visibility      , setVisibility      ] = useState<ProductVisibility>(product.visibility as ProductVisibility);
    const [name            , setName            ] = useState<string>(product.name);
    const [path            , setPath            ] = useState<string>(product.path);
    const [price           , setPrice           ] = useState<number>(product.price);
    const [shippingWeight  , setShippingWeight  ] = useState<number|null>(product.shippingWeight ?? null);
    const [stock           , setStock           ] = useState<number|null>(product.stock          ?? null);
    const [images          , setImages          ] = useState<string[]>(product.images);
    const [description     , setDescription     ] = useState<WysiwygEditorState|null>(() => {
        const description = product.description;
        if (!description) return null;
        if (typeof(description) === 'object') return description as any;
        try {
            return JSON.parse(description.toString());
        }
        catch {
            return null;
        } // try
    });
    
    
    
    // stores:
    const [updateProduct, {isLoading}] = useUpdateProduct();
    
    
    
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
    const handleNameChange = useEvent((name: string) => {
        // conditions:
        if (isPathModified) return; // path is already modified by user, do not perform *auto* modify
        
        
        
        // sync path:
        setPath(
            name.trim().toLowerCase().replace(/(\s|_|-)+/ig, '-')
        );
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
        if (editorFormRef.current?.querySelector(':is(.invalidating, .invalidated)')) return;
        
        
        
        try {
            await updateProduct({
                id             : product.id,
                
                visibility,
                name,
                path,
                price          : price,
                shippingWeight : shippingWeight,
                stock          : stock,
                images,
                description    : (description?.toJSON?.() ?? description) as any,
            }).unwrap();
            
            onClose();
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
                    onClose();
                    break;
                default:
                    // do nothing (continue editing)
                    break;
            } // switch
        }
        else {
            onClose();
        } // if
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
                <h1>{name || ((product === emptyProduct) ? 'Create New Product' : 'Edit Product')}</h1>
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
                    <TabPanel label={PAGE_PRODUCT_TAB_INFORMATIONS} panelComponent={<Generic className={styles.infoTab} />}>
                        <form ref={editorFormRef}>
                            <span className='name label'>Name:</span>
                            <TextEditor           className='name editor'       required={true}  value={name}           onChange={(value) => { setName(value); setIsModified(true); handleNameChange(value); }} elmRef={((defaultExpandedTabIndex ?? 0) === 0) ? firstEditorRef : undefined} />
                            
                            <span className='path label'>Path:</span>
                            <PathEditor           className='path editor'       required={true}  value={path}           onChange={(value) => { setPath(value); setIsPathModified(true); }} homeUrl={STORE_WEBSITE_URL} isValid={!!path} />
                            
                            <span className='price label'>Price:</span>
                            <CurrencyEditor       className='price editor'      required={true}  value={price}          onChange={(value) => { setPrice(value ?? 0); setIsModified(true); }} currencySign={getCurrencySign()} currencyFraction={COMMERCE_CURRENCY_FRACTION_MAX} />
                            
                            <span className='sWeight label'>Shipping Weight:</span>
                            <ShippingWeightEditor className='sWeight editor'    required={false} value={shippingWeight} onChange={(value) => { setShippingWeight(value); setIsModified(true); }} />
                            
                            <span className='stock label'>Stock:</span>
                            <StockEditor          className='stock editor'                       value={stock}          onChange={(value) => { setStock(value)     ; setIsModified(true); }} theme='secondary' />
                            
                            <span className='visibility label'>Visibility:</span>
                            <VisibilityEditor     className='visibility editor'                  value={visibility}     onChange={(value) => { setVisibility(value); setIsModified(true); }} theme='secondary' />
                        </form>
                    </TabPanel>
                    <TabPanel label={PAGE_PRODUCT_TAB_IMAGES}       panelComponent={<Generic className={styles.imagesTab} />}>
                        <GalleryEditor<HTMLElement, string>
                            // variants:
                            nude={true}
                            
                            
                            
                            // values:
                            value={images}
                            onChange={(value) => {
                                setImages(value);
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
                                formData.append('folder', name);
                                const response = await axios.post('/api/upload', formData, {
                                    headers          : { 'content-type': 'multipart/form-data' },
                                    onUploadProgress : (event) => {
                                        reportProgress(
                                            (event.loaded * 100) / (event.total ?? 100)
                                        );
                                    },
                                });
                                return response.data.id;
                            }}
                            onDeleteImage={async ({ imageData }) => {
                                await axios.delete(`/api/upload?imageId=${encodeURIComponent(imageData)}`);
                                return true;
                            }}
                            onResolveImageUrl={resolveMediaUrl<never>}
                        />
                    </TabPanel>
                    <TabPanel label={PAGE_PRODUCT_TAB_DESCRIPTION}  panelComponent={<Generic className={styles.descriptionTab} />}>
                        <WysiwygEditor
                            // refs:
                            elmRef={((defaultExpandedTabIndex ?? 0) === 2) ? firstEditorRef : undefined}
                            
                            
                            
                            // classes:
                            className={styles.editDescription}
                            
                            
                            
                            // values:
                            value={description}
                            onChange={(value) => {
                                setDescription(value);
                                setIsModified(true);
                            }}
                        >
                            <ToolbarPlugin className='solid' theme='primary' />
                            <EditorPlugin
                                // accessibilities:
                                placeholder='Type product description here...'
                            />
                        </WysiwygEditor>
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
