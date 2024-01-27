// react:
import type {
    // react:
    default as React,
}                           from 'react'



const droppableMap = new Map<Element, DroppableHook>();

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
    let droppableHookResult    : null|boolean       = null; // firstly mark as NOT_YET having attached hook
    let responsedDroppableHook : null|DroppableHook = null;
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
            droppableHookResult    = false;                         // YET having refused hook
            responsedDroppableHook = droppableHook;                 // YET having refused hook
            break;
        }
        else { // true => wants to be dropped
            const dragNego = await onDragHandshake(droppableHook.dropData);
            if (!dragNego) {                                        // false => refuses to be dragged
                droppableHookResult    = false;                     // YET having refused hook
                responsedDroppableHook = droppableHook;             // YET having refused hook
                break;
            }
            else {                                                  // true => wants to be dragged
                droppableHookResult    = true;                      // YET having attached hook
                responsedDroppableHook = droppableHook;             // YET having refused hook
                break;
            } // if
        } // if
    } // for
    
    
    
    for (const droppableHook of droppableMap.values()) {
        // actions:
        if (droppableHook === responsedDroppableHook) {
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
export const detachDroppableHook = (): void => {
    for (const droppableHook of droppableMap.values()) {
        // actions:
        droppableHook.setIsDropping(undefined); // no  dropping activity
    } // for
};



export const registerDroppableHook = (element: Element, droppableHook: DroppableHook): void => {
    droppableHook.isMounted = true;
    droppableMap.set(element, droppableHook);
};
export const unregisterDroppableHook = (element: Element): DroppableHook|null => {
    const droppableHook = droppableMap.get(element);
    if (droppableHook) droppableHook.isMounted = false;
    droppableMap.delete(element);
    
    return droppableHook ?? null; // found | not found
};
