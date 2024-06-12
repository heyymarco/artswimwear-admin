// cssfn:
import {
    style,
}                           from '@cssfn/core'          // writes css in javascript

// reusable-ui core:
import {
    // padding (inner spacing) stuff of UI:
    usesPadding,
    
    
    
    // groups a list of UIs into a single UI:
    usesGroupable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
const usesCoverageZoneEditorLayout = () => {
    // dependencies:
    
    // features:
    const {paddingVars} = usesPadding();
    
    // capabilities:
    const {groupableRule} = usesGroupable({
        orientationInlineSelector : null, // never  => the <OrderableList> is never  stacked in horizontal
        orientationBlockSelector  : '&',  // always => the <OrderableList> is always stacked in vertical
        itemsSelector             : ':nth-child(n)', // select <OrderableList>
    });
    
    
    
    return style({
        // capabilities:
        ...groupableRule(), // make a nicely rounded corners
        
        
        
        // layouts:
        ...style({
            // layouts:
            display: 'grid',
            
            
            
            // spacings:
            [paddingVars.paddingInline] : '0px',
            [paddingVars.paddingBlock ] : '0px',
        }),
    });
};

export default style({
    // layouts:
    ...usesCoverageZoneEditorLayout(),
});
