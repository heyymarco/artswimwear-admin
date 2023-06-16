// cssfn:
import {
    // writes css in javascript:
    children,
    style,
    vars,
    scope,
}                           from '@cssfn/core'          // writes css in javascript
import {
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a responsive management system:
    ifScreenWidthAtLeast,
}                           from '@reusable-ui/core'    // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // configs:
    lists,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// styles:
export const usesCardBodyLayout = () => {
    // dependencies:
    
    // features:
    const {borderVars} = usesBorder();
    
    
    
    return style({
        // layouts:
        ...style({
            // layouts:
            display        : 'flex',
            flexDirection  : 'column',
            justifyContent : 'start',       // if items are not growable, the excess space (if any) placed at the end, and if no sufficient space available => the first item should be visible first
            alignItems     : 'stretch',     // items width are 100% of the parent (for variant `.block`) or height (for variant `.inline`)
            flexWrap       : 'nowrap',      // no wrapping
            
            
            
            // sizes:
            // the default <Card>'s body height is resizeable, ensuring footers are aligned to the bottom:
            flex           : [[1, 1, 'auto']], // growable, shrinkable, initial from it's width (for variant `.inline`) or height (for variant `.block`)
            
            
            
            // scrolls:
            overflow       : 'hidden', // force <TabBody> to scroll
            
            
            
            // borders:
            [borderVars.borderStartStartRadius] : '0px',
            [borderVars.borderStartEndRadius  ] : '0px',
            [borderVars.borderEndStartRadius  ] : '0px',
            [borderVars.borderEndEndRadius    ] : '0px',
        }),
    });
};
export const usesTabListLayout = () => {
    return vars({
        // configs:
        [lists.borderRadius] : '0px',
    });
};
export const usesTabBodyLayout = () => {
    // dependencies:
    
    // features:
    const {borderVars} = usesBorder();
    
    
    
    return style({
        // borders:
        [borderVars.borderWidth]: '0px',
    });
};
export const usesPageInfoLayout = () => {
    return style({
        // layouts:
        display          : 'grid',
        alignContent     : 'start',
        gridTemplate     : [[
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
            gridTemplate : [[
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
        
        
        
        // spacings:
        gapInline : spacers.default,
        gapBlock  : spacers.xs,
        
        
        
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

export default () => [
    scope('cardBody', {
        ...usesCardBodyLayout(),
    }, { specificityWeight: 3 }),
    
    scope('tabList', {
        ...usesTabListLayout(),
    }, { specificityWeight: 2 }),
    
    scope('tabBody', {
        ...usesTabBodyLayout(),
    }, { specificityWeight: 2 }),
    
    scope('pageInfo', {
        ...usesPageInfoLayout(),
    }),
];
