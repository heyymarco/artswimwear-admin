// cssfn:
import {
    // writes css in javascript:
    rule,
    descendants,
    children,
    style,
    scope,
}                           from '@cssfn/core'          // writes css in javascript

// reusable-ui core:
import {
    // a border (stroke) management system:
    borders,
    borderRadiuses,
    
    
    
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a responsive management system:
    breakpoints,
    ifScreenWidthAtLeast,
    ifScreenWidthSmallerThan,
    
    
    
    // a typography management system:
    typos,
    horzRules,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
}                           from '@reusable-ui/core'    // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    containers,
    contents,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// configs:
import {
    commerces,
}                           from '@/config'



// defaults:
const imageSize = 64;  // 64px
const maxMobileTextWidth = `calc(${breakpoints.sm}px - (2 * ${contents.paddingInline}))`;



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
const usesViewCartLayout = () => {
    return style({
        // children:
        ...children('*', { // <li>
            // appearances:
            borderColor : `color-mix(in srgb, currentcolor calc(${horzRules.opacity} * 100%), transparent)`,
        }),
    });
}
const usesViewCartItemLayout = () => {
    return style({
        // positions:
        gridArea: 'orderSummary',
        
        
        
        // layouts:
        display      : 'grid',
        gridTemplate : [[
            '"title    title              title    title" max-content',
            '"image    image              image    image" max-content',
            '".....    labelUnitPrice unitPrice ........" max-content',
            '".....    labelQuantity   quantity ........" max-content',
            '"subPrice subPrice        subPrice subPrice" max-content',
            '/',
            `1fr auto auto 1fr`,
        ]],
        ...ifScreenWidthAtLeast('sm', {
            gridTemplate : [[
                '"number image title              title" max-content',
                '"number image labelUnitPrice unitPrice" max-content',
                '"number image labelQuantity   quantity" max-content',
                '"number image subPrice        subPrice" max-content',
                '/',
                `min-content min-content min-content auto`,
            ]],
        }),
        
        
        
        // spacings:
        gapInline     : spacers.sm,
        ...ifScreenWidthAtLeast('sm', {
            gapInline : 0, // different gap between prodImg and label
        }),
        gapBlock      : '0.5rem',
        paddingInline : '0px',
        
        
        
        // children:
        ...children('::before', {
            display : 'none',
            ...ifScreenWidthAtLeast('sm', {
                gridArea        : 'number',
                display         : 'grid',
                justifyContent  : 'end',
                alignContent    : 'center',
                
                
                
                // spacings:
                marginInlineEnd : spacers.sm,
            }),
        }),
        ...children('.prodImg', {
            // positions:
            gridArea    : 'image',
            justifySelf : 'center', // center horizontally
            alignSelf   : 'center', // center vertically
            
            
            
            // sizes:
            width       : `${imageSize}px`,
            aspectRatio : commerces.defaultProductAspectRatio,
            
            
            
            // backgrounds:
            background  : 'white',
            
            
            
            // spacings:
            ...ifScreenWidthAtLeast('sm', {
                marginInlineEnd : spacers.default,
            }),
            
            
            
            // children:
            ...children('img', {
                // sizes:
                width  : '100% !important',
                height : '100% !important',
            }),
        }),
        ...children('.title', {
            // positions:
            gridArea    : 'title',
            justifySelf : 'center', // center horizontally
            ...ifScreenWidthAtLeast('sm', {
                justifySelf : 'stretch', // stretch horizontally
            }),
            
            
            
            // sizes:
            ...ifScreenWidthSmallerThan('sm', {
                boxSizing     : 'border-box',
                maxInlineSize : maxMobileTextWidth,
            }),
            
            
            
            // typos:
            whiteSpace   : 'normal',
            textOverflow : 'ellipsis', // long text...
            wordBreak    : 'break-word',
            overflowWrap : 'break-word',
            overflow     : 'hidden',
            ...ifScreenWidthSmallerThan('sm', {
                textAlign: 'center',
            }),
        }),
        ...children(['.unitPrice', '.quantity'], {
            display             : 'grid',
            gridTemplateColumns : 'subgrid',
            
            
            
            // children:
            ...children('.label', {
                // spacings:
                marginInlineEnd : spacers.sm,
                
                
                
                // typos:
                textAlign       : 'end',   // right_most
            }),
            ...children('.value', {
                // typos:
                textAlign   : 'start', // left_most
            }),
        }),
        ...children('.unitPrice', {
            // positions:
            gridArea    : 'labelUnitPrice/labelUnitPrice / unitPrice/unitPrice',
            justifySelf : 'center', // center horizontally
            ...ifScreenWidthAtLeast('sm', {
                justifySelf : 'start', // place to the left
            }),
            
            
            
            // typos:
            fontWeight  : typos.fontWeightLight,
        }),
        ...children('.quantity', {
            // positions:
            gridArea    : 'labelQuantity/labelQuantity / quantity/quantity',
            justifySelf : 'center', // center horizontally
            ...ifScreenWidthAtLeast('sm', {
                justifySelf : 'start', // place to the left
            }),
            
            
            
            // children:
            ...children('.label', {
                fontWeight  : typos.fontWeightLight,
            }),
        }),
        ...children('.subPrice', {
            // positions:
            gridArea    : 'subPrice',
            justifySelf : 'end',
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
        insetInlineStart : 0,
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
const usesProgressBadgeLayout = () => {
    return style({
        // positions:
        position         : 'relative',
        insetInlineStart : `calc(0px - ${containers.paddingInline} + ${contents.paddingInline})`,
        insetBlockStart  : `calc(0px - ${containers.paddingBlock } + ${contents.paddingBlock })`,
        
        
        
        // sizes:
        contain          : 'inline-size', // do not take up space of width
        alignSelf        : 'start',
        
        
        
        // typos:
        whiteSpace        : 'nowrap',
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
        insetInlineEnd  : 0,
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
const usesTroubleHeaderLayout = () => {
    return style({
        display: 'grid',
        justifyContent : 'center',
    });
};
const usesTroubleBodyLayout = () => {
    return style({
        // layouts:
        display : 'grid',
        
        
        
        // children:
        ...children('*', {
            gridArea : '1 / 1 / 1 / 1',
        }),
    });
};
const usesTroubleContentLayout = () => {
    return style({
        ...children('*', {
            ...rule(':empty', {
                ...children('::before', {
                    // layouts:
                    display        : 'grid',
                    justifyContent : 'center',
                    alignContent   : 'center',
                    content        : '"-- no trouble note --"',
                }),
            }),
        }),
    });
};
const usesEditTroubleLayout = () => {
    return style({
        // positions:
        justifySelf : 'end',
        alignSelf   : 'center',
    });
};

export default () => [
    scope('orderShippingTab', {
        ...usesOrderShippingTabLayout(),
    }, { specificityWeight: 3 }),
    scope('orderShippingSection', {
        ...usesOrderShippingSectionLayout(),
    }),
    scope('viewCart', {
        ...usesViewCartLayout(),
    }, { specificityWeight: 2 }),
    scope('viewCartItem', {
        ...usesViewCartItemLayout(),
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
    scope('progressBadge', {
        ...usesProgressBadgeLayout(),
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
    
    scope('troubleHeader', {
        ...usesTroubleHeaderLayout(),
    }),
    scope('troubleBody', {
        ...usesTroubleBodyLayout(),
    }),
    scope('troubleContent', {
        ...usesTroubleContentLayout(),
    }),
    scope('editTrouble', {
        ...usesEditTroubleLayout(),
    }, { specificityWeight: 2 }),
];
