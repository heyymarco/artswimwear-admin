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
    uploadImageType            ?: RegExp
    
    
    
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
        uploadImageType        = /^image\/(jpg|jpeg|png|svg)(;.*)?/i,
        
        
        
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
            
            
            
            // droppable handlers:
            onDragEnter={(event) => {
                // conditions:
                const isValidDragFiles = event.dataTransfer.types.includes('Files');
                if (!isValidDragFiles) return; // unknown drag file(s) => ignore
                
                
                
                // actions:
                event.currentTarget.style.borderColor = 'red';
            }}
            onDragOver={(event) => {
                // conditions:
                const isValidDragFiles = event.dataTransfer.types.includes('Files');
                if (!isValidDragFiles) return; // unknown drag file(s) => ignore
                
                
                
                event.preventDefault();
            }}
            onDragLeave={(event) => {
                // actions:
                event.currentTarget.style.borderColor = '';
            }}
            onDrop={(event) => {
                // conditions:
                const isValidDragFiles = event.dataTransfer.types.includes('Files');
                if (!isValidDragFiles) return; // unknown drag file(s) => ignore
                
                
                
                // events:
                event.preventDefault();
                event.stopPropagation(); // do not bubble event to the <parent>
                
                
                
                // actions:
                event.currentTarget.style.borderColor = '';
                for (const file of event.dataTransfer.files) {
                    if (uploadImageType.test(file.type)) {
                        console.log('image file: ', file.name);
                    }
                    else {
                        console.log('unknown file: ', file.name);
                    } // if
                } // for
            }}
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
