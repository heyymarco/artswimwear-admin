'use client'

// react:
import {
    // react:
    default as React, useRef, useState,
}                           from 'react'

import { UploadImage } from '@/components/editors/UploadImage'
import { Section, Main } from '@heymarco/section'
import GalleryEditor from '@/components/editors/GalleryEditor';
import {
    useDraggable,
    useDroppable,
} from '@/components/DragNDrop'
import { Basic } from '@reusable-ui/components';



const DraggableComponent = () => {
    const {
        isDragging,
        handleMouseDown,
        handleTouchStart,
    } = useDraggable({
        dragData : 123,
        onDragHandshake(dropData) {
            return true;
        },
        onDragged(dropData) {
            //
        },
        dragComponent : <Basic theme='warning'>Dragging...</Basic>,
    });
    return (
        <Basic
            theme='danger'
            outlined={isDragging !== undefined}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            Drag Me!
            <Basic theme='warning'>
                Child
            </Basic>
        </Basic>
    );
}
const DroppableComponent = () => {
    const dropRef = useRef<HTMLButtonElement|null>(null);
    const {
        isDropping,
    } = useDroppable({
        dropData : 456,
        dropRef  : dropRef,
        onDropHandshake(dragData) {
            return true;
        },
        onDropped(dragData) {
            //
        },
    });
    return (
        <Basic
            elmRef={dropRef}
            theme='danger'
            outlined={isDropping !== undefined}
        >
            Drop Me!
            <Basic theme='warning'>
                Child
            </Basic>
        </Basic>
    );
}



export default function DashboardPage() {
    const [mockDatabaseImage, setMockDatabaseImage] = useState<string|null>(null);
    
    return (
        <Main nude={true}>
            <Section title='Dashboard'>
                <p>
                    Coming soon: analitic data &amp; store summary goes here.
                </p>
                <div style={{
                    display: 'grid',
                    gridAutoFlow: 'column',
                    justifyItems: 'center',
                    alignItems: 'center',
                    gap: '3rem',
                    padding: '1rem',
                }}>
                    <DraggableComponent />
                    <DroppableComponent />
                </div>
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
