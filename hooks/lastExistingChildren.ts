// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'



// hooks:
export const useLastExistingChildren = (children?: React.ReactNode): readonly [boolean, React.ReactNode] => {
    // states:
    const lastExistingChildrenRef = useRef<React.ReactNode>(undefined);
    const hasChildren = (!!children || (children === 0)) && (children !== true) && (!Array.isArray(children) || !!children.length); // ignores undefined|null|true|false|emptyString|emptyArray
    if (hasChildren) lastExistingChildrenRef.current = children;
    
    
    
    // children:
    return [hasChildren, lastExistingChildrenRef.current];
}
