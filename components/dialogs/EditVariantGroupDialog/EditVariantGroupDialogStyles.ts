// cssfn:
import {
    // writes css in javascript:
    children,
    style,
    scope,
}                           from '@cssfn/core'          // writes css in javascript
import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a typography management system:
    typos,
    
    
    
    // a responsive management system:
    ifScreenWidthAtLeast,
}                           from '@reusable-ui/core'    // a set of reusable-ui packages which are responsible for building any component



// styles:
export const usesInfoTabLayout = () => {
    return style({
        // layout:
        display: 'grid',
        
        
        
        // scrolls:
        overscrollBehavior      : 'none',
        scrollPaddingBlockStart : '1.75rem', // makes scroll to field's label
        
        
        
        // children:
        ...children('form', {
            // layouts:
            display            : 'grid',
            alignContent       : 'start',
            gridTemplate       : [[
                '"name-label       "', 'auto',
                '"name-editor      "', 'auto',
                '"................."', spacers.sm,
                '"hasStock-label   "', 'auto',
                '"hasStock-editor  "', 'auto',
                '"................."', spacers.sm,
                '"variants-label   "', 'auto',
                '"variants-editor  "', 'auto',
                '/',
                '1fr'
            ]],
            ...ifScreenWidthAtLeast('lg', {
                gridTemplate   : [[
                    '"name-label               name-label"', 'auto',
                    '"name-editor             name-editor"', 'auto',
                    '"................. ................."', spacers.sm,
                    '"hasStock-label       hasStock-label"', 'auto',
                    '"hasStock-editor     hasStock-editor"', 'auto',
                    '"................. ................."', spacers.sm,
                    '"variants-label       variants-label"', 'auto',
                    '"variants-editor     variants-editor"', 'auto',
                    '/',
                    '1fr', '1fr'
                ]],
            }),
            
            
            
            // spacings:
            gapInline          : spacers.default,
            gapBlock           : spacers.xs,
            
            
            
            // children:
            ...children('.name.label'       , { gridArea: 'name-label'        }),
            ...children('.name.editor'      , { gridArea: 'name-editor'       }),
            
            ...children('.hasStock.label'   , { gridArea: 'hasStock-label'    }),
            ...children('.hasStock.editor'  , { gridArea: 'hasStock-editor'   }),
            
            ...children('.variants.label'   , { gridArea: 'variants-label'    }),
            ...children('.variants.editor'  , { gridArea: 'variants-editor'   }),
        }),
    });
};

export default () => [
    scope('infoTab', {
        ...usesInfoTabLayout(),
    }),
];
