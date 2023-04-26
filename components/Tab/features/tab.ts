// cssfn:
import {
    // cssfn general types:
    Factory,
    
    
    
    // cssfn css specific types:
    CssKnownProps,
    CssRule,
    
    
    
    // writes css in javascript:
    style,
    vars,
    
    
    
    // strongly typed of css variables:
    CssVars,
    cssVars,
}                           from '@cssfn/core'                  // writes css in javascript



// hooks:

// features:

//#region tab
export interface TabVars {
    /**
     * <Tab>'s expanded (active) index.
     */
    expandedTabIndex   : any
    
    /**
     * <Tab>'s current index.
     */
    currentTabIndex    : any
    
    /**
     * <Tab>'s current position.
     */
    currentTabPosition : any
}
const [tabVars] = cssVars<TabVars>({ prefix: 'tabb', minify: false }); // shared variables: ensures the server-side & client-side have the same generated css variable names



export interface TabStuff { tabRule: Factory<CssRule>, tabVars: CssVars<TabVars> }
export interface TabConfig {
    paddingInline ?: CssKnownProps['paddingInline']
}
/**
 * Uses tab variables.
 * @param config  A configuration of `tabRule`.
 * @returns A `TabStuff` represents the tab rules.
 */
export const usesTab = (config?: TabConfig): TabStuff => {
    return {
        tabRule: () => style({
            ...vars({
                // variables:
                [tabVars.currentTabPosition] : `calc((100%${(config?.paddingInline !== undefined) ? ` + (${config?.paddingInline} * 2)` : ''}) * (${tabVars.currentTabIndex} - ${tabVars.expandedTabIndex}))`,
            }),
        }),
        tabVars,
    };
};
//#endregion tab
