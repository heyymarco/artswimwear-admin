// cssfn:
import {
    // cssfn css specific types:
    CssKnownProps,
    
    
    
    // writes css in javascript:
    keyframes,
    
    
    
    // reads/writes css variables configuration:
    cssConfig,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a border (stroke) management system:
    borders,
    
    
    
    // a spacer (gap) management system:
    spacers,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // configs:
    basics,
}                           from '@reusable-ui/basic'           // a base component
import {
    // configs:
    indicators,
}                           from '@reusable-ui/indicator'       // a base component



// configs:
export const [uploadImages, uploadImageValues, cssUploadImageConfig] = cssConfig(() => {
    const bases = {
        // images:
        imageInlineSizeSm : 'calc(3 * 40px)'            as CssKnownProps['inlineSize'],
        imageInlineSizeMd : 'calc(5 * 40px)'            as CssKnownProps['inlineSize'],
        imageInlineSizeLg : 'calc(8 * 40px)'            as CssKnownProps['inlineSize'],
    };
    
    
    
    const subs = {
    };
    
    
    
    const defaults = {
        imageInlineSize   : bases.imageInlineSizeMd     as CssKnownProps['inlineSize'],
    };
    
    
    
    return {
        ...bases,
        ...subs,
        ...defaults,
    };
}, { prefix: 'uplimg' });
