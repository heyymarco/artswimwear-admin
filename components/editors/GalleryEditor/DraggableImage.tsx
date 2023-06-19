// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// react components:
export interface DraggableImageProps
    extends
        // bases:
        Omit<React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
            // draggable:
            |'draggable'   // already implemented internally
            |'onDragStart' // already implemented internally
            |'onDragEnd'   // already implemented internally
            
            
            
            // droppable:
            |'onDragEnter' // already implemented internally
            |'onDragOver'  // already implemented internally
            |'onDragLeave' // already implemented internally
            |'onDrop'      // already implemented internally
        >
{
    // positions:
    itemIndex      : number
    
    
    
    // draggable:
    dragDataType   : string
    onDragStart   ?: (itemIndex: number) => void
    onDragEnd     ?: (itemIndex: number) => void
    
    
    
    // droppable:
    onDragEnter   ?: (itemIndex: number) => void
    onDragOver    ?: (itemIndex: number) => void
    onDragLeave   ?: (itemIndex: number) => void
    onDrop        ?: (itemIndex: number) => void
    
    
    
    // components:
    imageComponent : React.ReactComponentElement<any, React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>>
}
const DraggableImage = (props: DraggableImageProps) => {
    // rest props:
    const {
        // positions:
        itemIndex,
        
        
        
        // draggable:
        dragDataType,
        onDragStart,
        onDragEnd,
        
        
        
        // droppable:
        onDragEnter,
        onDragOver,
        onDragLeave,
        onDrop,
        
        
        
        // components:
        imageComponent,
    ...restImageProps} = props;
    
    
    
    // draggable handlers:
    const handleDragStart = useEvent<React.DragEventHandler<HTMLElement>>((event) => {
        // events:
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData(dragDataType, ''); // we don't store the data here, just for marking purpose
        
        const dragImageElm = event.currentTarget.children?.[0] ?? event.currentTarget;
        const { width: dragImageWidth, height: dragImageHeight } = getComputedStyle(dragImageElm);
        event.dataTransfer.setDragImage(dragImageElm, Number.parseFloat(dragImageWidth) / 2, Number.parseFloat(dragImageHeight) / 2);
        
        
        
        // callback:
        onDragStart?.(itemIndex);                     // rather, we store the data at the <parent>'s state
    });
    const handleDragEnd   = useEvent<React.DragEventHandler<HTMLElement>>((event) => {
        // callback:
        onDragEnd?.(itemIndex);
    });
    
    
    
    // droppable handlers:
    const handleDragEnter   = useEvent<React.DragEventHandler<HTMLElement>>((event) => {
        // conditions:
        const isValidDragObject = event.dataTransfer.types.includes(dragDataType);
        if (!isValidDragObject) return; // unknown drag object => ignore
        
        
        
        // callback:
        onDragEnter?.(itemIndex);
    });
    const handleDragOver   = useEvent<React.DragEventHandler<HTMLElement>>((event) => {
        // conditions:
        const isValidDragObject = event.dataTransfer.types.includes(dragDataType);
        if (!isValidDragObject) return; // unknown drag object => ignore
        
        
        
        // events:
        event.preventDefault(); // prevents the default behavior to *disallow* for dropping here
        
        
        
        // callback:
        onDragOver?.(itemIndex);
    });
    const handleDragLeave   = useEvent<React.DragEventHandler<HTMLElement>>((event) => {
        // callback:
        onDragLeave?.(itemIndex);
    });
    const handleDrop   = useEvent<React.DragEventHandler<HTMLElement>>((event) => {
        // conditions:
        const isValidDragObject = event.dataTransfer.types.includes(dragDataType);
        if (!isValidDragObject) return; // unknown drag object => ignore
        
        
        
        // events:
        event.preventDefault();
        event.stopPropagation(); // do not bubble event to the <parent>
        
        
        
        // callback:
        onDrop?.(itemIndex);
    });
    
    
    
    // jsx:
    /* <Image> */
    return React.cloneElement<React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>>(imageComponent,
        // props:
        {
            // other props:
            ...restImageProps,
            ...imageComponent.props, // overwrites restImageProps (if any conflics)
            
            
            
            // draggable:
            draggable   : true,
            onDragStart : handleDragStart,
            onDragEnd   : handleDragEnd,
            
            
            
            // droppable:
            onDragEnter : handleDragEnter,
            onDragOver  : handleDragOver,
            onDragLeave : handleDragLeave,
            onDrop      : handleDrop,
        },
    );
};
export {
    DraggableImage,
    DraggableImage as default,
}
