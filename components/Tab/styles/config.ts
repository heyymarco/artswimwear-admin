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



// configs:
export const [tabs, tabValues, cssTabConfig] = cssConfig(() => {
    //#region keyframes
    const panelFrameCollapsed    = style({
        overflowY     : 'clip',
        ...fallbacks({
            overflowY : 'hidden',
        }),
        maxBlockSize  : 0,
    });
    const panelFrameIntermediate = style({
        overflowY     : 'clip',
        ...fallbacks({
            overflowY : 'hidden',
        }),
        maxBlockSize  : '100vh',
    });
    const panelFrameExpanded     = style({
        overflowY     : 'unset',
        maxBlockSize  : 'unset',
    });
    const [panelKeyframesExpandRule  , panelKeyframesExpand  ] = keyframes({
        from  : panelFrameCollapsed,
        '99%' : panelFrameIntermediate,
        to    : panelFrameExpanded,
    });
    panelKeyframesExpand.value   = 'expand';   // the @keyframes name should contain 'expand'   in order to be recognized by `useCollapsible`
    const [panelKeyframesCollapseRule, panelKeyframesCollapse] = keyframes({
        from  : panelFrameExpanded,
        '1%'  : panelFrameIntermediate,
        to    : panelFrameCollapsed,
    });
    panelKeyframesCollapse.value = 'collapse'; // the @keyframes name should contain 'collapse' in order to be recognized by `useCollapsible`
    //#endregion keyframes
    
    
    
    return {
        // animations:
        ...panelKeyframesExpandRule,
        ...panelKeyframesCollapseRule,
        panelAnimExpand   : [
            ['300ms', 'ease-out', 'both', panelKeyframesExpand  ],
        ]                                                       as CssKnownProps['animation'],
        panelAnimCollapse : [
            ['300ms', 'ease-out', 'both', panelKeyframesCollapse],
        ]                                                       as CssKnownProps['animation'],
    };
}, { prefix: 'tab' });
