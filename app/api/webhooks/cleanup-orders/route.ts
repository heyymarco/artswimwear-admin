export async function POST(req: Request, res: Response): Promise<Response> {
    const secretHeader = req.headers.get('X-Secret');
    console.log('webhook called: ', {secretHeader});
    if (!secretHeader || (secretHeader !== process.env.APP_SECRET)) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 401 }); // handled with error: unauthorized
    } // if
    
    
    
    // Return OK:
    return Response.json({
        ok: true,
    });
};