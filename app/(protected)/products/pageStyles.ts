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
import { commerces } from '@/config';



// styles:
const imageSize = 128;  // 128px
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
                // ...rule('.overlay', {
                //     opacity : 0.8,
                //     
                //     
                //     
                //     // children:
                //     ...children('[role="img"]', {
                //         filter : [[
                //             'invert(1)',
                //         ]],
                //     }),
                // }),
            }),
            ...children('.images', {
                gridArea    : 'images',
                
                
                
                // sizes:
                alignSelf   : 'stretch',
                aspectRatio : commerces.defaultProductAspectRatio,
                
                
                
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
                
                
                
                // children:
                ...children('ul>li>.prodImg', {
                    inlineSize : '100%',
                    blockSize  : '100%',
                }),
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

export default () => [
    scope('page', {
        display: 'flex',
        flexDirection: 'column',
    }),
    scope('productItem', { // the <ListItem> of product list
        ...usesProductItemLayout(),
    }, { specificityWeight: 2 }),
    scope('productItemWrapper', { // the <div> of the <ListItem> of product list
        ...usesProductItemWrapperLayout(),
    }, { specificityWeight: 2 }),
];
