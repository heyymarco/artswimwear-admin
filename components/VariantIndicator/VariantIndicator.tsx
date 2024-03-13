'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // react components:
    IndicatorProps,
    Indicator,
}                           from '@reusable-ui/indicator'       // a base component

// stores:
import type {
    // types:
    VariantDetail,
}                           from '@/store/features/api/apiSlice'

// styles:
import {
    useVariantIndicatorStyleSheet,
}                           from './styles/loader'



// react components:
export interface VariantIndicatorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        IndicatorProps<TElement>
{
    // data:
    model : VariantDetail
}
const VariantIndicator = <TElement extends Element = HTMLElement>(props: VariantIndicatorProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // data:
        model : {
            name,
            visibility,
        },
        
        
        
        // other props:
        ...restVariantIndicatorProps
    } = props;
    
    
    
    // styles:
    const styleSheet = useVariantIndicatorStyleSheet();
    
    
    
    // default props:
    const {
        // semantics:
        tag       = 'span',                       // defaults to <span>
        
        
        
        // variants:
        size      = 'sm',                         // defaults to sm
        
        
        
        // classes:
        className = styleSheet.main,              // defaults to internal styleSheet
        
        
        
        // accessibilities:
        active    = true,                         // defaults to active
        enabled   = (visibility === 'PUBLISHED'), // defaults to if_PUBLISHED
        
        
        
        // children:
        children  = name,                         // defaults to name
        
        
        
        // other props:
        ...restIndicatorProps
    } = restVariantIndicatorProps;
    
    
    
    // jsx:
    return (
        <Indicator<TElement>
            // other props:
            {...restIndicatorProps}
            
            
            
            // semantics:
            tag={tag}
            
            
            
            // variants:
            size={size}
            
            
            
            // classes:
            className={className}
            
            
            
            // states:
            active={active}
            enabled={enabled}
        >
            {children}
        </Indicator>
    );
}
export {
    VariantIndicator,            // named export for readibility
    VariantIndicator as default, // default export to support React.lazy
}
