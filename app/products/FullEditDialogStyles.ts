// cssfn:
import {
    style,
    children,
}                           from '@cssfn/core'          // writes css in javascript
import { ifScreenWidthAtLeast, spacers } from '@reusable-ui/core';



// styles:
export const usesFullEditDialogLayout = () => {
    return style({
        display: 'grid',
        gridTemplate: [[
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
            '"stock-label      "', 'auto',
            '"stock-editor     "', 'auto',
            '"................."', spacers.sm,
            '"visibility-label "', 'auto',
            '"visibility-editor"', 'auto',
            '/',
            '1fr'
        ]],
        ...ifScreenWidthAtLeast('lg', {
            gridTemplate: [[
                '"name-label               name-label"', 'auto',
                '"name-editor             name-editor"', 'auto',
                '"................. ................."', spacers.sm,
                '"path-label               path-label"', 'auto',
                '"path-editor             path-editor"', 'auto',
                '"................. ................."', spacers.sm,
                '"price-label           sWeight-label"', 'auto',
                '"price-editor         sWeight-editor"', 'auto',
                '"................. ................."', spacers.sm,
                '"stock-label        visibility-label"', 'auto',
                '"stock-editor      visibility-editor"', 'auto',
                '/',
                '1fr', '1fr'
            ]],
        }),
        gapInline: spacers.default,
        gapBlock : spacers.xs,
        
        
        
        // children:
        ...children('.name.label'       , { gridArea: 'name-label'        }),
        ...children('.name.editor'      , { gridArea: 'name-editor'       }),
        
        ...children('.path.label'       , { gridArea: 'path-label'        }),
        ...children('.path.editor'      , { gridArea: 'path-editor'       }),
        
        ...children('.price.label'      , { gridArea: 'price-label'       }),
        ...children('.price.editor'     , { gridArea: 'price-editor'      }),
        
        ...children('.sWeight.label'    , { gridArea: 'sWeight-label'     }),
        ...children('.sWeight.editor'   , { gridArea: 'sWeight-editor'    }),
        
        ...children('.stock.label'      , { gridArea: 'stock-label'       }),
        ...children('.stock.editor'     , { gridArea: 'stock-editor'      }),
        
        ...children('.visibility.label' , { gridArea: 'visibility-label'  }),
        ...children('.visibility.editor', { gridArea: 'visibility-editor' }),
    });
};

export default () => style({
    // layouts:
    ...usesFullEditDialogLayout(),
});
