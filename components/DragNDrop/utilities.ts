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
    }
}
export const findDroppableHook = (elements: Element[]): DroppableHook|null => {
    for (const element of elements) {
        const droppableHook = (droppableKey in element) ? element[droppableKey] : undefined;
        if (droppableHook && (droppableHook instanceof DroppableHook)) return droppableHook; // found
    } // for
    
    
    
    return null; // not found
};
