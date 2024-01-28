// react:
import type {
    // react:
    default as React,
}                           from 'react'

// internals:
import type {
    DragNDropData,
}                           from './types'



export class DroppableHook {
    dropData         : DragNDropData
    onDropHandshake  : (dragData: DragNDropData) => undefined|boolean|Promise<undefined|boolean>
    onDropped        : ((dragData: DragNDropData) => void)|undefined
    setIsDropping    : React.Dispatch<React.SetStateAction<undefined|null|boolean>>
    isMounted        : boolean
    
    constructor(
        dropData         : DragNDropData,
        onDropHandshake  : (dragData: DragNDropData) => undefined|boolean|Promise<undefined|boolean>,
        onDropped        : ((dragData: DragNDropData) => void)|undefined,
        setIsDropping    : React.Dispatch<React.SetStateAction<undefined|null|boolean>>
    ) {
        this.dropData        = dropData;
        this.onDropHandshake = onDropHandshake;
        this.onDropped       = onDropped;
        this.setIsDropping   = setIsDropping;
        this.isMounted       = true;
    }
}



const droppableMap      = new Map<Element, DroppableHook>();
let activeDroppableHook : null|DroppableHook = null;

export interface AttachDroppableHookResult {
    handshakeResult : null|boolean
    dropData        : undefined|DragNDropData
}
export const attachDroppableHook = async (elements: Element[], onDragHandshake: (dropData: DragNDropData) => boolean|Promise<boolean>, dragData: DragNDropData): Promise<AttachDroppableHookResult> => {
    let handshakeResult    : null|boolean            = null; // firstly mark as NOT_YET having handshake
    let interactedHook     : null|DroppableHook      = null;
    let interactedDropData : undefined|DragNDropData = undefined;
    
    
    
    for (const element of elements) {
        // conditions:
        const droppableHook = droppableMap.get(element);
        if (!droppableHook) continue;
        
        
        
        // tests:
        const dropNego = await droppableHook.onDropHandshake(dragData);
        if (!droppableHook.isMounted || (dropNego === undefined)) { // unmounted|undefined => do not drop here => see others
            continue; // noop => continue to scan others
        } // if
        
        
        
        interactedHook     = droppableHook;
        interactedDropData = droppableHook.dropData;
        
        
        
        if(dropNego === false) {                                    // false => refuses to be dropped
            handshakeResult = false;                                // handshake REFUSED by drop target
            break; // no need to continue scan others
        } // if
        
        
        
        const dragNego = await onDragHandshake(interactedDropData);
        if (!dragNego) {                                            // false => refuses to be dragged
            handshakeResult = false;                                // handshake REFUSED by drag source
            break; // no need to continue scan others
        } // if
        
        
        
        handshakeResult = true;                                     // handshake ACCEPTED by both drop target and drag source
        break; // no need to continue scan others
    } // for
    
    
    
    activeDroppableHook = handshakeResult ? interactedHook : null; // set or release
    
    
    
    for (const droppableHook of droppableMap.values()) {
        // actions:
        if (droppableHook === interactedHook) {
            /*
             * undefined : NEVER HERE.  
             * null      : NEVER HERE.  
             * false     : has dropping activity on this dropping target but the source/target refuses to be dragged/dropped.  
             * true      : has dropping activity on this dropping target and the source/target wants   to be dragged/dropped.  
             */
            droppableHook.setIsDropping(!!handshakeResult);
        }
        else {
            /*
             * undefined : NEVER HERE.  
             * null      : has dropping activity but outside this dropping target.  
             * false     : NEVER HERE.  
             * true      : NEVER HERE.  
             */
            droppableHook.setIsDropping(null);
        } // if
    } // for
    
    
    
    return {
        handshakeResult,
        dropData : interactedDropData,
    };
};
export const detachDroppableHook = (): null|DroppableHook => {
    const prevActiveDroppableHook = activeDroppableHook; // backup
    activeDroppableHook = null; // release
    
    
    
    for (const droppableHook of droppableMap.values()) {
        // actions:
        droppableHook.setIsDropping(undefined); // no  dropping activity
    } // for
    
    
    
    return prevActiveDroppableHook;
};



export const registerDroppableHook   = (element: Element, droppableHook: DroppableHook): void => {
    droppableHook.isMounted = true; // mount
    droppableMap.set(element, droppableHook);
};
export const unregisterDroppableHook = (element: Element): null|DroppableHook => {
    const droppableHook = droppableMap.get(element); // backup
    if (droppableHook) droppableHook.isMounted = false; // unmount
    droppableMap.delete(element);
    
    
    
    if (droppableHook && (droppableHook === activeDroppableHook)) {
        activeDroppableHook = null; // release
    } // if
    
    
    
    return droppableHook ?? null; // found | not found
};
