import cloudinary from 'cloudinary'



cloudinary.v2.config({ 
    cloud_name : process.env.NEXT_PUBLIC_CLOUDINARY_ENV, 
    api_key    : process.env.CLOUDINARY_ID, 
    api_secret : process.env.CLOUDINARY_SECRET
});

interface UploadMediaOptions {
    folder?: string
}
export const uploadMedia = async (file: Express.Multer.File, options?: UploadMediaOptions): Promise<string> => {
    // options:
    const {
        folder,
    } = options ?? {};
    
    
    
    const result = await cloudinary.v2.uploader.upload(file.path, {
        filename_override : file.originalname,
        display_name      : file.originalname, // a user-friendly name for (internal) asset management.
        use_filename      : true, // use a filename + random_string to form the public_id
        public_id_prefix  : folder, // for url-SEO
        ...(!folder ? undefined : {
            asset_folder  : folder || undefined,
            folder        : folder
        }),
        resource_type     : 'auto',
        tags              : folder ? [folder] : undefined,
    });
    return result.public_id;
};

export const deleteMedia = async (imageId: string): Promise<void> => {
    await cloudinary.v2.uploader.destroy(imageId);
};
