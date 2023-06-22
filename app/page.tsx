'use client'

import { useState } from 'react';
import { Section, Main } from '@heymarco/section'
import { ImageData, GalleryEditor } from '@/components/editors/GalleryEditor/GalleryEditor';
// import Image from 'next/image'
import {
    // react components:
    Image,
}                           from '@heymarco/image'
import axios from 'axios'



const sleep = (timeout: number) => new Promise<void>((resolve) => {
    setTimeout(resolve, timeout);
});



export default function Home() {
    const [images, setImages] = useState<ImageData[]>(() => [
        'waves-800x600.jpg',
        'leaf-800x700.jpg',
        'building-800x500.jpg',
        'street-800x800.jpg',
        'flower-700x400.jpg',
        'water-500x800.jpg',
        'wood-700x600.jpg',
    ]);
    return (
        <Main nude={true}>
            <Section title='Homepage'>
                <GalleryEditor
                    // variants:
                    theme='primary'
                    
                    
                    
                    // paths:
                    resolveUrl={(imageData) => {
                        const rawUrl = ((typeof(imageData) === 'string')) ? imageData : imageData.url;
                        if (rawUrl.includes('/')) return rawUrl;
                        return `/products/lorem-img/${rawUrl}`
                    }}
                    
                    
                    
                    // values:
                    value={images}
                    onChange={(value) => {
                        console.log(`onChange: ${value.join(', ')}`);
                        setImages(value);
                    }}
                    
                    
                    
                    // upload activities:
                    onUploadImageStart={async (imageFile, reportProgress, cancelController) => {
                        const formData = new FormData();
                        formData.append('testFile', imageFile);
                        const response = await axios.post('/api/upload', formData, {
                            headers          : { 'content-type': 'multipart/form-data' },
                            onUploadProgress : (event) => {
                                reportProgress(
                                    (event.loaded * 100) / (event.total ?? 100)
                                );
                            },
                        });
                        return response.data.url;
                    }}
                    
                    
                    
                    // components:
                    imageComponent={
                        // @ts-ignore
                        <Image
                            priority={true}
                        />
                    }
                />
            </Section>
        </Main>
    )
}
