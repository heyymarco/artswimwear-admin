// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
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



// react components:
export interface UploadingImageProps
{
    // positions:
    uploadingItemIndex                   : number
    
    
    
    // uploading images:
    uploadingImageTitle                 ?: string
    uploadingImageErrorTitle            ?: string
    uploadingImageRetry                 ?: string
    uploadingImageCancel                ?: string
    onUploadingImageProgress            ?: (percentage: number|null) => string
    
    
    
    // uploading activities:
    uploadingImageFile                   : File
    uploadingImagePercentage             : number|null
    uploadingImageErrorMessage           : string
    onUploadingImageRetry                : () => void
    onUploadingImageCancel               : () => void
    
    
    
    // components:
    imageComponent                       : React.ReactComponentElement<any, React.ImgHTMLAttributes<HTMLImageElement>>
    uploadingImageProgressComponent     ?: React.ReactComponentElement<any, ProgressProps<Element>>
    uploadingImageProgressBarComponent  ?: React.ReactComponentElement<any, ProgressBarProps<Element>>
    uploadingImageRetryButtonComponent  ?: React.ReactComponentElement<any, ButtonProps>
    uploadingImageCancelButtonComponent ?: React.ReactComponentElement<any, ButtonProps>
}
const UploadingImage = (props: UploadingImageProps): JSX.Element|null => {
    // rest props:
    const {
        // positions:
        uploadingItemIndex,
        
        
        
        // uploading images:
        uploadingImageTitle      = 'Uploading...',
        uploadingImageErrorTitle = 'Upload Error',
        uploadingImageRetry      = 'Retry',
        uploadingImageCancel     = 'Cancel',
        // onUploadingImageProgress = (percentage) => `${percentage}%`,
        onUploadingImageProgress = (percentage) => '',
        
        
        
        // uploading activities:
        uploadingImageFile,
        uploadingImagePercentage,
        uploadingImageErrorMessage,
        onUploadingImageRetry,
        onUploadingImageCancel,
        
        
        
        // components:
        imageComponent,
        uploadingImageProgressComponent     = (<Progress                                  size='sm' /> as React.ReactComponentElement<any, ProgressProps<Element>>),
        uploadingImageProgressBarComponent  = (<ProgressBar                                         /> as React.ReactComponentElement<any, ProgressBarProps<Element>>),
        uploadingImageRetryButtonComponent  = (<ButtonIcon icon='refresh' theme='success' size='sm' /> as React.ReactComponentElement<any, ButtonProps>),
        uploadingImageCancelButtonComponent = (<ButtonIcon icon='cancel'  theme='danger'  size='sm' /> as React.ReactComponentElement<any, ButtonProps>),
    } = props;
    
    
    
    // fn props:
    const isUnknownProgress = (uploadingImagePercentage === null);
    const isError           = !!uploadingImageErrorMessage;
    
    
    
    // dom effects:
    const previewImageRef = useRef<string|undefined>(undefined);
    useIsomorphicLayoutEffect(() => {
        // setups:
        const previewImageUrl = URL.createObjectURL(uploadingImageFile);
        previewImageRef.current = previewImageUrl;
        
        
        
        // cleanups:
        return () => {
            URL.revokeObjectURL(previewImageUrl);
        };
    }, [uploadingImageFile]);
    
    
    
    // handlers:
    const uploadingImageRetryButtonHandleClick  = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        onUploadingImageRetry();
    });
    const uploadingImageCancelButtonHandleClick = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        onUploadingImageCancel();
    });
    
    
    
    // jsx:
    return (
        <Basic
            // variants:
            theme={isError ? 'danger' : undefined}
            mild={true}
            
            
            
            // classes:
            className='uploadingImage'
        >
            {React.cloneElement<React.ImgHTMLAttributes<HTMLImageElement>>(imageComponent,
                // props:
                {
                    // classes:
                    className : imageComponent.props.className ?? 'uploadingPreview',
                    
                    
                    
                    // images:
                    alt       : imageComponent.props.alt       ?? 'preview',
                    src       : imageComponent.props.src       ?? previewImageRef.current,
                },
            )}
            <h6>
                {!isError && uploadingImageTitle     }
                { isError && uploadingImageErrorTitle}
            </h6>
            {!isError && React.cloneElement<ProgressProps<Element>>(uploadingImageProgressComponent,
                // props:
                {},
                
                
                
                // children:
                React.cloneElement<ProgressBarProps<Element>>(uploadingImageProgressBarComponent,
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
                    onUploadingImageProgress(uploadingImagePercentage),
                ),
            )}
            { isError && <>
                <p>
                    {uploadingImageErrorMessage}
                </p>
                {React.cloneElement<ButtonProps>(uploadingImageRetryButtonComponent,
                    // props:
                    {
                        // handlers:
                        onClick : uploadingImageRetryButtonHandleClick,
                    },
                    
                    
                    
                    // children:
                    uploadingImageRetry,
                )}
            </>}
            {React.cloneElement<ButtonProps>(uploadingImageCancelButtonComponent,
                // props:
                {
                    // handlers:
                    onClick : uploadingImageCancelButtonHandleClick,
                },
                
                
                
                // children:
                uploadingImageCancel,
            )}
        </Basic>
    );
};
export {
    UploadingImage,
    UploadingImage as default,
}
