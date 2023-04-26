// cssfn:
import {
    // cssfn css specific types:
    CssKnownProps,
    
    
    
    // writes css in javascript:
    keyframes,
    fallbacks,
    style,
    
    
    
    // reads/writes css variables configuration:
    cssConfig,
}                           from '@cssfn/core'                  // writes css in javascript

// internals:
import {
    // features:
    usesTab,
}                           from '../features/tab'



// configs:
export const [tabs, tabValues, cssTabConfig] = cssConfig(() => {
    // features:
    const {tabVars} = usesTab();
    
    
    
    //#region keyframes
    const panelFrameCollapsedPosition    = style({
        insetInlineStart : tabVars.prevTabPosition,
    });
    const panelFrameIntermediatePosition = style({
        // TODO...
    });
    const panelFrameExpandedPosition     = style({
        insetInlineStart : tabVars.currentTabPosition,
    });
    
    
    
    const [panelKeyframesExpandRule  , panelKeyframesExpand  ] = keyframes({
        /* no animation */
    });
    panelKeyframesExpand.value   = 'expand';   // the @keyframes name should contain 'expand'   in order to be recognized by `useCollapsible`
    const [panelKeyframesCollapseRule, panelKeyframesCollapse] = keyframes({
        /* no animation */
    });
    panelKeyframesCollapse.value = 'collapse'; // the @keyframes name should contain 'collapse' in order to be recognized by `useCollapsible`
    
    
    
    const panelFrameCollapsedFitContent    = style({
        ...panelFrameCollapsedPosition,
        
        overflowY     : 'clip',
        ...fallbacks({
            overflowY : 'hidden',
        }),
        maxBlockSize  : 0,
    });
    const panelFrameIntermediateFitContent = style({
        ...panelFrameIntermediatePosition,
    });
    const panelFrameSemifinalFitContent    = style({
        overflowY     : 'clip',
        ...fallbacks({
            overflowY : 'hidden',
        }),
        maxBlockSize  : '100vh',
    });
    const panelFrameExpandedFitContent     = style({
        ...panelFrameExpandedPosition,
        
        overflowY     : 'unset',
        maxBlockSize  : 'unset',
    });
    const [panelKeyframesExpandFitContentRule  , panelKeyframesExpandFitContent  ] = keyframes({
        from  : panelFrameCollapsedFitContent,
        '80%' : panelFrameIntermediateFitContent,
        '99%' : panelFrameSemifinalFitContent,
        to    : panelFrameExpandedFitContent,
    });
    panelKeyframesExpandFitContent.value   = 'expand';   // the @keyframes name should contain 'expand'   in order to be recognized by `useCollapsible`
    const [panelKeyframesCollapseFitContentRule, panelKeyframesCollapseFitContent] = keyframes({
        from  : panelFrameExpandedFitContent,
        '1%'  : panelFrameSemifinalFitContent,
        '20%' : panelFrameIntermediateFitContent,
        to    : panelFrameCollapsedFitContent,
    });
    panelKeyframesCollapseFitContent.value = 'collapse'; // the @keyframes name should contain 'collapse' in order to be recognized by `useCollapsible`
    //#endregion keyframes
    
    
    
    return {
        // animations:
        ...panelKeyframesExpandRule,
        ...panelKeyframesCollapseRule,
        panelAnimExpand   : [
            ['1ms', 'ease-out', 'both', panelKeyframesExpand  ],
        ]                                                       as CssKnownProps['animation'],
        panelAnimCollapse : [
            ['1ms', 'ease-out', 'both', panelKeyframesCollapse],
        ]                                                       as CssKnownProps['animation'],
        
        
        
        ...panelKeyframesExpandFitContentRule,
        ...panelKeyframesCollapseFitContentRule,
        panelAnimExpandFitContent   : [
            ['300ms', 'ease-out', 'both', panelKeyframesExpandFitContent  ],
        ]                                                       as CssKnownProps['animation'],
        panelAnimCollapseFitContent : [
            ['300ms', 'ease-out', 'both', panelKeyframesCollapseFitContent],
        ]                                                       as CssKnownProps['animation'],
    };
}, { prefix: 'tab' });
