// next-js:
import {
    NextRequest,
    NextResponse,
}                           from 'next/server'

// next-next:
import {
    getServerSession,
}                           from 'next-auth'

// next-connect:
import {
    createEdgeRouter,
}                           from 'next-connect'

// other libs:
import {
    writeFile,
    unlink,
}                           from 'fs/promises'

// utilities:
import {
    uploadMedia,
    deleteMedia,
}                           from '@/libs/mediaStorage.server'

// internal auth:
import {
    authOptions,
}                           from '@/app/api/auth/[...nextauth]/route'



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
    handler as GET,
    handler as POST,
    handler as PUT,
    handler as PATCH,
    handler as DELETE,
    handler as HEAD,
}

router
.use(async (req, ctx, next) => {
    // conditions:
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    
    
    
    // authorized => next:
    return await next();
})
.post(async (req) => {
    const data = await req.formData();
    const file = data.get('image');
    // const file : Express.Multer.File = (req as any).file;
    if (!file || !(file instanceof Object)) {
        return NextResponse.json({
            error: 'No file uploaded.',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    // const {
    //     folder,
    // } = await req.json();
    const folder = data.get('folder');
    if ((folder !== undefined) && (typeof(folder) !== 'string')) {
        return NextResponse.json({
            error: 'Invalid parameter(s).',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    const filePath = `/tmp/${file.name}`;
    try {
        await writeFile(filePath, Buffer.from(await file.arrayBuffer()));
        const fileId = await uploadMedia({ path: filePath, originalname: file.name } as any, {
            folder,
        });
        
        
        return NextResponse.json({ id: fileId }); // handled with success
    }
    catch (error: any) {
        return NextResponse.json({ error: error?.message ?? `${error}` }, { status: 500 }); // handled with error
    }
    finally {
        try {
            await unlink(filePath);
        }
        catch {
            // ignore error
        }
    } // try
})
.delete(async (req) => {
    const {
        imageId,
    } = Object.fromEntries(new URL(req.url, 'https://localhost/').searchParams.entries());
    if (!imageId || (typeof(imageId) !== 'string')) {
        return NextResponse.json({
            error: 'Invalid parameter(s).',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    try {
        await deleteMedia(imageId);
        
        
        
        return NextResponse.json({ id: imageId }); // deleted => success
    }
    catch (error: any) {
        if (error?.code === 404) return NextResponse.json({ id: imageId }); // not found => treat as success
        return NextResponse.json({ error: error?.message ?? `${error}` }, { status: 500 }); // handled with error
    } // try
});
