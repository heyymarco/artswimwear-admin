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
    uploadingImageTitle       ?: React.ReactNode
    uploadingImageErrorTitle  ?: React.ReactNode
    uploadingImageRetryText   ?: React.ReactNode
    uploadingImageCancelText  ?: React.ReactNode
    onUploadingImageProgress  ?: (args: { imageFile: File, percentage: number|null }) => string
    
    
    
    // uploading activities:
    uploadingImageFile         : File
    uploadingImagePercentage   : number|null
    uploadingImageErrorMessage : React.ReactNode
    onUploadingImageRetry      : () => void
    onUploadingImageCancel     : () => void
    
    
    
    // components:
    titleComponent            ?: React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>|null
    
    imageComponent            ?: React.ReactComponentElement<any, React.ImgHTMLAttributes<HTMLImageElement>>
    previewImageComponent     ?: React.ReactComponentElement<any, React.ImgHTMLAttributes<HTMLImageElement>>
    
    actionGroupComponent      ?: React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>
    progressComponent         ?: React.ReactComponentElement<any, ProgressProps<Element>>
    progressBarComponent      ?: React.ReactComponentElement<any, ProgressBarProps<Element>>
    uploadErrorComponent      ?: React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>
    
    retryButtonComponent      ?: React.ReactComponentElement<any, ButtonProps>
    cancelButtonComponent     ?: React.ReactComponentElement<any, ButtonProps>
}
const UploadingImage = (props: UploadingImageProps): JSX.Element|null => {
    // rest props:
    const {
        // uploading images:
        uploadingImageTitle      = 'Uploading...',
        uploadingImageErrorTitle = 'Upload Error',
        uploadingImageRetryText  = 'Retry',
        uploadingImageCancelText = 'Cancel',
        // onUploadingImageProgress = ({ percentage }) => `${percentage}%`,
        onUploadingImageProgress = ({ percentage }) => '',
        
        
        
        // uploading activities:
        uploadingImageFile,
        uploadingImagePercentage,
        uploadingImageErrorMessage,
        onUploadingImageRetry,
        onUploadingImageCancel,
        
        
        
        // components:
        titleComponent        = (<h1 />                                                     as React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>),
        
        imageComponent,
        previewImageComponent = imageComponent ?? (<img                                  /> as React.ReactComponentElement<any, React.ImgHTMLAttributes<HTMLImageElement>>),
        
        actionGroupComponent  = (<div                                                    /> as React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>),
        progressComponent     = (<Progress    size='sm'                                  /> as React.ReactComponentElement<any, ProgressProps<Element>>),
        progressBarComponent  = (<ProgressBar                                            /> as React.ReactComponentElement<any, ProgressBarProps<Element>>),
        uploadErrorComponent  = (<Basic       size='sm'      mild={true} theme='danger'  /> as React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>),
        
        retryButtonComponent   = (<ButtonIcon icon='refresh'             theme='success' /> as React.ReactComponentElement<any, ButtonProps>),
        cancelButtonComponent  = (<ButtonIcon icon='cancel'              theme='danger'  /> as React.ReactComponentElement<any, ButtonProps>),
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
        onUploadingImageRetry();
    });
    const retryButtonHandleClick          = useMergeEvents(
        // preserves the original `onClick` from `retryButtonComponent`:
        retryButtonComponent.props.onClick,
        
        
        
        // actions:
        retryButtonHandleClickInternal,
    );
    
    const cancelButtonHandleClickInternal = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        onUploadingImageCancel();
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
            
            {React.cloneElement<React.HTMLAttributes<HTMLElement>>(actionGroupComponent,
                // props:
                {
                    // classes:
                    className : actionGroupComponent.props.className ?? 'actionGroup',
                },
                
                
                
                // children:
                (!isError && <>
                    {/* <Title> */}
                    {!!titleComponent && React.cloneElement<Pick<React.HTMLAttributes<Element>, 'className'>>(titleComponent,
                        // props:
                        {
                            // classes:
                            className : titleComponent.props.className ?? 'uploadingImageTitle',
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
                        React.cloneElement<ProgressBarProps<Element>>(progressBarComponent,
                            // props:
                            {
                                // variants:
                                progressBarStyle : isUnknownProgress ? 'striped' : undefined,
                                
                                
                                
                                // states:
                                running          : isUnknownProgress ? true : undefined,
                                
                                
                                
                                // values:
                                value            : isUnknownProgress ? 100  : uploadingImagePercentage,
                            },
                            
                            
                            
                            // children:
                            onUploadingImageProgress({
                                imageFile  : uploadingImageFile,
                                percentage : uploadingImagePercentage,
                            }),
                        ),
                    )}
                </>),
                
                /* <UploadError> */
                (isError && <>
                    {React.cloneElement<React.HTMLAttributes<HTMLElement>>(uploadErrorComponent,
                        // props:
                        {
                            // classes:
                            className : uploadErrorComponent.props.className ?? 'uploadError',
                        },
                        
                        
                        
                        // children:
                        uploadErrorComponent.props.children ?? <>
                            {/* <Title> */}
                            {!!titleComponent && React.cloneElement<Pick<React.HTMLAttributes<Element>, 'className'>>(titleComponent,
                                // props:
                                {
                                    // classes:
                                    className : titleComponent.props.className ?? 'uploadingImageErrorTitle',
                                },
                                
                                
                                
                                // children:
                                uploadingImageErrorTitle,
                            )}
                            {uploadErrorComponent.props.children ?? uploadingImageErrorMessage}
                        </>,
                    )}
                    
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
                </>),
                
                /* <CancelButton> */
                React.cloneElement<ButtonProps>(cancelButtonComponent,
                    // props:
                    {
                        // classes:
                        className : cancelButtonComponent.props.className ?? 'cancelButton',
                        
                        
                        
                        // handlers:
                        onClick   : cancelButtonHandleClick,
                    },
                    
                    
                    
                    // children:
                    cancelButtonComponent.props.children ?? uploadingImageCancelText,
                ),
            )}
        </Basic>
    );
};
export {
    UploadingImage,
    UploadingImage as default,
}
