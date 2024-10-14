// cssfn:
import {
    // writes css in javascript:
    rule,
    fallback,
    children,
    style,
    scope,
}                           from '@cssfn/core'          // writes css in javascript
import {
    // a responsive management system:
    breakpoints,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a responsive management system:
    ifScreenWidthAtLeast,
    
    
    
    // groups a list of UIs into a single UI:
    usesGroupable,
}                           from '@reusable-ui/core'    // a set of reusable-ui packages which are responsible for building any component



// styles:
const usesInfoTabLayout = () => {
    return style({
        // layout:
        display: 'grid',
        
        
        
        // scrolls:
        overscrollBehavior      : 'none',
        scrollPaddingBlockStart : '1.75rem', // makes scroll to field's label
        
        
        
        // children:
        ...children('form', {
            // layouts:
            display            : 'grid',
            alignContent       : 'start',
            gridTemplate       : [[
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
                '"visibility-label "', 'auto',
                '"visibility-editor"', 'auto',
                '/',
                '1fr'
            ]],
            ...ifScreenWidthAtLeast('lg', {
                gridTemplate   : [[
                    '"name-label               name-label"', 'auto',
                    '"name-editor             name-editor"', 'auto',
                    '"................. ................."', spacers.sm,
                    '"path-label               path-label"', 'auto',
                    '"path-editor             path-editor"', 'auto',
                    '"................. ................."', spacers.sm,
                    '"price-label           sWeight-label"', 'auto',
                    '"price-editor         sWeight-editor"', 'auto',
                    '"................. ................."', spacers.sm,
                    '"visibility-label   visibility-label"', 'auto',
                    '"visibility-editor visibility-editor"', 'auto',
                    '/',
                    '1fr', '1fr'
                ]],
            }),
            
            
            
            // spacings:
            gapInline          : spacers.default,
            gapBlock           : spacers.xs,
            
            
            
            // children:
            ...children('.name.label'       , { gridArea: 'name-label'        }),
            ...children('.name.editor'      , { gridArea: 'name-editor'       }),
            
            ...children('.path.label'       , { gridArea: 'path-label'        }),
            ...children('.path.editor'      , { gridArea: 'path-editor'       }),
            
            ...children('.price.label'      , { gridArea: 'price-label'       }),
            ...children('.price.editor'     , { gridArea: 'price-editor'      }),
            
            ...children('.sWeight.label'    , { gridArea: 'sWeight-label'     }),
            ...children('.sWeight.editor'   , { gridArea: 'sWeight-editor'    }),
            
            ...children('.visibility.label' , { gridArea: 'visibility-label'  }),
            ...children('.visibility.editor', { gridArea: 'visibility-editor' }),
        }),
    });
};
const usesVariantsTabLayout = () => {
    return style({
        // layouts:
        display      : 'grid',
        alignContent : 'start',
    });
};
const usesStocksTabLayout = () => {
    return style({
        // layouts:
        display      : 'grid',
        alignContent : 'start',
        ...rule(':not(:has(>ul>li>*>.variants))', {
            alignContent : 'center',
        }),
        
        
        
        // spacings:
        padding: 0,
    });
};
const usesImagesTabLayout = () => {
    return style({
        // scrolls:
        overscrollBehavior : 'none',
    });
};
const usesDescriptionTabLayout = () => {
    return style({
        // scrolls:
        overscrollBehavior : 'none',
    });
};
const usesCategoriesTabLayout = () => {
    return style({
        // layouts:
        display: 'grid',
        
        
        
        // scrolls:
        overscrollBehavior : 'none',
        
        
        
        // sizes:
        contain: 'size', // ignores the size of this tab, so the width & height of the dialog depends on another tab's size
    });
};
const usesEditDescription = () => {
    // dependencies:
    
    // capabilities:
    const {groupableRule, groupableVars} = usesGroupable({
        itemsSelector : '&', // select the <WysiwygEditor> itself
    });
    
    // features:
    const {borderRule, borderVars } = usesBorder({ borderWidth: '0px' });
    
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
            // sizes:
            contain       : 'inline-size', // ignores the inline-size of the children
         // blockSize     : 'fill-available',
            ...fallback({
                blockSize : `calc(100% + (${positivePaddingBlock} * 2))`,
            }),
            
            
            
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
            // cancel-out parent's padding with negative margin:
            marginInline : negativePaddingInline,
            marginBlock  : negativePaddingBlock,
        }),
        
        
        
        // features:
        ...borderRule(), // must be placed at the last
    });
};

export default () => [
    scope('dialog', {
        boxSizing     : 'border-box',
        maxInlineSize : `${breakpoints.lg}px`,
        // maxBlockSize  : `${breakpoints.sm}px`, // unlimited for max height
    }, {specificityWeight: 4}),
    
    scope('infoTab', {
        ...usesInfoTabLayout(),
    }),
    scope('variantsTab', {
        ...usesVariantsTabLayout(),
    }, { specificityWeight: 4 }),
    scope('stocksTab', {
        ...usesStocksTabLayout(),
    }, { specificityWeight: 4 }),
    scope('imagesTab', {
        ...usesImagesTabLayout(),
    }),
    scope('descriptionTab', {
        ...usesDescriptionTabLayout(),
    }),
    scope('categoriesTab', {
        ...usesCategoriesTabLayout(),
    }, { specificityWeight: 2 }),
    scope('editDescription', {
        ...usesEditDescription(),
    }, { specificityWeight: 2 }),
];
