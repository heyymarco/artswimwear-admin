// cssfn:
import { commerces } from '@/config';
import {
    children,
    descendants,
    rule,
    scope,
}                           from '@cssfn/core'          // writes css in javascript
import { typos, usesBorder, usesGroupable, usesPadding } from '@reusable-ui/core';



// defaults:
const imageSize = 96;  // 96px



// styles:
export default () => {
    const {paddingVars} = usesPadding();
    const {groupableRule, groupableVars} = usesGroupable({
        orientationInlineSelector : null,
        orientationBlockSelector  : null,
    });
    const {borderVars} = usesBorder();
    
    
    
    return [
        scope('page', {
            display: 'flex',
            flexDirection: 'column',
        }),
        scope('toolbox', {
        }, { specificityWeight: 2 }),
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
        scope('productList', {
            gridArea: 'productList',
            
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            [paddingVars.paddingInline] : '0px',
            [paddingVars.paddingBlock ] : '0px',
            ...groupableRule(),  // make a nicely rounded corners
        }, { specificityWeight: 2 }),
        scope('productListInner', {
            [groupableVars.borderStartStartRadius] : 'inherit !important', // reads parent's prop
            [groupableVars.borderStartEndRadius  ] : 'inherit !important', // reads parent's prop
            [groupableVars.borderEndStartRadius  ] : 'inherit !important', // reads parent's prop
            [groupableVars.borderEndEndRadius    ] : 'inherit !important', // reads parent's prop
            
            [borderVars.borderStartStartRadius] : groupableVars.borderStartStartRadius,
            [borderVars.borderStartEndRadius  ] : groupableVars.borderStartEndRadius,
            [borderVars.borderEndStartRadius  ] : groupableVars.borderEndStartRadius,
            [borderVars.borderEndEndRadius    ] : groupableVars.borderEndEndRadius,
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
        scope('productItem', {
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            ...descendants('[role="dialog"]', {
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
            }),
        }, { specificityWeight: 2 }),
        scope('productItemLayout', {
            display: 'grid',
            gridTemplate: [[
                '"image      name "', 'auto',
                '"image      price"', 'auto',
                '"image      stock"', 'auto',
                '"image visibility"', 'auto',
                '"image fullEditor"', 'auto',
                '/',
                `${imageSize}px`, 'auto',
            ]],
            padding: '1rem',
            gapInline: '1rem',
            gapBlock: '0.5rem',
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
            ...children('.prodImg', {
                gridArea: 'image',
                alignSelf: 'center',
                width: '96px',
                height: 'fit-content',
                display: 'grid',
                
                
                
                // sizes:
                aspectRatio: commerces.defaultProductAspectRatio,
                
                
                
                // children:
                ...children('*', {
                    gridArea: '1/1/-1/-1',
                }),
                ...children('.image', {
                    width: '100%',
                    minHeight: `${imageSize}px`,
                }),
                ...children('.edit', {
                    justifySelf: 'start',
                    alignSelf: 'start',
                    margin: 0,
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
        }, { specificityWeight: 2 }),
    ];
}
