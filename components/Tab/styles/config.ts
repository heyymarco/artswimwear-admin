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
    const panelFramePrevPosition           = style({
        insetInlineStart : tabVars.prevTabPosition,
    });
    const panelFrameIntermediatePosition   = style({
        // TODO...
    });
    const panelFrameCurrentPosition        = style({
        insetInlineStart : tabVars.currentTabPosition,
    });
    //#endregion shared sliding animation
    
    
    
    //#region animation for tabPanelStyle='maxContent'
    const panelFramePrevMaxContent         = style({
        ...panelFramePrevPosition,
    });
    const panelFrameIntermediateMaxContent = style({
        ...panelFrameIntermediatePosition,
    });
    const panelFrameCurrentMaxContent      = style({
        ...panelFrameCurrentPosition,
    });
    const [panelKeyframesExpandMaxContentRule  , panelKeyframesExpandMaxContent  ] = keyframes({
        from  : panelFramePrevMaxContent,
        '80%' : panelFrameIntermediateMaxContent,
        to    : panelFrameCurrentMaxContent,
    });
    panelKeyframesExpandMaxContent.value   = 'expandMaxContent';   // the @keyframes name should contain 'expand'   in order to be recognized by `useCollapsible`
    const [panelKeyframesCollapseMaxContentRule, panelKeyframesCollapseMaxContent] = keyframes({
        from  : panelFramePrevMaxContent,
        '20%' : panelFrameIntermediateMaxContent,
        to    : panelFrameCurrentMaxContent,
    });
    panelKeyframesCollapseMaxContent.value = 'collapseMaxContent'; // the @keyframes name should contain 'collapse' in order to be recognized by `useCollapsible`
    //#endregion animation for tabPanelStyle='maxContent'
    
    
    
    //#region animation for tabPanelStyle='fitContent'
    const panelFramePrevFitContent         = style({
        ...panelFramePrevPosition,
        
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
    const panelFrameCurrentFitContent      = style({
        ...panelFrameCurrentPosition,
        
        overflowY     : 'unset',
        maxBlockSize  : 'unset',
    });
    const [panelKeyframesExpandFitContentRule  , panelKeyframesExpandFitContent  ] = keyframes({
        from  : panelFramePrevFitContent,
        '80%' : panelFrameIntermediateFitContent,
        '99%' : panelFrameSemifinalFitContent,
        to    : panelFrameCurrentFitContent,
    });
    panelKeyframesExpandFitContent.value   = 'expandFitContent';   // the @keyframes name should contain 'expand'   in order to be recognized by `useCollapsible`
    const [panelKeyframesCollapseFitContentRule, panelKeyframesCollapseFitContent] = keyframes({
        from  : panelFramePrevFitContent,
        '1%'  : panelFrameSemifinalFitContent,
        '20%' : panelFrameIntermediateFitContent,
        to    : panelFrameCurrentFitContent,
    });
    panelKeyframesCollapseFitContent.value = 'collapseFitContent'; // the @keyframes name should contain 'collapse' in order to be recognized by `useCollapsible`
    //#endregion animation for tabPanelStyle='fitContent'
    //#endregion keyframes
    
    
    
    return {
        // animations:
        ...panelKeyframesExpandMaxContentRule,
        ...panelKeyframesCollapseMaxContentRule,
        panelAnimExpandMaxContent   : [
            ['300ms', 'ease-out', panelKeyframesExpandMaxContent  ],
        ]                                                       as CssKnownProps['animation'],
        panelAnimCollapseMaxContent : [
            ['300ms', 'ease-out', panelKeyframesCollapseMaxContent],
        ]                                                       as CssKnownProps['animation'],
        
        
        
        ...panelKeyframesExpandFitContentRule,
        ...panelKeyframesCollapseFitContentRule,
        panelAnimExpandFitContent   : [
            ['300ms', 'ease-out', panelKeyframesExpandFitContent  ],
        ]                                                       as CssKnownProps['animation'],
        panelAnimCollapseFitContent : [
            ['300ms', 'ease-out', panelKeyframesCollapseFitContent],
        ]                                                       as CssKnownProps['animation'],
    };
}, { prefix: 'tab' });
