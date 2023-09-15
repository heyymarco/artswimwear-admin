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



// react components:
export interface UploadingImageProps
{
    // positions:
    uploadingItemIndex         : number
    
    
    
    // uploading images:
    uploadingImageTitle       ?: string
    uploadingImageErrorTitle  ?: string
    uploadingImageRetry       ?: string
    uploadingImageCancel      ?: string
    onUploadingImageProgress  ?: (args: { percentage: number|null }) => string
    
    
    
    // uploading activities:
    uploadingImageFile         : File
    uploadingImagePercentage   : number|null
    uploadingImageErrorMessage : React.ReactNode
    onUploadingImageRetry      : () => void
    onUploadingImageCancel     : () => void
    
    
    
    // components:
    imageComponent             : React.ReactComponentElement<any, React.ImgHTMLAttributes<HTMLImageElement>>
    progressComponent         ?: React.ReactComponentElement<any, ProgressProps<Element>>
    progressBarComponent      ?: React.ReactComponentElement<any, ProgressBarProps<Element>>
    retryButtonComponent      ?: React.ReactComponentElement<any, ButtonProps>
    cancelButtonComponent     ?: React.ReactComponentElement<any, ButtonProps>
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
        // onUploadingImageProgress = ({ percentage }) => `${percentage}%`,
        onUploadingImageProgress = ({ percentage }) => '',
        
        
        
        // uploading activities:
        uploadingImageFile,
        uploadingImagePercentage,
        uploadingImageErrorMessage,
        onUploadingImageRetry,
        onUploadingImageCancel,
        
        
        
        // components:
        imageComponent,
        progressComponent     = (<Progress                                  size='sm' /> as React.ReactComponentElement<any, ProgressProps<Element>>),
        progressBarComponent  = (<ProgressBar                                         /> as React.ReactComponentElement<any, ProgressBarProps<Element>>),
        retryButtonComponent  = (<ButtonIcon icon='refresh' theme='success' size='sm' /> as React.ReactComponentElement<any, ButtonProps>),
        cancelButtonComponent = (<ButtonIcon icon='cancel'  theme='danger'  size='sm' /> as React.ReactComponentElement<any, ButtonProps>),
    } = props;
    
    
    
    // fn props:
    const isUnknownProgress = (uploadingImagePercentage === null);
    const isError           = !!uploadingImageErrorMessage && (uploadingImageErrorMessage !== true);
    
    
    
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
                        value            : isUnknownProgress ? 100  : uploadingImagePercentage,
                    },
                    
                    
                    
                    // children:
                    onUploadingImageProgress({
                        percentage : uploadingImagePercentage,
                    }),
                ),
            )}
            { isError && <>
                {uploadingImageErrorMessage}
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
        </Basic>
    );
};
export {
    UploadingImage,
    UploadingImage as default,
}
