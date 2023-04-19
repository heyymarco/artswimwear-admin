// cssfn:
import {
    style,
    children,
    scopeOf,
}                           from '@cssfn/core'          // writes css in javascript
import {
    // background stuff of UI:
    usesBackground,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a responsive management system:
    ifScreenWidthAtLeast,
}                           from '@reusable-ui/core'    // a set of reusable-ui packages which are responsible for building any component



// styles:
export const usesCardBodyLayout = () => {
    // dependencies:
    
    // features:
    const {backgroundRule, backgroundVars} = usesBackground();
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
            
            
            
            // backgrounds:
            backg         : backgroundVars.backg,
            
            
            
            // borders:
            [borderVars.borderStartStartRadius] : '0px',
            [borderVars.borderStartEndRadius  ] : '0px',
            [borderVars.borderEndStartRadius  ] : '0px',
            [borderVars.borderEndEndRadius    ] : '0px',
        }),
        
        
        
        // features:
        ...backgroundRule(), // must be placed at the last
    });
};
export const usesTabBodyLayout = () => {
    // dependencies:
    
    // features:
    const {borderVars} = usesBorder();
    
    
    
    return style({
        // scrolls:
        overflow       : 'auto', // enable horz & vert scrolling
        
        
        
        // borders:
        [borderVars.borderWidth]: '0px',
    });
};
export const usesPageInfoLayout = () => {
    return style({
        // layouts:
        display          : 'grid',
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
    scopeOf('cardBody', {
        ...usesCardBodyLayout(),
    }, { specificityWeight: 3 }),
    
    scopeOf('tabBody', {
        ...usesTabBodyLayout(),
    }, { specificityWeight: 3 }),
    
    scopeOf('pageInfo', {
        ...usesPageInfoLayout(),
    }, { specificityWeight: 3 }),
];
