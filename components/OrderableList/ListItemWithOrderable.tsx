// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    globalStacks,
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import type {
    // react components:
    ListItemProps,
    
    ListItemComponentProps,
}                           from '@reusable-ui/list'            // represents a series of content

// internals:
import {
    // states:
    useOrderableListState,
}                           from './states/orderableListState'
import {
    useDraggable,
    useDroppable,
}                           from '@/libs/drag-n-drop'



// react components:
export interface ListItemWithOrderableProps<TElement extends HTMLElement = HTMLElement>
    extends
        // bases:
        ListItemProps<TElement>,
        
        // components:
        Required<ListItemComponentProps<TElement>>
{
    // positions:
    listIndex : number
}
export const ListItemWithOrderable = <TElement extends HTMLElement = HTMLElement>(props: ListItemWithOrderableProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // positions:
        listIndex,
        
        
        
        // components:
        listItemComponent,
    ...restListItemProps} = props;
    
    
    
    // states:
    const {
        // identifiers:
        dragNDropId,
        
        
        
        // handlers:
        handleDragMove,
        handleDropped,
    } = useOrderableListState();
    
    
    
    // refs:
    const listItemRef = useRef<TElement|null>(null);
    const listItemBasePosition = useRef<{ left: number, top: number }>({ left: 0, top: 0 });
    
    
    
    // capabilities:
    const {
        // data:
        dropData : dropData,
        // states:
        isDragging,
    ...draggable} = useDraggable<TElement>({
        enabled  : true,
        dragData : {
            type : dragNDropId,
            data : listIndex,
        },
        onDragHandshake({type, data: toListIndex}) {
            return ((type === dragNDropId) && (toListIndex !== listIndex));
        },
        onDragMove(event) {
            if (dropData) {
                handleDragMove({
                    ...event,
                    from : listIndex,
                    to   : dropData.data as number,
                });
            } // if
            
            
            
            const {clientX, clientY} = event;
            if (!isDraggingActiveRef.current) return;
            const listItemInlineStyle = listItemRef.current?.style;
            if (!listItemInlineStyle) return;
            listItemInlineStyle.left = `${clientX - listItemBasePosition.current.left}px`;
            listItemInlineStyle.top  = `${clientY - listItemBasePosition.current.top }px`;
        },
    });
    const {
        isDropping,
    } = useDroppable<TElement>({
        enabled  : true,
        dropData : {
            type : dragNDropId,
            data : listIndex,
        },
        dropRef  : listItemRef,
        onDropHandshake({type, data: fromListIndex}) {
            return ((type === dragNDropId) && (fromListIndex !== listIndex));
        },
        onDropped({data: fromListIndex}) {
            handleDropped({
                from : fromListIndex as number,
                to   : listIndex,
            });
        },
    });
    
    
    
    // handlers:
    const handlePointerStart = useEvent((event: MouseEvent) => {
        listItemBasePosition.current = {
            left : event.clientX,
            top  : event.clientY,
        };
    });
    const handleMouseDown  = useEvent<React.MouseEventHandler<TElement>>((event) => {
        handlePointerStart(event.nativeEvent);
        draggable.handleMouseDown(event);
    });
    const handleTouchStart = useEvent<React.TouchEventHandler<TElement>>((event) => {
        // simulates the TouchMove as MouseMove:
        handlePointerStart({
            ...event,
            clientX : event.touches[0].clientX,
            clientY : event.touches[0].clientY,
            buttons : 1, // primary button (usually the left button)
        } as unknown as MouseEvent);
        draggable.handleTouchStart(event);
    });
    
    
    
    // effects:
    const isDraggingActive = (isDragging !== undefined);
    const isDraggingActiveRef = useRef<boolean>(isDraggingActive);
    if (isDraggingActiveRef.current !== isDraggingActive) {
        isDraggingActiveRef.current = isDraggingActive;
        
        const listItemInlineStyle = listItemRef.current?.style;
        if (listItemInlineStyle) {
            if (isDraggingActive) {
                listItemInlineStyle.position      = 'relative';
                listItemInlineStyle.zIndex        = `${globalStacks.dragOverlay}`;
                listItemInlineStyle.pointerEvents = 'none';
            }
            else {
                setTimeout(() => {
                    listItemInlineStyle.position      = '';
                    listItemInlineStyle.zIndex        = '';
                    listItemInlineStyle.left          = '';
                    listItemInlineStyle.top           = '';
                    listItemInlineStyle.pointerEvents = '';
                }, 0);
            }
        } // if
    } // if
    
    
    
    // jsx:
    /* <ListItem> */
    return React.cloneElement<ListItemProps<TElement>>(listItemComponent,
        // props:
        {
            // other props:
            ...restListItemProps,
            ...listItemComponent.props, // overwrites restListItemProps (if any conflics)
            
            
            
            // refs:
            outerRef : listItemRef, // TODO: remove this test
            
            
            
            // variants:
            // outlined : (isDragging !== undefined) ? true : undefined, // TODO: remove this test
            
            
            
            // handlers:
            onMouseDown  : handleMouseDown,  // TODO: use mergeEvents
            onTouchStart : handleTouchStart, // TODO: use mergeEvents
        },
        
        
        
        // children:
        listItemComponent.props.children ?? props.children,
    );
};
