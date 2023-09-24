// cssfn:
import {
    // writes css in javascript:
    fallback,
    descendants,
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
    
    
    
    // groups a list of UIs into a single UI:
    usesGroupable,
    breakpoints,
}                           from '@reusable-ui/core'    // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // configs:
    containers,
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
            display : 'grid',
            
            
            
            // sizes:
            boxSizing         : 'border-box',
            minInlineSize     : `calc(100vw - (${containers.paddingInline} * 2))`,
            ...ifScreenWidthAtLeast('md', {
                minInlineSize : `calc(${breakpoints.sm}px - (${containers.paddingInline} * 2))`,
            }),
            
            
            
            // scrolls:
            overscrollBehavior      : 'none',
            scrollPaddingBlockStart : '1.75rem', // makes scroll to field's label
            
            
            
            // children:
            ...children('form', {
                // layouts:
                display      : 'grid',
                alignContent : 'start',
                gridTemplate : [[
                    '"name-label       "', 'auto',
                    '"name-editor      "', 'auto',
                    '"................."', spacers.sm,
                    '"authorities-label"', 'auto',
                    '"authorities-list "', 'auto',
                    '/',
                    '1fr'
                ]],
                
                
                
                // spacings:
                gapInline    : spacers.default,
                gapBlock     : spacers.xs,
                
                
                
                // children:
                ...children('.name.label'       , { gridArea: 'name-label'        }),
                ...children('.name.editor'      , { gridArea: 'name-editor'       }),
                
                ...children('.authorities.label', { gridArea: 'authorities-label' }),
                ...children('.authorities.list' , { gridArea: 'authorities-list'  }),
                ...children(':where(.authorities.list)' , {
                    ...children('*>*:where(:nth-child(2))', {
                        // layouts:
                        display       : 'flex',
                        flexDirection : 'row',
                        flexWrap      : 'wrap',
                        
                        
                        
                        // spacings:
                        gap           : spacers.default,
                    }),
                }),
            }),
        }),
    });
};

export default () => [
    scope('cardBody', {
        ...usesCardBodyLayout(),
    }, { specificityWeight: 2 }),
];
