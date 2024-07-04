// cssfn:
import {
    // writes css in javascript:
    descendants,
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
                '"visibility-label "', 'auto',
                '"visibility-editor"', 'auto',
                '"................."', spacers.sm,
                '"autoUpdate-label "', 'auto',
                '"autoUpdate-editor"', 'auto',
                '/',
                '1fr'
            ]],
            
            
            
            // spacings:
            gapInline          : spacers.default,
            gapBlock           : spacers.xs,
            
            
            
            // children:
            ...children('.name.label'       , { gridArea: 'name-label'        }),
            ...children('.name.editor'      , { gridArea: 'name-editor'       }),
            
            ...children('.visibility.label' , { gridArea: 'visibility-label'  }),
            ...children('.visibility.editor', { gridArea: 'visibility-editor' }),
            
            ...children('.autoUpdate.label' , { gridArea: 'autoUpdate-label'  }),
            ...children('.autoUpdate.editor', { gridArea: 'autoUpdate-editor' }),
            
            ...children('.autoUpdate.editor', {
                // layouts:
                display : 'grid',
            }),
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
                '"weightStep-label "', 'auto',
                '"weightStep-editor"', 'auto',
                '"................."', spacers.sm,
                '"eta-label        "', 'auto',
                '"eta-editor       "', 'auto',
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
            ...children('.weightStep.label' , { gridArea: 'weightStep-label'  }),
            ...children('.weightStep.editor', { gridArea: 'weightStep-editor' }),
            
            ...children('.eta.label'        , { gridArea: 'eta-label'         }),
            ...children('.eta.editor'       , { gridArea: 'eta-editor'        }),
            
            ...children('.rate.label'       , { gridArea: 'rate-label'        }),
            ...children('.rate.editor'      , { gridArea: 'rate-editor'       }),
            
            ...children('.eta.editor', {
                ...descendants('.editor', {
                    textAlign : 'end',
                }),
            }),
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
        
        ...children('.zone.editor'   , { gridArea: 'zone-editor'    }),
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
