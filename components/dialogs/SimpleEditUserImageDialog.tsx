'use client'

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
    EventHandler,
    useMergeEvents,
    useMountedFlag,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internal components:
import type {
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    UploadImage,
}                           from '@/components/editors/UploadImage'
import {
    ProfileImage,
}                           from '@/components/ProfileImage'
import {
    // types:
    ValueOfModel,
    UpdateModelApi,
    SimpleEditModelDialogExpandedChangeEvent,
    
    
    
    // react components:
    SimpleEditModelDialogProps,
    ImplementedSimpleEditModelDialogProps,
    SimpleEditModelDialog,
}                           from '@/components/dialogs/SimpleEditModelDialog'

// stores:
import {
    // types:
    UserDetail,
    
    
    
    // hooks:
    usePostImage,
    useDeleteImage,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'
import {
    useDraftDifferentialImages,
}                           from '@/states/draftDifferentialImages'



// react components:
export interface SimpleEditUserImageDialogProps
    extends
        // bases:
        Omit<ImplementedSimpleEditModelDialogProps<Omit<UserDetail, 'roleId'>, 'image'>, 'editorComponent'>,
        Partial<Pick<SimpleEditModelDialogProps<Omit<UserDetail, 'roleId'>, 'image'>, 'editorComponent'|'updateModelApi'>>
{
}
export const SimpleEditUserImageDialog = (props: SimpleEditUserImageDialogProps) => {
    // states:
    const [image, setImage      ] = useState<string|null>(props.model?.image ?? null); // optional field
    const initialImageRef         = useRef  <string|null>(props.model?.image ?? null); // optional field
    const draftDifferentialImages = useDraftDifferentialImages();
    
    
    
    // stores:
    const [postImage] = usePostImage();
    const [commitDeleteImage, {isLoading : isLoadingCommitDeleteImage}] = useDeleteImage();
    const [revertDeleteImage, {isLoading : isLoadingRevertDeleteImage}] = useDeleteImage();
    
    
    
    // handlers:
    const handleSideUpdate = useEvent(async (): Promise<void> => {
        await handleSideSave(/*commitImages = */true);
    });
    const handleSideDelete = useEvent(async (): Promise<void> => {
        await handleSideSave(/*commitImages = */false);
    });
    const handleSideSave   = useEvent(async (commitImages : boolean) => {
        // initial_image have been replaced with new image:
        if (commitImages && initialImageRef.current && (initialImageRef.current !== image)) {
            // register to actual_delete the initial_image when committed:
            draftDifferentialImages.registerDeletedImage(initialImageRef.current);
        } // if
        
        
        
        // search for unused image(s) and delete them:
        const {unusedImages} = draftDifferentialImages.commitChanges(commitImages);
        
        
        
        try {
            if (unusedImages.length) {
                await (commitImages ? commitDeleteImage : revertDeleteImage)({
                    imageId : unusedImages,
                }).unwrap();
            } // if
        }
        catch {
            // ignore any error
            return; // but do not clear the draft
        } // try
    });
    
    
    
    // other props:
    interface UserImageModel {
        id    : UserDetail['id']
        image : string|null
    }
    const {
        // stores:
        updateModelApi,
        
        
        
        // components:
        editorComponent = (<UploadImage
            // variants:
            nude={true}
            
            
            
            // values:
            value={image}
            onChange={(value) => {
                setImage(value);
            }}
            
            
            
            // components:
            imageComponent={<ProfileImage nude={true} />}
            
            
            
            // handlers:
            onUploadImage={async ({ imageFile, reportProgress, abortSignal }) => {
                try {
                    const imageId = await postImage({
                        image            : imageFile,
                        folder           : 'users',
                        onUploadProgress : reportProgress,
                        abortSignal      : abortSignal,
                    }).unwrap();
                    
                    // replace => delete prev drafts:
                    await handleSideDelete();
                    
                    // register to actual_delete the new_image when reverted:
                    draftDifferentialImages.registerAddedImage(imageId);
                    
                    return imageId;
                }
                catch (error : any) {
                    if (error.status === 0) { // non_standard HTTP status code: a request was aborted
                        // TODO: try to cleanup a prematurely image (if any)
                        
                        return null; // prevents showing error
                    } // if
                    
                    throw error;     // shows the error detail
                } // try
            }}
            onDeleteImage={async ({ imageData: imageId }) => {
                // register to actual_delete the deleted_image when committed:
                draftDifferentialImages.registerDeletedImage(imageId);
                
                return true;
            }}
            onResolveImageUrl={resolveMediaUrl<never>}
        /> as React.ReactComponentElement<any, EditorProps<Element, ValueOfModel<UserImageModel>>>),
    } = props;
    
    
    
    // jsx:
    return (
        <SimpleEditModelDialog<UserImageModel>
            // other props:
            {...props as unknown as ImplementedSimpleEditModelDialogProps<UserImageModel>}
            
            
            
            // stores:
            updateModelApi={updateModelApi as (UpdateModelApi<UserImageModel> | (() => UpdateModelApi<UserImageModel>))}
            isCommiting={isLoadingCommitDeleteImage}
            isReverting={isLoadingRevertDeleteImage}
            
            
            
            // components:
            editorComponent={editorComponent}
            
            
            
            // handlers:
            onSideUpdate={handleSideUpdate}
            onSideDelete={handleSideDelete}
        />
    );
};
