
import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'

import multer from 'multer'
import type { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis';
import { createReadStream, unlink } from 'fs'



const {
    GOOGLE_AUTH_CLIENT_ID,
    GOOGLE_AUTH_CLIENT_SECRET,
    GOOGLE_AUTH_REDIRECT_URI,
    GOOGLE_AUTH_REFRESH_TOKEN,
    GOOGLE_DRIVE_FOLDER_PRODUCT_IMAGES,
} = process.env;



const googleAuth = (): OAuth2Client => {
    const googleAuth = new google.auth.OAuth2(
        GOOGLE_AUTH_CLIENT_ID,
        GOOGLE_AUTH_CLIENT_SECRET,
        GOOGLE_AUTH_REDIRECT_URI
    );
    googleAuth.setCredentials({ refresh_token: GOOGLE_AUTH_REFRESH_TOKEN });
    return googleAuth; 
};

let syncCreateFolderPromise : Promise<any>|undefined = undefined;
interface GoogleDriveUploadOptions {
    folder?: string
}
const googleDriveUpload = async (googleAuth: OAuth2Client, file: Express.Multer.File, options?: GoogleDriveUploadOptions) => {
    // options:
    const {
        folder,
    } = options ?? {};
    
    
    
    const googleDrive = google.drive({
        version : 'v3',
        auth    : googleAuth,
    });
    
    
    
    let driveFolderId = GOOGLE_DRIVE_FOLDER_PRODUCT_IMAGES ?? '';
    if (folder) {
        for (const subFolder of folder.split('/')) {
            driveFolderId = (
                await (async (): Promise<string|null|undefined> => {
                    do {
                        const foundSubFolderId = (
                            (await googleDrive.files.list({
                                q            : `'${driveFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and name='${subFolder}' and trashed=false`,
                                fields       : 'files(id)',
                            }))
                            .data.files?.[0]?.id
                        );
                        if (foundSubFolderId) return foundSubFolderId;
                    } while(
                        syncCreateFolderPromise // wait for a folder creation completed (if any)
                        &&
                        (await syncCreateFolderPromise || true) // wait until the folder creation finished (no matter the promising result)
                    );
                    
                    return undefined; // not found
                })()
                
                ??
                
                await (async (): Promise<string|null|undefined> => {
                    const createFolderPromise = googleDrive.files.create({
                        requestBody  : {
                            mimeType : 'application/vnd.google-apps.folder',
                            name     : subFolder,
                            
                            parents  : [
                                driveFolderId,
                            ],
                        },
                        fields       : 'id',
                    });
                    syncCreateFolderPromise = createFolderPromise;
                    const result = await createFolderPromise;
                    syncCreateFolderPromise = undefined;
                    return result.data.id;
                })()
                
                ??
                
                driveFolderId
            );
        } // for
    } // if
    
    
    
    // const bufferStream = new stream.PassThrough();
    // bufferStream.end(file.buffer);
    
    
    
    const driveFile = await googleDrive.files.create({
        requestBody  : {
            mimeType : file.mimetype,
            name     : file.originalname,
            
            parents  : [
                driveFolderId,
            ],
        },
        media        : {
            body     : createReadStream(file.path),
        },
        fields       : 'id',
    });
    return driveFile.data.id ?? '';
};



const router = createRouter<NextApiRequest, NextApiResponse>();

const upload = multer({
    storage: multer.diskStorage({
        destination: './public/temp',
        filename: (req, file, cb) => {
            cb(null, file.originalname);
            (req as any).originalname = file.originalname;
        },
    }),
});
const uploadMiddleware = upload.single('image');

const deleteFile = (file: Express.Multer.File) => {
    unlink(file.path, () => {});
};



router
// Use express middleware in next-connect with expressWrapper function
// .use(expressWrapper(passport.session()))
// .use(uploadMiddleware as any)
.post(uploadMiddleware as any, async (req, res) => {
    const file : Express.Multer.File = (req as any).file;
    if (!file) {
        res.status(400).send("No file uploaded.");
        return;
    } // if
    
    
    
    const {
        folder,
    } = req.body;
    if ((folder !== undefined) && (typeof(folder) !== 'string')) {
        res.status(400).json({ error: 'invalid parameter(s)' });
        return;
    } // if
    
    
    
    try {
        const gAuth = googleAuth();
        const driveFileId = await googleDriveUpload(gAuth, file, {
            folder,
        });
        
        
        
        res.status(200).json({ id: driveFileId });
    }
    catch (error: any) {
        res.status(500).send(error?.message ?? `${error}`);
    }
    finally {
        try {
            deleteFile(file);
        }
        catch {
            // ignore error
        }
    } // try
});



export default router.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
    onNoMatch: (req, res) => {
        res.status(404).json({ error: 'Page is not found' });
    },
});

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};
