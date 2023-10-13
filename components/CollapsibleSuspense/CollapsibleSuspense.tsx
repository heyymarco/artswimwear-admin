'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

// reusable-ui core:
import {
    // a set of React node utility functions:
    flattenChildren,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internals:
import type {
    SuspendableProps,
}                           from './types'
import {
    // react components:
    CollapsibleWithSuspense,
}                           from './CollapsibleWithSuspense'



// react components:
export interface CollapsibleSuspenseProps {
    // components:
    children : React.ReactNode
}
const CollapsibleSuspense = (props: CollapsibleSuspenseProps): JSX.Element|null => {
    // rest props:
    const {
        // components:
        children,
    } = props;
    
    
    
    // children:
    const wrappedChildren = useMemo<React.ReactNode[]>(() =>
        flattenChildren(children)
        .map<React.ReactNode>((suspendable, index) => {
            // conditions:
            if (!React.isValidElement<SuspendableProps>(suspendable)) return suspendable; // not a <SuspendableProps> => place it anyway
            
            
            
            // props:
            const suspendableProps = suspendable.props;
            
            
            
            // jsx:
            return (
                /* wrap suspendable with <CollapsibleWithSuspense> */
                <CollapsibleWithSuspense
                    // other props:
                    {...suspendableProps} // steals all suspendable's props, so the <Owner> can recognize the <CollapsibleWithSuspense> as <TheirChild>
                    
                    
                    
                    // components:
                    suspendableComponent={
                        // clone suspendable element with (almost) blank props:
                        <suspendable.type
                            // identifiers:
                            key={suspendable.key}
                            
                            
                            
                            //#region restore conflicting props
                            {...{
                                ...(('suspendableComponent' in suspendableProps) ? { suspendableComponent : suspendableProps.suspendableComponent } : undefined),
                            }}
                            //#endregion restore conflicting props
                        />
                    }
                />
            );
        })
    , [children]);
    
    
    
    // jsx:
    return (
        <>
            {wrappedChildren}
        </>
    )
};
export {
    CollapsibleSuspense,
    CollapsibleSuspense as default,
}
