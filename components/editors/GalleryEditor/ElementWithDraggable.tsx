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
export interface ElementWithDraggableProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<React.HTMLAttributes<TElement>,
            // draggable:
            |'draggable'   // already implemented internally
            |'onDragStart' // already implemented internally
            |'onDragEnd'   // already implemented internally
            
            
            
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
        
        
        
        // components:
        elementComponent,
    ...restElementProps} = props;
    
    
    
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
        },
    );
};
export {
    ElementWithDraggable,
    ElementWithDraggable as default,
}
