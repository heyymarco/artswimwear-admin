// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeEvents,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    Basic,
    
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
    uploadImageTitle       ?: React.ReactNode
    selectButtonText       ?: React.ReactNode
    dropImageText          ?: React.ReactNode
    uploadImageType        ?: string
    
    
    
    // upload activities:
    onUploadImageStart     ?: (args: { imageFile: File }) => void
    
    
    
    // components:
    titleComponent         ?: React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>|null
    
    actionGroupComponent   ?: React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>
    
    selectButtonComponent  ?: React.ReactComponentElement<any, ButtonProps>
}
const UploadImage = (props: UploadImageProps): JSX.Element|null => {
    // rest props:
    const {
        // upload images:
        uploadImageTitle       = 'Add New Image(s)',
        selectButtonText       = 'Select Images',
        dropImageText          = 'or drop images here',
        uploadImageType        = 'image/jpg, image/jpeg, image/png, image/svg',
        
        
        
        // upload activities:
        onUploadImageStart,
        
        
        
        // components:
        titleComponent         = (<h1 />                            as React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>),
        
        actionGroupComponent   = (<div                           /> as React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>),
        
        selectButtonComponent  = (<ButtonIcon icon='upload_file' /> as React.ReactComponentElement<any, ButtonProps>),
    } = props;
    
    
    
    // refs:
    const inputFileRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // states:
    const dragEnterCounter = useRef<number>(0);
    const [hasEnterCounter, setHasEnterCounter] = useState<boolean>(false);
    
    
    
    // handlers:
    const handleFilesAdded  = useEvent((files: FileList): void => {
        // conditions:
        if (!onUploadImageStart) return; // the upload image handler is not configured => ignore
        
        
        
        // actions:
        const mimeMatcher = new MimeMatcher(...uploadImageType.split(',').map((mime) => mime.trim()));
        for (const file of files) {
            // conditions:
            if (!mimeMatcher.match(file.type)) {
                continue; // ignore foreign files
            } // if
            
            
            
            // actions:
            onUploadImageStart({
                imageFile : file,
            });
        } // for
    });
    
    
    // droppable handlers:
    const handleDragEnter   = useEvent<React.DragEventHandler<HTMLElement>>((event) => {
        // conditions:
        const isValidDragFiles = event.dataTransfer.types.includes('Files');
        if (!isValidDragFiles) return; // unknown drag file(s) => ignore
        
        
        
        // actions:
        dragEnterCounter.current++;
        if (dragEnterCounter.current === 1) setHasEnterCounter(true);
    });
    const handleDragOver    = useEvent<React.DragEventHandler<HTMLElement>>((event) => {
        // conditions:
        const isValidDragFiles = event.dataTransfer.types.includes('Files');
        if (!isValidDragFiles) return; // unknown drag file(s) => ignore
        
        
        
        // events:
        event.dataTransfer.dropEffect = 'copy';
        event.preventDefault(); // prevents the default behavior to *disallow* for dropping here
    });
    const handleDragLeave   = useEvent<React.DragEventHandler<HTMLElement>>((event) => {
        // actions:
        if (dragEnterCounter.current >= 1) {
            dragEnterCounter.current--;
            if (dragEnterCounter.current === 0) setHasEnterCounter(false);
        } // if
    });
    const handleDrop        = useEvent<React.DragEventHandler<HTMLElement>>((event) => {
        // conditions:
        const isValidDragFiles = event.dataTransfer.types.includes('Files');
        if (!isValidDragFiles) return; // unknown drag file(s) => ignore
        
        
        
        // events:
        event.preventDefault();
        event.stopPropagation(); // do not bubble event to the <parent>
        
        
        
        // actions:
        if (dragEnterCounter.current >= 1) {
            dragEnterCounter.current = 0;
            setHasEnterCounter(false);
        } // if
        handleFilesAdded(event.dataTransfer.files);
    });
    
    
    
    // handlers:
    const selectButtonHandleClickInternal = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        inputFileRef.current?.click();
    });
    const selectButtonHandleClick         = useMergeEvents(
        // preserves the original `onClick` from `selectButtonComponent`:
        selectButtonComponent.props.onClick,
        
        
        
        // actions:
        selectButtonHandleClickInternal,
    );
    const inputFileHandleChange           = useEvent<React.ChangeEventHandler<HTMLInputElement>>(() => {
        // conditions:
        const inputFileElm = inputFileRef.current;
        if (!inputFileElm)       return; // input file is not loaded => ignore
        
        const files = inputFileElm.files;
        if (!files)              return; // no file selected => ignore
        
        
        
        // actions:
        try {
            handleFilesAdded(files);
        }
        finally {
            // unselect files after the selected files has taken:
            inputFileElm.value = '';
        } // try
    });
    
    
    
    // jsx:
    return (
        <Basic
            // variants:
            mild={true}
            
            
            
            // classes:
            className={`uploadGroup ${hasEnterCounter ? 'dropTarget' : ''}`}
            
            
            
            // droppable handlers:
            onDragEnter = {handleDragEnter}
            onDragOver  = {handleDragOver }
            onDragLeave = {handleDragLeave}
            onDrop      = {handleDrop     }
        >
            {React.cloneElement<React.HTMLAttributes<HTMLElement>>(actionGroupComponent,
                // props:
                {
                    // classes:
                    className : actionGroupComponent.props.className ?? 'actionGroup',
                },
                
                
                
                // children:
                /* <Title> */
                (!!titleComponent && React.cloneElement<Pick<React.HTMLAttributes<Element>, 'className'>>(titleComponent,
                    // props:
                    {
                        // classes:
                        className : titleComponent.props.className ?? 'uploadImageTitle',
                    },
                    
                    
                    
                    // children:
                    uploadImageTitle,
                )),
                
                /* <SelectButton> */
                React.cloneElement<ButtonProps>(selectButtonComponent,
                    // props:
                    {
                        // classes:
                        className : selectButtonComponent.props.className ?? 'selectButton',
                        
                        
                        
                        // handlers:
                        onClick   : selectButtonHandleClick,
                    },
                    
                    
                    
                    // children:
                    selectButtonComponent.props.children ?? selectButtonText,
                ),
                
                /* <Paragraph> */
                (!!dropImageText && ((typeof(dropImageText) === 'string') ? <p>{dropImageText}</p> : dropImageText)),
            )}
            
            {/* <Input> */}
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
        </Basic>
    );
};
export {
    UploadImage,
    UploadImage as default,
}
