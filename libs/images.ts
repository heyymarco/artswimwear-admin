export const downloadImageAsBase64 = async (url: string, responsiveSize: number, quality: number = 75): Promise<string> => {
    const response    = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ''}/_next/image?url=${encodeURIComponent(url)}&w=${responsiveSize}&q=${quality}`, {
        cache : 'force-cache',
        // next  : { // "cache: force-cache" and "revalidate: 86400", only one should be specified
        //     revalidate : 1 * 24 * 3600, // set the cache lifetime of a resource (in seconds).
        // },
    });
    if (response.status !== 200) throw Error('Unable to download the image.');
    const blob        = await response.blob();
    const buffer      = Buffer.from(await blob.arrayBuffer());
    const contentType = response.headers.get('Content-Type') ?? 'image';
    return `data:${contentType};base64, ${buffer.toString('base64')}`;
};
