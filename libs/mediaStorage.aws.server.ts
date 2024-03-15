// import { uploadData }    from 'aws-amplify/storage'
import {
    S3Client,
    DeleteObjectCommand,
}                           from '@aws-sdk/client-s3'
import {
    Upload,
}                           from '@aws-sdk/lib-storage'
import {
    lookup as mimeLookup,
}                           from 'mime-types'

// others:
import {
    customAlphabet,
}                           from 'nanoid/async'



const bucketName   = process.env.AWS_BUCKET_NAME ?? '';
const bucketRegion = process.env.AWS_REGION      ?? '';
const s3 = new S3Client({
    region              : bucketRegion,
    credentials         : {
        accessKeyId     : process.env.AWS_ID     ?? '',
        secretAccessKey : process.env.AWS_SECRET ?? '',
    },
});



interface UploadMediaOptions {
    folder?: string
}
export const uploadMedia = async (fileName: string, stream: ReadableStream, options?: UploadMediaOptions): Promise<string> => {
    // options:
    const {
        folder,
    } = options ?? {};
    
    
    
    const extensionIndex = fileName.indexOf('.'); // the dot of the first extension
    const fileNameNoExt  = (extensionIndex < 0) ? fileName : fileName.slice(0, extensionIndex);
    const fileExtensions = (extensionIndex < 0) ? '' : fileName.slice(extensionIndex);
    const nanoid         = customAlphabet('abcdefghijklmnopqrstuvwxyz', 5);
    const uniqueFileName = `${fileNameNoExt}-${await nanoid()}${fileExtensions}`;
    const filePath       = (folder ? `${folder}/${uniqueFileName}` : uniqueFileName);
    
    
    
    const multipartUpload = new Upload({
        client : s3,
        params : {
            // ACL       : 'public-read', // unsupported: the ACL is disabled in bucket-level
            Bucket       : bucketName,
            Key          : filePath,
            Body         : stream,
            ContentType  : mimeLookup(fileName) || undefined,
            CacheControl : 'max-age=31536000', // cache to one year to reduce bandwidth usage
        },
    });
    const blobResult = await multipartUpload.done();
    return (
        blobResult.Location
        ??
        `https://${encodeURIComponent(bucketName)}.s3.${encodeURIComponent(bucketRegion)}.amazonaws.com/${encodeURIComponent(filePath)}`
    );
};

export const deleteMedia = async (imageId: string): Promise<void> => {
    const baseUrl  = `https://${encodeURIComponent(bucketName)}.s3.${encodeURIComponent(bucketRegion)}.amazonaws.com/`;
    if (!imageId.startsWith(baseUrl)) return; // invalid aws_s3_url => ignore;
    const pathUrl  = imageId.slice(baseUrl.length);
    const filePath = decodeURIComponent(pathUrl);
    
    
    
    try {
        await s3.send(
            new DeleteObjectCommand({
                Bucket : bucketName,
                Key    : filePath,
            })
        );
        // if (deleteResult.$metadata.httpStatusCode === 204) // object was deleted -or- nothing to delete => assumes as success
    }
    catch {
        // ignore any error
    } // try
};

export const hasMedia    = async (imageId: string): Promise<boolean> => {
    // try {
    //     await infoBlob(imageId, {
    //         token : process.env.BLOB_READ_WRITE_TOKEN,
    //     });
    //     
    //     return true; // succeeded => the media is exist
    // }
    // catch {
    //     return false; // errored => the media is not exist
    // } // try
    return false;
};

export const moveMedia   = async (imageIds: string[], folder: string): Promise<{ from: string, to: string }[]> => {
    //const metaPromises = imageIds.map(async (imageId) => {
    //    try {
    //        const {
    //            pathname,
    //            url,
    //        } = (await infoBlob(imageId, {
    //            token : process.env.BLOB_READ_WRITE_TOKEN,
    //        }));
    //        
    //        return {
    //            pathname,
    //            url,
    //        };
    //    }
    //    catch {
    //        return undefined; // ignore any error
    //    } // try
    //});
    //const metas = (await Promise.all(metaPromises)).filter((meta): meta is Exclude<typeof meta, undefined> => (meta !== undefined));
    //const movePromises = metas.map(async ({ pathname, url }) => {
    //    try {
    //        const fileName = pathname.split('/').at(-1) ?? pathname;
    //        const desiredPathname = (folder ? `${folder}/${fileName}` : fileName);
    //        if (pathname === desiredPathname) return undefined; // already the same, nothing to move
    //        
    //        const blobResult = await copyBlob(url, /* pathname: */desiredPathname, {
    //            token              : process.env.BLOB_READ_WRITE_TOKEN,
    //            access             : 'public',
    //            contentType        : undefined,
    //            addRandomSuffix    : true, // avoids name conflict
    //            cacheControlMaxAge : undefined,
    //        });
    //        
    //        return {
    //            from : url,
    //            to   : blobResult.url,
    //        };
    //    }
    //    catch {
    //        return undefined; // ignore any error
    //    } // try
    //});
    //const moved = (await Promise.all(movePromises)).filter((item): item is Exclude<typeof item, undefined> => (item !== undefined));
    //return moved;
    return [];
}
