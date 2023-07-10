
import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'

import multer from 'multer'
import { unlink } from 'fs'
import { uploadMedia, deleteMedia } from '@/libs/mediaStorage.server'



const router = createRouter<NextApiRequest, NextApiResponse>();

const upload = multer({
    storage: multer.diskStorage({
        destination: './tmp',
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
    if (!file) return res.status(400).send("No file uploaded.");
    
    
    
    const {
        folder,
    } = req.body;
    if ((folder !== undefined) && (typeof(folder) !== 'string')) return res.status(400).json({ error: 'invalid parameter(s)' });
    
    
    
    try {
        const fileId = await uploadMedia(file, {
            folder,
        });
        
        
        return res.status(200).json({ id: fileId });
    }
    catch (error: any) {
        return res.status(500).send(error?.message ?? `${error}`);
    }
    finally {
        try {
            deleteFile(file);
        }
        catch {
            // ignore error
        }
    } // try
})
.delete(async (req, res) => {
    const {
        imageId,
    } = req.query;
    if (!imageId || (typeof(imageId) !== 'string')) return res.status(400).json({ error: 'invalid parameter(s)' });
    
    
    
    try {
        await deleteMedia(imageId);
        
        
        
        return res.status(200).json({ id: imageId }); // deleted => success
    }
    catch (error: any) {
        if (error?.code === 404) return res.status(200).json({ id: imageId }); // not found => treat as success
        return res.status(500).send(error?.message ?? `${error}`);
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
