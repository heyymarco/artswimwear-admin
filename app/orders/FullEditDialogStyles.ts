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
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a responsive management system:
    ifScreenWidthAtLeast,
    
    
    
    // groups a list of UIs into a single UI:
    usesGroupable,
    typos,
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
const usesOrderListLayout = () => {
    return style({
        // spacings:
        gap: '0.5rem',
    });
}
const usesProductPreviewLayout = () => {
    return style({
        // positions:
        position : 'relative',
        gridArea : 'orderSummary',
        
        
        
        // layouts:
        display: 'grid',
        gridTemplate: [[
            '"image     title" max-content',
            '"image unitPrice" max-content',
            '"image  subPrice" max-content',
            '"image  ........" auto',
            '/',
            `${imageSize}px auto`,
        ]],
        
        
        
        // spacings:
        gapInline: '1rem',
        gapBlock: '0.25rem',
        padding: 0,
        
        
        
        // children:
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
        // children:
        ...children('article', {
            ...children('h3', {
                textAlign: 'center',
            }),
        }),
    }),
    scope('orderList', {
        ...usesOrderListLayout(),
    }, { specificityWeight: 2 }),
    scope('productPreview', {
        ...usesProductPreviewLayout(),
    }, { specificityWeight: 2 }),
    scope('orderDeliverySection', {
        // children:
        ...children('article', {
            ...children('h3', {
                textAlign: 'center',
            }),
        }),
    }),
    
    scope('paymentTab', {
    }),
];
