// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import type {
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'



// react components:
export interface PlaceholderProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        React.HTMLAttributes<TElement>,
        Pick<EditorProps,
            // accessibilities:
            |'placeholder'
        >
{
    // components:
    placeholderComponent   ?: React.ReactComponentElement<any, React.HTMLAttributes<TElement>>
}
const Placeholder = <TElement extends Element = HTMLElement>(props: PlaceholderProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // accessibilities:
        placeholder,
        
        
        
        // components:
        placeholderComponent = (<div /> as React.ReactComponentElement<any, React.HTMLAttributes<TElement>>),
    ...restElementProps} = props;
    
    
    
    // jsx:
    return React.cloneElement<React.HTMLAttributes<TElement>>(placeholderComponent,
        // props:
        {
            // other props:
            ...restElementProps,
            ...placeholderComponent.props, // overwrites restElementProps (if any conflics)
        },
        
        
        
        // children:
        placeholder,
    );
};
export {
    Placeholder,
    Placeholder as default,
}
