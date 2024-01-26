const droppableKey = Symbol('droppableKey');

export class DroppableHook {
    dropData         : unknown
    onDropHandshake  : (dragData: unknown) => boolean|Promise<boolean>
    onDropped        : (dragData: unknown) => void
    
    constructor(
        dropData         : unknown,
        onDropHandshake  : (dragData: unknown) => boolean|Promise<boolean>,
        onDropped        : (dragData: unknown) => void,
    ) {
        this.dropData        = dropData;
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
