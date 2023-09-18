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

// internals:
import type {
    // react components:
    ElementWithDraggableProps,
}                           from './ElementWithDraggable'



// react components:
export interface ElementWithDroppableProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<React.HTMLAttributes<TElement>,
            // droppable:
            |'onDragEnter' // already implemented internally
            |'onDragOver'  // already implemented internally
            |'onDragLeave' // already implemented internally
            |'onDrop'      // already implemented internally
            
            
            
            // children:
            |'children' // no nested children
        >,
        // draggable:
        Pick<ElementWithDraggableProps<TElement>,
            // draggable:
            |'dragDataType'
        >
{
    // positions:
    itemIndex        : number
    
    
    
    // droppable:
    onDragEnter     ?: (itemIndex: number) => void
    onDragOver      ?: (itemIndex: number) => void
    onDragLeave     ?: (itemIndex: number) => void
    onDrop          ?: (itemIndex: number) => void
    
    
    
    // components:
    /**
     * Required.  
     *   
     * The underlying `<Element>` to be droppable.
     */
    elementComponent : React.ReactComponentElement<any, React.HTMLAttributes<TElement>>
}
const ElementWithDroppable = <TElement extends Element = HTMLElement>(props: ElementWithDroppableProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // positions:
        itemIndex,
        
        
        
        // draggable:
        dragDataType,
        
        
        
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
            
            
            
            // droppable:
            onDragEnter : handleDragEnter,
            onDragOver  : handleDragOver,
            onDragLeave : handleDragLeave,
            onDrop      : handleDrop,
        },
    );
};
export {
    ElementWithDroppable,
    ElementWithDroppable as default,
}
