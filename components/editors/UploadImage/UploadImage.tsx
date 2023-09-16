// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useId,
    useRef,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    useMergeEvents,
    useMergeClasses,
    useMountedFlag,
    useScheduleTriggerEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    BasicProps,
    Basic,
    Content,
    
    
    
    // simple-components:
    Icon,
    ButtonProps,
    ButtonIcon,
    
    
    
    // composite-components:
    ProgressProps,
    Progress,
    ProgressBarProps,
    ProgressBar,
    
    
    
    // utility-components:
    paragraphify,
}                           from '@reusable-ui/components'

// other libs:
import {
    default as MimeMatcher,
}                           from 'mime-matcher'

// internals:
import type {
    // types:
    EditorChangeEventHandler,
    
    
    
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    // configs:
    uploadImages,
}                           from './styles/config'



// styles:
export const useUploadImageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { specificityWeight: 2, id: 'glt9axuphe' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './styles/styles'



// utilities:
const resolveSrc = <TValue extends ImageData = ImageData>(imageData: TValue, onResolveUrl: ((imageData: TValue) => URL|string)|undefined): string => {
    if (!onResolveUrl) return (typeof(imageData) === 'string') ? imageData : imageData.url;
    const resolved = onResolveUrl(imageData);
    return (typeof(resolved) === 'string') ? resolved : resolved.href;
};
const resolveAlt = <TValue extends ImageData = ImageData>(imageData: TValue): string => {
    return ((typeof(imageData) === 'string') ? '' : imageData.title) || '';
};



// types:
export type DetailedImageData = {
    url    : string
    title ?: string
}
export type ImageData =
    |string
    |DetailedImageData

type UploadingImageData = {
    imageFile   : File
    percentage  : number|null
    uploadError : React.ReactNode
    onRetry     : () => void
    onCancel    : () => void
}



// react components:
export interface UploadImageProps<TElement extends Element = HTMLElement, TValue extends ImageData = ImageData>
    extends
        // bases:
        Pick<EditorProps<TElement, TValue>,
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
        >,
        Omit<BasicProps<TElement>,
            // values:
            |'defaultValue' // not supported
            |'value'        // not supported
            |'onChange'     // not supported
            
            // children:
            |'children'     // already taken over
        >
{
    // actions:
    actionDelete             ?: string
    onActionDelete           ?: (args: { imageData: TValue }) => Promise<boolean>
    
    
    
    // upload images:
    uploadImageSelectImage   ?: string
    uploadImageDeleteImage   ?: string
    uploadImageType          ?: string
    
    
    
    // uploading images:
    uploadingImageErrorTitle ?: string
    uploadingImageRetry      ?: string
    uploadingImageCancel     ?: string
    
    
    
    // upload activities:
    onUploadImageStart       ?: (args: { imageFile: File, reportProgress: (percentage: number) => void, abortSignal: AbortSignal }) => Promise<TValue|Error|null>
    onUploadingImageProgress ?: (args: { percentage: number|null }) => string
    
    
    
    // components:
    bodyComponent            ?: React.ReactComponentElement<any, BasicProps<TElement>>
    
    mediaGroupComponent      ?: React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>
    noImageComponent         ?: React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>
    previewImageComponent    ?: React.ReactComponentElement<any, React.ImgHTMLAttributes<HTMLImageElement>>
    imageComponent           ?: React.ReactComponentElement<any, React.ImgHTMLAttributes<HTMLImageElement>>
    progressComponent        ?: React.ReactComponentElement<any, ProgressProps<Element>>
    progressBarComponent     ?: React.ReactComponentElement<any, ProgressBarProps<Element>>
    uploadErrorComponent     ?: React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>
    
    actionGroupComponent     ?: React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>
    selectButtonComponent    ?: React.ReactComponentElement<any, ButtonProps>
    deleteButtonComponent    ?: React.ReactComponentElement<any, ButtonProps>
    retryButtonComponent     ?: React.ReactComponentElement<any, ButtonProps>
    cancelButtonComponent    ?: React.ReactComponentElement<any, ButtonProps>
    
    // handlers:
    onResolveUrl             ?: (imageData: TValue) => URL|string
}
const UploadImage = <TElement extends Element = HTMLElement, TValue extends ImageData = ImageData>(props: UploadImageProps<TElement, TValue>): JSX.Element|null => {
    // styles:
    const styleSheet = useUploadImageStyleSheet();
    
    
    
    // rest props:
    const {
        // values:
        defaultValue : defaultImage,
        value        : image,
        onChange,
        
        
        
        // actions:
        actionDelete,
        onActionDelete,
        
        
        
        // upload images:
        uploadImageSelectImage   = 'Select Image',
        uploadImageDeleteImage   = 'Delete Image',
        uploadImageType          = 'image/jpg, image/jpeg, image/png, image/svg',
        
        
        
        // uploading images:
        uploadingImageErrorTitle = 'Upload Error',
        uploadingImageRetry      = 'Retry',
        uploadingImageCancel     = 'Cancel',
        
        
        
        // upload/uploading activities:
        onUploadImageStart,
        // onUploadingImageProgress = ({ percentage }) => `${percentage}%`,
        onUploadingImageProgress = ({ percentage }) => '',
        
        
        
        // components:
        bodyComponent          = (<Content<TElement>                                 /> as React.ReactComponentElement<any, BasicProps<TElement>>),
        
        mediaGroupComponent    = (<div                                               /> as React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>),
        noImageComponent       = (<Icon       icon='image' size='xl'                 /> as React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>),
        imageComponent         = (<img                                               /> as React.ReactComponentElement<any, React.ImgHTMLAttributes<HTMLImageElement>>),
        previewImageComponent  = imageComponent,
        progressComponent      = (<Progress                size='sm'                 /> as React.ReactComponentElement<any, ProgressProps<Element>>),
        progressBarComponent   = (<ProgressBar                                       /> as React.ReactComponentElement<any, ProgressBarProps<Element>>),
        uploadErrorComponent   = (<Basic      mild={true}  size='sm' theme='danger'  /> as React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>),
        
        actionGroupComponent   = (<div                                               /> as React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>),
        selectButtonComponent  = (<ButtonIcon icon='upload_file'     theme='primary' /> as React.ReactComponentElement<any, ButtonProps>),
        deleteButtonComponent  = (<ButtonIcon icon='clear'           theme='danger'  /> as React.ReactComponentElement<any, ButtonProps>),
        retryButtonComponent   = (<ButtonIcon icon='refresh'         theme='success' /> as React.ReactComponentElement<any, ButtonProps>),
        cancelButtonComponent  = (<ButtonIcon icon='cancel'          theme='danger'  /> as React.ReactComponentElement<any, ButtonProps>),
        
        
        
        // handlers:
        onResolveUrl,
    ...restBasicProps} = props;
    
    
    
    // refs:
    const inputFileRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // states:
    const isControllableImage                  = (image !== undefined);
    const [imageDn        , setImageDn       ] = useState<TValue|null>(defaultImage ?? null);
    const imageFn : TValue|null                = (image /*controllable*/ ?? imageDn /*uncontrollable*/);
    
    const [uploadingImage , setUploadingImage] = useState<UploadingImageData|null>(null);
    const uploadingImageRef                    = useRef<UploadingImageData|null>(uploadingImage);
    uploadingImageRef.current                  = uploadingImage;
    const isUnknownProgress                    = !!uploadingImage && (uploadingImage.percentage === null);
    const isError                              = !!uploadingImage && !!uploadingImage.uploadError && (uploadingImage.uploadError !== true);
    
    const [previewImage   , setPreviewImage  ] = useState<string|null>(null);
    
    
    
    // events:
    const scheduleTriggerEvent = useScheduleTriggerEvent();
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    
    
    // handlers:
    const handleChangeInternal            = useEvent<EditorChangeEventHandler<TValue>>((image) => {
        // update state:
        if (!isControllableImage) setImageDn(image);
    });
    const handleChange                    = useMergeEvents(
        // preserves the original `onChange` from `props`:
        onChange,
        
        
        
        // actions:
        handleChangeInternal,
    );
    const triggerChange                   = useEvent((newDraftImage: TValue): void => {
        if (handleChange) scheduleTriggerEvent(() => { // runs the `onChange` event *next after* current macroTask completed
            // fire `onChange` react event:
            handleChange(newDraftImage);
        });
    });
    
    const selectButtonHandleClickInternal = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        inputFileRef.current?.click();
    });
    const selectButtonHandleClick         = useMergeEvents(
        // preserves the original `onClick` from `selectButtonComponent`:
        selectButtonComponent.props.onClick,
        
        
        
        // actions:
        selectButtonHandleClickInternal,
    );
    
    const deleteButtonHandleClickInternal = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        // TODO: delete image
    });
    const deleteButtonHandleClick         = useMergeEvents(
        // preserves the original `onClick` from `deleteButtonComponent`:
        deleteButtonComponent.props.onClick,
        
        
        
        // actions:
        deleteButtonHandleClickInternal,
    );
    
    const inputFileHandleChange           = useEvent<React.ChangeEventHandler<HTMLInputElement>>(async () => {
        // conditions:
        const inputFileElm = inputFileRef.current;
        if (!inputFileElm)       return; // input file is not loaded => ignore
        
        const files = inputFileElm.files;
        if (!files)              return; // no file selected => ignore
        
        
        
        // actions:
        try {
            handleFilesAdded(files);
        }
        finally {
            // unselect files after the selected files has taken:
            inputFileElm.value = '';
        } // try
    });
    const handleFilesAdded                = useEvent((files: FileList): void => {
        // conditions:
        if (!onUploadImageStart) return; // the upload image handler is not configured => ignore
        
        
        
        // actions:
        const mimeMatcher = new MimeMatcher(...uploadImageType.split(',').map((mime) => mime.trim()));
        
        // for (const imageFile of files) {
        //     // conditions:
        //     if (!mimeMatcher.match(imageFile.type)) {
        //         continue; // ignore foreign files
        //     } // if
        //     
        //     
        //     
        //     // actions:
        //     handleUploadImageStart({
        //         imageFile : imageFile,
        //     });
        // } // for
        
        const imageFile = files?.[0];
        if (!imageFile) return; // no file selected => ignore
        if (!mimeMatcher.match(imageFile.type)) {
            return; // ignore foreign files
        } // if
        handleUploadImageStart({
            imageFile : imageFile,
        });
    });
    const handleUploadImageStart          = useEvent((args: { imageFile: File }): void => {
        // conditions:
        if (!onUploadImageStart) return; // the upload image handler is not configured => ignore
        
        
        
        // params:
        const {
            imageFile,
        ...restParams} = args;
        
        
        
        // add a new uploading status:
        const abortController    = new AbortController();
        const abortSignal        = abortController.signal;
        const isUploadCanceled   = (): boolean => {
            return (
                !isMounted.current
                ||
                abortSignal.aborted
            );
        };
        const handleUploadRetry  = (): void => {
            // conditions:
            if (isUploadCanceled()) return; // the uploader was canceled => ignore
            
            
            
            // resets:
            const uploadingImageData = uploadingImageRef.current;
            if (uploadingImageData) {
                uploadingImageData.percentage  = null; // reset progress
                uploadingImageData.uploadError = null; // reset error
                setUploadingImage({...uploadingImageData}); // force to re-render
            } // if
            
            
            
            // actions:
            performUpload();
        };
        const handleUploadCancel = (): void => {
            // conditions:
            if (isUploadCanceled()) return; // the uploader was canceled => ignore
            
            
            
            // abort the upload progress:
            abortController.abort();
            
            
            
            // remove the uploading status:
            performRemove();
        };
        const uploadingImageData : UploadingImageData = {
            imageFile   : imageFile,
            percentage  : null,
            uploadError : null,
            onRetry     : handleUploadRetry,
            onCancel    : handleUploadCancel,
        };
        setUploadingImage(uploadingImageData); // set a new uploading status
        
        
        
        // uploading progress:
        const handleReportProgress = (percentage: number): void => {
            // conditions:
            if (isUploadCanceled())  return; // the uploader was canceled => ignore
            const uploadingImageData = uploadingImageRef.current;
            if (!uploadingImageData) return; // upload is not started => ignore
            if (uploadingImageData.percentage === percentage)  return; // already the same => ignore
            
            
            
            // updates:
            uploadingImageData.percentage = percentage; // update the percentage
            setUploadingImage({...uploadingImageData}); // force to re-render
        };
        const performRemove        = (): void => {
            // remove the uploading status:
            setUploadingImage(null);
        };
        const performUpload        = async (): Promise<void> => {
            let imageData : TValue|Error|null|undefined = undefined;
            try {
                imageData = await onUploadImageStart({
                    ...restParams,
                    
                    imageFile      : imageFile,
                    reportProgress : handleReportProgress,
                    abortSignal    : abortSignal,
                });
                if (imageData instanceof Error) throw imageData;
                
                
                
                // conditions:
                if (isUploadCanceled()) return; // the uploader was canceled => ignore
            }
            catch (error: any) {
                // conditions:
                if (isUploadCanceled())  return; // the uploader was canceled => ignore
                const uploadingImageData = uploadingImageRef.current;
                if (!uploadingImageData) return; // upload is not started => ignore
                
                
                
                const errorJsx : React.ReactNode = (
                    ((typeof(error?.message) === 'string') || (typeof(error) === 'string'))
                    ? paragraphify(error?.message ?? error)
                    : (error ?? <p>Failed to upload image.</p>)
                );
                uploadingImageData.uploadError = errorJsx;
                setUploadingImage({...uploadingImageData}); // force to re-render
                return; // failed => no further actions
            } // try
            
            
            
            // remove the uploading status:
            performRemove();
            
            
            
            // successfully uploaded:
            if (imageData) {
                // notify the images changed:
                triggerChange(imageData); // then at the *next re-render*, the *controllable* `image` will change
            } // if
        };
        performUpload();
    });
    
    const retryButtonHandleClickInternal  = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        uploadingImage?.onRetry?.();
    });
    const retryButtonHandleClick          = useMergeEvents(
        // preserves the original `onClick` from `retryButtonComponent`:
        retryButtonComponent.props.onClick,
        
        
        
        // actions:
        retryButtonHandleClickInternal,
    );
    
    const cancelButtonHandleClickInternal = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        uploadingImage?.onCancel?.();
    });
    const cancelButtonHandleClick         = useMergeEvents(
        // preserves the original `onClick` from `cancelButtonComponent`:
        cancelButtonComponent.props.onClick,
        
        
        
        // actions:
        cancelButtonHandleClickInternal,
    );
    
    
    
    // classes:
    const classes = useMergeClasses(
        // preserves the original `classes` from `bodyComponent`:
        bodyComponent.props.classes,
        
        
        
        // preserves the original `classes` from `props`:
        props.classes,
        
        
        
        // classes:
        styleSheet.main,
    );
    
    
    
    // dom effects:
    const uploadingImageFile = uploadingImage?.imageFile;
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (!uploadingImageFile) return; // no uploading file => ignore
        
        
        
        // setups:
        const previewImageUrl = URL.createObjectURL(uploadingImageFile);
        setPreviewImage(previewImageUrl);
        
        
        
        // cleanups:
        return () => {
            URL.revokeObjectURL(previewImageUrl);
            setPreviewImage(null);
        };
    }, [uploadingImageFile]);
    
    
    
    // jsx:
    return React.cloneElement<BasicProps<TElement>>(bodyComponent,
        // props:
        {
            // other props:
            ...restBasicProps,
            ...bodyComponent.props, // overwrites restBasicProps (if any conflics)
            
            
            
            // variants:
            mild    : bodyComponent.props.mild ?? props.mild ?? true,
            
            
            
            // classes:
            classes : classes,
        },
        
        
        
        // children:
        React.cloneElement<React.HTMLAttributes<HTMLElement>>(mediaGroupComponent,
            // props:
            {
                // classes:
                className : mediaGroupComponent.props.className ?? 'mediaGroup',
            },
            
            
            
            // children:
            /* <NoImage> */
            ((!uploadingImage && !imageFn) && React.cloneElement<React.HTMLAttributes<HTMLElement>>(noImageComponent,
                // props:
                {
                    // classes:
                    className : noImageComponent.props.className ?? 'noImage',
                },
            )),
            
            /* <PreviewImage> */
            (!!uploadingImage && !!previewImage && React.cloneElement<React.ImgHTMLAttributes<HTMLImageElement>>(previewImageComponent,
                // props:
                {
                    // classes:
                    className : previewImageComponent.props.className ?? 'previewImage',
                    
                    
                    
                    // images:
                    alt       : previewImageComponent.props.alt   ?? '',
                    src       : previewImageComponent.props.src   ?? previewImage, // convert empty string to undefined
                    sizes     : previewImageComponent.props.sizes ?? uploadImages.previewImageInlineSize,
                },
            )),
            
            /* <Image> */
            (!!imageFn && React.cloneElement<React.ImgHTMLAttributes<HTMLImageElement>>(imageComponent,
                // props:
                {
                    // classes:
                    className : imageComponent.props.className ?? 'image',
                    
                    
                    
                    // images:
                    alt       : imageComponent.props.alt   ??  resolveAlt(imageFn),
                    src       : imageComponent.props.src   ?? (resolveSrc(imageFn, onResolveUrl) || undefined), // convert empty string to undefined
                    sizes     : imageComponent.props.sizes ?? uploadImages.imageInlineSize,
                },
            )),
            
            /* <Progress> & <UploadError> */
            (!!uploadingImage && <>
                {/* <Progress> */}
                {!isError && React.cloneElement<ProgressProps<Element>>(progressComponent,
                    // props:
                    {
                        // classes:
                        className : progressComponent.props.className ?? 'uploadProgress',
                    },
                    
                    
                    
                    // children:
                    React.cloneElement<ProgressBarProps<Element>>(progressBarComponent,
                        // props:
                        {
                            // variants:
                            progressBarStyle : progressBarComponent.props.progressBarStyle ?? (isUnknownProgress ? 'striped' : undefined),
                            
                            
                            
                            // states:
                            running          : progressBarComponent.props.running          ?? (isUnknownProgress ? true : undefined),
                            
                            
                            
                            // values:
                            value            : progressBarComponent.props.value            ?? (isUnknownProgress ? 100  : (uploadingImage.percentage ?? 100)),
                        },
                        
                        
                        
                        // children:
                        onUploadingImageProgress({
                            percentage : uploadingImage.percentage,
                        }),
                    ),
                )}
                
                {/* <UploadError> */}
                {isError && React.cloneElement<React.HTMLAttributes<HTMLElement>>(uploadErrorComponent,
                    // props:
                    {
                        // classes:
                        className : uploadErrorComponent.props.className ?? 'uploadError',
                    },
                    
                    
                    
                    // children:
                    uploadErrorComponent.props.children ?? uploadingImage.uploadError
                )}
            </>),
        ),
        
        React.cloneElement<React.HTMLAttributes<HTMLElement>>(actionGroupComponent,
            // props:
            {
                // classes:
                className : actionGroupComponent.props.className ?? 'actionGroup',
            },
            
            
            
            // children:
            (!uploadingImage && <>
                {/* <SelectButton> */}
                {React.cloneElement<ButtonProps>(selectButtonComponent,
                    // props:
                    {
                        // classes:
                        className : selectButtonComponent.props.className ?? 'selectButton',
                        
                        
                        
                        // handlers:
                        onClick : selectButtonHandleClick,
                    },
                    
                    
                    
                    // children:
                    uploadImageSelectImage,
                )}
                
                {/* <DeleteButton> */}
                {React.cloneElement<ButtonProps>(deleteButtonComponent,
                    // props:
                    {
                        // classes:
                        className : deleteButtonComponent.props.className ?? 'deleteButton',
                        
                        
                        
                        // handlers:
                        onClick : deleteButtonHandleClick,
                    },
                    
                    
                    
                    // children:
                    uploadImageDeleteImage,
                )}
            </>),
            
            (!!uploadingImage && <>
                {/* <RetryButton> */}
                {isError && React.cloneElement<ButtonProps>(retryButtonComponent,
                    // props:
                    {
                        // classes:
                        className : retryButtonComponent.props.className ?? 'retryButton',
                        
                        
                        
                        // handlers:
                        onClick : retryButtonHandleClick,
                    },
                    
                    
                    
                    // children:
                    uploadingImageRetry,
                )}
                
                {/* <CancelButton> */}
                {React.cloneElement<ButtonProps>(cancelButtonComponent,
                    // props:
                    {
                        // classes:
                        className : cancelButtonComponent.props.className ?? 'cancelButton',
                        
                        
                        
                        // handlers:
                        onClick : cancelButtonHandleClick,
                    },
                    
                    
                    
                    // children:
                    uploadingImageCancel,
                )}
            </>),
        ),
        
        <input
            // refs:
            ref={inputFileRef}
            
            
            
            // classes:
            className='inputFile'
            
            
            
            // formats:
            type='file'
            accept={uploadImageType}
            multiple={false}
            
            
            
            // handlers:
            onChange={inputFileHandleChange}
        />,
    );
};
export {
    UploadImage,
    UploadImage as default,
}
