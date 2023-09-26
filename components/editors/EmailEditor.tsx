// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    // react components:
    TextEditorProps,
    TextEditor,
}                           from '@/components/editors/TextEditor'



// react components:
export interface EmailEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        TextEditorProps<TElement>
{
}
const EmailEditor = <TElement extends Element = HTMLElement>(props: EmailEditorProps<TElement>): JSX.Element|null => {
    // jsx:
    return (
        <TextEditor<TElement>
            // other props:
            {...props}
            
            
            
            // accessibilities:
            aria-label={props['aria-label'] ?? 'Email'}
            
            
            
            // validations:
            required={props.required ?? true}
            
            
            
            // formats:
            type={props.type ?? 'email'}
        />
    );
};
export {
    EmailEditor,
    EmailEditor as default,
}
