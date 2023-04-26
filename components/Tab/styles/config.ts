// cssfn:
import {
    // cssfn css specific types:
    CssKnownProps,
    
    
    
    // writes css in javascript:
    keyframes,
    fallbacks,
    style,
    vars,
    
    
    
    // strongly typed of css variables:
    cssVars,
    switchOf,
    
    
    
    // reads/writes css variables configuration:
    cssConfig,
}                           from '@cssfn/core'                  // writes css in javascript

// internals:
import {
    // features:
    usesTab,
}                           from '../features/tab'



interface ConfigVars {
    startsMin : any
    startsMax : any
    endsMax   : any
    endsMin   : any
}
const [configVars] = cssVars<ConfigVars>({ prefix: 'cTabVar' });



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
        insetInlineStart : `calc(${tabVars.currentTabPosition} + ((${tabVars.currentTabPosition} - ${tabVars.prevTabPosition}) * 0.02))`, // add a bumpy effect
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
        '70%' : panelFrameIntermediateMaxContent,
        to    : panelFrameCurrentMaxContent,
    });
    panelKeyframesExpandMaxContent.value   = 'expandMaxContent';   // the @keyframes name should contain 'expand'   in order to be recognized by `useCollapsible`
    const [panelKeyframesCollapseMaxContentRule, panelKeyframesCollapseMaxContent] = keyframes({
        from  : panelFramePrevMaxContent,
        '30%' : panelFrameIntermediateMaxContent,
        to    : panelFrameCurrentMaxContent,
    });
    panelKeyframesCollapseMaxContent.value = 'collapseMaxContent'; // the @keyframes name should contain 'collapse' in order to be recognized by `useCollapsible`
    //#endregion animation for tabPanelStyle='maxContent'
    
    
    
    //#region animation for tabPanelStyle='fitContent'
    const configVarsDecl                   = vars({
        // expanding => starting from 0:
        [configVars.startsMin] : [[
            tabVars.expandedSw, // the expanded switching function (will be valid if expanded, otherwise invalid)
            0,
        ]],
        // collapsing => starting from 100vh:
        [configVars.startsMax] : '100vh',
        
        
        
        // expanding => ending to 100vh:
        [configVars.endsMax]   : [[
            tabVars.expandedSw, // the expanded switching function (will be valid if expanded, otherwise invalid)
            '100vh',
        ]],
        // collapsing => ending to 0:
        [configVars.endsMin]   : 0,
    });
    const panelFramePrevFitContent         = style({
        ...panelFramePrevPosition,
        ...configVarsDecl,
        
        overflowY              : 'clip',
        ...fallbacks({
            overflowY          : 'hidden',
        }),
        
        maxBlockSize : switchOf(
            configVars.startsMin, // first  priority
            configVars.startsMax, // second priority
        ),
    });
    const panelFrameIntermediateFitContent = style({
        ...panelFrameIntermediatePosition,
    });
    const panelFrameSemifinalFitContent    = style({
        overflowY              : 'clip',
        ...fallbacks({
            overflowY          : 'hidden',
        }),
        
        maxBlockSize : switchOf(
            configVars.endsMax, // first  priority
            configVars.endsMin, // second priority
        ),
    });
    const panelFrameCurrentFitContent      = style({
        ...panelFrameCurrentPosition,
        ...configVarsDecl,
        
        // cleanups => reset modified props:
        overflowY     : 'unset',
        maxBlockSize  : 'unset',
    });
    const [panelKeyframesExpandFitContentRule  , panelKeyframesExpandFitContent  ] = keyframes({
        from  : panelFramePrevFitContent,
        '70%' : panelFrameIntermediateFitContent,
        '99%' : panelFrameSemifinalFitContent,
        to    : panelFrameCurrentFitContent,
    });
    panelKeyframesExpandFitContent.value   = 'expandFitContent';   // the @keyframes name should contain 'expand'   in order to be recognized by `useCollapsible`
    const [panelKeyframesCollapseFitContentRule, panelKeyframesCollapseFitContent] = keyframes({
        from  : panelFramePrevFitContent,
        '30%' : panelFrameIntermediateFitContent,
        '99%' : panelFrameSemifinalFitContent,
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
            ['300ms', 'ease-out', 'both', panelKeyframesExpandMaxContent  ],
        ]                                                               as CssKnownProps['animation'],
        panelAnimCollapseMaxContent : [
            ['300ms', 'ease-out', 'both', panelKeyframesCollapseMaxContent],
        ]                                                               as CssKnownProps['animation'],
        
        
        
        ...panelKeyframesExpandFitContentRule,
        ...panelKeyframesCollapseFitContentRule,
        panelAnimExpandFitContent   : [
            ['300ms', 'ease-out', 'both', panelKeyframesExpandFitContent  ],
        ]                                                               as CssKnownProps['animation'],
        panelAnimCollapseFitContent : [
            ['300ms', 'ease-out', 'both', panelKeyframesCollapseFitContent],
        ]                                                               as CssKnownProps['animation'],
    };
}, { prefix: 'tab' });
