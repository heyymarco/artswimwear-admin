// next-js:
import {
    type NextRequest,
}                           from 'next/server'

// next-auth:
import {
    getServerSession,
}                           from 'next-auth'

// heymarco:
import type {
    Session,
}                           from '@heymarco/next-auth/server'

// next-connect:
import {
    createEdgeRouter,
}                           from 'next-connect'

// utilities:
import {
    uploadMedia,
    deleteMedia,
    moveMedia,
}                           from '@/libs/mediaStorage.aws.server'
import {
    default as sharp,
}                           from 'sharp'

// internal auth:
import {
    authOptions,
}                           from '@/libs/auth.server'



// types:
export type ImageId = string & {}



// // file processors:
// const upload = multer({
//     storage: multer.diskStorage({
//         destination: '/tmp',
//         filename: (req, file, cb) => {
//             cb(null, file.originalname);
//             (req as any).originalname = file.originalname;
//         },
//     }),
// });
// const uploadMiddleware = upload.single('image');



// routers:
interface RequestContext {
    params: {
        /* no params yet */
    }
}
const router  = createEdgeRouter<NextRequest, RequestContext>();
const handler = async (req: NextRequest, ctx: RequestContext) => router.run(req, ctx) as Promise<any>;
export {
    // handler as GET,
    handler as POST,
    handler as PUT,
    handler as PATCH,
    // handler as DELETE,
    // handler as HEAD,
}

router
.use(async (req, ctx, next) => {
    // conditions:
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    (req as any).session = session;
    
    
    
    // authorized => next:
    return await next();
})
.post(async (req) => {
    const data = await req.formData();
    
    const file = data.get('image');
    // const file : Express.Multer.File = (req as any).file;
    if (!file || !(file instanceof Object)) {
        return Response.json({
            error: 'No file uploaded.',
        }, { status: 400 }); // handled with error
    } // if
    if (file.size > (4 * 1024 * 1024)) { // limits to max 4MB
        return Response.json({
            error: 'The file is too big. The limit is 4MB.',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    const folder = data.get('folder');
    if ((typeof(folder) !== 'string') || !folder) {
        return Response.json({
            error: 'Invalid parameter(s).',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    
    if (!session.role?.product_ui && folder.startsWith('products/')) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the product images.`
    }, { status: 403 }); // handled with error: forbidden
    
    if (!session.role?.admin_ui && folder.startsWith('admins/')) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the admin's image.`
    }, { status: 403 }); // handled with error: forbidden
    //#endregion validating privileges
    
    
    
    try {
        const nodeImageTransformer = sharp({
            failOn           : 'none',
            limitInputPixels : 4096*2160, // 4K resolution
            density          : 72, // dpi
        })
        .resize({
            ...((): { width: number, height: number } => {
                if (folder === 'admins') return { // for admin profile image:
                    width      : 160,
                    height     : 160,
                };
                
                return { // default: assumes product image:
                    width      : 1280,
                    height     : 1920,
                };
            })(),
            fit                : 'cover',
            background         : '#ffffff',
            withoutEnlargement : true,       // do NOT scale up
            withoutReduction   : false,      // do scale down
            kernel             : 'lanczos3', // interpolation kernels
        })
        .flatten({ // merge alpha transparency channel, if any, with a background, then remove the alpha channel
            background         : '#ffffff',
        })
        .webp({
            quality            : 90,
            alphaQuality       : 90,
            lossless           : false,
            nearLossless       : false,
            effort             : 4,
        }) ;
        
        
        
        let signalTransformDone : (() => void)|undefined = undefined;
        const webImageTransformer = new TransformStream({
            start(controller) {
                nodeImageTransformer.on('data', (chunk) => {
                    controller.enqueue(chunk); // forward a chunk of processed data to the next Stream
                    
                    if (signalTransformDone) {
                        signalTransformDone();
                    } // if
                });
                nodeImageTransformer.on('end', () => {
                    signalTransformDone?.(); // signal that the last data has been processed
                });
            },
            transform(chunk, controller) {
                nodeImageTransformer.write(chunk); // write a chunk of data to the Writable
            },
            async flush(controller) {
                const promiseTransformDone = new Promise<void>((resolved) => {
                    signalTransformDone = resolved;
                });
                nodeImageTransformer.end(); // signal that no more data will be written to the Writable
                await promiseTransformDone; // wait for the last data has been processed
            },
        });
        
        
        
        const fileName = file.name;
        const fileNameWithoutExt = fileName.match(/^.*(?=\.\w+$)/gi)?.[0] || fileName.split('.')?.[0] || 'image';
        const fileId = await uploadMedia(`${fileNameWithoutExt}.webp`, file.stream().pipeThrough(webImageTransformer), {
            folder,
        });
        
        
        
        return Response.json(fileId); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        return Response.json({ error: 'Unable to process your image.\n\nPlease choose another image.' }, { status: 500 }); // handled with error
    } // try
})
.patch(async (req) => {
    const {
        image: imageIds,
    } = await req.json();
    
    if (!Array.isArray(imageIds) || !imageIds.length || !imageIds.every((imageId) => (typeof(imageId) === 'string'))) {
        return Response.json({
            error: 'Invalid parameter(s).',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    try {
        await Promise.all(imageIds.map((imageId) => deleteMedia(imageId)));
        
        
        return Response.json(imageIds); // deleted => success
    }
    catch (error: any) {
        if (error?.code === 404) { // not found => treat as success
            return Response.json(imageIds); // deleted => success
        } // if
        return Response.json({ error: error?.message ?? `${error}` }, { status: 500 }); // handled with error
    } // try
})
.put(async (req) => {
    const {
        image: imageIds,
        folder,
    } = await req.json();
    
    if (!Array.isArray(imageIds) || !imageIds.length || !imageIds.every((imageId) => (typeof(imageId) === 'string'))) {
        return Response.json({
            error: 'Invalid parameter(s).',
        }, { status: 400 }); // handled with error
    } // if
    
    if ((typeof(folder) !== 'string') || !folder) {
        return Response.json({
            error: 'Invalid parameter(s).',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    try {
        const moved = await moveMedia(imageIds, folder);
        
        
        
        return Response.json(moved); // update => success
    }
    catch (error: any) {
        return Response.json({ error: error?.message ?? `${error}` }, { status: 500 }); // handled with error
    } // try
});
