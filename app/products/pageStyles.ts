// cssfn:
import {
    children,
    descendants,
    rule,
    scopeOf,
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
        scopeOf('page', {
            display: 'flex',
            flexDirection: 'column',
        }),
        scopeOf('toolbox', {
        }, { specificityWeight: 2 }),
        scopeOf('paginationLoading', {
            blockSize: '100%',
        }, { specificityWeight: 2 }),
        scopeOf('products', {
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
        scopeOf('paginTop', {
            gridArea: 'paginTop',
            
            justifySelf: 'center',
        }),
        scopeOf('productList', {
            gridArea: 'productList',
            
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            [paddingVars.paddingInline] : '0px',
            [paddingVars.paddingBlock ] : '0px',
            ...groupableRule(),  // make a nicely rounded corners
        }, { specificityWeight: 2 }),
        scopeOf('productListInner', {
            [groupableVars.borderStartStartRadius] : 'inherit !important', // reads parent's prop
            [groupableVars.borderStartEndRadius  ] : 'inherit !important', // reads parent's prop
            [groupableVars.borderEndStartRadius  ] : 'inherit !important', // reads parent's prop
            [groupableVars.borderEndEndRadius    ] : 'inherit !important', // reads parent's prop
            
            [borderVars.borderStartStartRadius] : groupableVars.borderStartStartRadius,
            [borderVars.borderStartEndRadius  ] : groupableVars.borderStartEndRadius,
            [borderVars.borderEndStartRadius  ] : groupableVars.borderEndStartRadius,
            [borderVars.borderEndEndRadius    ] : groupableVars.borderEndEndRadius,
        }, { specificityWeight: 2 }),
        scopeOf('paginBtm', {
            gridArea: 'paginBtm',
            
            justifySelf: 'center',
        }),
        scopeOf('productFetching', {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            ...children('.loadingBar', {
                alignSelf: 'stretch',
            }),
        }, { specificityWeight: 2 }),
        scopeOf('productItem', {
            display: 'grid',
            gridTemplate: [[
                '"image      name "', 'auto',
                '"image      price"', 'auto',
                '"image      stock"', 'auto',
                '"image visibility"', 'auto',
                '/',
                'min-content', 'auto',
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
                ...rule(':hover', {
                    opacity: 'unset',
                    transform: 'scale(105%)',
                }),
            }),
            ...children('.prodImg', {
                gridArea: 'image',
                width: '96px',
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
            ...descendants('[role="dialog"]', {
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
            }),
        }, { specificityWeight: 2 }),
        scopeOf('productItem', {
        }),
        scopeOf('simpleEditor', {
            display: 'grid',
            gridTemplate: [[
                '"editor     editor"', 'auto',
                '"btnSave btnCancel"', 'auto',
                '/',
                '1fr', '1fr'
            ]],
            gapInline: '0.5rem',
            gapBlock : '1rem',
            ...children('.editor', {
                gridArea: 'editor',
                
                boxSizing: 'content-box',
                minInlineSize: '20em',
            }),
            ...children('.btnSave', {
                gridArea: 'btnSave',
            }),
            ...children('.btnCancel', {
                gridArea: 'btnCancel',
            }),
        }, { specificityWeight: 3 }),
        scopeOf('editorTabBody', {
            display: 'grid',
            justifyItems: 'center',
            alignItems: 'center',
            [borderVars.borderStartStartRadius] : '0px',
            [borderVars.borderStartEndRadius  ] : '0px',
            borderBlockStartWidth               : '0px',
            ...children('*', {
                gridArea: '1/1/1/1', // the options are overlapping each other, so the parent takes the maximum width & height of children
            }),
            ...children('.hidden', {
                visibility: 'hidden',
            }),
        }, { specificityWeight: 2 }),
    ];
}
