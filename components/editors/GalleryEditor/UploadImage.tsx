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
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    Content,
    
    ButtonProps,
    
    ButtonIcon,
}                           from '@reusable-ui/components'

// other libs:
import {
    default as MimeMatcher,
}                           from 'mime-matcher'



// react components:
export interface UploadImageProps
{
    // upload images:
    uploadImageTitle           ?: string
    uploadImageSelectImage     ?: string
    uploadImageDropImage       ?: string
    uploadImageType            ?: string
    
    
    
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
        uploadImageType        = 'image/jpg, image/jpeg, image/png, image/svg',
        
        
        
        // components:
        uploadImageButtonComponent = (<ButtonIcon icon='upload_file' /> as React.ReactComponentElement<any, ButtonProps>),
    } = props;
    
    
    
    // refs:
    const inputFileRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // droppable handlers:
    const handleDragEnter   = useEvent<React.DragEventHandler<HTMLElement>>((event) => {
        // conditions:
        const isValidDragFiles = event.dataTransfer.types.includes('Files');
        if (!isValidDragFiles) return; // unknown drag file(s) => ignore
        
        
        
        // actions:
        event.currentTarget.style.borderColor = 'red';
    });
    const handleDragOver    = useEvent<React.DragEventHandler<HTMLElement>>((event) => {
        // conditions:
        const isValidDragFiles = event.dataTransfer.types.includes('Files');
        if (!isValidDragFiles) return; // unknown drag file(s) => ignore
        
        
        
        // events:
        event.preventDefault(); // prevents the default behavior to *disallow* for dropping here
    });
    const handleDragLeave   = useEvent<React.DragEventHandler<HTMLElement>>((event) => {
        // actions:
        event.currentTarget.style.borderColor = '';
    });
    const handleDrop        = useEvent<React.DragEventHandler<HTMLElement>>((event) => {
        // conditions:
        const isValidDragFiles = event.dataTransfer.types.includes('Files');
        if (!isValidDragFiles) return; // unknown drag file(s) => ignore
        
        
        
        // events:
        event.preventDefault();
        event.stopPropagation(); // do not bubble event to the <parent>
        
        
        
        // actions:
        event.currentTarget.style.borderColor = '';
        const mimeMatcher = new MimeMatcher(...uploadImageType.split(',').map((mime) => mime.trim()));
        for (const file of event.dataTransfer.files) {
            if (mimeMatcher.match(file.type)) {
                console.log('image file: ', file.name);
            }
            else {
                console.log('unknown file: ', file.name);
            } // if
        } // for
    });
    
    
    
    // handlers:
    const uploadImageButtonHandleClick = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        inputFileRef.current?.click();
    });
    const inputFileHandleChange        = useEvent<React.ChangeEventHandler<HTMLInputElement>>(() => {
        const inputFileElm = inputFileRef.current;
        if (!inputFileElm) return;
        const files = inputFileElm.files;
        if (!files) return;
        
        
        
        const mimeMatcher = new MimeMatcher(...uploadImageType.split(',').map((mime) => mime.trim()));
        for (const file of files) {
            if (mimeMatcher.match(file.type)) {
                console.log('image file: ', file.name);
            }
            else {
                console.log('unknown file: ', file.name);
            } // if
        } // for
        
        
        
        // unselect files after the selected files has taken:
        inputFileElm.value = '';
    });
    
    
    
    // jsx:
    return (
        <Content
            // variants:
            mild={true}
            
            
            
            // classes:
            className='uploadImage'
            
            
            
            // droppable handlers:
            onDragEnter = {handleDragEnter}
            onDragOver  = {handleDragOver }
            onDragLeave = {handleDragLeave}
            onDrop      = {handleDrop     }
        >
            <h6>
                {uploadImageTitle}
            </h6>
            {React.cloneElement(uploadImageButtonComponent,
                // props:
                {
                    // handlers:
                    onClick : uploadImageButtonHandleClick,
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
                multiple={true}
                
                
                
                // handlers:
                onChange={inputFileHandleChange}
            />
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
