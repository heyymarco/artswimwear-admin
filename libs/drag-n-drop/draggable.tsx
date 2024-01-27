// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useMountedFlag,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import type {
    // react components:
    GenericProps,
}                           from '@reusable-ui/generic'         // a base component

// internals:
import {
    usePointerCapture,
}                           from '@/libs/pointer-capture'
import type {
    DragNDropData,
}                           from './types'
import {
    attachDroppableHook,
    detachDroppableHook,
}                           from './utilities'



export interface DraggableProps<TElement extends Element = HTMLElement> {
    // data:
    dragData         : DragNDropData
    
    
    
    // states:
    enabled         ?: boolean
    
    
    
    // components:
    dragComponent    : React.ReactComponentElement<any, GenericProps<TElement>>
    
    
    
    // handlers:
    onDragHandshake  : (dropData: DragNDropData) => boolean|Promise<boolean>
    onDragged       ?: (dropData: DragNDropData) => void
}
export interface DraggableApi<TElement extends Element = HTMLElement> {
    // states:
    /**
     * undefined : no  dragging activity.  
     * null      : has dragging activity but outside all dropping targets.  
     * false     : has dragging activity on a dropping target but the source/target refuses to be dragged/dropped.  
     * true      : has dragging activity on a dropping target and the source/target wants   to be dragged/dropped.  
     */
    isDragging       : undefined|null|boolean
    
    
    
    // handlers:
    handleMouseDown  : React.MouseEventHandler<TElement>
    handleTouchStart : React.TouchEventHandler<TElement>
}
export const useDraggable = <TElement extends Element = HTMLElement>(props: DraggableProps<TElement>): DraggableApi<TElement> => {
    // props:
    const {
        // data:
        dragData,
        
        
        
        // states:
        enabled = true,
        
        
        
        // handlers:
        onDragHandshake,
        onDragged,
    } = props;
    
    
    
    // states:
    const isMounted = useMountedFlag();
    const [isDragging, setIsDragging] = useState<undefined|null|boolean>(undefined);
    const pointerPositionRef          = useRef<{x: number, y: number}>({x: 0, y: 0});
    
    
    
    // capabilities:
    const {
        // handlers:
        handleMouseDown,
        handleTouchStart,
    } = usePointerCapture<TElement>({
        enabled,
        onPointerCaptureEnd() {
            const prevActiveDroppableHook = detachDroppableHook(); // no  dropping activity
            setIsDragging(undefined);                              // no  dragging activity
            
            
            
            if (isDragging === true) { // if was a valid dragging => now is dragged/dropped
                if (prevActiveDroppableHook?.isMounted) {
                    onDragged?.(prevActiveDroppableHook.dropData);
                    prevActiveDroppableHook.onDropped?.(dragData);
                } // if
            } // if
        },
        async onPointerCaptureMove(clientX, clientY) {
            // update pointer pos:
            pointerPositionRef.current = { x: clientX, y: clientY };
            
            
            
            // update drag & drop states:
            const droppableHookResult = await attachDroppableHook(document.elementsFromPoint(clientX, clientY), onDragHandshake, dragData);
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            /*
            * undefined : NEVER HERE.  
            * null      : has dragging activity but outside all dropping targets.  
            * false     : has dragging activity on a dropping target but the source/target refuses to be dragged/dropped.  
            * true      : has dragging activity on a dropping target and the source/target wants   to be dragged/dropped.  
            */
            setIsDragging(droppableHookResult);
        },
    });
    
    
    
    // api:
    return {
        // states:
        isDragging,
        
        
        
        // handlers:
        handleMouseDown,
        handleTouchStart,
    };
};
