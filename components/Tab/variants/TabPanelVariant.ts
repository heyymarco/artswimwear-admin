// defaults:
const _defaultTabPanelStyle : TabPanelStyle = 'fitContent'



// hooks:

// variants:

//#region TabPanelVariant
export type TabPanelStyle = 'fitContent'|'maxContent' // might be added more styles in the future
export interface TabPanelVariant {
    tabPanelStyle ?: TabPanelStyle
}
export const useTabPanelVariant = ({tabPanelStyle = _defaultTabPanelStyle}: TabPanelVariant) => {
    return {
        class: tabPanelStyle,
    };
};
//#endregion TabPanelVariant
