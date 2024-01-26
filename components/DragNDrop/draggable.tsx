// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
    useEffect,
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

// reusable-ui components:
import type {
    // react components:
    GenericProps,
}                           from '@reusable-ui/generic'         // a base component

// internals:
import {
    DroppableHook,
    findDroppableHook,
}                           from './utilities'



export interface DraggableProps<TElement extends Element = HTMLElement> {
    // data:
    dragData         : unknown
    
    
    
    // states:
    enabled         ?: boolean
    
    
    
    // components:
    dragComponent    : React.ReactComponentElement<any, GenericProps<TElement>>
    
    
    
    // handlers:
    onDragHandshake  : (dropData: unknown) => boolean|Promise<boolean>
    onDragged        : (dropData: unknown) => void
}
export interface DraggableApi<TElement extends Element = HTMLElement> {
    // states:
    /**
     * undefined : no  dragging activity.  
     * null      : has dragging activity but outside all dropping targets.  
     * false     : has dragging activity on a dropping target but the target refuses to be dropped.  
     * true      : has dragging activity on a dropping target and the target wants   to be dropped.  
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
    const activeDroppable             = useRef<DroppableHook|null>(null);
    
    
    
    // handlers:
    const isMouseActive           = useRef<boolean>(false);
    const handleMouseStatusNative = useEvent<EventHandler<MouseEvent>>((event) => {
        // actions:
        isMouseActive.current = enabled && (
            (event.buttons === 1) // only left button pressed, ignore multi button pressed
        );
        
        if (
            (!isMouseActive.current && !isTouchActive.current) // both mouse & touch are inactive
            ||
            ( isMouseActive.current &&  isTouchActive.current) // both mouse & touch are active
        ) {
            setIsDragging(undefined);                          // no  dragging activity
            activeDroppable.current?.setIsDropping(undefined); // no  dropping activity on this dropping target
            activeDroppable.current = null;                    // no longer active => forget
            watchGlobalPointer(false);                         // unwatch global mouse/touch move
        } // if
    });
    const handleMouseActive       = useEvent<React.MouseEventHandler<TElement>>((event) => {
        handleMouseStatusNative(event.nativeEvent);
    });
    
    const isTouchActive           = useRef<boolean>(false);
    const handleTouchStatusNative = useEvent<EventHandler<TouchEvent>>((event) => {
        // actions:
        isTouchActive.current = enabled && (
            (event.touches.length === 1) // only single touch
        );
        
        if (
            (!isMouseActive.current && !isTouchActive.current) // both mouse & touch are inactive
            ||
            ( isMouseActive.current &&  isTouchActive.current) // both mouse & touch are active
        ) {
            setIsDragging(undefined);                          // no  dragging activity
            activeDroppable.current?.setIsDropping(undefined); // no  dropping activity on this dropping target
            activeDroppable.current = null;                    // no longer active => forget
            watchGlobalPointer(false);                         // unwatch global mouse/touch move
        } // if
    });
    const handleTouchActive       = useEvent<React.TouchEventHandler<TElement>>((event) => {
        handleTouchStatusNative(event.nativeEvent);
    });
    
    const handleMouseMoveNative   = useEvent<EventHandler<MouseEvent>>(async (event) => {
        // conditions:
        // one of the mouse or touch is active but not both are active:
        if (
            (!isMouseActive.current && !isTouchActive.current) // both mouse & touch are inactive
            ||
            ( isMouseActive.current &&  isTouchActive.current) // both mouse & touch are active
        ) return;
        
        
        
        watchGlobalPointer(true); // watch global mouse/touch move
        
        
        
        // update pointer pos:
        pointerPositionRef.current = { x: event.clientX, y: event.clientY };
        
        
        
        // update drag & drop states:
        const droppableHook = findDroppableHook(document.elementsFromPoint(event.clientX, event.clientY));
        if (!droppableHook) {
            setIsDragging(null);                               // has dragging activity but outside all dropping targets
            activeDroppable.current?.setIsDropping(undefined); // no  dropping activity on this dropping target
            activeDroppable.current = null;                    // no longer active => forget
            return;
        } // if
        
        
        
        activeDroppable.current = droppableHook;               // remember the active droppable
        
        
        
        if (!(await onDragHandshake(droppableHook.dropData)) || !(await droppableHook.onDropHandshake(dragData))) {
            setIsDragging(false);                              // has dragging activity on a dropping target but the target refuses to be dropped
            droppableHook.setIsDropping(false);                // has dropping activity on this dropping target but the target refuses to be dropped
            return;
        } // if
        
        
        
        setIsDragging(true);                                   // has dragging activity on a dropping target and the target wants   to be dropped
        droppableHook.setIsDropping(true);                     // has dropping activity on this dropping target and the target wants   to be dropped
    });
    const handleTouchMoveNative   = useEvent<EventHandler<TouchEvent>>((event) => {
        // conditions:
        if (event.touches.length !== 1) return; // only single touch
        
        
        
        // simulates the TouchMove as MouseMove:
        handleMouseMoveNative({
            ...event,
            clientX : event.touches[0].clientX,
            clientY : event.touches[0].clientY,
            buttons : 1, // primary button (usually the left button)
        } as unknown as MouseEvent);
    });
    
    const handleMouseSlide        = useEvent<React.MouseEventHandler<TElement>>((event) => {
        // simulates the Slide as *unmove* Move:
        handleMouseMoveNative(event.nativeEvent);
    });
    const handleTouchSlide        = useEvent<React.TouchEventHandler<TElement>>((event) => {
        // simulates the Slide as *unmove* Move:
        handleTouchMoveNative(event.nativeEvent);
    });
    
    const handleMouseDown         = useEvent<React.MouseEventHandler<TElement>>((event) => {
        handleMouseActive(event); // update the mouse active status
        handleMouseSlide(event);  // update the mouse position
    });
    const handleTouchStart        = useEvent<React.TouchEventHandler<TElement>>((event) => {
        handleTouchActive(event); // update the touch active status
        handleTouchSlide(event);  // update the touch position
    });
    
    
    
    // global handlers:
    const watchGlobalPointerStatusRef = useRef<undefined|(() => void)>(undefined);
    const watchGlobalPointer          = useEvent((active: boolean): void => {
        // conditions:
        const shouldActive = active && enabled; // control is disabled or readOnly => no response required
        if (!!watchGlobalPointerStatusRef.current === shouldActive) return; // already activated|deactivated => nothing to do
        
        
        
        // actions:
        if (shouldActive) {
            // setups:
            const passiveOption : AddEventListenerOptions = { passive: true };
            
            const currentHandleMouseMoveNative   = handleMouseMoveNative;
            const currentHandleTouchMoveNative   = handleTouchMoveNative;
            const currentHandleMouseStatusNative = handleMouseStatusNative;
            const currentHandleTouchStatusNative = handleTouchStatusNative;
            
            window.addEventListener('mousemove'  , currentHandleMouseMoveNative   , passiveOption); // activating event
            window.addEventListener('touchmove'  , currentHandleTouchMoveNative   , passiveOption); // activating event
            
            window.addEventListener('mouseup'    , currentHandleMouseStatusNative , passiveOption); // deactivating event
            window.addEventListener('touchend'   , currentHandleTouchStatusNative , passiveOption); // deactivating event
            window.addEventListener('touchcancel', currentHandleTouchStatusNative , passiveOption); // deactivating event
            
            
            
            // cleanups later:
            watchGlobalPointerStatusRef.current = () => {
                window.removeEventListener('mousemove'  , currentHandleMouseMoveNative  ); // activating event
                window.removeEventListener('touchmove'  , currentHandleTouchMoveNative  ); // activating event
                
                window.removeEventListener('mouseup'    , currentHandleMouseStatusNative); // deactivating event
                window.removeEventListener('touchend'   , currentHandleTouchStatusNative); // deactivating event
                window.removeEventListener('touchcancel', currentHandleTouchStatusNative); // deactivating event
            };
        }
        else {
            // cleanups:
            watchGlobalPointerStatusRef.current?.();
            watchGlobalPointerStatusRef.current = undefined;
        } // if
    });
    
    
    
    // effects:
    useEffect(() => {
        // conditions:
        if (enabled) return; // control is enabled and mutable => no reset required
        
        
        
        // resets:
        isMouseActive.current = false; // unmark as pressed
        isTouchActive.current = false; // unmark as touched
        watchGlobalPointer(false);     // unwatch global mouse/touch move
    }, [enabled]);
    
    
    
    // api:
    return {
        // states:
        isDragging,
        
        
        
        // handlers:
        handleMouseDown,
        handleTouchStart,
    };
};
