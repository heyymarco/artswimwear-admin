// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useMemo,
    useEffect,
}                           from 'react'

// internals:
import {
    DroppableHook,
    registerDroppableHook,
    unregisterDroppableHook,
}                           from './utilities'



export interface DroppableProps<TElement extends Element = HTMLElement> {
    // data:
    dropData         : unknown
    
    
    
    // refs:
    dropRef          : React.RefObject<TElement>|TElement|null // getter ref
    
    
    
    // states:
    enabled         ?: boolean
    
    
    
    // handlers:
    onDropHandshake  : (dragData: unknown) => boolean|Promise<boolean>
    onDropped        : (dragData: unknown) => void
}
export interface DroppableApi {
    // states:
    /**
     * undefined : no  dropping activity on this dropping target.  
     * false     : has dropping activity on this dropping target but the target refuses to be dropped.  
     * true      : has dropping activity on this dropping target and the target wants   to be dropped.  
     */
    isDropping       : undefined|boolean
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
    const [isDropping, setIsDropping] = useState<undefined|boolean>(undefined);
    
    
    
    // hooks:
    const droppableHook = useMemo((): DroppableHook|undefined => {
        // conditions:
        if (!enabled) return undefined;
        
        
        
        // result:
        return new DroppableHook(
            dropData,
            onDropHandshake,
            onDropped,
            setIsDropping,
        );
    }, [
        enabled,
        
        dropData,
        onDropHandshake,
        onDropped,
    ]);
    
    
    
    // effects:
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
    
    
    
    // api:
    return {
        // states:
        isDropping,
    };
};
