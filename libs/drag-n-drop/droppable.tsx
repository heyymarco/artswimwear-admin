// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useMemo,
    useEffect,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internals:
import type {
    DragNDropData,
}                           from './types'
import {
    DroppableHook,
    
    
    
    registerDroppableHook,
    unregisterDroppableHook,
}                           from './interfaces'



export interface DroppableProps<TElement extends Element = HTMLElement> {
    // data:
    dropData         : DragNDropData
    
    
    
    // refs:
    dropRef          : React.RefObject<TElement>|TElement|null // getter ref
    
    
    
    // states:
    enabled         ?: boolean
    
    
    
    // handlers:
    onDropHandshake  : (dragData: DragNDropData) => undefined|boolean|Promise<undefined|boolean>
    onDropped       ?: (dragData: DragNDropData) => void
}
export interface DroppableApi {
    // data:
    dragData         : DragNDropData|undefined
    
    
    
    // states:
    /**
     * undefined : no  dropping activity.  
     * null      : has dropping activity but outside this dropping target.  
     * false     : has dropping activity on this dropping target but the source/target refuses to be dragged/dropped.  
     * true      : has dropping activity on this dropping target and the source/target wants   to be dragged/dropped.  
     */
    isDropping       : undefined|null|boolean
}
export const useDroppable = <TElement extends Element = HTMLElement>(props: DroppableProps<TElement>): DroppableApi => {
    // props:
    const {
        // data:
        dropData,
        
        
        
        // refs:
        dropRef,
        
        
        
        // states:
        enabled = true,
        
        
        
        // handlers:
        onDropHandshake,
        onDropped,
    } = props;
    
    
    
    // states:
    const [isDropping, setIsDropping] = useState<undefined|null|boolean>(undefined);
    const [dragData  , setDragData  ] = useState<DragNDropData|undefined>(undefined);
    
    
    
    // handlers:
    const handleDropHandshake = useEvent<typeof onDropHandshake>(async (newDragData) => {
        try {
            return await onDropHandshake(newDragData);
        }
        finally {
            if (!Object.is(dragData, newDragData)) setDragData(newDragData);
        } // try
    });
    
    
    
    // hooks:
    const droppableHook = useMemo((): DroppableHook|undefined => {
        // conditions:
        if (!enabled) return undefined;
        
        
        
        // result:
        return new DroppableHook(
            dropData,
            handleDropHandshake, // stable ref
            onDropped,
            setIsDropping,
        );
    }, [
        enabled,
        
        dropData,
        // handleDropHandshake, // stable ref
        onDropped,
    ]);
    
    
    
    // effects:
    
    // register/unregister DroppableHook:
    useEffect(() => {
        // conditions:
        const dropElm = (dropRef instanceof Element) ? dropRef : dropRef?.current;
        if (!dropElm) return; // no element for droppable => ignore
        if (!droppableHook) return; // droppableHook is disabled => ignore
        
        
        
        // setups:
        registerDroppableHook(dropElm, droppableHook);
        
        
        
        // cleanups:
        return () => {
            unregisterDroppableHook(dropElm);
        };
    }, [dropRef, droppableHook]);
    
    // clean up unused dragData after no dropping activity:
    useEffect(() => {
        // conditions:
        if (isDropping !== undefined) return; // only interested on no_dropping_activity
        
        
        
        // actions:
        setDragData(undefined);
    }, [isDropping]);
    
    
    
    // api:
    return {
        // data:
        dragData,
        
        
        
        // states:
        isDropping,
    };
};
