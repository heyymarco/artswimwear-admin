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
const usesCoverageZonePreviewLayout = () => { // the <ListItem> of shipping list
    return style({
        // layouts:
        display            : 'grid',
        alignContent       : 'start',
        gridTemplate       : [[
            '"name grip delete"', 'auto',
            '/',
            '1fr min-content min-content'
        ]],
        
        
        
        // spacings:
        gapInline          : spacers.md,
        
        
        
        // children:
        ...children('.name'   , { gridArea : 'name'   }),
        ...children('.grip'   , { gridArea : 'grip'  }),
        ...children('.delete' , { gridArea : 'delete' }),
    });
};

export default style({
    // layouts:
    ...usesCoverageZonePreviewLayout(),
});
