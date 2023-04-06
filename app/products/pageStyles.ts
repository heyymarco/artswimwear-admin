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
    const {groupableRule} = usesGroupable({
        orientationInlineSelector : null,
        orientationBlockSelector  : '&',
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
            ...groupableRule(), // make a nicely rounded corners
            [paddingVars.paddingInline] : '0px',
            [paddingVars.paddingBlock ] : '0px',
        }),
        scopeOf('paginBtm', {
            gridArea: 'paginBtm',
            
            justifySelf: 'center',
        }),
        scopeOf('productFetching', {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            [borderVars.borderWidth] : '0px',
            ...children('.loadingBar', {
                alignSelf: 'stretch',
            }),
        }),
        scopeOf('productFetchError', {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            [borderVars.borderWidth] : '0px',
        }),
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
    ];
}
