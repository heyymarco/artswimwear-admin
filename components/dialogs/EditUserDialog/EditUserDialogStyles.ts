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
export const usesAccountTabLayout = () => {
    return style({
        // layout:
        display: 'grid',
        
        
        
        // scrolls:
        overscrollBehavior      : 'none',
        scrollPaddingBlockStart : '1.75rem', // makes scroll to field's label
        
        
        
        // children:
        ...children('form', {// layouts:
            display            : 'grid',
            alignContent       : 'start',
            gridTemplate       : [[
                '"name-label       "', 'auto',
                '"name-editor      "', 'auto',
                '"................."', spacers.sm,
                '"username-label   "', 'auto',
                '"username-editor  "', 'auto',
                '"................."', spacers.sm,
                '"email-label      "', 'auto',
                '"email-editor     "', 'auto',
                '"................."', spacers.sm,
                '/',
                '1fr'
            ]],
            
            
            
            // spacings:
            gapInline          : spacers.default,
            gapBlock           : spacers.xs,
            
            
            
            // children:
            ...children('.name.label'       , { gridArea: 'name-label'        }),
            ...children('.name.editor'      , { gridArea: 'name-editor'       }),
            
            ...children('.username.label'   , { gridArea: 'username-label'    }),
            ...children('.username.editor'  , { gridArea: 'username-editor'   }),
            
            ...children('.email.label'      , { gridArea: 'email-label'       }),
            ...children('.email.editor'     , { gridArea: 'email-editor'      }),
        }),
    });
};
export const usesImageTabLayout = () => {
    return style({
        // positions:
        justifySelf : 'center',
        alignSelf   : 'center',
    });
};
export const usesRoleTabLayout = () => {
    return style({
        // scrolls:
        overscrollBehavior : 'none',
    });
};

export default () => [
    scope('accountTab', {
        ...usesAccountTabLayout(),
    }),
    scope('imageTab', {
        ...usesImageTabLayout(),
    }),
    scope('roleTab', {
        ...usesRoleTabLayout(),
    }),
];
