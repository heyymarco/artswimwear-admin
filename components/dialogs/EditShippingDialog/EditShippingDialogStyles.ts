// cssfn:
import {
    // writes css in javascript:
    rule,
    fallback,
    children,
    style,
    scope,
}                           from '@cssfn/core'          // writes css in javascript
import {
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a responsive management system:
    ifScreenWidthAtLeast,
    
    
    
    // groups a list of UIs into a single UI:
    usesGroupable,
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
                '"path-label       "', 'auto',
                '"path-editor      "', 'auto',
                '"................."', spacers.sm,
                '"price-label      "', 'auto',
                '"price-editor     "', 'auto',
                '"................."', spacers.sm,
                '"sWeight-label    "', 'auto',
                '"sWeight-editor   "', 'auto',
                '"................."', spacers.sm,
                '"visibility-label "', 'auto',
                '"visibility-editor"', 'auto',
                '/',
                '1fr'
            ]],
            ...ifScreenWidthAtLeast('lg', {
                gridTemplate   : [[
                    '"name-label               name-label"', 'auto',
                    '"name-editor             name-editor"', 'auto',
                    '"................. ................."', spacers.sm,
                    '"path-label               path-label"', 'auto',
                    '"path-editor             path-editor"', 'auto',
                    '"................. ................."', spacers.sm,
                    '"price-label           sWeight-label"', 'auto',
                    '"price-editor         sWeight-editor"', 'auto',
                    '"................. ................."', spacers.sm,
                    '"visibility-label   visibility-label"', 'auto',
                    '"visibility-editor visibility-editor"', 'auto',
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
            
            ...children('.path.label'       , { gridArea: 'path-label'        }),
            ...children('.path.editor'      , { gridArea: 'path-editor'       }),
            
            ...children('.price.label'      , { gridArea: 'price-label'       }),
            ...children('.price.editor'     , { gridArea: 'price-editor'      }),
            
            ...children('.sWeight.label'    , { gridArea: 'sWeight-label'     }),
            ...children('.sWeight.editor'   , { gridArea: 'sWeight-editor'    }),
            
            ...children('.visibility.label' , { gridArea: 'visibility-label'  }),
            ...children('.visibility.editor', { gridArea: 'visibility-editor' }),
        }),
    });
};
export const usesVariantsTabLayout = () => {
    return style({
        // layouts:
        display      : 'grid',
        alignContent : 'start',
    });
};
export const usesRatesTabLayout = () => {
    return style({
    });
};

export default () => [
    scope('infoTab', {
        ...usesInfoTabLayout(),
    }),
    scope('variantsTab', {
        ...usesVariantsTabLayout(),
    }, { specificityWeight: 4 }),
    scope('ratesTab', {
        ...usesRatesTabLayout(),
    }),
];
