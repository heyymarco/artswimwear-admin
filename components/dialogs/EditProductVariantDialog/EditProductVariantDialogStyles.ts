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
                '"name-label            "', 'auto',
                '"name-editor           "', 'auto',
                '"......................"', spacers.sm,
                '"price-label           "', 'auto',
                '"price-label-optional  "', 'auto',
                '"price-editor          "', 'auto',
                '"......................"', spacers.sm,
                '"sWeight-label         "', 'auto',
                '"sWeight-label-optional"', 'auto',
                '"sWeight-editor        "', 'auto',
                '"......................"', spacers.sm,
                '"visibility-label      "', 'auto',
                '"visibility-editor     "', 'auto',
                '/',
                '1fr'
            ]],
            ...ifScreenWidthAtLeast('lg', {
                gridTemplate   : [[
                    '"name-label                        name-label"', 'auto',
                    '"name-label-optional      name-label-optional"', 'auto',
                    '"name-editor                      name-editor"', 'auto',
                    '".....................  ....................."', spacers.sm,
                    '"price-label                    sWeight-label"', 'auto',
                    '"price-label-optional  sWeight-label-optional"', 'auto',
                    '"price-editor                  sWeight-editor"', 'auto',
                    '".....................  ....................."', spacers.sm,
                    '"visibility-label            visibility-label"', 'auto',
                    '"visibility-editor          visibility-editor"', 'auto',
                    '/',
                    '1fr', '1fr'
                ]],
            }),
            
            
            
            // spacings:
            gapInline          : spacers.default,
            gapBlock           : spacers.xs,
            
            
            
            // children:
            ...children('.label.optional', {
                marginBlockStart : `calc(0px - ${spacers.xs})`, // cancels out default block spacing
                fontSize : typos.fontSizeSm,
                opacity  : 0.5,
            }),
            ...children('.name.label'            , { gridArea: 'name-label'             }),
            ...children('.name.editor'           , { gridArea: 'name-editor'            }),
            
            ...children('.price.label'           , { gridArea: 'price-label'            }),
            ...children('.price.label.optional'  , { gridArea: 'price-label-optional'   }),
            ...children('.price.editor'          , { gridArea: 'price-editor'           }),
            
            ...children('.sWeight.label'         , { gridArea: 'sWeight-label'          }),
            ...children('.sWeight.label.optional', { gridArea: 'sWeight-label-optional' }),
            ...children('.sWeight.editor'        , { gridArea: 'sWeight-editor'         }),
            
            ...children('.visibility.label'      , { gridArea: 'visibility-label'       }),
            ...children('.visibility.editor'     , { gridArea: 'visibility-editor'      }),
        }),
    });
};
export const usesImagesTabLayout = () => {
    return style({
        // scrolls:
        overscrollBehavior : 'none',
    });
};

export default () => [
    scope('infoTab', {
        ...usesInfoTabLayout(),
    }),
    scope('imagesTab', {
        ...usesImagesTabLayout(),
    }),
];
