
import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter, expressWrapper } from 'next-connect'

import { connectDB } from '@/libs/dbConn'
import { default as Product, ProductSchema } from '@/models/Product'
import type { HydratedDocument } from 'mongoose'
import multer from 'multer'



const router = createRouter<NextApiRequest, NextApiResponse>();

const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
            cb(null, file.originalname);
            (req as any).originalname = file.originalname;
        },
    }),
});
const uploadMiddleware = upload.single('testFile');



router
// Use express middleware in next-connect with expressWrapper function
// .use(expressWrapper(passport.session()))
.use(uploadMiddleware as any)
.post((req, res) => {
    res.status(200).json({ url: `/uploads/${(req as any).originalname}` });
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
