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
}                           from '@reusable-ui/core'    // a set of reusable-ui packages which are responsible for building any component



// styles:
export const usesRoleTabLayout = () => {
    return style({
        // layout:
        display: 'grid',
        
        
        
        // scrolls:
        overscrollBehavior      : 'none',
        scrollPaddingBlockStart : '1.75rem', // makes scroll to field's label
        
        
        
        // children:
        ...children('form', {
            // layouts:
            display      : 'grid',
            alignContent : 'start',
            gridTemplate : [[
                '"name-label      "', 'auto',
                '"name-editor     "', 'auto',
                '"................"', spacers.sm,
                '"privileges-label"', 'auto',
                '"privileges-list "', 'auto',
                '/',
                '1fr'
            ]],
            
            
            
            // spacings:
            gapInline    : spacers.default,
            gapBlock     : spacers.xs,
            
            
            
            // children:
            ...children('.name.label'      , { gridArea: 'name-label'        }),
            ...children('.name.editor'     , { gridArea: 'name-editor'       }),
            
            ...children('.privileges.label', { gridArea: 'privileges-label' }),
            ...children('.privileges.list' , { gridArea: 'privileges-list'  }),
            ...children(':where(.privileges.list)' , {
                ...children('*>*:where(:nth-child(2))', {
                    // layouts:
                    display       : 'flex',
                    flexDirection : 'row',
                    flexWrap      : 'wrap',
                    
                    
                    
                    // sizes:
                    contain       : 'inline-size', // do not take inline-space
                    
                    
                    
                    // spacings:
                    gap           : spacers.default,
                }),
            }),
        }),
    });
};

export default () => [
    scope('roleTab', {
        ...usesRoleTabLayout(),
    }),
];
