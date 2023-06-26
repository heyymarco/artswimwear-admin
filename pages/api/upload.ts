
import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter, expressWrapper } from 'next-connect'

import { connectDB } from '@/libs/dbConn'
import { default as Product, ProductSchema } from '@/models/Product'
import type { HydratedDocument } from 'mongoose'
import multer, { StorageEngine } from 'multer'
import type { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis';
import stream from 'stream'
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
const googleDriveUpload = async (googleAuth: OAuth2Client, file: Express.Multer.File) => {
    // const bufferStream = new stream.PassThrough();
    // bufferStream.end(file.buffer);
    
    
    
    const googleDrive = google.drive({
        version: 'v3',
        auth: googleAuth,
    });
    const driveFile = await googleDrive.files.create({
        requestBody  : {
            name     : file.originalname,
            parents  : [
                GOOGLE_DRIVE_FOLDER_PRODUCT_IMAGES ?? '',
            ],
        },
        media        : {
            mimeType : file.mimetype,
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
const uploadMiddleware = upload.single('testFile');

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
    
    
    
    try {
        const gAuth = googleAuth();
        const driveFileId = await googleDriveUpload(gAuth, file);
        console.log('file created!', driveFileId);
        
        
        
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
