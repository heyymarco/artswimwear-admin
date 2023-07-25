import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'

// models:
import type {
    ShippingProvider,
}                           from '@prisma/client'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'



// types:
export interface ShippingPreview
    extends
        Pick<ShippingProvider,
            |'id'
            |'name'
        >
{
}



const router = createRouter<
    NextApiRequest,
    NextApiResponse<
        | Array<ShippingPreview>
        | { error: string }
    >
>();



router
.get(async (req, res) => {
    return res.json(
        await prisma.shippingProvider.findMany({
            select: {
                id   : true,
                
                name : true,
            },
        }) // get all shippings including the disabled ones
    );
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
