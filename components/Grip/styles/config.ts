// cssfn:
import {
    // cssfn css specific types:
    CssKnownProps,
    
    
    
    // reads/writes css variables configuration:
    cssConfig,
}                           from '@cssfn/core'                  // writes css in javascript



// configs:
export const [grips, gripValues, cssGripConfig] = cssConfig(() => {
    return {
        // accessibilities:
        cursor          : 'move'    as CssKnownProps['cursor'      ],
        
        
        
        // dots:
        dotInlineSize   : '4px'     as CssKnownProps['inlineSize'  ],
        dotBlockSize    : '4px'     as CssKnownProps['blockSize'   ],
        dotMarginInline : '2px'     as CssKnownProps['marginInline'],
        dotMarginBlock  : '2px'     as CssKnownProps['marginBlock' ],
        dotBorderRadius : '50%'     as CssKnownProps['borderRadius'],
    };
}, { prefix: 'grip' });
