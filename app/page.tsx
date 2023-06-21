'use client'

import { useState } from 'react';
import { Section, Main } from '@heymarco/section'
import { ImageData, GalleryEditor } from '@/components/editors/GalleryEditor/GalleryEditor';



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
                }} uploadImageStart={(imageFile) => {
                    console.log(imageFile.name);
                }} />
            </Section>
        </Main>
    )
}
