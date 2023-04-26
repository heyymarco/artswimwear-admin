// cssfn:
import {
    // cssfn general types:
    Factory,
    
    
    
    // cssfn css specific types:
    CssKnownProps,
    CssRule,
    
    
    
    // writes css in javascript:
    states,
    style,
    vars,
    
    
    
    // strongly typed of css variables:
    CssVars,
    cssVars,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a capability of UI to expand/reduce its size or toggle the visibility:
    ifExpand,
    ifCollapse,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// hooks:

// features:

//#region tab
export interface TabVars {
    /**
     * `<Tab>`'s index.
     */
    tabIndex           : any
    
    /**
     * `<TabPanel>`'s width (inline) or height (block).
     */
    panelSize          : any
    
    /**
     * the expanded switching function.
     */
    expandedSw         : any
    
    /**
     * `<Tab>`'s previously expanded (active) index.
     */
    collapsedTabIndex  : any
    /**
     * `<Tab>`'s expanded (active) index.
     */
    expandedTabIndex   : any
    
    /**
     * `<Tab>`'s previous position.
     */
    prevTabPosition    : any
    /**
     * `<Tab>`'s current position.
     */
    currentTabPosition : any
}
const [tabVars] = cssVars<TabVars>({ prefix: 'tabb', minify: false }); // shared variables: ensures the server-side & client-side have the same generated css variable names



export interface TabStuff { tabRule: Factory<CssRule>, tabVars: CssVars<TabVars> }
export interface TabConfig {
    panelSize ?: CssKnownProps['inlineSize']
}
/**
 * Uses tab variables.
 * @param config  A configuration of `tabRule`.
 * @returns A `TabStuff` represents the tab rules.
 */
export const usesTab = (config?: TabConfig): TabStuff => {
    return {
        tabRule: () => style({
            // position functions:
            ...vars({
                [tabVars.panelSize         ] : config?.panelSize ?? '100%',
                [tabVars.prevTabPosition   ] : `calc(${tabVars.panelSize} * (${tabVars.tabIndex} - ${tabVars.collapsedTabIndex}))`,
                [tabVars.currentTabPosition] : `calc(${tabVars.panelSize} * (${tabVars.tabIndex} - ${tabVars.expandedTabIndex }))`,
            }),
            
            
            
            // states:
            ...states([
                /*
                    *switch on/off* the `expandedSw` prop.
                    toggle:
                        empty string      => do not alter the `expandedSw`'s value => activates   `expandedSw` variable.
                        initial (invalid) => destroy      the `expandedSw`'s value => deactivates `expandedSw` variable.
                */
                ifExpand(vars({
                        [tabVars.expandedSw] : '',
                })),
                ifCollapse(vars({
                        [tabVars.expandedSw] : 'initial',
                })),
            ]),
        }),
        tabVars,
    };
};
//#endregion tab
