// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'



// utilities:
let childrenKeyCounter = 0;



// hooks:
export const useLastExistingChildren = (children?: React.ReactNode): readonly [boolean, React.ReactNode[]|undefined] => {
    // states:
    const lastExistingChildrenRef = useRef<React.ReactNode[]|undefined>(undefined);
    const hasChildren = (!!children || (children === 0)) && (children !== true) && (!Array.isArray(children) || !!children.length); // ignores undefined|null|true|false|emptyString|emptyArray
    if (hasChildren) {
        lastExistingChildrenRef.current = React.Children.map(children, (child) =>
            React.isValidElement(child)
            ? React.cloneElement(child,
                // props:
                {
                    key: (++childrenKeyCounter), // helps React that the last <Element> was replaced with another <Element>
                },
            )
            : child
        );
    } // if
    
    
    
    // children:
    return [hasChildren, lastExistingChildrenRef.current];
}
