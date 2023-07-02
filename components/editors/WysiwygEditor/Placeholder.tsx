// react:
import {
    // react:
    default as React,
}                           from 'react'



// react components:
export interface PlaceholderProps {
    // accessibilities:
    placeholder ?: string
}
const Placeholder = (props: PlaceholderProps): JSX.Element|null => {
    // rest props:
    const {
        // accessibilities:
        placeholder,
    } = props;
    
    
    
    // jsx:
    return (
        <div>
            {placeholder}
        </div>
    );
};
export {
    Placeholder,
    Placeholder as default,
}
