'use client'

// react:
import {
    // react:
    default as React, useRef, useState,
}                           from 'react'

import { Section, Main } from '@heymarco/section'
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
            </Section>
        </Main>
    )
}
