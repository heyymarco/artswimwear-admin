'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // status-components:
    BasicProps,
    Basic,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// models:
import {
    type ProductVisibility,
}                           from '@/models'



// react components:
export interface VisibilityBadgeProps
    extends
        // bases:
        Omit<BasicProps<HTMLElement>,
            // handlers:
            |'onClick' // overriden
        >
{
    // data:
    visibility  : ProductVisibility
}
const VisibilityBadge = (props: VisibilityBadgeProps): JSX.Element|null => {
    // rest props:
    const {
        // data:
        visibility,
        
        
        
        // other props:
        ...restVisibilityBadgeProps
    } = props;
    if (visibility === 'PUBLISHED') return null;
    
    
    
    // default props:
    const {
        // semantics:
        tag      = 'span',
        
        
        
        // variants:
        theme    = 'secondary',
        size     = 'sm',
        
        
        
        // children:
        children = (visibility === 'DRAFT') ? 'DRAFT' : 'HIDDEN',
        
        
        
        // other props:
        ...restBasicProps
    } = restVisibilityBadgeProps;
    
    
    
    // jsx:
    return (
        <Basic
            // other props:
            {...restBasicProps}
            
            
            
            // semantics:
            tag={tag}
            
            
            
            // variants:
            theme={theme}
            size={size}
        >
            {children}
        </Basic>
    );
};
export {
    VisibilityBadge,
    VisibilityBadge as default,
}
