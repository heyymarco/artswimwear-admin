'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useEffect,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
    useMergeEvents,
    
    
    
    // a capability of UI to expand/reduce its size or toggle the visibility:
    ExpandedChangeEvent,
    CollapsibleProps,
    // CollapsibleEventProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// types:
export interface CollapsibleEventProps {
    onExpandStart   ?: EventHandler<any>
    onExpandEnd     ?: EventHandler<any>
    onCollapseStart ?: EventHandler<any>
    onCollapseEnd   ?: EventHandler<any>
}
const enum VisibilityState {
    CollapseEnd   = 0,
    // CollapseStart = 1, // no need render transition of collapsing
    ExpandStart   = 1,
    ExpandEnd     = 2,
}



// react components:
export interface CollapsibleWithSuspenseProps {
    // components:
    collapsibleComponent : React.ReactComponentElement<any, CollapsibleProps<ExpandedChangeEvent> & CollapsibleEventProps>
}
const CollapsibleWithSuspense = (props: CollapsibleWithSuspenseProps): JSX.Element|null => {
    // rest props:
    const {
        // components:
        collapsibleComponent,
    } = props;
    const isComponentExpanded = !!(collapsibleComponent.props.expanded ?? false);
    
    
    
    // states:
    const [visibilityState, setVisibilityState] = useState<VisibilityState>(isComponentExpanded ? VisibilityState.ExpandEnd : VisibilityState.CollapseEnd);
    
    
    
    // handlers:
    const handleCollapseEndInternal = useEvent(() => {
        setVisibilityState(VisibilityState.CollapseEnd);
    });
    const handleCollapseEnd         = useMergeEvents(
        // preserves the original `onCollapseEnd` from `collapsibleComponent`:
        collapsibleComponent.props.onCollapseEnd,
        
        
        
        // actions:
        handleCollapseEndInternal,
    );
    
    
    
    // dom effects:
    
    // handle initiate to render the <Collapsible>:
    useEffect(() => {
        if (isComponentExpanded) setVisibilityState(VisibilityState.ExpandStart);
    }, [isComponentExpanded]);
    
    // handle render transition from [ExpandStart => delay => ExpandEnd]:
    useEffect(() => {
        // conditions:
        if (visibilityState !== VisibilityState.ExpandStart) return; // ignores states other than `ExpandStart`
        
        
        
        // setups:
        const asyncDelayedTransition = setTimeout(() => { // a brief moment for rendering `collapsed state`
            setVisibilityState(VisibilityState.ExpandEnd);
        }, 0);
        
        
        
        // cleanups:
        return () => {
            clearTimeout(asyncDelayedTransition);
        };
    }, [visibilityState]);
    
    
    
    // jsx:
    if (visibilityState === VisibilityState.CollapseEnd) return null; // causing to discard (lost) the <CollapsibleComponent>'s states
    return React.cloneElement<CollapsibleProps<ExpandedChangeEvent> & CollapsibleEventProps>(collapsibleComponent,
        // props:
        {
            // states:
            expanded      : (visibilityState === VisibilityState.ExpandStart) ? false /* render as collapsed first, then next re-render render as expanded */ : isComponentExpanded,
            
            
            
            // handlers:
            onCollapseEnd : handleCollapseEnd,
        },
    );
};
export {
    CollapsibleWithSuspense,
    CollapsibleWithSuspense as default,
}
