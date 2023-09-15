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
        // media:
        mediaInlineSizeSm    : 'calc(3 * 40px)'         as CssKnownProps['inlineSize'],
        mediaBlockSizeSm     : 'calc(3 * 40px)'         as CssKnownProps['blockSize' ],
        mediaInlineSizeMd    : 'calc(5 * 40px)'         as CssKnownProps['inlineSize'],
        mediaBlockSizeMd     : 'calc(5 * 40px)'         as CssKnownProps['blockSize' ],
        mediaInlineSizeLg    : 'calc(8 * 40px)'         as CssKnownProps['inlineSize'],
        mediaBlockSizeLg     : 'calc(8 * 40px)'         as CssKnownProps['blockSize' ],
        
        
        
        // noImages:
        
        // previewImages:
        previewImageFilter  : [[
            'opacity(0.5)',
            'contrast(0.8)',
        ]]                                              as CssKnownProps['filter'    ],
        
        // images:
        
        // uploadProgresses:
        uploadProgressMargin : spacers.default          as CssKnownProps['margin'    ],
        
        // uploadErrors:
        uploadErrorMargin    : spacers.default          as CssKnownProps['margin'    ],
        
        // actions:
        
        // selectButtons:
        
        // deleteButtons:
        
        // retryButtons:
        
        // cancelButtons:
    };
    
    
    
    const subs = {
    };
    
    
    
    const defaults = {
        mediaInlineSize      : bases.mediaInlineSizeMd  as CssKnownProps['inlineSize'],
        mediaBlockSize       : bases.mediaBlockSizeMd   as CssKnownProps['blockSize' ],
    };
    
    
    
    return {
        ...bases,
        ...subs,
        ...defaults,
    };
}, { prefix: 'uplimg' });
