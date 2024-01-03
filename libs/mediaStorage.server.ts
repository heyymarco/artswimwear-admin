import cloudinary from 'cloudinary'
import { createReadStream } from 'streamifier'



// @ts-ignore
process.noDeprecation = true;



cloudinary.v2.config({ 
    cloud_name : process.env.NEXT_PUBLIC_CLOUDINARY_ENV, 
    api_key    : process.env.CLOUDINARY_ID, 
    api_secret : process.env.CLOUDINARY_SECRET
});

interface UploadMediaOptions {
    folder?: string
}
export const uploadMedia = async (file: File, options?: UploadMediaOptions): Promise<string> => {
    // options:
    const {
        folder,
    } = options ?? {};
    
    
    
    return await new Promise<string>(async (resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
            {
                filename_override : file.name,
                display_name      : file.name, // a user-friendly name for (internal) asset management.
                use_filename      : true,      // use a filename + random_string to form the public_id
                public_id_prefix  : folder,    // for url-SEO
                ...(!folder ? undefined : {
                    asset_folder  : folder || undefined,
                    folder        : folder
                }),
                resource_type     : 'auto',
                tags              : folder ? [folder] : undefined,
            },
            (err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res?.public_id ?? '')
                } // if
            }
        );
        createReadStream(Buffer.from(await file.arrayBuffer())).pipe(uploadStream);
    });
};

export const deleteMedia = async (imageId: string): Promise<void> => {
    await cloudinary.v2.uploader.destroy(imageId);
};
