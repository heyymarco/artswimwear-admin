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
    // a spacer (gap) management system:
    spacers,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// configs:
export const [gedits, geditValues, cssGeditConfig] = cssConfig(() => {
    //#region keyframes
    const [keyframesDraggedRule, keyframesDragged] = keyframes({
        from  : {
            opacity : 0.4,
        },
        to    : {
            opacity : 0.6,
        },
    });
    const [keyframesDroppedRule, keyframesDropped] = keyframes({
        from  : {
            scale : '100%',
        },
        to    : {
            scale : '105%',
        },
    });
    const [keyframesDropTargetRule, keyframesDropTarget] = keyframes({
        from  : {
            rotate : '-0.5deg',
        },
        to    : {
            rotate : '0.5deg',
        },
    });
    
    
    
    const [keyframesShiftedUpRule, keyframesShiftedUp] = keyframes({
        '0%'   : {
            translate : [[ '0%', '0%']],
        },
        '5%'  : {
            translate : [['-1%', '0%']],
        },
        '50%' : {
            translate : [[ '0%', '0%']],
        },
        '100%' : {
            translate : [[ '0%', '0%']],
        },
    });
    const [keyframesShiftedDownRule, keyframesShiftedDown] = keyframes({
        '0%'   : {
            translate : [[ '0%', '0%']],
        },
        '5%'  : {
            translate : [[ '1%', '0%']],
        },
        '50%' : {
            translate : [[ '0%', '0%']],
        },
        '100%' : {
            translate : [[ '0%', '0%']],
        },
    });
    //#endregion keyframes
    
    
    
    const bases = {
        // sizes:
        itemMinColumnWidthSm : 'calc(3 * 40px)'             as CssKnownProps['columnWidth'],
        itemMinColumnWidthMd : 'calc(5 * 40px)'             as CssKnownProps['columnWidth'],
        itemMinColumnWidthLg : 'calc(8 * 40px)'             as CssKnownProps['columnWidth'],
        
        itemAspectRatio      : '1/1'                        as CssKnownProps['aspectRatio'],
        
        
        
        // animations:
        ...keyframesDraggedRule,
        ...keyframesDroppedRule,
        ...keyframesDropTargetRule,
        animDragged          : [
            ['600ms', 'linear'  , 'none', 'alternate', 'infinite', keyframesDragged    ],
        ]                                                   as CssKnownProps['animation'  ],
        animDropped          : [
            ['300ms', 'linear'  , 'none', 'alternate', 'infinite', keyframesDropped    ],
        ]                                                   as CssKnownProps['animation'  ],
        animDropTarget       : [
            ['300ms', 'linear'  , 'none', 'alternate', 'infinite', keyframesDropTarget ],
        ]                                                   as CssKnownProps['animation'  ],
        
        ...keyframesShiftedUpRule,
        ...keyframesShiftedDownRule,
        animShiftedUp        : [
            ['600ms', 'ease-out', 'none', 'normal'   , 'infinite', keyframesShiftedUp  ],
        ]                                                   as CssKnownProps['animation'  ],
        animShiftedDown      : [
            ['600ms', 'ease-out', 'none', 'normal'   , 'infinite', keyframesShiftedDown],
        ]                                                   as CssKnownProps['animation'  ],
        
        
        
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
