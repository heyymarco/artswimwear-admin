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
export const attachDroppableHook = (element: Element, droppableHook: DroppableHook): void => {
    droppableMap.set(element, droppableHook);
};
export const detachDroppableHook = (element: Element): DroppableHook|null => {
    const droppableHook = droppableMap.get(element);
    droppableMap.delete(element);
    
    return droppableHook ?? null; // found | not found
};
