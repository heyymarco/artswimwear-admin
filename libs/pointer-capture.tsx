// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useEffect,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



export interface PointerCaptureProps {
    // states:
    enabled ?: boolean
    
    
    
    // handlers:
    onPointerCaptureStart ?: () => void
    onPointerCaptureEnd   ?: () => void
    onPointerCaptureMove   : (clientX: number, clientY: number) => void
}
export interface PointerCaptureApi<TElement extends Element = HTMLElement> {
    // handlers:
    handleMouseDown  : React.MouseEventHandler<TElement>
    handleTouchStart : React.TouchEventHandler<TElement>
}
export const usePointerCapture = <TElement extends Element = HTMLElement>(props: PointerCaptureProps): PointerCaptureApi<TElement> => {
    // props:
    const {
        // states:
        enabled = true,
        
        
        
        // handlers:
        onPointerCaptureStart,
        onPointerCaptureEnd,
        onPointerCaptureMove,
    } = props;
    
    
    
    
    // handlers:
    const isMouseActive           = useRef<boolean>(false);
    const isTouchActive           = useRef<boolean>(false);
    const handlePointerStatus     = useEvent((): void => {
        // actions:
        if (
            (!isMouseActive.current && !isTouchActive.current) // both mouse & touch are inactive
            ||
            ( isMouseActive.current &&  isTouchActive.current) // both mouse & touch are active
        ) {
            if (watchGlobalPointer(false) === false) { // unwatch global mouse/touch move
                onPointerCaptureEnd?.();
            } // if
        } // if
    });
    const handleMouseStatusNative = useEvent<EventHandler<MouseEvent>>((event) => {
        // actions:
        isMouseActive.current = enabled && (
            (event.buttons === 1) // only left button pressed, ignore multi button pressed
        );
        handlePointerStatus(); // update pointer status
    });
    const handleMouseActive       = useEvent<React.MouseEventHandler<TElement>>((event) => {
        handleMouseStatusNative(event.nativeEvent);
    });
    const handleTouchStatusNative = useEvent<EventHandler<TouchEvent>>((event) => {
        // actions:
        isTouchActive.current = enabled && (
            (event.touches.length === 1) // only single touch
        );
        handlePointerStatus(); // update pointer status
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
        
        
        
        if (watchGlobalPointer(true) === true){ // watch global mouse/touch move
            onPointerCaptureStart?.();
        } // if
        
        
        
        onPointerCaptureMove(event.clientX, event.clientY);
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
        // conditions:
        if (event.defaultPrevented) return; // already handled => ignore
        event.preventDefault(); // now we handled the event
        
        
        
        handleMouseActive(event); // update the mouse active status
        handleMouseSlide(event);  // update the mouse position
    });
    const handleTouchStart        = useEvent<React.TouchEventHandler<TElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // already handled => ignore
        event.preventDefault(); // now we handled the event
        
        
        
        handleTouchActive(event); // update the touch active status
        handleTouchSlide(event);  // update the touch position
    });
    
    
    
    // global handlers:
    const watchGlobalPointerStatusRef = useRef<undefined|(() => void)>(undefined);
    const watchGlobalPointer          = useEvent((active: boolean): boolean|null => {
        // conditions:
        const shouldActive = active && enabled; // control is disabled or readOnly => no response required
        if (!!watchGlobalPointerStatusRef.current === shouldActive) return null; // already activated|deactivated => nothing to do
        
        
        
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
        
        
        
        return shouldActive;
    });
    
    
    
    // effects:
    useEffect(() => {
        // conditions:
        if (enabled) return; // control is enabled and mutable => no reset required
        
        
        
        // resets:
        isMouseActive.current = false; // unmark as pressed
        isTouchActive.current = false; // unmark as touched
        handlePointerStatus();         // update pointer status
    }, [enabled]);
    
    
    
    // api:
    return {
        // handlers:
        handleMouseDown,
        handleTouchStart,
    };
};
