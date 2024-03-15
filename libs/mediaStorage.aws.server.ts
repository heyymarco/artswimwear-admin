// import { uploadData }    from 'aws-amplify/storage'
import {
    S3Client,
    DeleteObjectCommand,
    CopyObjectCommand,
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
const baseMediaUrl = `https://${encodeURIComponent(bucketName)}.s3.${encodeURIComponent(bucketRegion)}.amazonaws.com/`;



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
        `${baseMediaUrl}${encodeURI(filePath)}`
    );
}

export const deleteMedia = async (imageId: string): Promise<void> => {
    if (!imageId.startsWith(baseMediaUrl)) return; // invalid aws_s3_url => ignore;
    const pathUrl  = imageId.slice(baseMediaUrl.length);
    const filePath = decodeURI(pathUrl);
    
    
    
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
}

export const moveMedia   = async (imageIds: string[], newFolder: string): Promise<{ from: string, to: string }[]> => {
    const movableFileNames = (
        imageIds
        .filter((imageId) =>
            imageId.startsWith(baseMediaUrl) // only valid aws_s3_url
        )
        .map((imageId) => {
            const pathUrl  = imageId.slice(baseMediaUrl.length);
            const filePath  = decodeURI(pathUrl);
            const lastIndex = filePath.lastIndexOf('/');
            if (lastIndex < 0) return false;
            const currentFolder = filePath.slice(0, lastIndex);
            if (currentFolder === newFolder) return false; // already the same folder => nothing to move
            return {
                filePath,
                fileName : filePath.slice(lastIndex + 1), // different folder => needs to move
            };
        })
        .filter((filePath): filePath is Exclude<typeof filePath, false> => !!filePath)
    );
    if (!movableFileNames.length) return []; // nothing to move => returns empty array
    
    
    
    return (
        (await Promise.all(
            movableFileNames
            .map(async ({filePath: currentFilePath, fileName: currentFileName}) => {
                const newFilePath = (newFolder ? `${newFolder}/${currentFileName}` : currentFileName);
                try {
                    await s3.send(
                        new CopyObjectCommand({
                            CopySource : `/${bucketName}/${currentFilePath}`,
                            
                            Bucket     : bucketName,
                            Key        : newFilePath,
                        })
                    );
                    return {
                        from : `${baseMediaUrl}${encodeURI(currentFilePath)}`,
                        to   : `${baseMediaUrl}${encodeURI(newFilePath)}`,
                    };
                }
                catch {
                    return false; // ignore any error
                } // try
            })
        ))
        .filter((result): result is Exclude<typeof result, false> => (result !== false))
    );
}
