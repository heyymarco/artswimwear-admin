// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    useMergeEvents,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    Basic,
    
    ButtonProps,
    
    ButtonIcon,
    
    ProgressProps,
    Progress,
    ProgressBarProps,
    ProgressBar,
}                           from '@reusable-ui/components'

// internals:
import {
    // configs:
    galleryEditors,
}                           from './styles/config'



// react components:
export interface UploadingImageProps
{
    // uploading images:
    uploadingImageTitle               ?: React.ReactNode
    uploadingImageErrorTitle          ?: React.ReactNode
    uploadingImageRetryText           ?: React.ReactNode
    uploadingImageCancelText          ?: React.ReactNode
    
    
    
    // upload activities:
    uploadingImageFile                 : File
    uploadingImagePercentage           : number|null
    uploadingImageErrorMessage         : React.ReactNode
    onUploadImageProgress             ?: (args: { imageFile: File, percentage: number|null }) => string
    onUploadImageRetry                 : () => void
    onUploadImageCancel                : () => void
    
    
    
    // components:
    imageComponent                    ?: React.ReactComponentElement<any, React.ImgHTMLAttributes<HTMLImageElement>>
    previewImageComponent             ?: React.ReactComponentElement<any, React.ImgHTMLAttributes<HTMLImageElement>>
    
