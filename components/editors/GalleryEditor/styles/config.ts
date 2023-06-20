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
            scale : '103%',
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
        from  : {
            transform: [[
                'perspective(500px)',
                'rotateY(0deg)',
            ]],
        },
        to    : {
            transform: [[
                'perspective(500px)',
                'rotateY(5deg)',
            ]],
        },
    });
    const [keyframesShiftedDownRule, keyframesShiftedDown] = keyframes({
        from  : {
            transform: [[
                'perspective(500px)',
                'rotateY(0deg)',
            ]],
        },
        to    : {
            transform: [[
                'perspective(500px)',
                'rotateY(-5deg)',
            ]],
        },
    });
    
    
    
    const [uploadKeyframesDropTargetRule, uploadKeyframesDropTarget] = keyframes({
        from  : {
            borderStyle : 'solid',
            borderWidth : borders.hair,
        },
        to    : {
            borderStyle : 'solid',
            borderWidth : borders.bold,
        },
    });
    //#endregion keyframes
    
    
    
    const bases = {
        // animations:
        defaultAnimationDuration : basics.defaultAnimationDuration  as CssKnownProps['animationDuration'],
        
        
        
        // spacings:
        gapInlineSm          : spacers.xs                           as CssKnownProps['gapInline'        ],
        gapBlockSm           : spacers.xs                           as CssKnownProps['gapBlock'         ],
        gapInlineMd          : spacers.sm                           as CssKnownProps['gapInline'        ],
        gapBlockMd           : spacers.sm                           as CssKnownProps['gapBlock'         ],
        gapInlineLg          : spacers.md                           as CssKnownProps['gapInline'        ],
        gapBlockLg           : spacers.md                           as CssKnownProps['gapBlock'         ],
        
        
        
        // items:
        itemMinColumnWidthSm : 'calc(3 * 40px)'                     as CssKnownProps['columnWidth'      ],
        itemMinColumnWidthMd : 'calc(5 * 40px)'                     as CssKnownProps['columnWidth'      ],
        itemMinColumnWidthLg : 'calc(8 * 40px)'                     as CssKnownProps['columnWidth'      ],
        
        itemAspectRatio      : '1/1'                                as CssKnownProps['aspectRatio'      ],
        
        
        
        // uploads:
        uploadBorderStyle    : 'dashed'                             as CssKnownProps['borderStyle'      ],
        
        
        
        // uploadings:
        uploadingBorderStyle : 'dashed'                             as CssKnownProps['borderStyle'      ],
    };
    
    
    
    const subs = {
        // animations:
        
        ...keyframesDraggedRule,
        ...keyframesDroppedRule,
        ...keyframesDropTargetRule,
        animDragged          : [
            [bases.defaultAnimationDuration, 'linear'  , 'none', 'alternate', 'infinite', keyframesDragged          ],
        ]                                                           as CssKnownProps['animation'        ],
        animDropped          : [
            [bases.defaultAnimationDuration, 'linear'  , 'none', 'alternate', 'infinite', keyframesDropped          ],
        ]                                                           as CssKnownProps['animation'        ],
        animDropTarget       : [
            [bases.defaultAnimationDuration, 'linear'  , 'none', 'alternate', 'infinite', keyframesDropTarget       ],
        ]                                                           as CssKnownProps['animation'        ],
        
        ...keyframesShiftedUpRule,
        ...keyframesShiftedDownRule,
        animShiftedUp        : [
            [bases.defaultAnimationDuration, 'ease-out', 'none', 'alternate', 'infinite', keyframesShiftedUp        ],
        ]                                                           as CssKnownProps['animation'        ],
        animShiftedDown      : [
            [bases.defaultAnimationDuration, 'ease-out', 'none', 'alternate', 'infinite', keyframesShiftedDown      ],
        ]                                                           as CssKnownProps['animation'        ],
        
        
        
        // uploads:
        ...uploadKeyframesDropTargetRule,
        uploadAnimDropTarget : [
            [bases.defaultAnimationDuration, 'linear'  , 'none', 'alternate', 'infinite', uploadKeyframesDropTarget ],
        ]                                                           as CssKnownProps['animation'        ],
    };
    
    
    
    const defaults = {
        // spacings:
        gapInline            : bases.gapInlineMd                    as CssKnownProps['gapInline'        ],
        gapBlock             : bases.gapBlockMd                     as CssKnownProps['gapBlock'         ],
        
        
        
        // items:
        itemMinColumnWidth   : bases.itemMinColumnWidthMd           as CssKnownProps['columnWidth'      ],
    };
    
    
    
    return {
        ...bases,
        ...subs,
        ...defaults,
    };
}, { prefix: 'gedit' });
