'use client'

// react:
import {
    // react:
    default as React, useState,
}                           from 'react'

import { UploadImage } from '@/components/editors/UploadImage'
import { Section, Main } from '@heymarco/section'
import GalleryEditor from '@/components/editors/GalleryEditor';



export default function DashboardPage() {
    const [mockDatabaseImage, setMockDatabaseImage] = useState<string|null>(null);
    
    return (
        <Main nude={true}>
            <Section title='Dashboard'>
                <p>
                    Coming soon: analitic data &amp; store summary goes here.
                </p>
                <UploadImage
                    theme='primary'
                    onUploadImage={async ({ imageFile, reportProgress }) => {
                        for (let progress = 0; progress <= 100; progress+=10) {
                            await new Promise<void>((resolved) => {
                                setTimeout(() => {
                                    resolved();
                                }, 100);
                            });
                            reportProgress(progress);
                            
                            // if (progress >= 70) throw <p><span style={{ color: 'red' }}>error</span> bro!</p>;
                            // if (progress >= 70) return Error('error bro!');
                        } // for
                        // await new Promise<void>((resolved) => {
                        //     // setTimeout(() => {
                        //     //     resolved();
                        //     // }, 1000);
                        // });
                        
                        
                        
                        if (mockDatabaseImage) URL.revokeObjectURL(mockDatabaseImage);
                        const imageUrl = URL.createObjectURL(imageFile);
                        setMockDatabaseImage(imageUrl);
                        return imageUrl;
                    }}
                    onDeleteImage={async ({ imageData }) => {
                        await new Promise<void>((resolved) => {
                            setTimeout(() => {
                                resolved();
                            }, 1000);
                        });
                        
                        
                        
                        URL.revokeObjectURL(imageData);
                        setMockDatabaseImage(null);
                        return true;
                    }}
                />
                <GalleryEditor
                    theme='primary'
                    onUploadImage={async ({ imageFile, reportProgress }) => {
                        for (let progress = 0; progress <= 100; progress+=10) {
                            await new Promise<void>((resolved) => {
                                setTimeout(() => {
                                    resolved();
                                }, 100);
                            });
                            reportProgress(progress);
                            
                            // if (progress >= 70) throw <p><span style={{ color: 'red' }}>error</span> bro!</p>;
                            // if (progress >= 70) return Error('error bro!');
                        } // for
                        // await new Promise<void>((resolved) => {
                        //     // setTimeout(() => {
                        //     //     resolved();
                        //     // }, 1000);
                        // });
                        
                        
                        
                        // if (mockDatabaseImage) URL.revokeObjectURL(mockDatabaseImage);
                        const imageUrl = URL.createObjectURL(imageFile);
                        setMockDatabaseImage(imageUrl);
                        return imageUrl;
                    }}
                    onDeleteImage={async ({ imageData }) => {
                        await new Promise<void>((resolved) => {
                            setTimeout(() => {
                                resolved();
                            }, 1000);
                        });
                        
                        
                        
                        URL.revokeObjectURL(imageData);
                        setMockDatabaseImage(null);
                        return true;
                    }}
                />
            </Section>
        </Main>
    )
}
