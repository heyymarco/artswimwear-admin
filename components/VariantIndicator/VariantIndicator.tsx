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
    VariantPreview,
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
    model ?: VariantPreview
}
const VariantIndicator = <TElement extends Element = HTMLElement>(props: VariantIndicatorProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // data:
        model,
        
        
        
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
        enabled   = (
            !!model
            ? (model.visibility === 'PUBLISHED')
            : false
        ),                                        // defaults to if_PUBLISHED
        title     = (
            !!model
            ? undefined
            : 'Unknown Variant'
        ),                                        // defaults to undefined -or- 'Unknown Variant'
        
        
        
        // children:
        children  = (
            !!model
            ? model.name
            : '?'
        ),                                        // defaults to name -or- '?'
        
        
        
        // other props:
        ...restIndicatorProps
    } = restVariantIndicatorProps as (typeof restVariantIndicatorProps & Pick<React.HTMLAttributes<TElement>, 'title'>);
    
    
    
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
            
            
            
            // accessibilities:
            active={active}
            enabled={enabled}
            // @ts-expect-error
            title={title}
        >
            {children}
        </Indicator>
    );
}
export {
    VariantIndicator,            // named export for readibility
    VariantIndicator as default, // default export to support React.lazy
}
