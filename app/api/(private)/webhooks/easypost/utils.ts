import crypto from 'crypto'
import { type Event } from '@easypost/api'



export const validateWebhook = async (body: Uint8Array, signature: string|null|undefined, webhookSecret: string|null|undefined): Promise<Event|false> => {
    if (!signature)     return false;
    if (!webhookSecret) return false;
    
    
    
    const encodedSecret = Buffer.from(webhookSecret.normalize('NFKD'), 'utf8');
    
    const expectedSignature = (
        crypto
        .createHmac('sha256', encodedSecret)
        .update(await (new Response(body)).text(), 'utf-8')
        .digest('hex')
    );
    
    const digest = `hmac-sha256-hex=${expectedSignature}`;
    
    try {
        if (
            crypto.timingSafeEqual(
                Buffer.from(signature, 'utf8'),
                Buffer.from(digest, 'utf8'),
            )
        ) {
            return await (new Response(body)).json();
        } else {
            return false;
        }
    }
    catch {
        return false;
    } // if
}
