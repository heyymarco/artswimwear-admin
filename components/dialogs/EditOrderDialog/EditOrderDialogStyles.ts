// cssfn:
import {
    // writes css in javascript:
    rule,
    descendants,
    children,
    style,
    scope,
}                           from '@cssfn/core'          // writes css in javascript
import {
    // a border (stroke) management system:
    borders,
    borderRadiuses,
    
    
    
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a responsive management system
    ifScreenWidthAtLeast,
    ifScreenWidthSmallerThan,
    
    
    
    // a typography management system:
    typos,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
}                           from '@reusable-ui/core'    // a set of reusable-ui packages which are responsible for building any component

// configs:
import {
    commerces,
}                           from '@/config'



// defaults:
const imageSize = 48;  // 48px



// styles:
const usesOrderShippingTabLayout = () => {
    return style({
        // layouts:
        display            : 'flex',
        flexDirection      : 'column',
        justifyContent     : 'start',   // if items are not growable, the excess space (if any) placed at the end, and if no sufficient space available => the first item should be visible first
        alignItems         : 'stretch', // items width are 100% of the parent (for variant `.block`) or height (for variant `.inline`)
        flexWrap           : 'nowrap',  // no wrapping
        
        
        
        // sizes:
        boxSizing          : 'content-box',
        minInlineSize      : '32rem',
        
        
        
        // scrolls:
        overscrollBehavior : 'none',
        
        
        
        // spacings:
        padding            : '0px',
    });
};
const usesOrderShippingSectionLayout = () => {
    return style({
        // children:
        ...children('article', {
            ...children('h3', {
                textAlign: 'center',
            }),
            ...descendants('p', {
                margin: 0,
            }),
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
        }),
    });
};
const usesActionSectionLayout = () => {
    return style({
        // children:
        ...children('article', {
            // layouts:
            display            : 'flex',
            flexDirection      : 'column',
            justifyContent     : 'start',   // if items are not growable, the excess space (if any) placed at the end, and if no sufficient space available => the first item should be visible first
            alignItems         : 'stretch', // items width are 100% of the parent (for variant `.block`) or height (for variant `.inline`)
            flexWrap           : 'nowrap',  // no wrapping
            
            
            
            // spacings:
            gap : spacers.default,
        }),
    });
};
const usesPaymentTabLayout = () => {
    return style({
        // layouts:
        display            : 'flex',
        flexDirection      : 'column',
        justifyContent     : 'start',   // if items are not growable, the excess space (if any) placed at the end, and if no sufficient space available => the first item should be visible first
        alignItems         : 'stretch', // items width are 100% of the parent (for variant `.block`) or height (for variant `.inline`)
        flexWrap           : 'nowrap',  // no wrapping
        
        
        
        // scrolls:
        overscrollBehavior : 'none',
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
            alignItems     : 'center',      // center item(s) horizonally
            flexWrap       : 'nowrap',      // no wrapping
            
            
            
            // spacings:
            gap : spacers.lg,
            
            
            
            // children:
            ...children('table', {
                // layouts:
                borderCollapse : 'separate',
                borderSpacing  : 0,
                tableLayout    : 'auto',
                
                
                
                // sizes:
                ...ifScreenWidthSmallerThan('sm', {
                    inlineSize : '100%',
                }),
                
                
                
                // children:
                ...children(['thead', 'tbody'], {
                    // border strokes & radiuses:
                    ...children('tr', {
                        ...children(['th', 'td'], {
                            ...rule(':first-child', {
                                borderInlineStart              : borderVars.border,
                                borderInlineStartWidth         : borders.defaultWidth,
                            }),
                            ...rule(':last-child', {
                                borderInlineEnd                : borderVars.border,
                                borderInlineEndWidth           : borders.defaultWidth,
                            }),
                        }),
                    }),
                    ...rule(':first-child', {
                        ...children('tr', {
                            ...rule(':first-child', {
                                ...children(['th', 'td'], {
                                    borderBlockStart           : borderVars.border,
                                    borderBlockStartWidth      : borders.defaultWidth,
                                    
                                    
                                    
                                    ...rule(':first-child', {
                                        borderStartStartRadius : borderRadiuses.default,
                                    }),
                                    ...rule(':last-child', {
                                        borderStartEndRadius   : borderRadiuses.default,
                                    }),
                                }),
                            }),
                        }),
                    }),
                    ...rule(':last-child', {
                        ...children('tr', {
                            ...rule(':last-child', {
                                ...children(['th', 'td'], {
                                    borderBlockEnd             : borderVars.border,
                                    borderBlockEndWidth        : borders.defaultWidth,
                                    
                                    
                                    
                                    ...rule(':first-child', {
                                        borderEndStartRadius   : borderRadiuses.default,
                                    }),
                                    ...rule(':last-child', {
                                        borderEndEndRadius     : borderRadiuses.default,
                                    }),
                                }),
                            }),
                        }),
                    }),
                    
                    
                    
                    // border separators:
                    ...children('tr', { // border as separator between row(s)
                        ...rule(':not(:last-child)', {
                            ...children(['th', 'td'], {
                                borderBlockEnd      : borderVars.border,
                                borderBlockEndWidth : borders.defaultWidth,
                            }),
                        }),
                    }),
                    ...rule(':not(:last-child)', { // border as separator between thead|tbody
                        ...children('tr', {
                            ...rule(':last-child', {
                                ...children(['th', 'td'], {
                                    borderBlockEnd      : borderVars.border,
                                    borderBlockEndWidth : borders.defaultWidth,
                                }),
                            }),
                        }),
                    }),
                    
                    
                    
                    // children:
                    ...children('tr', {
                        // children:
                        ...children(['th', 'td'], { // spacing for all cells
                            // spacings:
                            padding        : '0.75rem',
                        }),
                        ...children('th', { // default title formatting
                            // typos:
                            fontWeight     : typos.fontWeightSemibold,
                            textAlign      : 'center', // center the title horizontally
                        }),
                    }),
                }),
                ...children('tbody', {
                    // conditional border strokes & radiuses:
                    ...ifScreenWidthSmallerThan('sm', {
                        ...children('tr', {
                            ...children(['th', 'td'], {
                                borderInline      : borderVars.border,
                                borderInlineWidth : borders.defaultWidth,
                            }),
                        }),
                        ...rule(':first-child', {
                            ...children('tr', {
                                ...rule(':first-child', {
                                    ...children(['th', 'td'], {
                                        ...rule(':not(:first-child)', {
                                            borderBlockStartWidth  : 0, // kill the separator
                                            
                                            borderStartStartRadius : 0,
                                            borderStartEndRadius   : 0,
                                        }),
                                        ...rule(':first-child', {
                                            borderStartStartRadius : borderRadiuses.default,
                                            borderStartEndRadius   : borderRadiuses.default,
                                        }),
                                    }),
                                }),
                            }),
                        }),
                        ...rule(':last-child', {
                            ...children('tr', {
                                ...rule(':last-child', {
                                    ...children(['th', 'td'], {
                                        ...rule(':not(:last-child)', {
                                            borderEndStartRadius   : 0,
                                            borderEndEndRadius     : 0,
                                        }),
                                        ...rule(':last-child', {
                                            borderEndStartRadius   : borderRadiuses.default,
                                            borderEndEndRadius     : borderRadiuses.default,
                                        }),
                                    }),
                                }),
                            }),
                        }),
                    }),
                    
                    
                    
                    // conditional border separators:
                    ...ifScreenWidthSmallerThan('sm', {
                        ...children('tr', {
                            ...rule(':nth-child(n)', { // increase specificity
                                ...children(['th', 'td'], {
                                    ...rule(':not(:last-child)', {
                                        borderBlockEnd : 0,
                                    }),
                                }),
                            }),
                        }),
                    }),
                    
                    
                    
                    ...children('tr', {
                        // layouts:
                        // the table cells is set to 'grid'|'block', causing the table structure broken,
                        // to fix this we set the table row to flex:
                        display               : 'flex',
                        
                        flexDirection         : 'column',
                        justifyContent        : 'start',   // top_most the items vertically
                        alignItems            : 'stretch', // stretch  the items horizontally
                        ...ifScreenWidthAtLeast('sm', {
                            flexDirection     : 'row',
                            // justifyContent : 'start',   // top_most the items horizontally
                            // alignItems     : 'stretch', // stretch  the items vertically
                        }),
                        
                        flexWrap              : 'nowrap',  // no wrapping
                        
                        
                        
                        // children:
                        ...children('th', { // special title formatting
                            // layouts:
                            display            : 'grid',
                            
                            justifyContent     : 'center',  // center     the items horizontally
                            ...ifScreenWidthAtLeast('sm', {
                                justifyContent : 'end',     // right_most the items horizontally
                            }),
                            
                            alignContent       : 'center',  // center     the items vertically
                            
                            
                            
                            // sizes:
                            ...ifScreenWidthAtLeast('sm', {
                                // fixed size accross table(s), simulating subgrid:
                                boxSizing      : 'content-box',
                                inlineSize     : '4em', // a fixed size by try n error
                                flex           : [[0, 0, 'auto']], // ungrowable, unshrinkable, initial from it's width
                            }),
                        }),
                        ...children('td', { // special data formatting
                            // sizes:
                            
                            // fill the remaining width for data cells:
                            ...rule(':nth-child(2)', {
                                flex       : [[1, 1, 'auto']], // growable, shrinkable, initial from it's width
                            }),
                        }),
                        ...children('td', {
                            // layouts:
                            display            : 'grid',
                                    
                            justifyContent     : 'center', // center    the items horizontally
                            ...ifScreenWidthAtLeast('sm', {
                                justifyContent : 'start',  // left_most the items horizontally
                            }),
                            
                            alignItems         : 'center', // center    the each item vertically
                            justifyItems       : 'center', // center    the each item horizontally
                            
                            gridAutoFlow       : 'row',
                            ...ifScreenWidthAtLeast('sm', {
                                gridAutoFlow   : 'column',
                            }),
                            
                            
                            
                            // spacings:
                            gap                : spacers.sm,
                            
                            
                            
                            ...rule('.currencyData', {
                                ...ifScreenWidthAtLeast('sm', {
                                    justifyContent : 'end',  // right_most the items horizontally
                                }),
                                ...children('.currencyNumber', {
                                    // marginInlineStart : 'auto',
                                }),
                                ...children('.hidden', {
                                    visibility : 'hidden',
                                }),
                            }),
                            ...children('.paymentProvider', {
                                width         : '42px',
                                height         : 'auto',
                                
                                
                                
                                // borders:
                                border         : borderVars.border,
                                borderWidth    : borders.defaultWidth,
                                borderRadius   : borderRadiuses.sm,
                            }),
                            ...children('.paymentIdentifier', {
                                // typos:
                                fontSize       : typos.fontSizeSm,
                                fontWeight     : typos.fontWeightNormal,
                            }),
                        }),
                    }),
                }),
            }),
        }),
    });
};
const usesBadgeLayout = () => {
    return style({
        // positions:
        position         : 'absolute',
        insetInlineStart : '0',
        insetBlockStart  : 0,
        
        
        
        // layouts:
        display: 'inline-block',
        
        
        
        // sizes:
        boxSizing     : 'content-box',
        minInlineSize : '6em',
        
        
        
        // borders:
        borderWidth  : 0,
        borderRadius : 0,
        
        
        
        // spacings:
        padding: spacers.sm,
        
        
        
        // typos:
        fontWeight : typos.fontWeightSemibold,
        textAlign  : 'center',
    });
};
const usesShippingAddressLayout = () => {
    return style({
        // positions:
        position        : 'relative',
    });
};
const usesEditShippingAddressLayout = () => {
    return style({
        // positions:
        position        : 'absolute',
        insetInlineEnd  : '0',
        insetBlockStart : 0,
        
        
        
        // spacings:
        margin: spacers.sm,
    });
};
const usesPrintSpacerLayout = () => {
    return style({
        // layouts:
        display: 'grid', // hide the <Content> if [screen mode]
        gridTemplate: [[
            '"scissors line" auto',
            '/',
            'auto 1fr',
        ]],
        alignItems: 'center', // center vertically
        
        
        
        // spacings:
        paddingBlock : spacers.lg,
        
        
        
        // children:
        ...children('.scissors', {
            // positions:
            gridArea: 'scissors',
        }),
        ...children('.line', {
            // positions:
            gridArea: 'line',
            
            
            
            // borders:
            borderBlockStartStyle: 'dashed',
            borderBlockStartWidth : borders.thin,
            
            
            
            // spacings:
            margin: 0,
        }),
    });
};

export default () => [
    scope('orderShippingTab', {
        ...usesOrderShippingTabLayout(),
    }, { specificityWeight: 3 }),
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
    scope('actionSection', {
        ...usesActionSectionLayout(),
    }),
    
    scope('paymentTab', {
        ...usesPaymentTabLayout(),
    }),
    scope('paymentSection', {
        ...usesPaymentSectionLayout(),
    }),
    
    scope('badge', {
        ...usesBadgeLayout(),
    }, { specificityWeight: 2 }),
    
    scope('shippingAddress', {
        ...usesShippingAddressLayout(),
    }),
    scope('editShippingAddress', {
        ...usesEditShippingAddressLayout(),
    }, { specificityWeight: 2 }),
    
    scope('printSpacer', {
        ...usesPrintSpacerLayout(),
    }, { specificityWeight: 2 }),
];
