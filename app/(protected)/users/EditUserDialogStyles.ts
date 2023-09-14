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
            display        : 'flex',
            flexDirection  : 'column',
            justifyContent : 'start',       // if items are not growable, the excess space (if any) placed at the end, and if no sufficient space available => the first item should be visible first
            alignItems     : 'stretch',     // items width are 100% of the parent (for variant `.block`) or height (for variant `.inline`)
            flexWrap       : 'nowrap',      // no wrapping
            
            
            
            // sizes:
            // the default <Card>'s body height is resizeable, ensuring footers are aligned to the bottom:
            flex           : [[1, 1, 'auto']], // growable, shrinkable, initial from it's width (for variant `.inline`) or height (for variant `.block`)
            minInlineSize     : `calc(100vw - (${containers.paddingInline} * 2))`,
            ...ifScreenWidthAtLeast('md', {
                minInlineSize : `${breakpoints.sm}px`,
            }),
            
            
            
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
    return style({
        // layouts:
        ...style({
            // positions:
            zIndex: 1, // a draggable fix for Chrome
        }),
        
        
        
        // configs:
        ...vars({
            [lists.borderRadius] : '0px',
        }),
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
export const usesAccountTabLayout = () => {
    return style({
        // layout:
        display: 'grid',
        
        
        
        // scrolls:
        overscrollBehavior : 'none',
        
        
        
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
        // scrolls:
        overscrollBehavior : 'none',
    });
};
export const usesRoleTabLayout = () => {
    return style({
        // scrolls:
        overscrollBehavior : 'none',
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
