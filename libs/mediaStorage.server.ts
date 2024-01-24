import {
    // apis:
    put  as uploadBlob,
    del  as deleteBlob,
    head as infoBlob,
    copy as copyBlob,
}                           from '@vercel/blob'
import {
    // types:
    HandleUploadBody,
    
    
    
    // apis:
    handleUpload as handleUploadBlob,
}                           from '@vercel/blob/client'



interface UploadMediaOptions {
    folder?: string
}
export const uploadMedia = async (fileName: string, stream: ReadableStream, options?: UploadMediaOptions): Promise<string> => {
    // options:
    const {
        folder,
    } = options ?? {};
    
    
    
    const blobResult = await uploadBlob((folder ? `${folder}/${fileName}` : fileName), stream, {
        token              : process.env.BLOB_READ_WRITE_TOKEN,
        access             : 'public',
        contentType        : undefined,
        addRandomSuffix    : true, // avoids name conflict
        cacheControlMaxAge : undefined,
        multipart          : false,
    });
    return blobResult.url;
};

export const deleteMedia = async (imageId: string): Promise<void> => {
    await deleteBlob(imageId, {
        token : process.env.BLOB_READ_WRITE_TOKEN,
    });
};

export const moveMedia = async (imageIds: string[], folder: string): Promise<{ from: string, to: string }[]> => {
    const metaPromises = imageIds.map(async (imageId) => {
        try {
            const {
                pathname,
                url,
            } = (await infoBlob(imageId, {
                token : process.env.BLOB_READ_WRITE_TOKEN,
            }));
            
            return {
                pathname,
                url,
            };
        }
        catch {
            return undefined; // ignore any error
        } // try
    });
    const metas = (await Promise.all(metaPromises)).filter((meta): meta is Exclude<typeof meta, undefined> => (meta !== undefined));
    const movePromises = metas.map(async ({ pathname, url }) => {
        try {
            const fileName = pathname.split('/').at(-1) ?? pathname;
            const desiredPathname = (folder ? `${folder}/${fileName}` : fileName);
            if (pathname === desiredPathname) return undefined; // already the same, nothing to move
            
            const blobResult = await copyBlob(url, /* pathname: */desiredPathname, {
                token              : process.env.BLOB_READ_WRITE_TOKEN,
                access             : 'public',
                contentType        : undefined,
                addRandomSuffix    : true, // avoids name conflict
                cacheControlMaxAge : undefined,
            });
            
            return {
                from : url,
                to   : blobResult.url,
            };
        }
        catch {
            return undefined; // ignore any error
        } // try
    });
    const moved = (await Promise.all(movePromises)).filter((item): item is Exclude<typeof item, undefined> => (item !== undefined));
    return moved;
}
