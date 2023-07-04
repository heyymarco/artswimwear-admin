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
export const [wysiwygEditors, wysiwygEditorValues, cssWysiwygEditorConfig] = cssConfig(() => {
    const bases = {
        // appearances:
        placeholderOpacity           : 0.5                                                  as CssKnownProps['opacity'      ],
        
        
        
        // toolbars:
        toolbarGapInline             : spacers.default                                      as CssKnownProps['gapInline'    ],
        toolbarGapBlock              : spacers.default                                      as CssKnownProps['gapBlock'     ],
        toolbarFilter                : [[
            'contrast(120%)',
        ]]                                                                                  as CssKnownProps['filter'       ],
        
        toolbarPaddingInlineSm       : spacers.sm                                           as CssKnownProps['paddingInline'],
        toolbarPaddingBlockSm        : spacers.sm                                           as CssKnownProps['paddingBlock' ],
        toolbarPaddingInlineMd       : [['calc((', spacers.sm, '+', spacers.md, ')/2)']]    as CssKnownProps['paddingInline'],
        toolbarPaddingBlockMd        : [['calc((', spacers.sm, '+', spacers.md, ')/2)']]    as CssKnownProps['paddingBlock' ],
        toolbarPaddingInlineLg       : spacers.md                                           as CssKnownProps['paddingInline'],
        toolbarPaddingBlockLg        : spacers.md                                           as CssKnownProps['paddingBlock' ],
        
        
        
        // headingEditors:
        headingEditorBoxSizing       : 'content-box'                                        as CssKnownProps['boxSizing'    ],
        headingEditorMinInlineSize   : '6em'                                                as CssKnownProps['minInlineSize'],
        
        
        
        // alignmentEditors:
        alignmentEditorBoxSizing     : 'content-box'                                        as CssKnownProps['boxSizing'    ],
        alignmentEditorMinInlineSize : '4.5em'                                              as CssKnownProps['minInlineSize'],
    };
    
    
    
    const defaults = {
        // spacings:
        toolbarPaddingInline         : bases.toolbarPaddingInlineMd                         as CssKnownProps['paddingInline'],
        toolbarPaddingBlock          : bases.toolbarPaddingBlockMd                          as CssKnownProps['paddingBlock' ],
    };
    
    
    
    return {
        ...bases,
        ...defaults,
    };
}, { prefix: 'wysiwyg' });
