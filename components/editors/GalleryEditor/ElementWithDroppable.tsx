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
    useMergeClasses,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    GenericProps,
}                           from '@reusable-ui/components'

// internals:
import type {
    // react components:
    ElementWithDraggableProps,
}                           from './ElementWithDraggable'



// react components:
export interface ElementWithDroppableProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<GenericProps<TElement>,
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
    draggedItemIndex : number
    droppedItemIndex : number
    
    
    
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
    elementComponent : React.ReactComponentElement<any, GenericProps<TElement>>
}
const ElementWithDroppable = <TElement extends Element = HTMLElement>(props: ElementWithDroppableProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // positions:
        itemIndex,
        draggedItemIndex,
        droppedItemIndex,
        
        
        
        // draggable:
        dragDataType,
        
        
        
        // droppable:
        onDragEnter,
        onDragOver,
        onDragLeave,
        onDrop,
        
        
        
        // components:
        elementComponent,
    ...restGenericProps} = props;
    
    
    
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
    
    
    
    // states:
    const droppedStateClass = ((): string|null => {
        // dropped item:
        if (itemIndex === droppedItemIndex) return 'dropped';
        
        
        
        // shifted item(s):
        if ((draggedItemIndex !== -1) && (droppedItemIndex !== -1)) {
            if (draggedItemIndex < droppedItemIndex) {
                if ((itemIndex >= draggedItemIndex) && (itemIndex <= droppedItemIndex)) return 'shiftedDown';
            }
            else if (draggedItemIndex > droppedItemIndex) {
                if ((itemIndex <= draggedItemIndex) && (itemIndex >= droppedItemIndex)) return 'shiftedUp';
            } // if
        } // if
        
        
        
        // dragged item:
        if ((draggedItemIndex !== -1) && (itemIndex === draggedItemIndex)) return 'dragged';
        
        
        
        // dropping target:
        if ((draggedItemIndex !== -1) && (itemIndex !== draggedItemIndex)) return 'dropTarget';
        
        
        
        // unmoved item(s):
        return null;
    })();
    
    
    
    // classes:
    const stateClasses = useMergeClasses(
        // preserves the original `stateClasses` from `elementComponent`:
        elementComponent.props.stateClasses,
        
        
        
        // preserves the original `stateClasses` from `props`:
        props.stateClasses,
        
        
        
        // states:
        droppedStateClass,
    );
    
    
    
    // jsx:
    /* <Element> */
    return React.cloneElement<GenericProps<TElement>>(elementComponent,
        // props:
        {
            // other props:
            ...restGenericProps,
            ...elementComponent.props, // overwrites restGenericProps (if any conflics)
            
            
            
            // classes:
            stateClasses : stateClasses,
            
            
            
            // droppable:
            onDragEnter  : handleDragEnter,
            onDragOver   : handleDragOver,
            onDragLeave  : handleDragLeave,
            onDrop       : handleDrop,
        },
    );
};
export {
    ElementWithDroppable,
    ElementWithDroppable as default,
}
