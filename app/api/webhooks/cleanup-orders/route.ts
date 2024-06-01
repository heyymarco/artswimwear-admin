export async function POST(req: Request, res: Response): Promise<Response> {
    const secretHeader = req.headers.get('X-Secret');
    console.log('webhook:cleanup-orders called: ', {secretHeader});
    if (!secretHeader || (secretHeader !== process.env.APP_SECRET)) {
        return Response.json({
            error: 'Unauthorized.',
        }, { status: 401 }); // handled with error: unauthorized
    } // if
    
    
    
    // Return OK:
    return Response.json({
        ok: true,
    });
};