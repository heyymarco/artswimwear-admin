// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// react components:
export interface ElementWithDraggableProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<React.HTMLAttributes<TElement>,
            // draggable:
            |'draggable'   // already implemented internally
            |'onDragStart' // already implemented internally
            |'onDragEnd'   // already implemented internally
            
            
            
            // droppable:
            |'onDragEnter' // already implemented internally
            |'onDragOver'  // already implemented internally
            |'onDragLeave' // already implemented internally
            |'onDrop'      // already implemented internally
            
            
            
            // children:
            |'children' // no nested children
        >
{
    // positions:
    itemIndex        : number
    
    
    
    // draggable:
    dragDataType     : string
    onDragStart     ?: (itemIndex: number) => void
    onDragEnd       ?: (itemIndex: number) => void
    
    
    
    // droppable:
    onDragEnter     ?: (itemIndex: number) => void
    onDragOver      ?: (itemIndex: number) => void
    onDragLeave     ?: (itemIndex: number) => void
    onDrop          ?: (itemIndex: number) => void
    
    
    
    // components:
    /**
     * Required.  
     *   
     * The underlying `<Element>` to be draggable.
     */
    elementComponent : React.ReactComponentElement<any, React.HTMLAttributes<TElement>>
}
const ElementWithDraggable = <TElement extends Element = HTMLElement>(props: ElementWithDraggableProps<TElement>): JSX.Element|null => {
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
        elementComponent,
    ...restElementProps} = props;
    
    
    
    // states:
    const dragEnterCounter = useRef<number>(0);
    
    
    
    // draggable handlers:
    const handleDragStart   = useEvent<React.DragEventHandler<TElement>>((event) => {
        // events:
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.clearData();
        event.dataTransfer.setData(dragDataType, ''); // we don't store the data here, just for marking purpose
        
        const dragImageElm = event.currentTarget.children?.[0] ?? event.currentTarget;
        const { width: dragImageWidth, height: dragImageHeight } = getComputedStyle(dragImageElm);
        event.dataTransfer.setDragImage(dragImageElm, Number.parseFloat(dragImageWidth) / 2, Number.parseFloat(dragImageHeight) / 2);
        
        
        
        // callback:
        onDragStart?.(itemIndex);                     // rather, we store the data at the <parent>'s state
    });
    const handleDragEnd     = useEvent<React.DragEventHandler<TElement>>((event) => {
        // callback:
        onDragEnd?.(itemIndex);
    });
    
    
    
    // droppable handlers:
    const handleDragEnter   = useEvent<React.DragEventHandler<TElement>>((event) => {
        // conditions:
        const isValidDragObject = event.dataTransfer.types.includes(dragDataType);
        if (!isValidDragObject) return; // unknown drag object => ignore
        
        
        
        // callback:
        dragEnterCounter.current++;
        if (dragEnterCounter.current === 1) onDragEnter?.(itemIndex);
    });
    const handleDragOver    = useEvent<React.DragEventHandler<TElement>>((event) => {
        // conditions:
        const isValidDragObject = event.dataTransfer.types.includes(dragDataType);
        if (!isValidDragObject) return; // unknown drag object => ignore
        
        
        
        // events:
        event.dataTransfer.dropEffect = 'move';
        event.preventDefault(); // prevents the default behavior to *disallow* for dropping here
        
        
        
        // callback:
        onDragOver?.(itemIndex);
    });
    const handleDragLeave   = useEvent<React.DragEventHandler<TElement>>((event) => {
        // callback:
        if (dragEnterCounter.current >= 1) {
            dragEnterCounter.current--;
            if (dragEnterCounter.current === 0) onDragLeave?.(itemIndex);
        } // if
    });
    const handleDrop        = useEvent<React.DragEventHandler<TElement>>((event) => {
        // conditions:
        const isValidDragObject = event.dataTransfer.types.includes(dragDataType);
        if (!isValidDragObject) return; // unknown drag object => ignore
        
        
        
        // events:
        event.preventDefault();
        event.stopPropagation(); // do not bubble event to the <parent>
        
        
        
        // callback:
        if (dragEnterCounter.current >= 1) {
            dragEnterCounter.current = 0;
            onDragLeave?.(itemIndex);
        } // if
        onDrop?.(itemIndex);
    });
    
    
    
    // jsx:
    /* <Element> */
    return React.cloneElement<React.HTMLAttributes<TElement>>(elementComponent,
        // props:
        {
            // other props:
            ...restElementProps,
            ...elementComponent.props, // overwrites restElementProps (if any conflics)
            
            
            
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
    ElementWithDraggable,
    ElementWithDraggable as default,
}
