// cssfn:
import {
    children,
    descendants,
    rule,
    scopeOf,
}                           from '@cssfn/core'          // writes css in javascript
import { ifScreenWidthAtLeast, spacers, typos, usesBorder, usesGroupable, usesPadding } from '@reusable-ui/core';



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
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            ...descendants('[role="dialog"]', {
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
            }),
        }, { specificityWeight: 2 }),
        scopeOf('productItemLayout', {
            display: 'grid',
            gridTemplate: [[
                '"image      name "', 'auto',
                '"image      price"', 'auto',
                '"image      stock"', 'auto',
                '"image visibility"', 'auto',
                '"image fullEditor"', 'auto',
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
                ...children('*', {
                    gridArea: '1/1/-1/-1',
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
        scopeOf('fullEditor', {
            display: 'grid',
            gridTemplate: [[
                '"name-label       "', 'auto',
                '"name-editor      "', 'auto',
                '"................."', spacers.sm,
                '"path-label       "', 'auto',
                '"path-editor      "', 'auto',
                '"................."', spacers.sm,
                '"price-label      "', 'auto',
                '"price-editor     "', 'auto',
                '"................."', spacers.sm,
                '"sWeight-label    "', 'auto',
                '"sWeight-editor   "', 'auto',
                '"................."', spacers.sm,
                '"stock-label      "', 'auto',
                '"stock-editor     "', 'auto',
                '"................."', spacers.sm,
                '"visibility-label "', 'auto',
                '"visibility-editor"', 'auto',
                '/',
                '1fr'
            ]],
            ...ifScreenWidthAtLeast('lg', {
                gridTemplate: [[
                    '"name-label               name-label"', 'auto',
                    '"name-editor             name-editor"', 'auto',
                    '"................. ................."', spacers.sm,
                    '"path-label               path-label"', 'auto',
                    '"path-editor             path-editor"', 'auto',
                    '"................. ................."', spacers.sm,
                    '"price-label           sWeight-label"', 'auto',
                    '"price-editor         sWeight-editor"', 'auto',
                    '"................. ................."', spacers.sm,
                    '"stock-label        visibility-label"', 'auto',
                    '"stock-editor      visibility-editor"', 'auto',
                    '/',
                    '1fr', '1fr'
                ]],
            }),
            gapInline: spacers.default,
            gapBlock : spacers.xs,
            
            ...children('.name.label'       , { gridArea: 'name-label'        }),
            ...children('.name.editor'      , { gridArea: 'name-editor'       }),
            
            ...children('.path.label'       , { gridArea: 'path-label'        }),
            ...children('.path.editor'      , { gridArea: 'path-editor'       }),
            
            ...children('.price.label'      , { gridArea: 'price-label'       }),
            ...children('.price.editor'     , { gridArea: 'price-editor'      }),
            
            ...children('.sWeight.label'    , { gridArea: 'sWeight-label'     }),
            ...children('.sWeight.editor'   , { gridArea: 'sWeight-editor'    }),
            
            ...children('.stock.label'      , { gridArea: 'stock-label'       }),
            ...children('.stock.editor'     , { gridArea: 'stock-editor'      }),
            
            ...children('.visibility.label' , { gridArea: 'visibility-label'  }),
            ...children('.visibility.editor', { gridArea: 'visibility-editor' }),
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
                margin: 0,
            }),
            ...children('.hidden', {
                visibility: 'hidden',
            }),
        }, { specificityWeight: 2 }),
    ];
}
