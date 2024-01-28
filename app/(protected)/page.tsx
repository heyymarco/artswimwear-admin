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
    DragNDropData,
    DraggableProps,
    DroppableProps,
    useDraggable,
    useDroppable,
} from '@/libs/drag-n-drop'
import { Basic } from '@reusable-ui/components';



interface DraggableComponentProps {
    text            : React.ReactNode
    dragData        : DragNDropData
    onDragHandshake : DraggableProps['onDragHandshake']
}
const DraggableComponent = (props: DraggableComponentProps) => {
    const {
        dropData,
        isDragging,
        handleMouseDown,
        handleTouchStart,
        DragOverlay,
    } = useDraggable({
        dragData : props.dragData,
        onDragHandshake : props.onDragHandshake,
        onDragged(dropData) {
            console.log('onDragged: ', dropData);
        },
        dragComponent : () => <Basic theme='warning'>
            {(() => {
                switch (isDragging) {
                    case null  : return 'Drop me on droppable area.';
                    case true  : return 'Yes, drop here.';
                    case false : return "Noo, don't drop here.";
                    default    : return '';
                } // switch
            })()}
        </Basic>,
    });
    
    return (
        <>
            <Basic
                theme='danger'
                outlined={isDragging !== undefined}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                {props.text}
                <Basic theme='warning'>
                    {`${dropData?.data ?? '--no-data--'}`}
                </Basic>
            </Basic>
            <DragOverlay />
        </>
    );
}

interface DroppableComponentProps {
    text            : React.ReactNode
    dropData        : DragNDropData
    onDropHandshake : DroppableProps['onDropHandshake']
}
const DroppableComponent = (props: DroppableComponentProps) => {
    const dropRef = useRef<HTMLButtonElement|null>(null);
    const {
        dragData,
        isDropping,
    } = useDroppable({
        dropData : props.dropData,
        dropRef  : dropRef,
        onDropHandshake: props.onDropHandshake,
        onDropped(dragData) {
            console.log('onDropped: ', dragData);
        },
    });
    return (
        <Basic
            elmRef={dropRef}
            theme='danger'
            outlined={!!isDropping}
        >
            {props.text}
            <Basic theme='warning'>
                {`${dragData?.data ?? '--no-data--'}`}
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
                    <DraggableComponent text='Drag Universal' dragData={{type: 'drag/universal', data: 123}}       onDragHandshake={(dropData) => true} />
                    <DraggableComponent text='Drag Specific'  dragData={{type: 'drag/specific',  data: 'abc-333'}} onDragHandshake={(dropData) => dropData.type === 'drop/specific'} />
                    
                    <DroppableComponent text='Drop Universal' dropData={{type: 'drop/universal', data: 456}}       onDropHandshake={(dragData) => true} />
                    <DroppableComponent text='Drop Specific'  dropData={{type: 'drop/specific',  data: 'def-666'}} onDropHandshake={(dragData) => dragData.type === 'drag/specific'} />
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
