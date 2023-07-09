// cssfn:
import { commerces } from '@/config';
import {
    children,
    descendants,
    rule,
    scope,
}                           from '@cssfn/core'          // writes css in javascript
import { typos, usesBorder, usesGroupable, usesPadding } from '@reusable-ui/core';



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
        scope('orderList', {
            gridArea: 'orderList',
            
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            [paddingVars.paddingInline] : '0px',
            [paddingVars.paddingBlock ] : '0px',
            
            minBlockSize : '150px', // a temporary fix for empty loading appearance
            
            ...groupableRule(),  // make a nicely rounded corners
        }, { specificityWeight: 2 }),
        scope('orderListInner', {
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
        scope('orderFetching', {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            ...children('.loadingBar', {
                alignSelf: 'stretch',
            }),
        }, { specificityWeight: 2 }),
        scope('orderItem', {
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            ...descendants('[role="dialog"]', {
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
            }),
        }, { specificityWeight: 2 }),
        scope('orderItemLayout', {
            display: 'grid',
            gridTemplate: [[
                '"orderId   "', 'auto',
                '"customer  "', 'auto',
                '"shipping  "', 'auto',
                '"items     "', 'auto',
                '"fullEditor"', 'auto',
                '/',
                '1fr',
            ]],
            padding: '1rem',
            gapInline: '1rem',
            gapBlock: '0.5rem',
            ...descendants(['.orderId', 'p'], {
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
            ...children('.shipping', {
                gridArea: 'shipping',
            }),
            ...children('.items', {
                gridArea: 'items',
            }),
            ...children('.fullEditor', {
                gridArea: 'fullEditor',
            }),
        }, { specificityWeight: 2 }),
    ];
}
