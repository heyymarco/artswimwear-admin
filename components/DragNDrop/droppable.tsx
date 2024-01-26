// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useMemo,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    EventHandler,
    useMergeEvents,
    useScheduleTriggerEvent,
    useMountedFlag,
    
    
    
    // an accessibility management system:
    AccessibilityProvider,
    
    
    
    // a validation management system:
    ValidationProvider,
    
    
    
    // a capability of UI to stack on top-most of another UI(s) regardless of DOM's stacking context:
    GlobalStackableProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internals:
import {
    DroppableHook,
}                           from './utilities'



export interface DroppableProps<TElement extends Element = HTMLElement> {
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
     * undefined : no  dropping activity.  
     * null      : has dropping activity but outside this dropping target.  
     * false     : has dropping activity on this dropping target but the target refuses to be dropped.  
     * true      : has dropping activity on this dropping target and the target wants   to be dropped.  
     */
    isDropping       : undefined|null|boolean
}
export const useDroppable = <TElement extends Element = HTMLElement>(props: DroppableProps<TElement>): DroppableApi => {
    // props:
    const {
        // states:
        enabled = true,
        
        
        
        // handlers:
        onDropHandshake,
        onDropped,
    } = props;
    
    
    
    // states:
    const isMounted = useMountedFlag();
    const [isDropping, setIsDropping] = useState<undefined|null|boolean>(undefined);
    
    
    
    // hooks:
    const droppableHook = useMemo((): DroppableHook => {
        return new DroppableHook(
            onDropHandshake,
            onDropped,
        );
    }, []);
    
    
    
    // api:
    return {
        // states:
        isDropping,
    };
};
