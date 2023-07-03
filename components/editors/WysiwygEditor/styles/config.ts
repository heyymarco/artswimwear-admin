// cssfn:
import {
    // cssfn css specific types:
    CssKnownProps,
    
    
    
    // reads/writes css variables configuration:
    cssConfig,
}                           from '@cssfn/core'                  // writes css in javascript



// configs:
export const [wysiwygEditors, wysiwygEditorValues, cssWysiwygEditorConfig] = cssConfig(() => {
    return {
        // appearances:
        placeholderOpacity : 0.5    as CssKnownProps['opacity'],
    };
}, { prefix: 'wysiwyg' });
