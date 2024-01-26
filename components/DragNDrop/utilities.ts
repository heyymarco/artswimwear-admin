const droppableKey = Symbol('droppableKey');

export class DroppableHook {
    onDropHandshake  : (dragData: unknown) => boolean|Promise<boolean>
    onDropped        : (dragData: unknown) => void
    
    constructor(
        onDropHandshake  : (dragData: unknown) => boolean|Promise<boolean>,
        onDropped        : (dragData: unknown) => void,
    ) {
        this.onDropHandshake = onDropHandshake;
        this.onDropped       = onDropped;
    }
}
export const findDroppableHook = (elements: Element[]): DroppableHook|null => {
    for (const element of elements) {
        const droppableHook = (droppableKey in element) ? element[droppableKey] : undefined;
        if (droppableHook && (droppableHook instanceof DroppableHook)) return droppableHook; // found
    } // for
    
    
    
    return null; // not found
};
