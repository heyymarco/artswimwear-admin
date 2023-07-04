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

// reusable-ui components:
import {
    // configs:
    basics,
}                           from '@reusable-ui/basic'           // a base component
import {
    // configs:
    controls,
}                           from '@reusable-ui/control'         // a base component



// configs:
export const [wysiwygEditors, wysiwygEditorValues, cssWysiwygEditorConfig] = cssConfig(() => {
    return {
        // appearances:
        placeholderOpacity           : 0.5                      as CssKnownProps['opacity'      ],
        
        
        
        // rings:
        ring                         : basics.ring              as CssKnownProps['color'        ],
        
        
        
        // animations:
        boxShadowFocus               : controls.boxShadowFocus  as CssKnownProps['boxShadow'    ],
        animFocus                    : controls.animFocus       as CssKnownProps['animation'    ],
        animBlur                     : controls.animBlur        as CssKnownProps['animation'    ],
        
        
        // toolbars:
        toolbarGapInline             : spacers.default          as CssKnownProps['gapInline'    ],
        toolbarGapBlock              : spacers.default          as CssKnownProps['gapBlock'     ],
        toolbarFilter                : [[
            'contrast(120%)',
        ]]                                                      as CssKnownProps['filter'       ],
        
        
        
        // headingEditors:
        headingEditorBoxSizing       : 'content-box'            as CssKnownProps['boxSizing'    ],
        headingEditorMinInlineSize   : '6em'                    as CssKnownProps['minInlineSize'],
        
        
        
        // alignmentEditors:
        alignmentEditorBoxSizing     : 'content-box'            as CssKnownProps['boxSizing'    ],
        alignmentEditorMinInlineSize : '4.5em'                  as CssKnownProps['minInlineSize'],
    };
}, { prefix: 'wysiwyg' });
