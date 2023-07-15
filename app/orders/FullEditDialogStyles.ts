// cssfn:
import {
    // writes css in javascript:
    rule,
    fallback,
    descendants,
    children,
    style,
    vars,
    scope,
}                           from '@cssfn/core'          // writes css in javascript
import {
    // a border (stroke) management system:
    borders,
    
    
    
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a responsive management system
    ifScreenWidthSmallerThan,
    
    
    
    // a typography management system:
    typos,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
}                           from '@reusable-ui/core'    // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // configs:
    lists,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components
import { commerces } from '@/config';



// defaults:
const imageSize = 48;  // 48px



// styles:
const usesCardBodyLayout = () => {
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
const usesTabListLayout = () => {
    return vars({
        // configs:
        [lists.borderRadius] : '0px',
    });
};
const usesTabBodyLayout = () => {
    // dependencies:
    
    // features:
    const {borderVars } = usesBorder();
    const {paddingVars} = usesPadding();
    
    
    
    return style({
        // borders:
        [borderVars.borderWidth]: '0px',
        
        
        
        // spacings:
        [paddingVars.paddingInline]: '0px',
        [paddingVars.paddingBlock ]: '0px',
        
        
        
        // children:
        ...descendants('.currencyBlock', {
            display: 'flex',
            
            ...rule('.totalCost', {
                ...descendants(['&', '.currency'], {
                    fontSize: typos.fontSizeLg,
                    fontWeight: typos.fontWeightSemibold,
                }),
            })
        }),
        ...descendants('.currency', {
            marginInlineStart: 'auto',
            fontSize: typos.fontSizeMd,
            fontWeight: typos.fontWeightSemibold,
            ...rule('.secondary', {
                fontSize: typos.fontSizeSm,
                fontWeight: typos.fontWeightLight,
            }),
        }),
    });
};
const usesOrderShippingTabLayout = () => {
    return style({
        // layouts:
        display        : 'flex',
        flexDirection  : 'column',
        justifyContent : 'start',       // if items are not growable, the excess space (if any) placed at the end, and if no sufficient space available => the first item should be visible first
        alignItems     : 'stretch',     // items width are 100% of the parent (for variant `.block`) or height (for variant `.inline`)
        flexWrap       : 'nowrap',      // no wrapping
        
        
        
        // sizes:
        boxSizing      : 'content-box',
        minInlineSize  : '32rem',
    });
};
const usesOrderShippingSectionLayout = () => {
    return style({
        // children:
        ...children('article', {
            ...children('h3', {
                textAlign: 'center',
            }),
        }),
    });
};
const usesOrderListLayout = () => {
    return style({
        // spacings:
        gap: '0.5rem',
    });
}
const usesProductItemLayout = () => {
    return style({
        // positions:
        gridArea: 'orderSummary',
        
        
        
        // layouts:
        display: 'grid',
        gridTemplate: [[
            '"num image     title" max-content',
            '"num image unitPrice" max-content',
            '"num image  subPrice" max-content',
            '"num image  ........" auto',
            '/',
            `1.25rem ${imageSize}px auto`,
        ]],
        
        
        
        // spacings:
        gapInline: '1rem',
        gapBlock: '0.25rem',
        padding: 0,
        
        
        
        // children:
        ...children('::before', {
            gridArea    : 'num',
            textAlign   : 'end',
        }),
        ...children('.image', {
            gridArea    : 'image',
            alignSelf   : 'center',
            
            background  : 'white',
            width       : `${imageSize}px`,
            aspectRatio : commerces.defaultProductAspectRatio,
        }),
        ...children('.title', {
            gridArea: 'title',
            
            fontWeight: typos.fontWeightNormal,
            margin: 0,
            // maxInlineSize: '15em',
            whiteSpace: 'normal',
            textOverflow : 'ellipsis', // long text...
            wordBreak    : 'break-word',
            overflowWrap : 'break-word',
            // overflow: 'hidden',
        }),
        ...children('.unitPrice', {
            gridArea: 'unitPrice',
            
            margin: 0,
            
            fontSize: typos.fontSizeSm,
            fontWeight: typos.fontWeightLight,
        }),
        ...children('.subPrice', {
            gridArea: 'subPrice',
            
            margin: 0,
        }),
    });
};
const usesOrderDeliverySectionLayout = () => {
    return style({
        // children:
        ...children('article', {
            ...children('h3', {
                textAlign: 'center',
            }),
            ...children('.shippingProvider', {
                // positions:
                position         : 'absolute',
                insetInlineStart : '0',
                insetBlockStart  : 0,
                
                
                
                // layouts:
                display: 'inline-block',
                
                
                
                // sizes:
                boxSizing     : 'content-box',
                minInlineSize : '4em',
                
                
                
                // borders:
                borderWidth  : 0,
                borderRadius : 0,
                
                
                
                // spacings:
                padding: spacers.sm,
                
                
                
                // typos:
                fontWeight : typos.fontWeightSemibold,
                textAlign  : 'center',
            })
        }),
    });
};
const usesPaymentTabLayout = () => {
    return style({
        // layouts:
        display        : 'flex',
        flexDirection  : 'column',
        justifyContent : 'start',       // if items are not growable, the excess space (if any) placed at the end, and if no sufficient space available => the first item should be visible first
        alignItems     : 'stretch',     // items width are 100% of the parent (for variant `.block`) or height (for variant `.inline`)
        flexWrap       : 'nowrap',      // no wrapping
    });
};
const usesPaymentSectionLayout = () => {
    // dependencies:
    
    // features:
    const {borderVars} = usesBorder();
    
    
    
    return style({
        // children:
        ...children('article', {
            // layouts:
            display        : 'flex',
            flexDirection  : 'column',
            justifyContent : 'start',       // if items are not growable, the excess space (if any) placed at the end, and if no sufficient space available => the first item should be visible first
            alignItems     : 'stretch',     // items width are 100% of the parent (for variant `.block`) or height (for variant `.inline`)
            flexWrap       : 'nowrap',      // no wrapping
            
            
            
            // children:
            ...children('table', {
                // positions:
                alignSelf      : 'center',
                
                
                
                // layouts:
                borderCollapse : 'collapse',
                tableLayout    : 'auto',
                // tableLayout : 'fixed',
                
                
                
                // borders:
                border         : borderVars.border,
                borderWidth    : borders.defaultWidth,
                
                
                
                // children:
                ...children('tbody', {
                    ...children('tr', {
                        borderBlockEnd      : borderVars.border,
                        borderBlockEndWidth : borders.defaultWidth,
                        
                        
                        
                        // children:
                        ...children(['th', 'td'], {
                            padding: '0.75rem',
                        }),
                        ...children('th', {
                            textAlign: 'end',
                            ...ifScreenWidthSmallerThan('sm', {
                                textAlign: 'center',
                            }),
                        }),
                        ...children('td', {
                            textAlign: 'start',
                            ...ifScreenWidthSmallerThan('sm', {
                                textAlign: 'center',
                            }),
                        }),
                        
                        ...children('th', {
                            fontWeight : typos.fontWeightSemibold,
                            textAlign  : 'end',
                        }),
                        ...children('td', {
                            ...children('.paymentProvider', {
                                width         : '42px',
                                verticalAlign : 'middle',
                            }),
                            ...children('.paymentIdentifier', {
                                // positions:
                                verticalAlign     : 'middle',
                                
                                
                                
                                // layouts:
                                display           : 'inline-block',
                                
                                
                                
                                // sizes:
                                boxSizing         : 'content-box',
                                maxInlineSize     : '25em',
                                
                                
                                
                                // scrolls:
                                overflow          : 'hidden',   // hide the rest text if overflowed
                                whiteSpace        : 'nowrap',   // do not break word on [space]
                                overflowWrap      : 'normal',   // do not break word for long_word
                                textOverflow      : 'ellipsis', // put triple_dot after long_word...
                                
                                
                                
                                // spacings:
                                marginInlineStart : '0.5em',
                                
                                
                                
                                // typos:
                                fontSize          : typos.fontSizeSm,
                            }),
                        }),
                    }),
                }),
            }),
        }),
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
    
    scope('orderShippingTab', {
        ...usesOrderShippingTabLayout(),
    }),
    scope('orderShippingSection', {
        ...usesOrderShippingSectionLayout(),
    }),
    scope('orderList', {
        ...usesOrderListLayout(),
    }, { specificityWeight: 2 }),
    scope('productItem', {
        ...usesProductItemLayout(),
    }, { specificityWeight: 2 }),
    scope('orderDeliverySection', {
        ...usesOrderDeliverySectionLayout(),
    }),
    
    scope('paymentTab', {
        ...usesPaymentTabLayout(),
    }),
    scope('paymentSection', {
        ...usesPaymentSectionLayout(),
    }),
];
