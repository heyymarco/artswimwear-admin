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
    //#region shared sliding animation
    const panelFrameCollapsedPosition    = style({
        insetInlineStart : tabVars.prevTabPosition,
    });
    const panelFrameIntermediatePosition = style({
        // TODO...
    });
    const panelFrameExpandedPosition     = style({
        insetInlineStart : tabVars.currentTabPosition,
    });
    //#endregion shared sliding animation
    
    
    
    //#region animation for tabPanelStyle='maxContent'
    const panelFrameCollapsedMaxContent    = style({
        ...panelFrameCollapsedPosition,
    });
    const panelFrameIntermediateMaxContent = style({
        ...panelFrameIntermediatePosition,
    });
    const panelFrameExpandedMaxContent     = style({
        ...panelFrameExpandedPosition,
    });
    const [panelKeyframesExpandMaxContentRule  , panelKeyframesExpandMaxContent  ] = keyframes({
        from  : panelFrameCollapsedMaxContent,
        '80%' : panelFrameIntermediateMaxContent,
        to    : panelFrameExpandedMaxContent,
    });
    panelKeyframesExpandMaxContent.value   = 'expandMaxContent';   // the @keyframes name should contain 'expand'   in order to be recognized by `useCollapsible`
    const [panelKeyframesCollapseMaxContentRule, panelKeyframesCollapseMaxContent] = keyframes({
        from  : panelFrameExpandedMaxContent,
        '20%' : panelFrameIntermediateMaxContent,
        to    : panelFrameCollapsedMaxContent,
    });
    panelKeyframesCollapseMaxContent.value = 'collapseMaxContent'; // the @keyframes name should contain 'collapse' in order to be recognized by `useCollapsible`
    //#endregion animation for tabPanelStyle='maxContent'
    
    
    
    //#region animation for tabPanelStyle='fitContent'
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
    panelKeyframesExpandFitContent.value   = 'expandFitContent';   // the @keyframes name should contain 'expand'   in order to be recognized by `useCollapsible`
    const [panelKeyframesCollapseFitContentRule, panelKeyframesCollapseFitContent] = keyframes({
        from  : panelFrameExpandedFitContent,
        '1%'  : panelFrameSemifinalFitContent,
        '20%' : panelFrameIntermediateFitContent,
        to    : panelFrameCollapsedFitContent,
    });
    panelKeyframesCollapseFitContent.value = 'collapseFitContent'; // the @keyframes name should contain 'collapse' in order to be recognized by `useCollapsible`
    //#endregion animation for tabPanelStyle='fitContent'
    //#endregion keyframes
    
    
    
    return {
        // animations:
        ...panelKeyframesExpandMaxContentRule,
        ...panelKeyframesCollapseMaxContentRule,
        panelAnimExpandMaxContent   : [
            ['300ms', 'ease-out', 'both', panelKeyframesExpandMaxContent  ],
        ]                                                       as CssKnownProps['animation'],
        panelAnimCollapseMaxContent : [
            ['300ms', 'ease-out', 'both', panelKeyframesCollapseMaxContent],
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
