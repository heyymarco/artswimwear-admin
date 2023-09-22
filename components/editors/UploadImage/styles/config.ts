// cssfn:
import {
    // cssfn css specific types:
    CssKnownProps,
    
    
    
    // reads/writes css variables configuration:
    cssConfig,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui components:
import {
    // configs:
    indicators,
}                           from '@reusable-ui/indicator'       // a base component



// configs:
export const [uploadImages, uploadImageValues, cssUploadImageConfig] = cssConfig(() => {
    const bases = {
        // animations:
        filterDisable         : [[
            'opacity(0.5)',
            'contrast(0.8)',
        ]]                                                  as CssKnownProps['filter'    ],
        animEnable            : indicators.animEnable       as CssKnownProps['animation' ],
        animDisable           : indicators.animDisable      as CssKnownProps['animation' ],
        
        
        
        // media:
        mediaInlineSizeSm     : 'calc(3 * 40px)'            as CssKnownProps['inlineSize'],
        mediaBlockSizeSm      : 'auto'                      as CssKnownProps['blockSize' ],
        mediaInlineSizeMd     : 'calc(5 * 40px)'            as CssKnownProps['inlineSize'],
        mediaBlockSizeMd      : 'auto'                      as CssKnownProps['blockSize' ],
        mediaInlineSizeLg     : 'calc(8 * 40px)'            as CssKnownProps['inlineSize'],
        mediaBlockSizeLg      : 'auto'                      as CssKnownProps['blockSize' ],
        
        mediaAspectRatio      : '1/1'                       as CssKnownProps['aspectRatio'],
        
        
        
        // mediaInner:
        
        
        
        // titles:
        
        
        
        // noImages:
        
        
        
        // previewImages:
        previewImageObjectFit : 'cover'                     as CssKnownProps['objectFit' ],
        previewImageFilter    : [[
            'opacity(0.5)',
            'contrast(0.8)',
        ]]                                                  as CssKnownProps['filter'    ],
        
        
        
        // images:
        imageObjectFit : 'cover'                            as CssKnownProps['objectFit' ],
        
        
        
        // busies:
        
        
        
        // uploadProgresses:
        
        
        
        // uploadErrors:
        
        
        
        // actions:
        
        
        
        // selectButtons:
        
        
        
        // deleteButtons:
        
        
        
        // retryButtons:
        
        
        
        // cancelButtons:
    };
    
    
    
    const subs = {
    };
    
    
    
    const defaults = {
        mediaInlineSize       : bases.mediaInlineSizeMd     as CssKnownProps['inlineSize'],
        mediaBlockSize        : bases.mediaBlockSizeMd      as CssKnownProps['blockSize' ],
    };
    
    
    
    return {
        ...bases,
        ...subs,
        ...defaults,
    };
}, { prefix: 'uplimg' });
