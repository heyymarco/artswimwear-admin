// react:
import type {
    // react:
    default as React,
}                           from 'react'



const droppableMap = new WeakMap<Element, DroppableHook>();

export class DroppableHook {
    dropData         : unknown
    onDropHandshake  : (dragData: unknown) => boolean|Promise<boolean>
    onDropped        : (dragData: unknown) => void
    setIsDropping    : React.Dispatch<React.SetStateAction<undefined|boolean>>
    isMounted        : boolean
    
    constructor(
        dropData         : unknown,
        onDropHandshake  : (dragData: unknown) => boolean|Promise<boolean>,
        onDropped        : (dragData: unknown) => void,
        setIsDropping    : React.Dispatch<React.SetStateAction<undefined|boolean>>
    ) {
        this.dropData        = dropData;
        this.onDropHandshake = onDropHandshake;
        this.onDropped       = onDropped;
        this.setIsDropping   = setIsDropping;
        this.isMounted       = true;
    }
}
export const findDroppableHook = (elements: Element[]): DroppableHook|null => {
    for (const element of elements) {
        const droppableHook = droppableMap.get(element);
        if (droppableHook && (droppableHook instanceof DroppableHook)) return droppableHook; // found
    } // for
    
    
    
    return null; // not found
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
