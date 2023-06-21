// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    ContentProps,
    Content,
    
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
    uploadingImagePercentage             : number|null
    uploadingImageCancelController       : AbortController
    uploadingImageErrorMessage           : string
    onUploadingImageRetry                : () => void
    
    
    
    // components:
    uploadingImageProgressComponent     ?: React.ReactComponentElement<any, ProgressProps>
    uploadingImageProgressBarComponent  ?: React.ReactComponentElement<any, ProgressBarProps>
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
        uploadingImagePercentage,
        uploadingImageCancelController,
        uploadingImageErrorMessage,
        onUploadingImageRetry,
        
        
        
        // components:
        uploadingImageProgressComponent     = (<Progress                                  size='sm' /> as React.ReactComponentElement<any, ProgressProps>),
        uploadingImageProgressBarComponent  = (<ProgressBar                                         /> as React.ReactComponentElement<any, ProgressBarProps>),
        uploadingImageRetryButtonComponent  = (<ButtonIcon icon='refresh' theme='success' size='sm' /> as React.ReactComponentElement<any, ButtonProps>),
        uploadingImageCancelButtonComponent = (<ButtonIcon icon='cancel'  theme='danger'  size='sm' /> as React.ReactComponentElement<any, ButtonProps>),
    } = props;
    
    
    
    // fn props:
    const isUnknownProgress = (uploadingImagePercentage === null);
    const isError           = !!uploadingImageErrorMessage;
    
    
    
    // handlers:
    const uploadingImageRetryButtonHandleClick = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        onUploadingImageRetry();
    });
    const uploadingImageCancelButtonHandleClick = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        uploadingImageCancelController.abort();
    });
    
    
    
    // jsx:
    return (
        <Content
            // variants:
            theme={isError ? 'danger' : undefined}
            mild={true}
            
            
            
            // classes:
            className='uploadingImage'
        >
            <h6>
                {!isError && uploadingImageTitle     }
                { isError && uploadingImageErrorTitle}
            </h6>
            {!isError && React.cloneElement(uploadingImageProgressComponent,
                // props:
                {},
                
                
                
                // children:
                React.cloneElement(uploadingImageProgressBarComponent,
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
                {React.cloneElement(uploadingImageRetryButtonComponent,
                    // props:
                    {
                        // handlers:
                        onClick : uploadingImageRetryButtonHandleClick,
                    },
                    
                    
                    
                    // children:
                    uploadingImageRetry,
                )}
            </>}
            {React.cloneElement(uploadingImageCancelButtonComponent,
                // props:
                {
                    // handlers:
                    onClick : uploadingImageCancelButtonHandleClick,
                },
                
                
                
                // children:
                uploadingImageCancel,
            )}
        </Content>
    );
};
export {
    UploadingImage,
    UploadingImage as default,
}
