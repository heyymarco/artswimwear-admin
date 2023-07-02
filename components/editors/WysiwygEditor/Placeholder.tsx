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
export interface PlaceholderProps
    extends
        // bases:
        Pick<EditorProps,
            // accessibilities:
            |'placeholder'
        >
{
    // components:
    placeholderComponent   ?: React.ReactComponentElement<any, {}>
}
const Placeholder = (props: PlaceholderProps): JSX.Element|null => {
    // rest props:
    const {
        // accessibilities:
        placeholder,
        
        
        
        // components:
        placeholderComponent = (<div /> as React.ReactComponentElement<any, {}>),
    } = props;
    
    
    
    // jsx:
    return React.cloneElement<{}>(placeholderComponent,
        // props:
        undefined,
        
        
        
        // children:
        placeholder,
    );
};
export {
    Placeholder,
    Placeholder as default,
}
