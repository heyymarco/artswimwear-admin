// react:
import type {
    // react:
    default as React,
}                           from 'react'



const droppableKey = Symbol('droppableKey');

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
        const droppableHook = (droppableKey in element) ? element[droppableKey] : undefined;
        if (droppableHook && (droppableHook instanceof DroppableHook)) return droppableHook; // found
    } // for
    
    
    
    return null; // not found
};
export const attachDroppableHook = (element: Element, droppableHook: DroppableHook): void => {
    (element as any)[droppableKey] = droppableHook;
};
export const detachDroppableHook = (element: Element): DroppableHook|null => {
    if (!(droppableKey in element)) return null;
    const droppableHook = element[droppableKey];
    delete element[droppableKey];
    
    if (droppableHook && (droppableHook instanceof DroppableHook)) return droppableHook; // found
    return null; // not found
};
