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



// defaults:
const imageSize = 128;  // 128px
const usesProductListLayout = () => { // the <section> of product list
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
            gridArea  : 'productList',
            alignSelf : 'start',
            
            
            
            // layouts:
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            
            
            
            // // sizes:
            // minBlockSize : '150px', // a temporary fix for empty loading appearance
            
            
            
            // spacings:
            [paddingVars.paddingInline] : '0px',
            [paddingVars.paddingBlock ] : '0px',
        }),
    });
};
const usesProductListInnerLayout = () => { // the <List> of product list
    // dependencies:
    
    // capabilities:
    const {groupableVars} = usesGroupable();
    
    // features:
    const {borderVars } = usesBorder();
    
    
    
    return style({
        // borders:
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
const usesProductCreateLayout = () => { // the <ListItem> of product add_new
    return style({
        display: 'flex',
        flexDirection: 'column',
    });
};
const usesProductItemLayout = () => { // the <ListItem> of product list
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
const usesProductItemWrapperLayout = () => { // the <div> of the <ListItem> of product list
    // dependencies:
    
    // capabilities:
    const {groupableRule, groupableVars} = usesGroupable({
        orientationInlineSelector : null,     // craft the <Carousel>'s borderRadius manually
        orientationBlockSelector  : null,     // craft the <Carousel>'s borderRadius manually
        itemsSelector             : '.items', // select the <Carousel>
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
                '"images      name "', 'auto',
                '"images      price"', 'auto',
                '"images      stock"', 'auto',
                '"images visibility"', 'auto',
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
            ...descendants(['.name', 'p'], {
                margin: 0,
            }),
            ...descendants('.value', {
                fontWeight: typos.fontWeightSemibold,
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
            ...children('.images', {
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
            ...children('.name', {
                gridArea: 'name',
                fontSize: typos.fontSizeXl,
            }),
            ...children('.price', {
                gridArea: 'price',
            }),
            ...children('.stock', {
                gridArea: 'stock',
            }),
            ...children('.visibility', {
                gridArea: 'visibility',
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



// styles:
export default () => [
    scope('page', {
        display: 'flex',
        flexDirection: 'column',
    }),
    scope('paginationLoading', {
        blockSize: '100%',
    }, { specificityWeight: 2 }),
    scope('products', {
        flexGrow: 1,
        
        display: 'flex',
        flexDirection: 'column',
        ...children('article', {
            flexGrow: 1,
            
            display: 'grid',
            gridTemplate: [[
                '"paginTop"',    'auto',
                '"productList"', '1fr',
                '"paginBtm"',    'auto',
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
    scope('productList', { // the <section> of product list
        ...usesProductListLayout(),
    }, { specificityWeight: 2 }),
    scope('productListInner', { // the <List> of product list
        ...usesProductListInnerLayout(),
    }, { specificityWeight: 2 }),
    scope('paginBtm', {
        gridArea: 'paginBtm',
        
        justifySelf: 'center',
    }),
    scope('productFetching', {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...children('.loadingBar', {
            alignSelf: 'stretch',
        }),
    }, { specificityWeight: 2 }),
    scope('productCreate', { // the <ListItem> of product add_new
        ...usesProductCreateLayout(),
    }),
    scope('productItem', { // the <ListItem> of product list
        ...usesProductItemLayout(),
    }, { specificityWeight: 2 }),
    scope('productItemWrapper', { // the <div> of the <ListItem> of product list
        ...usesProductItemWrapperLayout(),
    }, { specificityWeight: 2 }),
];
