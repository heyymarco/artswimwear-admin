// cssfn:
import {
    children,
    descendants,
    rule,
    scopeOf,
}                           from '@cssfn/core'          // writes css in javascript
import { typos, usesPadding } from '@reusable-ui/core';



// styles:
export default () => {
    const {paddingVars} = usesPadding();
    
    
    
    return [
        scopeOf('toolbox', {
        }, { specificityWeight: 2 }),
        scopeOf('paginationLoading', {
            blockSize: '100%',
        }, { specificityWeight: 2 }),
        scopeOf('products', {
            ...children('article', {
                display: 'grid',
                gridTemplate: [[
                    '"pagin-top"',    'auto',
                    '"product-list"', 'auto',
                    '"pagin-btm"',    'auto',
                    '/',
                    'auto',
                ]],
                gapInline: '1rem',
                gapBlock: '1rem',
                ...children(['.pagin-top', '.pagin-btm'], {
                    justifySelf: 'center',
                }),
                ...children('.pagin-top', {
                    gridArea: 'pagin-top',
                }),
                ...children('.product-list', {
                    gridArea: 'product-list',
                }),
                ...children('.pagin-btm', {
                    gridArea: 'pagin-btm',
                }),
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
