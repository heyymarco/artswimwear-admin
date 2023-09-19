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
    
    
    
    // ring (focus indicator) color of UI:
    usesRing,
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
export const [galleryEditors, galleryEditorValues, cssGalleryEditorConfig] = cssConfig(() => {
    // dependencies:
    const {ringVars} = usesRing();
    
    
    
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
            boxShadow: [
                ['inset', 0, 0, 0, borders.hair, ringVars.ringFn],
            ] as any,
        },
        to    : {
            boxShadow: [
                ['inset', 0, 0, 0, borders.bold, ringVars.ringFn],
            ] as any,
        },
    });
    //#endregion keyframes
    
    
    
    const bases = {
        // animations:
        defaultAnimationDuration : basics.defaultAnimationDuration                      as CssKnownProps['animationDuration'],
        
        filterDisable            : [[
            'opacity(0.5)',
            'contrast(0.8)',
        ]]                                                                              as CssKnownProps['filter'           ],
        animEnable               : indicators.animEnable                                as CssKnownProps['animation'        ],
        animDisable              : indicators.animDisable                               as CssKnownProps['animation'        ],
        
        
        
        // spacings:
        gapInlineSm              : spacers.xs                                           as CssKnownProps['gapInline'        ],
        gapBlockSm               : spacers.xs                                           as CssKnownProps['gapBlock'         ],
        gapInlineMd              : spacers.sm                                           as CssKnownProps['gapInline'        ],
        gapBlockMd               : spacers.sm                                           as CssKnownProps['gapBlock'         ],
        gapInlineLg              : spacers.md                                           as CssKnownProps['gapInline'        ],
        gapBlockLg               : spacers.md                                           as CssKnownProps['gapBlock'         ],
        
        
        
        // items:
        itemPaddingInlineSm      : spacers.sm                                           as CssKnownProps['paddingInline'    ],
        itemPaddingBlockSm       : spacers.sm                                           as CssKnownProps['paddingBlock'     ],
        itemPaddingInlineMd      : [['calc((', spacers.sm, '+', spacers.md, ')/2)']]    as CssKnownProps['paddingInline'    ],
        itemPaddingBlockMd       : [['calc((', spacers.sm, '+', spacers.md, ')/2)']]    as CssKnownProps['paddingBlock'     ],
        itemPaddingInlineLg      : spacers.md                                           as CssKnownProps['paddingInline'    ],
        itemPaddingBlockLg       : spacers.md                                           as CssKnownProps['paddingBlock'     ],
        
        itemMinColumnWidthSm     : 'calc(3 * 40px)'                                     as CssKnownProps['columnWidth'      ],
        itemMinColumnWidthMd     : 'calc(5 * 40px)'                                     as CssKnownProps['columnWidth'      ],
        itemMinColumnWidthLg     : 'calc(8 * 40px)'                                     as CssKnownProps['columnWidth'      ],
        
        itemAspectRatio          : '1/1'                                                as CssKnownProps['aspectRatio'      ],
        
        
        
        // media:
        
        
        
        // titles:
        
        
        
        // images:
        imageObjectFit           : 'cover'                                              as CssKnownProps['objectFit'        ],
        
        
        
        // busies:
        
        
        
        // uploads:
        uploadBorderStyle        : 'dashed'                                             as CssKnownProps['borderStyle'      ],
        
        
        
        // uploadings:
        uploadingBorderStyle     : 'dashed'                                             as CssKnownProps['borderStyle'      ],
        
        
        
        // previewImages:
        previewImageObjectFit    : 'cover'                                              as CssKnownProps['objectFit'        ],
        previewImageFilter       : [[
            'opacity(0.5)',
            'contrast(0.8)',
        ]]                                                                              as CssKnownProps['filter'           ],
        
        
        
        // uploadProgresses:        
        
        
        
        // uploadErrors:
        
        
        
        // actions:
        
        
        
        // selectButtons:
        
        
        
        // deleteButtons:
        
        
        
        // retryButtons:
        
        
        
        // cancelButtons:
    };
    
    
    
    const subs = {
        // animations:
        
        ...keyframesDraggedRule,
        ...keyframesDroppedRule,
        ...keyframesDropTargetRule,
        animDragged              : [
            [bases.defaultAnimationDuration, 'linear'  , 'none', 'alternate', 'infinite', keyframesDragged          ],
        ]                                                                               as CssKnownProps['animation'        ],
        animDropped              : [
            [bases.defaultAnimationDuration, 'linear'  , 'none', 'alternate', 'infinite', keyframesDropped          ],
        ]                                                                               as CssKnownProps['animation'        ],
        animDropTarget           : [
            [bases.defaultAnimationDuration, 'linear'  , 'none', 'alternate', 'infinite', keyframesDropTarget       ],
        ]                                                                               as CssKnownProps['animation'        ],
        
        ...keyframesShiftedUpRule,
        ...keyframesShiftedDownRule,
        animShiftedUp            : [
            [bases.defaultAnimationDuration, 'ease-out', 'none', 'alternate', 'infinite', keyframesShiftedUp        ],
        ]                                                                               as CssKnownProps['animation'        ],
        animShiftedDown          : [
            [bases.defaultAnimationDuration, 'ease-out', 'none', 'alternate', 'infinite', keyframesShiftedDown      ],
        ]                                                                               as CssKnownProps['animation'        ],
        
        
        
        // uploads:
        ...uploadKeyframesDropTargetRule,
        uploadAnimDropTarget     : [
            [bases.defaultAnimationDuration, 'linear'  , 'none', 'alternate', 'infinite', uploadKeyframesDropTarget ],
        ]                                                                               as CssKnownProps['animation'        ],
    };
    
    
    
    const defaults = {
        // spacings:
        gapInline                : bases.gapInlineMd                                    as CssKnownProps['gapInline'        ],
        gapBlock                 : bases.gapBlockMd                                     as CssKnownProps['gapBlock'         ],
        
        
        
        // items:
        itemPaddingInline        : bases.itemPaddingInlineMd                            as CssKnownProps['paddingInline'    ],
        itemPaddingBlock         : bases.itemPaddingBlockMd                             as CssKnownProps['paddingBlock'     ],
        
        itemMinColumnWidth       : bases.itemMinColumnWidthMd                           as CssKnownProps['columnWidth'      ],
    };
    
    
    
    return {
        ...bases,
        ...subs,
        ...defaults,
    };
}, { prefix: 'gedit' });
