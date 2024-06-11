// cssfn:
import {
    children,
    style,
}                           from '@cssfn/core'          // writes css in javascript

// reusable-ui core:
import {
    spacers,
}                           from '@reusable-ui/core'    // a set of reusable-ui packages which are responsible for building any component



// styles:
const usesCoverageCountryPreviewLayout = () => { // the <ListItem> of shipping list
    return style({
        // layouts:
        display            : 'grid',
        alignContent       : 'start',
        gridTemplate       : [[
            '"country grip delete"', 'auto',
            '/',
            '1fr min-content max-content'
        ]],
        
        
        
        // spacings:
        gapInline          : spacers.md,
        
        
        
        // children:
        ...children('.country', { gridArea: 'rate'   }),
        ...children('.grip'   , { gridArea : 'grip'  }),
        ...children('.delete' , { gridArea: 'delete' }),
    });
};

export default style({
    // layouts:
    ...usesCoverageCountryPreviewLayout(),
});
