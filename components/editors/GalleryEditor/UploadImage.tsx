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
    
    Progress,
    ProgressBar,
}                           from '@reusable-ui/components'



// react components:
export interface UploadImageProps
{
    // upload images:
    uploadImageTitle           ?: string
    uploadImageSelectImage     ?: string
    uploadImageDropImage       ?: string
    
    
    
    // components:
    uploadImageButtonComponent ?: React.ReactComponentElement<any, ButtonProps>
}
const UploadImage = (props: UploadImageProps): JSX.Element|null => {
    // rest props:
    const {
        // upload images:
        uploadImageTitle       = 'Add New Image(s)',
        uploadImageSelectImage = 'Select Images',
        uploadImageDropImage   = 'or drop images here',
        
        
        
        // components:
        uploadImageButtonComponent = (<ButtonIcon icon='upload_file' /> as React.ReactComponentElement<any, ButtonProps>),
    } = props;
    
    
    
    // jsx:
    return (
        <Content
            // variants:
            mild={true}
            
            
            
            // classes:
            className='uploadImage'
        >
            <h6>
                {uploadImageTitle}
            </h6>
            {React.cloneElement(uploadImageButtonComponent,
                // props:
                {
                    // TODO: add handler
                },
                
                
                
                // children:
                uploadImageSelectImage,
            )}
            <p>
                {uploadImageDropImage}
            </p>
        </Content>
    );
};
export {
    UploadImage,
    UploadImage as default,
}
