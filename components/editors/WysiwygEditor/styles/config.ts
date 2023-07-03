// cssfn:
import {
    // reads/writes css variables configuration:
    cssConfig,
}                           from '@cssfn/core'                  // writes css in javascript



// configs:
export const [wysiwygEditors, wysiwygEditorValues, cssWysiwygEditorConfig] = cssConfig(() => {
    return {
        /* no config props yet */
    };
}, { prefix: 'crsl' });
