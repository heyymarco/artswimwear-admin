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
    
    
    
    // removes browser's default stylesheet:
    stripoutTextbox,
    
    
    
    // background stuff of UI:
    usesBackground,
    
    
    
    // foreground (text color) stuff of UI:
    usesForeground,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
    
    
    
    // groups a list of UIs into a single UI:
    usesGroupable,
}                           from '@reusable-ui/core'    // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    basics,
    
    
    
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
                // sizes:
                alignSelf     : 'center',  // center
                ...ifScreenWidthSmallerThan('sm', {
                    alignSelf : 'stretch', // full width
                }),
                
                
                
                // children:
                ...children('tbody', {
                    ...children('tr', {
                        ...children('td', { // special data formatting
                            // spacings:
                            gap                : spacers.sm,
                            
                            
                            
                            ...rule('.currencyData', {
                                ...ifScreenWidthAtLeast('sm', {
                                    justifyContent : 'end',  // right_most the items horizontally
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
const usesPaymentConfirmationAlertLayout = () => {
    return style({
        // sizes:
        contain: 'inline-size', // do not take up the <Dialog>'s width, just fill the available width
        width: '100%',
    });
};
const usesOutputDateLayout = () => {
    return style({
        ...stripoutTextbox(),
    });
};
const usesPaymentConfirmActionsLayout = () => {
    return style({
        display: 'grid',
        gap: spacers.default,
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
const usesNoteHeaderLayout = () => {
    return style({
        display: 'grid',
        justifyContent : 'center',
    });
};
const usesNoteBodyLayout = () => {
    return style({
        // layouts:
        display : 'grid',
        
        
        
        // children:
        ...children('*', {
            gridArea : '1 / 1 / 1 / 1',
        }),
    });
};
const usesNoteEmptyLayout = () => {
    return style({
        // positions:
        justifySelf : 'center',
        alignSelf   : 'center',
    });
};
const usesNoteContentCenterLayout = () => {
    return style({
        // positions:
        justifySelf : 'center',
        alignSelf   : 'center',
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
    scope('paymentConfirmationAlert', {
        ...usesPaymentConfirmationAlertLayout(),
    }),
    scope('outputDate', {
        ...usesOutputDateLayout(),
    }),
    scope('paymentConfirmActions', {
        ...usesPaymentConfirmActionsLayout(),
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
    
    scope('noteHeader', {
        ...usesNoteHeaderLayout(),
    }),
    scope('noteBody', {
        ...usesNoteBodyLayout(),
    }),
    scope('noteEmpty', {
        ...usesNoteEmptyLayout(),
    }),
    scope('noteContentCenter', {
        ...usesNoteContentCenterLayout(),
    }),
    scope('editTrouble', {
        ...usesEditTroubleLayout(),
    }, { specificityWeight: 2 }),
];
