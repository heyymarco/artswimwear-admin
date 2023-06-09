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
import { resolveMediaUrl } from '@/libs/mediaStorage.client'
import {WysiwygEditorState, WysiwygEditor, ToolbarPlugin, EditorPlugin, WysiwygViewer} from '@/components/editors/WysiwygEditor';



const sleep = (timeout: number) => new Promise<void>((resolve) => {
    setTimeout(resolve, timeout);
});



export default function Home() {
    // const [images, setImages] = useState<string[]>(() => [
    //     'waves-800x600.jpg',
    //     'leaf-800x700.jpg',
    //     'building-800x500.jpg',
    //     'street-800x800.jpg',
    //     'flower-700x400.jpg',
    //     'water-500x800.jpg',
    //     'wood-700x600.jpg',
    // ]);
    const [value, setValue] = useState<WysiwygEditorState|null>(
        JSON.parse(
            '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"edit me!","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}'
        )
    );
    return (
        <Main nude={true}>
            <Section title='Homepage'>
                {/* <GalleryEditor<HTMLElement, string>
                    // variants:
                    theme='primary'
                    
                    
                    
                    // values:
                    value={images}
                    onChange={(value) => {
                        console.log(`onChange: ${value.join(', ')}`);
                        setImages(value);
                    }}
                    
                    
                    
                    // actions:
                    onActionDelete={async (imageData) => {
                        await axios.delete(`/api/upload?imageId=${encodeURIComponent(imageData)}`);
                        return true;
                    }}
                    
                    
                    
                    // upload/uploading activities:
                    onUploadImageStart={async (imageFile, reportProgress, cancelController) => {
                        const formData = new FormData();
                        formData.append('image', imageFile);
                        const response = await axios.post('/api/upload', formData, {
                            headers          : { 'content-type': 'multipart/form-data' },
                            onUploadProgress : (event) => {
                                reportProgress(
                                    (event.loaded * 100) / (event.total ?? 100)
                                );
                            },
                        });
                        return response.data.id;
                    }}
                    onUploadingImageProgress={undefined}
                    
                    
                    
                    // components:
                    imageComponent={
                        // @ts-ignore
                        <Image
                            priority={true}
                        />
                    }
                    
                    
                    
                    // handlers:
                    onResolveUrl={resolveMediaUrl<never>}
                /> */}
                <WysiwygEditor
                    // variants:
                    theme='primary'
                    
                    
                    
                    // values:
                    value={value}
                    onChange={setValue}
                    // enabled={false}
                    // readOnly={true}
                >
                    <ToolbarPlugin />
                    <EditorPlugin
                        // accessibilities:
                        placeholder='Type product description here...'
                    />
                </WysiwygEditor>
                <hr />
                <WysiwygViewer
                    // variants:
                    theme='danger'
                    
                    
                    
                    // values:
                    value={value}
                />
                <hr />
                <div>
                    {JSON.stringify(value)}
                </div>
                <hr />
                <button onClick={() => setValue(JSON.parse(
                    '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"noooo","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}'
                ))}>update</button>
                <button onClick={() => setValue(JSON.parse(
                    '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"yesss","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}'
                ))}>update</button>
            </Section>
        </Main>
    )
}
