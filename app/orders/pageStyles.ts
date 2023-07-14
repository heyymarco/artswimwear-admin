// cssfn:
import {
    children,
    descendants,
    rule,
    scope,
    style,
}                           from '@cssfn/core'          // writes css in javascript
import { basics } from '@reusable-ui/components';
import { typos, usesBorder, usesGroupable, usesPadding } from '@reusable-ui/core';



// styles:
const imageSize = 128;  // 128px
const usesOrderListLayout = () => { // the <section> of order list
    // dependencies:
    
    // capabilities:
    const {groupableRule} = usesGroupable({
        orientationInlineSelector : null, // craft the <List>'s borderRadius manually, uncraft the other <portal><ModalBackdrop><ModalDialog>
        orientationBlockSelector  : null, // craft the <List>'s borderRadius manually, uncraft the other <portal><ModalBackdrop><ModalDialog>
    });
    
    // features:
    const {paddingVars} = usesPadding();
    
    
    
    return style({
        // capabilities:
        ...groupableRule(),  // make a nicely rounded corners
        
        
        
        // layouts:
        ...style({
            // positions:
            gridArea: 'orderList',
            
            
            
            // layouts:
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            
            
            
            // sizes:
            minBlockSize : '150px', // a temporary fix for empty loading appearance
            
            
            
            // spacings:
            [paddingVars.paddingInline] : '0px',
            [paddingVars.paddingBlock ] : '0px',
        }),
    });
};
const usesOrderListInnerLayout = () => { // the <List> of order list
    // dependencies:
    
    // capabilities:
    const {groupableVars} = usesGroupable();
    
    // features:
    const {borderVars } = usesBorder();
    
    
    
    return style({
        [groupableVars.borderStartStartRadius] : 'inherit !important', // reads parent's prop
        [groupableVars.borderStartEndRadius  ] : 'inherit !important', // reads parent's prop
        [groupableVars.borderEndStartRadius  ] : 'inherit !important', // reads parent's prop
        [groupableVars.borderEndEndRadius    ] : 'inherit !important', // reads parent's prop
        
        [borderVars.borderStartStartRadius] : groupableVars.borderStartStartRadius,
        [borderVars.borderStartEndRadius  ] : groupableVars.borderStartEndRadius,
        [borderVars.borderEndStartRadius  ] : groupableVars.borderEndStartRadius,
        [borderVars.borderEndEndRadius    ] : groupableVars.borderEndEndRadius,
    });
};
const usesOrderItemLayout = () => { // the <ListItem> of order list
    // dependencies:
    
    // features:
    const {paddingVars} = usesPadding();
    
    
    
    return style({
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        ...descendants('[role="dialog"]', {
            [paddingVars.paddingInline] : '0px',
            [paddingVars.paddingBlock ] : '0px',
        }),
    });
};
const usesOrderItemWrapperLayout = () => { // the <div> of the <ListItem> of order list
    // dependencies:
    
    // capabilities:
    const {groupableRule, groupableVars} = usesGroupable({
        orientationInlineSelector : null,      // craft the <Carousel>'s borderRadius manually
        orientationBlockSelector  : null,      // craft the <Carousel>'s borderRadius manually
        itemsSelector             : '.images', // select the <Carousel>
    });
    
    // features:
    const {borderRule , borderVars } = usesBorder({ borderWidth: '0px' });
    const {paddingRule, paddingVars} = usesPadding({
        paddingInline : '1rem',
        paddingBlock  : '1rem',
    });
    
    // spacings:
    const positivePaddingInline = groupableVars.paddingInline;
    const positivePaddingBlock  = groupableVars.paddingBlock;
    const negativePaddingInline = `calc(0px - ${positivePaddingInline})`;
    const negativePaddingBlock  = `calc(0px - ${positivePaddingBlock })`;
    
    
    
    return style({
        // capabilities:
        ...groupableRule(), // make a nicely rounded corners
        
        
        
        // layouts:
        ...style({
            // layouts:
            display: 'grid',
            gridTemplate: [[
                '"images orderId   "', 'auto',
                '"images customer  "', 'auto',
                '"images fullEditor"', 'auto',
                '/',
                `calc(${imageSize}px - ${paddingVars.paddingInline}) 1fr`,
            ]],
            
            
            
            // borders:
            // follows <parent>'s borderRadius
            border                   : borderVars.border,
         // borderRadius             : borderVars.borderRadius,
            borderStartStartRadius   : borderVars.borderStartStartRadius,
            borderStartEndRadius     : borderVars.borderStartEndRadius,
            borderEndStartRadius     : borderVars.borderEndStartRadius,
            borderEndEndRadius       : borderVars.borderEndEndRadius,
            [borderVars.borderWidth] : '0px', // only setup borderRadius, no borderStroke
            
            
            
            // spacings:
         // padding       : paddingVars.padding,
            paddingInline : paddingVars.paddingInline,
            paddingBlock  : paddingVars.paddingBlock,
            
            gapInline     : '1rem',
            gapBlock      : '0.5rem',
            
            
            
            // children:
            ...descendants(['.orderId', 'p'], {
                margin: 0,
            }),
            ...descendants('.edit', {
                marginInlineStart: '0.25em',
                opacity: 0.5,
                transition: [
                    ['transform', '300ms', 'ease-out'],
                ],
                ...rule(':hover', {
                    opacity: 'unset',
                    transform: 'scale(105%)',
                }),
            }),
            ...children('.orderId', {
                gridArea: 'orderId',
                fontSize: typos.fontSizeXl,
            }),
            ...children('.customer', {
                gridArea: 'customer',
                ...children(['.name', '.email'], {
                    display: 'block',
                }),
            }),
            ...children('.images', {
                // layouts:
                gridArea    : 'images',
                
                
                
                // sizes:
                alignSelf   : 'stretch',
                
                
                
                // borders:
                // follows <parent>'s borderRadius
                [borderVars.borderStartStartRadius] : groupableVars.borderStartStartRadius,
                [borderVars.borderStartEndRadius  ] : '0px',
                [borderVars.borderEndStartRadius  ] : groupableVars.borderEndStartRadius,
                [borderVars.borderEndEndRadius    ] : '0px',
                [borderVars.borderWidth           ] : '0px', // only setup borderRadius, no borderStroke
                borderInlineEndWidth : basics.borderWidth,
                
                
                
                // spacings:
                // cancel-out parent's padding with negative margin:
                marginInlineStart : negativePaddingInline,
                marginBlock       : negativePaddingBlock,
            }),
            ...children('.fullEditor', {
                gridArea: 'fullEditor',
            }),
        }),
        
        
        
        // features:
        ...borderRule(),  // must be placed at the last
        ...paddingRule(), // must be placed at the last
    });
};
export default () => [
    scope('page', {
        display: 'flex',
        flexDirection: 'column',
    }),
    scope('paginationLoading', {
        blockSize: '100%',
    }, { specificityWeight: 2 }),
    scope('orders', {
        flexGrow: 1,
        
        display: 'flex',
        flexDirection: 'column',
        ...children('article', {
            flexGrow: 1,
            
            display: 'grid',
            gridTemplate: [[
                '"paginTop"',  'auto',
                '"orderList"', '1fr',
                '"paginBtm"',  'auto',
                '/',
                'auto',
            ]],
            gapInline: '1rem',
            gapBlock: '1rem',
        }),
    }, { specificityWeight: 2 }),
    scope('paginTop', {
        gridArea: 'paginTop',
        
        justifySelf: 'center',
    }),
    scope('orderList', { // the <section> of order list
        ...usesOrderListLayout(),
    }, { specificityWeight: 2 }),
    scope('orderListInner', { // the <List> of order list
        ...usesOrderListInnerLayout(),
    }, { specificityWeight: 2 }),
    scope('paginBtm', {
        gridArea: 'paginBtm',
        
        justifySelf: 'center',
    }),
    scope('orderFetching', {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...children('.loadingBar', {
            alignSelf: 'stretch',
        }),
    }, { specificityWeight: 2 }),
    scope('orderItem', { // the <ListItem> of order list
        ...usesOrderItemLayout(),
    }, { specificityWeight: 2 }),
    scope('orderItemWrapper', { // the <div> of the <ListItem> of order list
        ...usesOrderItemWrapperLayout(),
    }, { specificityWeight: 2 }),
];
