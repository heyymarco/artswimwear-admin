'use client'

import { useState } from 'react';
import Image from 'next/image'
import { Section, Main } from '@heymarco/section'
import { GalleryEditor } from '@/components/editors/GalleryEditor/GalleryEditor';



export default function Home() {
    const [images, setImages] = useState<string[]>(() => [
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
                <GalleryEditor theme='primary' productName='lorem-img' value={images} onChange={(value) => {
                    console.log(`onChange: ${value.map((val) => val.split('-')[0]).join(', ')}`);
                    setImages(value);
                }} uploadImageStart={(imageFile) => {
                    console.log(imageFile.name);
                }} />
            </Section>
        </Main>
    )
}
