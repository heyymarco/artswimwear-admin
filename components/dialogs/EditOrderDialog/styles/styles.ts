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
const usesTableLayout = () => {
    // dependencies:
    
    // features:
    const {backgroundRule, backgroundVars} = usesBackground(basics);
    const {foregroundRule, foregroundVars} = usesForeground(basics);
    const {borderRule    , borderVars    } = usesBorder(basics);
    const {paddingRule   , paddingVars   } = usesPadding(basics);
    
    // capabilities:
    const {groupableRule, separatorRule, groupableVars} = usesGroupable({
        orientationInlineSelector : null, // never  => the <table> is never  stacked in horizontal
        orientationBlockSelector  : '&',  // always => the <table> is always stacked in vertical
        itemsSelector             : ['thead', 'tbody', 'tfoot'], // select <thead>, <tbody>, <tfoot>
    });
    const {groupableRule: subGroupableRule, separatorRule: subSeparatorRule} = usesGroupable({
        orientationInlineSelector : null, // never  => the <thead>, <tbody>, <tfoot> are never  stacked in horizontal
        orientationBlockSelector  : '&',  // always => the <thead>, <tbody>, <tfoot> are always stacked in vertical
        itemsSelector             : 'tr', // select <tr>
    });
    const {groupableRule: rowGroupableRule} = usesGroupable({
        orientationInlineSelector : '&',  // always => the <thead>, <tbody>, <tfoot> are always stacked in horizontal
        orientationBlockSelector  : null, // never  => the <thead>, <tbody>, <tfoot> are never  stacked in vertical
        itemsSelector             : ['td', 'th'], // select <tr> & <th>
    });
    
    
    
    return style({
        // capabilities:
        ...groupableRule(), // make a nicely rounded corners
        
        
        
        // layouts:
        ...style({
            // layouts:
            display             : 'grid',
            gridTemplateColumns : 'repeat(1, auto)',   // single column
            ...ifScreenWidthAtLeast('sm', {
                gridTemplateColumns : 'auto 1fr auto', // multi  columns : <Title>|<Label> + <Content> + <EditButton>
            }),
            ...children(['thead', 'tbody', 'tfoot'], {
                gridColumn          : '1 / -1', // span the entire columns
                display             : 'grid',
                gridTemplateColumns : 'subgrid',
                ...children('tr', {
                    gridColumn          : 'inherit',
                    display             : 'inherit',
                    gridTemplateColumns : 'inherit',
                    ...children(['td', 'th'], {
                        display          : 'grid',
                        gridTemplateRows : 'auto', // only 1 row
                        gridAutoFlow     : 'column',
                        
                        ...rule('[colspan="2"]', {
                            gridColumnEnd : 'span 2',
                        }),
                        ...rule('[colspan="3"]', {
                            gridColumnEnd : 'span 3',
                        }),
                        ...ifScreenWidthAtLeast('sm', { // auto fix for multi column : missing column of <EditButton>
                            ...rule(':last-child', {
                                ...rule(':nth-child(1)', {
                                    gridColumnEnd : 'span 3',
                                }),
                                ...rule(':nth-child(2)', {
                                    gridColumnEnd : 'span 2',
                                }),
                            }),
                        }),
                    }),
                }),
            }),
            
            
            
            // borders:
            border                 : borderVars.border,
         // borderRadius           : borderVars.borderRadius,
            borderStartStartRadius : borderVars.borderStartStartRadius,
            borderStartEndRadius   : borderVars.borderStartEndRadius,
            borderEndStartRadius   : borderVars.borderEndStartRadius,
            borderEndEndRadius     : borderVars.borderEndEndRadius,
            ...children(['thead', 'tbody', 'tfoot'], {
                border                 : borderVars.border,
                ...separatorRule(), // turns the current border as separator between <thead>, <tbody>, <tfoot>
                
             // borderRadius           : borderVars.borderRadius,
                borderStartStartRadius : borderVars.borderStartStartRadius,
                borderStartEndRadius   : borderVars.borderStartEndRadius,
                borderEndStartRadius   : borderVars.borderEndStartRadius,
                borderEndEndRadius     : borderVars.borderEndEndRadius,
                
                
                
                // children:
                ...subGroupableRule(),
                ...children('tr', {
                    border                 : borderVars.border,
                    ...subSeparatorRule(), // turns the current border as separator between <tr>(s)
                    
                 // borderRadius           : borderVars.borderRadius,
                    borderStartStartRadius : borderVars.borderStartStartRadius,
                    borderStartEndRadius   : borderVars.borderStartEndRadius,
                    borderEndStartRadius   : borderVars.borderEndStartRadius,
                    borderEndEndRadius     : borderVars.borderEndEndRadius,
                    
                    
                    
                    // children:
                    ...rowGroupableRule(), // turns the borderRadius(es) of the first & last <td>|<th>
                    ...children(['td', 'th'], {
                        // border                 : borderVars.border,
                        // ...rowSeparatorRule(), // turns the current border as separator between <td>|<th>(s)
                        
                     // borderRadius           : borderVars.borderRadius,
                        borderStartStartRadius : borderVars.borderStartStartRadius,
                        borderStartEndRadius   : borderVars.borderStartEndRadius,
                        borderEndStartRadius   : borderVars.borderEndStartRadius,
                        borderEndEndRadius     : borderVars.borderEndEndRadius,
                    }),
                }),
            }),
            
            
            
            // spacings:
            paddingInline : paddingVars.paddingInline,
            paddingBlock  : paddingVars.paddingBlock,
            ...children(['thead', 'tbody', 'tfoot'], {
                marginInline         : `calc(0px - ${groupableVars.paddingInline})`, // cancel out parent's padding with negative margin
                ...rule(':first-child', {
                    marginBlockStart : `calc(0px - ${groupableVars.paddingBlock })`, // cancel out parent's padding with negative margin
                }),
                ...rule(':last-child', {
                    marginBlockEnd   : `calc(0px - ${groupableVars.paddingBlock })`, // cancel out parent's padding with negative margin
                }),
            }),
            
            
            
            // children:
            ...children(['thead', 'tbody', 'tfoot'], {
                ...children('tr', {
                    ...children(['td', 'th'], { // spacing for all cells
                        // spacings:
                        padding        : '0.75rem',
                    }),
                    ...children(['td', 'th'], { // common features
                        // features:
                        ...backgroundRule(), // must be placed at the last
                        ...foregroundRule(), // must be placed at the last
                    }),
                    ...children('th', { // default title formatting
                        // typos:
                        fontWeight     : typos.fontWeightSemibold,
                        textAlign      : 'center', // center the title horizontally
                    }),
                    ...children('td', { // default data formatting
                        // typos:
                        wordBreak      : 'break-word',
                        overflowWrap   : 'anywhere', // break long text like email
                    }),
                }),
            }),
            ...children(['thead', 'tfoot'], {
                ...children('tr', {
                    ...children('th', { // special theme color for header|footer's cell(s)
                        // accessibilities:
                        ...rule(['&::selection', '& ::selection'], { // ::selection on self and descendants
                            // backgrounds:
                            backg : backgroundVars.backgColor,
                            
                            
                            
                            // foregrounds:
                            foreg : foregroundVars.foreg,
                        }),
                        
                        
                        
                        // backgrounds:
                        backg     : backgroundVars.altBackgColor,
                        
                        
                        
                        // foregrounds:
                        foreg     : foregroundVars.altForeg,
                    }),
                }),
            }),
            ...children('tbody', {
                ...children('tr', {
                    ...children(['td', 'th'], { // special theme color for body's cell(s)
                        // accessibilities:
                        ...rule(['&::selection', '& ::selection'], { // ::selection on self and descendants
                            // backgrounds:
                            backg : backgroundVars.altBackgColor,
                            
                            
                            
                            // foregrounds:
                            foreg : foregroundVars.altForeg,
                        }),
                        
                        
                        
                        // backgrounds:
                        backg     : backgroundVars.backgColor,
                        
                        
                        
                        // foregrounds:
                        foreg     : foregroundVars.foreg,
                    }),
                    ...children('th', { // special title formatting
                        ...rule(':nth-child(1)', { // <th> as <Label>
                            // layouts:
                            justifyContent     : 'center',  // center     the items horizontally
                            ...ifScreenWidthAtLeast('sm', {
                                justifyContent : 'end',     // right_most the items horizontally
                            }),
                            
                            alignContent       : 'center',  // center     the items vertically
                        }),
                    }),
                    ...children('td', { // special data formatting
                        // special layouts:
                        ...rule(':nth-child(1)', { // <td> as <Label>
                            // layouts:
                            justifyContent     : 'center',  // center     the items horizontally
                            ...ifScreenWidthAtLeast('sm', {
                                justifyContent : 'end',     // right_most the items horizontally
                            }),
                        }),
                        ...rule(':nth-child(2)', { // <td> as <Data>
                            // layouts:
                            justifyContent     : 'center',  // center    the items horizontally
                            ...ifScreenWidthAtLeast('sm', {
                                justifyContent : 'start',   // left_most the items horizontally
                            }),
                        }),
                        ...rule(':nth-child(3)', { // <td> as <EditButton>
                            // layouts:
                            justifyContent : 'center', // center the items vertically
                        }),
                    }),
                }),
            }),
        }),
        
        
        
        // features:
        ...borderRule(),     // must be placed at the last
        ...paddingRule(),    // must be placed at the last
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
                ...usesTableLayout(),
                
                
                
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
