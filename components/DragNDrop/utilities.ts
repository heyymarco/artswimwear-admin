// react:
import type {
    // react:
    default as React,
}                           from 'react'



const droppableMap = new Map<Element, DroppableHook>();
let activeDroppableHook : DroppableHook|null = null;

export class DroppableHook {
    dropData         : unknown
    onDropHandshake  : (dragData: unknown) => undefined|boolean|Promise<undefined|boolean>
    onDropped        : (dragData: unknown) => void
    setIsDropping    : React.Dispatch<React.SetStateAction<undefined|null|boolean>>
    isMounted        : boolean
    
    constructor(
        dropData         : unknown,
        onDropHandshake  : (dragData: unknown) => undefined|boolean|Promise<undefined|boolean>,
        onDropped        : (dragData: unknown) => void,
        setIsDropping    : React.Dispatch<React.SetStateAction<undefined|null|boolean>>
    ) {
        this.dropData        = dropData;
        this.onDropHandshake = onDropHandshake;
        this.onDropped       = onDropped;
        this.setIsDropping   = setIsDropping;
        this.isMounted       = true;
    }
}
export const attachDroppableHook = async (elements: Element[], onDragHandshake: (dropData: unknown) => boolean|Promise<boolean>, dragData: unknown): Promise<null|boolean> => {
    let droppableHookResult     : null|boolean       = null; // firstly mark as NOT_YET having attached hook
    let interactedDroppableHook : DroppableHook|null = null;
    for (const element of elements) {
        // conditions:
        const droppableHook = droppableMap.get(element);
        if (!droppableHook) continue;
        
        
        
        // tests:
        const dropNego = await droppableHook.onDropHandshake(dragData);
        if (!droppableHook.isMounted || (dropNego === undefined)) { // unmounted|undefined => do not drop here => see others
            continue; // noop => continue to scan others
        }
        else if(dropNego === false) {                               // false => refuses to be dropped
            droppableHookResult     = false;                        // YET having refused (by drop target) hook
            interactedDroppableHook = droppableHook;                // YET having refused (by drop target) hook
            break;
        }
        else { // true => wants to be dropped
            const dragNego = await onDragHandshake(droppableHook.dropData);
            if (!dragNego) {                                        // false => refuses to be dragged
                droppableHookResult     = false;                    // YET having refused (by drag source) hook
                interactedDroppableHook = droppableHook;            // YET having refused (by drag source) hook
                break;
            }
            else {                                                  // true => wants to be dragged
                droppableHookResult     = true;                     // YET having attached hook
                interactedDroppableHook = droppableHook;            // YET having attached hook
                break;
            } // if
        } // if
    } // for
    
    
    
    activeDroppableHook = droppableHookResult ? interactedDroppableHook : null; // set or release
    
    
    
    for (const droppableHook of droppableMap.values()) {
        // actions:
        if (droppableHook === interactedDroppableHook) {
            /*
             * undefined : NEVER HERE.  
             * null      : NEVER HERE.  
             * false     : has dropping activity on this dropping target but the source/target refuses to be dragged/dropped.  
             * true      : has dropping activity on this dropping target and the source/target wants   to be dragged/dropped.  
             */
            droppableHook.setIsDropping(!!droppableHookResult);
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
    
    
    
    return droppableHookResult;
};
export const detachDroppableHook = (): DroppableHook|null => {
    const prevActiveDroppableHook = activeDroppableHook; // backup
    activeDroppableHook = null; // release
    
    
    
    for (const droppableHook of droppableMap.values()) {
        // actions:
        droppableHook.setIsDropping(undefined); // no  dropping activity
    } // for
    
    
    
    return prevActiveDroppableHook;
};



export const registerDroppableHook = (element: Element, droppableHook: DroppableHook): void => {
    droppableHook.isMounted = true; // mount
    droppableMap.set(element, droppableHook);
};
export const unregisterDroppableHook = (element: Element): DroppableHook|null => {
    const droppableHook = droppableMap.get(element); // backup
    if (droppableHook) droppableHook.isMounted = false; // unmount
    droppableMap.delete(element);
    
    
    
    if (droppableHook && (droppableHook === activeDroppableHook)) {
        activeDroppableHook = null; // release
    } // if
    
    
    
    return droppableHook ?? null; // found | not found
};
