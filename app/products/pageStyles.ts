// cssfn:
import {
    children,
    descendants,
    rule,
    scopeOf,
}                           from '@cssfn/core'          // writes css in javascript
import { typos } from '@reusable-ui/core';



// styles:
export default () => [
    scopeOf('toolbox', {
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
            '"image title"', 'auto',
            '"image price"', 'auto',
            '"image stock"', 'auto',
            '"image avail"', 'auto',
            '/',
            'min-content', 'auto',
        ]],
        padding: '1rem',
        gapInline: '1rem',
        gapBlock: '0.5rem',
        ...descendants(['.title', 'p'], {
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
        ...children('.title', {
            gridArea: 'title',
            fontSize: typos.fontSizeXl,
        }),
        ...children('.price', {
            gridArea: 'price',
        }),
        ...children('.stock', {
            gridArea: 'stock',
        }),
        ...children('.avail', {
            gridArea: 'avail',
        }),
    }, { specificityWeight: 2 }),
];
