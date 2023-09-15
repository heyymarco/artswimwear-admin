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
        // noImages:
        noImageInlineSizeSm : 'calc(3 * 40px)'              as CssKnownProps['inlineSize'],
        noImageBlockSizeSm  : 'calc(3 * 40px)'              as CssKnownProps['blockSize' ],
        noImageInlineSizeMd : 'calc(5 * 40px)'              as CssKnownProps['inlineSize'],
        noImageBlockSizeMd  : 'calc(5 * 40px)'              as CssKnownProps['blockSize' ],
        noImageInlineSizeLg : 'calc(8 * 40px)'              as CssKnownProps['inlineSize'],
        noImageBlockSizeLg  : 'calc(8 * 40px)'              as CssKnownProps['blockSize' ],
        
        
        
        // images:
        imageInlineSizeSm   : 'calc(3 * 40px)'              as CssKnownProps['inlineSize'],
        imageBlockSizeSm    : 'calc(3 * 40px)'              as CssKnownProps['blockSize' ],
        imageInlineSizeMd   : 'calc(5 * 40px)'              as CssKnownProps['inlineSize'],
        imageBlockSizeMd    : 'calc(5 * 40px)'              as CssKnownProps['blockSize' ],
        imageInlineSizeLg   : 'calc(8 * 40px)'              as CssKnownProps['inlineSize'],
        imageBlockSizeLg    : 'calc(8 * 40px)'              as CssKnownProps['blockSize' ],
    };
    
    
    
    const subs = {
    };
    
    
    
    const defaults = {
        noImageInlineSize   : bases.noImageInlineSizeMd     as CssKnownProps['inlineSize'],
        noImageBlockSize    : bases.noImageBlockSizeMd      as CssKnownProps['blockSize' ],
        
        imageInlineSize     : bases.imageInlineSizeMd       as CssKnownProps['inlineSize'],
        imageBlockSize      : bases.imageBlockSizeMd        as CssKnownProps['blockSize' ],
    };
    
    
    
    return {
        ...bases,
        ...subs,
        ...defaults,
    };
}, { prefix: 'uplimg' });
