// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import {
    // hooks:
    useOrderDataContext,
}                           from './orderDataContext'

// lexical functions:
import {
    createHeadlessEditor,
}                           from '@lexical/headless'
import {
    $generateHtmlFromNodes,
}                           from '@lexical/html'

// types:
import type {
    // types:
    WysiwygEditorState,
}                           from '@/components/editors/WysiwygEditor/types'

// // theme:
// import {
//     // defined classes to match Reusable-UI's styles & components.
//     defaultTheme,
// }                           from '@/components/editors/WysiwygEditor/defaultTheme'

// nodes:
import {
    // defined supported nodes.
    defaultNodes,
}                           from '@/components/editors/WysiwygEditor/defaultNodes'



// react components:
export const PaymentRejectionReason = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        order : {
            paymentConfirmation,
        },
    } = useOrderDataContext();
    const rejectionReason = paymentConfirmation?.rejectionReason;
    
    
    
    const editor = createHeadlessEditor({
        namespace   : 'WysiwygEditor', 
        editable    : false,
        
        editorState : (rejectionReason ?? undefined) as WysiwygEditorState|undefined,
        
        // theme       : defaultTheme(), // no need className(s) because email doesn't support styling
        nodes       : defaultNodes(),
    });
    
    
    
    // jsx:
    if (!rejectionReason) return null;
    return (
        // $generateHtmlFromNodes(editor) ?? null
        JSON.stringify(rejectionReason)
    );
};
