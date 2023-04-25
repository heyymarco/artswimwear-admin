// cssfn:
import {
    // cssfn general types:
    Factory,
    
    
    
    // cssfn css specific types:
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
    expandedTabIndex : any
}
const [tabVars] = cssVars<TabVars>({ prefix: 'tabb', minify: false }); // shared variables: ensures the server-side & client-side have the same generated css variable names



export interface TabStuff { tabRule: Factory<CssRule>, tabVars: CssVars<TabVars> }
export interface TabConfig {
    expandedTabIndex ?: number
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
                [tabVars.expandedTabIndex] : config?.expandedTabIndex,
            }),
        }),
        tabVars,
    };
};
//#endregion tab
