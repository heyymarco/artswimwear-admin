// cssfn:
import {
    // cssfn css specific types:
    CssKnownProps,
    
    
    
    // reads/writes css variables configuration:
    cssConfig,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// configs:
export const [gedits, geditValues, cssGeditConfig] = cssConfig(() => {
    const bases = {
        // sizes:
        itemMinColumnWidthSm : 'calc(3 * 40px)'             as CssKnownProps['columnWidth'],
        itemMinColumnWidthMd : 'calc(5 * 40px)'             as CssKnownProps['columnWidth'],
        itemMinColumnWidthLg : 'calc(8 * 40px)'             as CssKnownProps['columnWidth'],
        
        itemAspectRatio      : '1/1'                        as CssKnownProps['aspectRatio'],
        
        
        
        // spacings:
        gapInlineSm          : spacers.xs                   as CssKnownProps['gapInline'  ],
        gapBlockSm           : spacers.xs                   as CssKnownProps['gapBlock'   ],
        gapInlineMd          : spacers.sm                   as CssKnownProps['gapInline'  ],
        gapBlockMd           : spacers.sm                   as CssKnownProps['gapBlock'   ],
        gapInlineLg          : spacers.md                   as CssKnownProps['gapInline'  ],
        gapBlockLg           : spacers.md                   as CssKnownProps['gapBlock'   ],
    };
    
    
    
    const defaults = {
        // sizes:
        itemMinColumnWidth   : bases.itemMinColumnWidthMd   as CssKnownProps['columnWidth'],
        
        
        
        // spacings:
        gapInline            : bases.gapInlineMd            as CssKnownProps['gapInline'  ],
        gapBlock             : bases.gapBlockMd             as CssKnownProps['gapBlock'   ],
    };
    
    
    
    return {
        ...bases,
        ...defaults,
    };
}, { prefix: 'gedit' });
