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
    onUploadingImageProgress            ?: (percentage: number) => string
    
    
    
    // uploading activities:
    uploadingImagePercentage             : number
    uploadingImageCancelController       : AbortController
    uploadingImageErrorMessage           : string
    
    
    
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
        
        
        
        // components:
        uploadingImageProgressComponent     = (<Progress                                  size='sm' /> as React.ReactComponentElement<any, ProgressProps>),
        uploadingImageProgressBarComponent  = (<ProgressBar                                         /> as React.ReactComponentElement<any, ProgressBarProps>),
        uploadingImageRetryButtonComponent  = (<ButtonIcon icon='refresh' theme='success' size='sm' /> as React.ReactComponentElement<any, ButtonProps>),
        uploadingImageCancelButtonComponent = (<ButtonIcon icon='cancel'  theme='danger'  size='sm' /> as React.ReactComponentElement<any, ButtonProps>),
    } = props;
    
    
    
    // handlers:
    const uploadingImageRetryButtonHandleClick = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        // uploadingImageCancelController.abort();
    });
    const uploadingImageCancelButtonHandleClick = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        uploadingImageCancelController.abort();
    });
    
    
    
    // jsx:
    return (
        <Content
            // variants:
            mild={true}
            
            
            
            // classes:
            className='uploadingImage'
        >
            <h6>
                { !uploadingImageErrorMessage && uploadingImageTitle     }
                {!!uploadingImageErrorMessage && uploadingImageErrorTitle}
            </h6>
            {!uploadingImageErrorMessage && React.cloneElement(uploadingImageProgressComponent,
                // props:
                {},
                
                
                
                // children:
                React.cloneElement(uploadingImageProgressBarComponent,
                    // props:
                    {
                        // values:
                        value : uploadingImagePercentage,
                    },
                    
                    
                    
                    // children:
                    onUploadingImageProgress(uploadingImagePercentage),
                ),
            )}
            {!!uploadingImageErrorMessage && <>
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
