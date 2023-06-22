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
        '/products/lorem-img/waves-800x600.jpg',
        '/products/lorem-img/leaf-800x700.jpg',
        '/products/lorem-img/building-800x500.jpg',
        '/products/lorem-img/street-800x800.jpg',
        '/products/lorem-img/flower-700x400.jpg',
        '/products/lorem-img/water-500x800.jpg',
        '/products/lorem-img/wood-700x600.jpg',
    ]);
    return (
        <Main nude={true}>
            <Section title='Homepage'>
                <GalleryEditor theme='primary' value={images} onChange={(value) => {
                    console.log(`onChange: ${value.map((val) => ((typeof(val) === 'string') ? val : val.url).split('-')[0]).join(', ')}`);
                    setImages(value);
                }} onUploadImageStart={async (imageFile: File, reportProgress: (percentage: number) => void, cancelController): Promise<ImageData|null> => {
                    // console.log('uploading: ', imageFile.name);
                    // for (let progress = 0; progress <= 100; progress += 10) {
                    //     await sleep(500);
                    //     reportProgress(progress);
                    // } // for
                    // throw Error('The server was busy.');
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
