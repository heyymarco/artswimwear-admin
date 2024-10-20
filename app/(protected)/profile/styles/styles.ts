// cssfn:
import {
    // writes css in javascript:
    rule,
    descendants,
    children,
    style,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a typography management system:
    typos,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
export const usesProfilePageLayout = () => {
    return style({
        ...children(['&', 'section'], {
            // layouts:
            display        : 'grid',
        }),
        ...children('section>article', {
            // layouts:
            display        : 'grid',
            gridTemplate   : [[
                '"image     name" auto',
                '"image username" auto',
                '"image    email" auto',
                '"image ........" auto',
                '/',
                '100px max-content',
            ]],
            justifyContent : 'center',
            alignContent   : 'center',
            
            
            
            // gap:
            gapInline : spacers.xl,
            gapBlock  : spacers.default,
            
            
            
            // children:
            ...children('*', {
                margin: 0,
                ...children('.label', {
                    display: 'block',
                    fontSize : typos.fontSizeSm,
                    fontWeight : typos.fontWeightNormal,
                }),
                ...descendants('.noValue', {
                    // appearances:
                    opacity    : 0.5,
                    
                    
                    
                    // typos:
                    fontStyle  : 'italic',
                }),
                ...children('.edit', {
                    ...rule(':not(.overlay)', {
                        // spacings:
                        marginInlineStart: '0.25em',
                        
                        
                        
                        // typos:
                        fontSize : '0.75em',
                    }),
                    // invert the edit overlay, so the edit overlay can be seen on busy background
                    ...rule('.overlay', {
                        // children:
                        ...children('[role="img"]', {
                            filter : [[
                                'invert(1)',
                            ]],
                        }),
                    }),
                }),
            }),
            ...children('.image', {
                gridArea: 'image',
            }),
            ...children('.floatingEdit', {
                translate: [[
                    `calc(100% + ${spacers.sm})`,
                    spacers.sm,
                ]],
            }),
            ...children('.name', {
                gridArea: 'name',
            }),
            ...children('.username', {
                gridArea: 'username',
            }),
            ...children('.email', {
                gridArea: 'email',
            }),
        }),
    });
};

export default () => style({
    // layouts:
    ...usesProfilePageLayout(),
});