    actionGroupComponent              ?: React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>
    uploadingImageTitleComponent      ?: React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>|null
    progressComponent                 ?: React.ReactComponentElement<any, ProgressProps<Element>>
    progressBarComponent              ?: React.ReactComponentElement<any, ProgressBarProps<Element>>
    uploadErrorComponent              ?: React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>
    uploadingImageErrorTitleComponent ?: React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>|null
    retryButtonComponent              ?: React.ReactComponentElement<any, ButtonProps>
    cancelButtonComponent             ?: React.ReactComponentElement<any, ButtonProps>
}
const UploadingImage = (props: UploadingImageProps): JSX.Element|null => {
    // rest props:
    const {
        // uploading images:
        uploadingImageTitle               = 'Uploading...',
        uploadingImageErrorTitle          = 'Upload Error',
        uploadingImageRetryText           = 'Retry',
        uploadingImageCancelText          = 'Cancel',
        
        
        
        // upload activities:
        uploadingImageFile,
        uploadingImagePercentage,
        uploadingImageErrorMessage,
        onUploadImageProgress             = () => '',
        onUploadImageRetry,
        onUploadImageCancel,
        
        
        
        // components:
        imageComponent,
        previewImageComponent             = imageComponent ?? (<img                                  /> as React.ReactComponentElement<any, React.ImgHTMLAttributes<HTMLImageElement>>),
        
        actionGroupComponent              = (<div                                                    /> as React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>),
        uploadingImageTitleComponent      = (<h1                                                     /> as React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>),
        progressComponent                 = (<Progress    size='sm'                                  /> as React.ReactComponentElement<any, ProgressProps<Element>>),
        progressBarComponent              = (<ProgressBar                                            /> as React.ReactComponentElement<any, ProgressBarProps<Element>>),
        uploadErrorComponent              = (<Basic       size='sm'      mild={true} theme='danger'  /> as React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>),
        uploadingImageErrorTitleComponent = (<h1                                                     /> as React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>),
        retryButtonComponent              = (<ButtonIcon  icon='refresh'             theme='success' /> as React.ReactComponentElement<any, ButtonProps>),
        cancelButtonComponent             = (<ButtonIcon  icon='cancel'              theme='danger'  /> as React.ReactComponentElement<any, ButtonProps>),
    } = props;
    
    
    
    // states:
    const [previewImage, setPreviewImage] = useState<string|null>(null);
    
    
    
    // fn props:
    const isUnknownProgress = (uploadingImagePercentage === null);
    const isError           = !!uploadingImageErrorMessage && (uploadingImageErrorMessage !== true);
    
    
    
    // dom effects:
    useIsomorphicLayoutEffect(() => {
        // setups:
        const previewImageUrl = URL.createObjectURL(uploadingImageFile);
        setPreviewImage(previewImageUrl);
        
        
        
        // cleanups:
        return () => {
            URL.revokeObjectURL(previewImageUrl);
            setPreviewImage(null);
        };
    }, [uploadingImageFile]);
    
    
    
    // handlers:
    const retryButtonHandleClickInternal  = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        onUploadImageRetry();
    });
    const retryButtonHandleClick          = useMergeEvents(
        // preserves the original `onClick` from `retryButtonComponent`:
        retryButtonComponent.props.onClick,
        
        
        
        // actions:
        retryButtonHandleClickInternal,
    );
    
    const cancelButtonHandleClickInternal = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        onUploadImageCancel();
    });
    const cancelButtonHandleClick         = useMergeEvents(
        // preserves the original `onClick` from `cancelButtonComponent`:
        cancelButtonComponent.props.onClick,
        
        
        
        // actions:
        cancelButtonHandleClickInternal,
    );
    
    
    
    // jsx:
    return (
        <Basic
            // variants:
            mild={true}
            
            
            
            // classes:
            className='uploadingGroup'
        >
            {/* <PreviewImage> */}
            {!! previewImage && React.cloneElement<React.ImgHTMLAttributes<HTMLImageElement>>(previewImageComponent,
                // props:
                {
                    // classes:
                    className : previewImageComponent.props.className ?? 'previewImage',
                    
                    
                    
                    // images:
                    alt       : previewImageComponent.props.alt       ?? '',
                    src       : previewImageComponent.props.src       ?? previewImage,
                    sizes     : previewImageComponent.props.sizes     ?? `calc((${galleryEditors.itemMinColumnWidth} * 2) + ${galleryEditors.gapInline})`,
                },
            )}
            
            {/* <ActionGroup> */}
            {React.cloneElement<React.HTMLAttributes<HTMLElement>>(actionGroupComponent,
                // props:
                {
                    // classes:
                    className : actionGroupComponent.props.className ?? 'actionGroup',
                },
                
                
                
                // children:
                actionGroupComponent.props.children ?? <>
                    {/* <UploadingImageTitle> + <Progress> */}
                    {!isError && <>
                        {/* <UploadingImageTitle> */}
                        {!!uploadingImageTitleComponent && React.cloneElement<Pick<React.HTMLAttributes<Element>, 'className'>>(uploadingImageTitleComponent,
                            // props:
                            {
                                // classes:
                                className : uploadingImageTitleComponent.props.className ?? 'uploadingImageTitle',
                            },
                            
                            
                            
                            // children:
                            uploadingImageTitle,
                        )}
                        
                        {/* <Progress> */}
                        {React.cloneElement<ProgressProps<Element>>(progressComponent,
                            // props:
                            {
                                // classes:
                                className : progressComponent.props.className ?? 'uploadProgress',
                            },
                            
                            
                            
                            // children:
                            /* <ProgressBar> */
                            progressComponent.props.children ?? React.cloneElement<ProgressBarProps<Element>>(progressBarComponent,
                                // props:
                                {
                                    // variants:
                                    progressBarStyle : progressBarComponent.props.progressBarStyle ?? (isUnknownProgress ? 'striped' : undefined),
                                    
                                    
                                    
                                    // states:
                                    running          : progressBarComponent.props.running          ?? (isUnknownProgress ? true : undefined),
                                    
                                    
                                    
                                    // values:
                                    value            : progressBarComponent.props.value            ?? (isUnknownProgress ? 100 : uploadingImagePercentage),
                                },
                                
                                
                                
                                // children:
                                progressBarComponent.props.children ?? onUploadImageProgress({
                                    imageFile  : uploadingImageFile,
                                    percentage : uploadingImagePercentage,
                                }),
                            ),
                        )}
                    </>}
                    
                    {/* <UploadError> + <RetryButton> */}
                    {isError && <>
                        {/* <UploadError> */}
                        {React.cloneElement<React.HTMLAttributes<HTMLElement>>(uploadErrorComponent,
                            // props:
                            {
                                // classes:
                                className : uploadErrorComponent.props.className ?? 'uploadError',
                            },
                            
                            
                            
                            // children:
                            uploadErrorComponent.props.children ?? <>
                                {/* <UploadingImageErrorTitle> */}
                                {!!uploadingImageErrorTitleComponent && React.cloneElement<Pick<React.HTMLAttributes<Element>, 'className'>>(uploadingImageErrorTitleComponent,
                                    // props:
                                    {
                                        // classes:
                                        className : uploadingImageErrorTitleComponent.props.className ?? 'uploadingImageErrorTitle',
                                    },
                                    
                                    
                                    
                                    // children:
                                    uploadingImageErrorTitle,
                                )}
                                
                                {/* <UploadingImageErrorMessage> */}
                                {uploadErrorComponent.props.children ?? uploadingImageErrorMessage}
                            </>,
                        )}
                        
                        {/* <RetryButton> */}
                        {React.cloneElement<ButtonProps>(retryButtonComponent,
                            // props:
                            {
                                // classes:
                                className : retryButtonComponent.props.className ?? 'retryButton',
                                
                                
                                
                                // handlers:
                                onClick   : retryButtonHandleClick,
                            },
                            
                            
                            
                            // children:
                            retryButtonComponent.props.children ?? uploadingImageRetryText,
                        )}
                    </>}
                    
                    {/* <CancelButton> */}
                    {React.cloneElement<ButtonProps>(cancelButtonComponent,
                        // props:
                        {
                            // classes:
                            className : cancelButtonComponent.props.className ?? 'cancelButton',
                            
                            
                            
                            // handlers:
                            onClick   : cancelButtonHandleClick,
                        },
                        
                        
                        
                        // children:
                        cancelButtonComponent.props.children ?? uploadingImageCancelText,
                    )}
                </>,
            )}
        </Basic>
    );
};
export {
    UploadingImage,
    UploadingImage as default,
}
