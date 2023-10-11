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
    useMergeEvents,
    
    
    
    // a capability of UI to expand/reduce its size or toggle the visibility:
    ExpandedChangeEvent,
    CollapsibleProps,
    CollapsibleEventProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// react components:
export interface CollapsibleSuspenseProps {
    // components:
    children : React.ReactComponentElement<any, CollapsibleProps<ExpandedChangeEvent> & CollapsibleEventProps>
}
const CollapsibleSuspense = (props: CollapsibleSuspenseProps): JSX.Element|null => {
    // rest props:
    const {
        // components:
        children : collapsibleComponent,
    } = props;
    const isComponentExpanded = !!(collapsibleComponent?.props?.expanded ?? false);
    
    
    
    // states:
    const [isVisible, setIsVisible] = useState<boolean|null>(isComponentExpanded);
    
    
    
    // handlers:
    const handleCollapseEndInternal = useEvent(() => {
        setIsVisible(false)
    });
    const handleCollapseEnd         = useMergeEvents(
        // preserves the original `onCollapseEnd`:
        collapsibleComponent?.props?.onCollapseEnd,
        
        
        
        // actions:
        handleCollapseEndInternal,
    );
    
    
    
    // dom effects:
    useEffect(() => {
        if (isComponentExpanded) setIsVisible(null);
    }, [isComponentExpanded]);
    
    useEffect(() => {
        if (isVisible === null) setIsVisible(true);
    }, [isVisible]);
    
    
    
    // jsx:
    if (isVisible === false) return null; // causing to discard (lost) the <EditUserDialogInternal>'s states
    return React.cloneElement<CollapsibleProps<ExpandedChangeEvent> & CollapsibleEventProps>(collapsibleComponent,
        // props:
        {
            // other props:
            ...props,
            
            
            
            // states:
            expanded      : (isVisible === null) ? false : collapsibleComponent?.props?.expanded,
            
            
            
            // handlers:
            onCollapseEnd : handleCollapseEnd,
        },
    );
};
export {
    CollapsibleSuspense,
    CollapsibleSuspense as default,
}
