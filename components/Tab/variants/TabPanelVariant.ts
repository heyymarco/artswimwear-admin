// defaults:
const _defaultTabPanelStyle : TabPanelStyle = 'maxContent'



// hooks:

// variants:

//#region TabPanelVariant
export type TabPanelStyle = 'maxContent'|'fitContent' // might be added more styles in the future
export interface TabPanelVariant {
    tabPanelStyle ?: TabPanelStyle
}
export const useTabPanelVariant = ({tabPanelStyle = _defaultTabPanelStyle}: TabPanelVariant) => {
    return {
        class: tabPanelStyle,
    };
};
//#endregion TabPanelVariant
