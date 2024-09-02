// react:
import {
    // hooks:
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component




export interface CommitedImages {
    unusedImages : string[]
    usedImages   : string[]
}
export interface DraftDifferentialImagesApi {
    registerAddedImage   : (imageId: string) => void
    registerDeletedImage : (imageId: string) => void
    commitChanges        : (commit: boolean) => CommitedImages
}
export const useDraftDifferentialImages = (): DraftDifferentialImagesApi => {
    // states:
    const [draftDifferentialImages] = useState<Map<string, boolean|null>>(() => new Map<string, boolean|null>());
    
    
    
    // stable callbacks:
    const registerAddedImage   = useEvent((imageId: string): void => {
        // register to actual_delete the new_image when reverted:
        draftDifferentialImages.set(imageId, false /* false: delete when reverted, noop when committed */);
    });
    const registerDeletedImage = useEvent((imageId: string): void => {
        // register to actual_delete the deleted_image when committed:
        draftDifferentialImages.set(imageId,
            draftDifferentialImages.has(imageId) // if has been created but not saved
            ? null /* null: delete when committed, delete when reverted */
            : true /* true: delete when committed, noop when reverted */
        );
    });
    const commitChanges        = useEvent((commit: boolean): CommitedImages => {
        // search for unused image(s) and delete them:
        const unusedImages : string[] = [];
        for (const unusedImage of
            Array.from(draftDifferentialImages.entries())
            .filter((draftDeletedImage) => ((draftDeletedImage[1] === commit) || (draftDeletedImage[1] === null)))
            .map((draftDeletedImage) => draftDeletedImage[0])
        )
        {
            unusedImages.push(unusedImage);
        } // for
        
        
        
        // compose the diff:
        for (const unusedImage of unusedImages) draftDifferentialImages.delete(unusedImage);
        const usedImages = Array.from(draftDifferentialImages.keys());
        draftDifferentialImages.clear();
        
        
        
        // return the results:
        return {
            unusedImages,
            usedImages,
        };
    });
    
    
    
    // api:
    return {
        // stable callbacks:
        registerAddedImage,
        registerDeletedImage,
        commitChanges,
    };
}
