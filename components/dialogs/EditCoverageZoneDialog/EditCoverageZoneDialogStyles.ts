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
                '"name-label "', 'auto',
                '"name-editor"', 'auto',
                '/',
                '1fr'
            ]],
            
            
            
            // spacings:
            gapInline          : spacers.default,
            gapBlock           : spacers.xs,
            
            
            
            // children:
            ...children('.name.label'       , { gridArea: 'name-label'        }),
            ...children('.name.editor'      , { gridArea: 'name-editor'       }),
        }),
    });
};
export const usesDefaultRatesTabLayout = () => {
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
                '"estimate-label   "', 'auto',
                '"estimate-editor  "', 'auto',
                '"................."', spacers.sm,
                '"rate-label       "', 'auto',
                '"rate-editor      "', 'auto',
                '/',
                '1fr'
            ]],
            
            
            
            // spacings:
            gapInline          : spacers.default,
            gapBlock           : spacers.xs,
            
            
            
            // children:
            ...children('.estimate.label'   , { gridArea: 'estimate-label'    }),
            ...children('.estimate.editor'  , { gridArea: 'estimate-editor'   }),
            
            ...children('.rate.label'       , { gridArea: 'rate-label'        }),
            ...children('.rate.editor'      , { gridArea: 'rate-editor'       }),
        }),
    });
};
export const usesSpecificRatesTabLayout = () => {
    return style({
        // layouts:
        display            : 'grid',
        alignContent       : 'start',
        gridTemplate       : [[
            '"useArea-editor"', 'auto',
            '".............."', spacers.sm,
            '"zone-editor   "', 'auto',
            '/',
            '1fr'
        ]],
        
        
        
        // scrolls:
        overscrollBehavior      : 'none',
        scrollPaddingBlockStart : '1.75rem', // makes scroll to field's label
        
        
        
        // spacings:
        gapInline          : spacers.default,
        gapBlock           : spacers.xs,
        
        
        
        // children:
        ...children('.useArea.editor', { gridArea: 'useArea-editor' }),
        
        ...children('.zone.editor'   , { gridArea: 'zone-editor' }),
    });
};

export default () => [
    scope('infoTab', {
        ...usesInfoTabLayout(),
    }),
    scope('defaultRatesTab', {
        ...usesDefaultRatesTabLayout(),
    }),
    scope('specificRatesTab', {
        ...usesSpecificRatesTabLayout(),
    }),
];
