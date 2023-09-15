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
    useMountedFlag,
    useScheduleTriggerEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    BasicProps,
    Basic,
    
    
    
    // simple-components:
    Icon,
    ButtonProps,
    ButtonIcon,
    
    
    
    // composite-components:
    ProgressProps,
    Progress,
    ProgressBarProps,
    ProgressBar,
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
, { id: 'glt9axuphe' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
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
    file        : File
    percentage  : number|null
    uploadError : string
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
    onActionDelete           ?: (imageData: TValue) => Promise<boolean>
    
    
    
    // upload images:
    uploadImageSelectImage   ?: string
    uploadImageType          ?: string
    
    
    
    // uploading images:
    uploadingImageErrorTitle ?: string
    uploadingImageRetry      ?: string
    uploadingImageCancel     ?: string
    
    
    
    // upload activities:
    onUploadImageStart       ?: (imageFile: File, reportProgress: (percentage: number) => void, abortSignal: AbortSignal) => Promise<TValue|null>
    onUploadingImageProgress ?: (percentage: number|null) => string
    
    
    
    // components:
    noImageComponent         ?: React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>
    imageComponent           ?: React.ReactComponentElement<any, React.ImgHTMLAttributes<HTMLImageElement>>
    
    selectButtonComponent    ?: React.ReactComponentElement<any, ButtonProps>
    deleteButtonComponent    ?: React.ReactComponentElement<any, ButtonProps>
    retryButtonComponent     ?: React.ReactComponentElement<any, ButtonProps>
    cancelButtonComponent    ?: React.ReactComponentElement<any, ButtonProps>
    
    progressComponent        ?: React.ReactComponentElement<any, ProgressProps<Element>>
    progressBarComponent     ?: React.ReactComponentElement<any, ProgressBarProps<Element>>
    
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
        uploadImageType          = 'image/jpg, image/jpeg, image/png, image/svg',
        
        
        
        // uploading images:
        uploadingImageErrorTitle = 'Upload Error',
        uploadingImageRetry      = 'Retry',
        uploadingImageCancel     = 'Cancel',
        
        
        
        // upload/uploading activities:
        onUploadImageStart,
        // onUploadingImageProgress = (percentage) => `${percentage}%`,
        onUploadingImageProgress = (percentage) => '',
        
        
        
        // components:
        noImageComponent       = (<Icon icon='image'                             /> as React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>),
        imageComponent         = (<img                                           /> as React.ReactComponentElement<any, React.ImgHTMLAttributes<HTMLImageElement>>),
        
        selectButtonComponent  = (<ButtonIcon icon='upload_file' theme='primary' /> as React.ReactComponentElement<any, ButtonProps>),
        deleteButtonComponent  = (<ButtonIcon icon='clear'       theme='danger'  /> as React.ReactComponentElement<any, ButtonProps>),
        retryButtonComponent   = (<ButtonIcon icon='refresh'     theme='success' /> as React.ReactComponentElement<any, ButtonProps>),
        cancelButtonComponent  = (<ButtonIcon icon='cancel'      theme='danger'  /> as React.ReactComponentElement<any, ButtonProps>),
        
        progressComponent     = (<Progress                             size='sm' /> as React.ReactComponentElement<any, ProgressProps<Element>>),
        progressBarComponent  = (<ProgressBar                                    /> as React.ReactComponentElement<any, ProgressBarProps<Element>>),
        
        
        
        // handlers:
        onResolveUrl,
    ...restBasicProps} = props;
    
    
    
    // refs:
    const inputFileRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // states:
    const isControllableImage   = (image !== undefined);
    const [imageDn, setImageDn] = useState<TValue|null>(defaultImage ?? null);
    const imageFn : TValue|null = (image /*controllable*/ ?? imageDn /*uncontrollable*/);
    
    const [uploadingImage, setUploadingImage] = useState<UploadingImageData|null>(null);
    const uploadingImageRef     = useRef<UploadingImageData|null>(uploadingImage);
    uploadingImageRef.current   = uploadingImage;
    const isUnknownProgress     = !!uploadingImage && (uploadingImage.percentage === null);
    const isError               = !!uploadingImage && !!uploadingImage.uploadError;
    
    
    
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
    
    const inputFileHandleChange           = useEvent<React.ChangeEventHandler<HTMLInputElement>>(async () => {
        // conditions:
        const inputFileElm = inputFileRef.current;
        if (!inputFileElm)       return; // input file is not loaded => ignore
        
        const files = inputFileElm.files;
        if (!files)              return; // no file selected => ignore
        
        if (!onUploadImageStart) return; // the upload image handler is not configured => ignore
        
        
        
        // actions:
        try {
            const file = files[0];
            const mimeMatcher = new MimeMatcher(...uploadImageType.split(',').map((mime) => mime.trim()));
            // conditions:
            if (!mimeMatcher.match(file.type)) {
                console.log('unknown file: ', file.name);
                return;
            } // if
            
            
            
            // actions:
            
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
                    uploadingImageData.uploadError = '';   // reset error
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
            const uploadingImageData : UploadingImageData = { file: file, percentage: null, uploadError: '', onRetry: handleUploadRetry, onCancel: handleUploadCancel };
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
                let imageData : TValue|null|undefined = undefined;
                try {
                    imageData = await onUploadImageStart(file, handleReportProgress, abortSignal);
                    
                    
                    
                    // conditions:
                    if (isUploadCanceled()) return; // the uploader was canceled => ignore
                }
                catch (error: any) {
                    // conditions:
                    if (isUploadCanceled())  return; // the uploader was canceled => ignore
                    const uploadingImageData = uploadingImageRef.current;
                    if (!uploadingImageData) return; // upload is not started => ignore
                    
                    
                    
                    uploadingImageData.uploadError = `${error?.message ?? error}` || 'Failed to upload image.';
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
        }
        finally {
            // unselect files after the selected files has taken:
            inputFileElm.value = '';
        } // try
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
    
    
    
    // jsx:
    return (
        <Basic<TElement>
            // other props:
            {...restBasicProps}
            
            
            
            // variants:
            mild={props.mild ?? true}
            
            
            
            // classes:
            mainClass={props.mainClass ?? styleSheet.main}
        >
            {/* <NoImage> */}
            { !imageFn && React.cloneElement<React.HTMLAttributes<HTMLElement>>(noImageComponent,
                // props:
                {
                    // classes:
                    className : 'noImage',
                },
            )}
            
            {/* <Image> */}
            {!!imageFn && React.cloneElement<React.ImgHTMLAttributes<HTMLImageElement>>(imageComponent,
                // props:
                {
                    // classes:
                    className : 'image',
                    
                    
                    
                    // images:
                    alt       : imageComponent.props.alt   ??  resolveAlt(imageFn),
                    src       : imageComponent.props.src   ?? (resolveSrc(imageFn, onResolveUrl) || undefined), // convert empty string to undefined
                    sizes     : imageComponent.props.sizes ?? uploadImages.imageInlineSize,
                },
            )}
            
            {/* <SelectButton> */}
            {React.cloneElement<ButtonProps>(selectButtonComponent,
                // props:
                {
                    // handlers:
                    onClick : selectButtonHandleClick,
                },
                
                
                
                // children:
                uploadImageSelectImage,
            )}
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
            />
            
            {!!uploadingImage && <>
                {!isError && React.cloneElement<ProgressProps<Element>>(progressComponent,
                    // props:
                    {},
                    
                    
                    
                    // children:
                    React.cloneElement<ProgressBarProps<Element>>(progressBarComponent,
                        // props:
                        {
                            // variants:
                            progressBarStyle : isUnknownProgress ? 'striped' : undefined,
                            
                            
                            
                            // states:
                            running          : isUnknownProgress ? true : undefined,
                            
                            
                            
                            // values:
                            value            : isUnknownProgress ? 100  : (uploadingImage.percentage ?? 100),
                        },
                        
                        
                        
                        // children:
                        onUploadingImageProgress(uploadingImage.percentage),
                    ),
                )}
                { isError && <>
                    <p>
                        {uploadingImage.uploadError}
                    </p>
                    {React.cloneElement<ButtonProps>(retryButtonComponent,
                        // props:
                        {
                            // handlers:
                            onClick : retryButtonHandleClick,
                        },
                        
                        
                        
                        // children:
                        uploadingImageRetry,
                    )}
                </>}
                {React.cloneElement<ButtonProps>(cancelButtonComponent,
                    // props:
                    {
                        // handlers:
                        onClick : cancelButtonHandleClick,
                    },
                    
                    
                    
                    // children:
                    uploadingImageCancel,
                )}
            </>}
        </Basic>
    );
};
export {
    UploadImage,
    UploadImage as default,
}
